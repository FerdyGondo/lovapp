/* eslint-disable prettier/prettier */
// import Actions from './authActions';
// import { GETUSER } from './actionTypes';
import { ActionType } from '../action-types';
import { Action } from '../actions';

const INITIAL_STATE = {
    errorMsg: '',
    loggedIn: false,
    // userObj: null,
    username: '',
    password: '',
    retypePassword: '',
    user: {},
    user_info: {},
    error: '',
    loading: false,
    userID: '',
    loggedOut: false,
};

interface INITIAL_TS  {
    errorMsg: string;
    loggedIn: Boolean;
    // userObj: object;
    username: string;
    password: string;
    retypePassword: string;
    user: object;
    user_info: object;
    error: string;
    loading: Boolean;
    userID: string;
    loggedOut: Boolean;
};

const authReducer = ( state : INITIAL_TS = INITIAL_STATE, action:Action ):INITIAL_TS => {
// const auth = ( state = INITIAL_STATE, action) => {
// const auth = ( state = INITIAL_STATE, action = {}) => {
  // const response = action.response;
    // console.log('authReducer action.type',action.type, ' action',action);
    switch (action.type) {
      case ActionType.REGISTER:
        return {
            ...state,
            loading: true,
            // errorMsgUp: 'Processing sign up...'
          };
      // case ActionType.REGISTER_SUCCESS:
      //   return {
      //       ...state,
      //       // loggedIn: true,
      //       // errorMsgUp:'Sign up success. Please check your email to verify before login'
      //   };
      case ActionType.REGISTER_FAILED:
        return {
            ...state,
            errorMsg: action.payload,
            loading: false,
        };
      case ActionType.PASSWORD_MISMATCH:
        return {
            ...state,
        };
      case ActionType.PASSWORD_MISMATCH_FAILED:
        return {
            ...state,
            errorMsg: action.payload,
            loading: false,
        };
      case ActionType.LOGIN:
        console.log('authReducer ActionType.LOGIN action.type',action.type, ' action',action);
        return {
            ...state,
            loading: true,
        };
      case ActionType.LOGIN_SUCCESS:
        console.log('authReducer ActionType.LOGIN_SUCCESS action.type',action.type, ' action',action);
        return {
            ...state,
            errorMsg:'Sign In success',
            loggedIn: true,
            // ...INITIAL_STATE,
            user: action.payload,
            user_info: action.user_info_payload,
            loading: false,
        };
      case ActionType.LOGIN_FAILED:
        return {
            ...state,
            errorMsg: action.payload,
            loading: false,
        };
      case ActionType.LOGOUT:
        console.log('authReducer ActionType.LOGIN action.type',action.type, ' action',action);   
        return {
            ...state,
            // loggedIn: false,
        };
      case ActionType.LOGOUT_SUCCESS:
        console.log('authReducer ActionType.LOGIN_SUCCESS action.type',action.type, ' action',action);   
        return {
            ...state,
            loggedIn: false,
            errorMsg:'',
        };
    //   case ActionType.GET_USER:
    //         return {
    //             ...state
    //         };
    //   case ActionType.RETURN_USER:
    //         return {
    //             ...state,
    //             userObj : action.payload
    //         };
      default:
        return state;
    }
};

export default authReducer;
