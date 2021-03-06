import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './store/reducers/user';
import authReducer from './store/reducers/auth';
import uiReducer from './store/reducers/ui';
import notesReducer from './store/reducers/notes';
import notifsReducer from './store/reducers/notifs';
import collabsReducer from './store/reducers/collabs';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  ui: uiReducer,
  notes: notesReducer,
  notifs: notifsReducer,
  collabs: collabsReducer
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
