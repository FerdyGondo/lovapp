/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import listReducer from './listReducer';
import profileReducer from './profileReducer';
import msgReducer from './msgReducer';

const reducers = combineReducers({
  authReducer,
  listReducer,
  profileReducer,
  msgReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>
