import { IHasUUID, Mutation, Reducer } from './state';

// models

export interface TimingPoint extends IHasUUID {
  time: number;
  bpm: number | null;
  signature: number | null;
}

// mutations

export interface InsertTimingPointMutation extends Mutation<'insertTimingPoint'> {
  entity: TimingPoint;
}

export interface UpdateTimingPointMutation extends Mutation<'updateTimingPoint'> {
  uuid: string;
  entity: Partial<Omit<TimingPoint, 'uuid'>>;
}

export interface DeleteTimingPointMutation extends Mutation<'deleteTimingPoint'> {
  uuid: string;
}

// reducers

const insertTimingPointReducer: Reducer<InsertTimingPointMutation, DeleteTimingPointMutation> = (state, {
  entity
}) => {
  const timingPoints = state.timingPoints;

  const index = timingPoints.findIndex(it => entity.time < it.time);

  if (index >= 0)
    timingPoints.splice(index, 0, entity);
  else
    timingPoints.push(entity);

  return {
    type: 'deleteTimingPoint',
    uuid: entity.uuid
  };
};

const updateTimingPointReducer: Reducer<UpdateTimingPointMutation, UpdateTimingPointMutation> = (state, {
  uuid,
  entity
}) => {
  const timingPoints = state.timingPoints;

  const oldIndex = timingPoints.findIndex(timingPoint => timingPoint.uuid === uuid);
  let timingPoint = timingPoints.splice(oldIndex, 1)[0];

  const index = timingPoints.findIndex(it => timingPoint.time < it.time);

  let revert: any = {};
  Object.keys(entity).forEach(key => revert[key] = timingPoint[key]);

  timingPoint = { ...timingPoint, ...entity };

  if (index >= 0)
    timingPoints.splice(index, 0, timingPoint);
  else
    timingPoints.push(timingPoint);

  return {
    type: 'updateTimingPoint',
    uuid,
    entity: revert
  };
};

const deleteTimingPointReducer: Reducer<DeleteTimingPointMutation, InsertTimingPointMutation> = (state, { uuid }) => {
  const index = state.timingPoints.findIndex(it => it.uuid === uuid);
  if (index <= 0)
    throw Error(`Tried to delete nonexistent timing point ${uuid}`);

  const entity = state.timingPoints[index];
  state.timingPoints.splice(index, 1);

  return {
    type: 'insertTimingPoint',
    entity
  };
};

// mutation factories

export function insertTimingPoint(entity: TimingPoint): InsertTimingPointMutation {
  return {
    type: 'insertTimingPoint',
    entity
  };
}

export function updateTimingPoint(uuid: string, entity: Partial<Omit<TimingPoint, 'uuid'>>): UpdateTimingPointMutation {
  return {
    type: 'updateTimingPoint',
    uuid,
    entity
  };
}

export function deleteTimingPoint(uuid: string): DeleteTimingPointMutation {
  return {
    type: 'deleteTimingPoint',
    uuid
  };
}

// exports

export default {
  reducers: {
    insertTimingPoint: insertTimingPointReducer,
    updateTimingPoint: updateTimingPointReducer,
    deleteTimingPoint: deleteTimingPointReducer
  }
};