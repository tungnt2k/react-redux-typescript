import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import recoderReducer from './recorder';
import userEventsReducer from './user-event';

const rootReducer = combineReducers({
  userEvents: userEventsReducer,
  recoder: recoderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
