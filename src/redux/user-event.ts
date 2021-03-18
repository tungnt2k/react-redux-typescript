import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { selectDateStart } from './recorder';
import { RootState } from './store';

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

const LOAD_REQUEST = 'userEvents/load_request';

interface LoadReaquestAction extends Action<typeof LOAD_REQUEST> {}

const LOAD_SUCCESS = 'userEvents/load_success';

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

const LOAD_FAILURE = 'userEvents/load_failure';

interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}

const CREATE_REQUEST = 'userEvents/create_request';

interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {}

const CREATE_SUCCESS = 'userEvents/create_success';

interface CreateSucessAction extends Action<typeof CREATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}

const CREATE_FAILURE = 'userEvents/create_failure';

interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
  error: string;
}

const DELETE_REQUEST = 'userEvents/delete_request';

interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}

const DELETE_SUCCESS = 'userEvents/delete_success';

interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: {
    eventId: number;
  };
}

const DELETE_FAILURE = 'userEvents/delete_failure';

interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {
  error: string;
}

const UPDATE_REQUEST = 'userEvents/update_request';

interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> {}

const UPDATE_SUCCESS = 'userEvents/update_success';

interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: {
    eventUpdated: UserEvent;
  };
}

const UPDATE_FAILURE = 'userEvents/update_failure';

interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
  error: string;
}

export const loadUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  LoadReaquestAction | LoadSuccessAction | LoadFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: LOAD_REQUEST,
  });

  try {
    const response = await fetch('http://localhost:3002/events');
    const events: UserEvent[] = await response.json();

    dispatch({
      type: LOAD_SUCCESS,
      payload: { events },
    });
  } catch (e) {
    dispatch({
      type: LOAD_FAILURE,
      error: 'Failed to load events.',
    });
  }
};

export const createUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  CreateRequestAction | CreateSucessAction | CreateFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: CREATE_REQUEST,
  });

  const dateStart = selectDateStart(getState());

  const event: Omit<UserEvent, 'id'> = {
    title: 'no name',
    dateStart: dateStart,
    dateEnd: new Date().toISOString(),
  };

  try {
    const response = await fetch('http://localhost:3002/events', {
      method: 'POST',
      headers: {
        'content-type': 'Application/json',
      },
      body: JSON.stringify(event),
    });
    const createdEvent: UserEvent = await response.json();

    dispatch({
      type: CREATE_SUCCESS,
      payload: { event: createdEvent },
    });
  } catch (e) {
    dispatch({
      type: CREATE_FAILURE,
      error: 'Failed to create event.',
    });
  }
};

export const deleteUserEvent = (
  eventId: number
): ThunkAction<
  void,
  RootState,
  undefined,
  DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: DELETE_REQUEST,
  });

  try {
    const response = await fetch(`http://localhost:3002/events/${eventId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch({
        type: DELETE_SUCCESS,
        payload: { eventId },
      });
    }
  } catch (e) {
    dispatch({
      type: DELETE_FAILURE,
      error: 'Failed to delete events.',
    });
  }
};

export const updateUserEvent = (
  event: UserEvent,
  title: string
): ThunkAction<
  void,
  RootState,
  undefined,
  UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_REQUEST,
  });

  try {
    const userEvent: Omit<UserEvent, 'id'> = {
      title: title,
      dateStart: event.dateStart,
      dateEnd: event.dateEnd,
    };

    const response = await fetch(`http://localhost:3002/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'Application/json',
      },
      body: JSON.stringify(userEvent),
    });

    const updatedEvent: UserEvent = await response.json();
    dispatch({
      type: UPDATE_SUCCESS,
      payload: { eventUpdated: updatedEvent },
    });
  } catch (e) {
    dispatch({
      type: UPDATE_FAILURE,
      error: 'Failed to update events.',
    });
  }
};

const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

const userEventsReducer = (
  state: UserEventsState = initialState,
  action:
    | LoadSuccessAction
    | CreateSucessAction
    | DeleteSuccessAction
    | UpdateSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };

    case CREATE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case DELETE_SUCCESS:
      const { eventId } = action.payload;
      const newByIds = { ...state.byIds };
      delete newByIds[eventId];
      return {
        ...state,
        allIds: state.allIds.filter((id) => id !== eventId),
        byIds: newByIds,
      };
    case UPDATE_SUCCESS:
      const { eventUpdated } = action.payload;
      const updatedByIds = {
        ...state.byIds,
      };
      updatedByIds[eventUpdated.id] = eventUpdated;
      return {
        ...state,
        byIds: updatedByIds,
      };

    default:
      return state;
  }
};

export default userEventsReducer;
