import Timing, {TimingPoint} from './timing';

export interface EditorState {
  timingPoints: TimingPoint[];
}

export interface IHasUUID {
  uuid: string;
}

type MutationKey = keyof typeof reducers;

export interface Mutation<Type extends MutationKey = any> {
  type: Type;
}

export type Reducer<M extends Mutation<any>, UndoMutation extends Mutation<any>> = (state: EditorState, mutation: M) => UndoMutation;

const reducers = {
  ...Timing.reducers,
};

export function commitMutation(state: EditorState, mutation: Mutation<any>): Mutation<any> | undefined {
  const reducer = reducers[mutation.type];

  if (reducer) {
    return reducer(state, mutation);
  }

  return undefined;
}