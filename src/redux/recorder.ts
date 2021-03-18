import { Action } from 'redux';
import { RootState } from './store';

interface RecorderState {
  dateStart: string;
}

const START = 'recoder/start';
const STOP = 'recoder/stop';

type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

export const start = (): StartAction => ({
  type: START,
});

export const stop = (): StopAction => ({
  type: STOP,
});

export const selectRecoderState = (rootState: RootState) => rootState.recoder;

export const selectDateStart = (rootState: RootState) =>
  selectRecoderState(rootState).dateStart;

const initialState: RecorderState = {
  dateStart: '',
};

const recoderReducer = (
  state: RecorderState = initialState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case START:
      return {
        ...state,
        dateStart: new Date().toISOString(),
      };
    case STOP:
      return {
        ...state,
        dateStart: '',
      };

    default:
      return state;
  }
};

export default recoderReducer;
