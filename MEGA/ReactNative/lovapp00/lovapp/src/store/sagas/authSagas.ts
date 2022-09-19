/* eslint-disable prettier/prettier */
import { all, fork, call, put, take, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as actionTypes from "./actionTypes";
import { ActionType } from "../action-types";
import { loginUserAction, logoutAction, registerAction, passwordMismatchAction }  from '../AuthAction';
import { register, login, loginSuccess, loginFailed, logout }  from '../action-creators';
// import { storeAuthData }   from '../shared/utils';
// import { getUser } from './getUser';
import ReduxSagaFirebase from 'redux-saga-firebase'
import firebase_config from '../../firebase_config';

function* passwordMismatchSaga(){
  try {
    yield passwordMismatchAction();
  } catch (err) {
    console.log('passwordMismatchSaga err',err);
  }
}

function* registerSaga (register) {
  try {
        // storeAuthData('username', registerAction.username);
        yield registerAction(register.payload.username, register.payload.email, register.payload.password);
        // yield put({ type : actionTypes.REGISTER_SUCCESS});
      } catch (err) {
        let newErr = err.message;
        switch (newErr){
          case 'PreSignUp failed with error A user with the same email address exists.' :
            newErr = 'Email Already Associated with an Account';
            break;
          case 'Custom auth lambda trigger is not configured for the user pool.' :
            newErr = 'Password cannot be empty';
            break;
          case 'User already exists' :
            newErr = 'Username Name is Taken';
            break;
        }
        // yield put({ type : actionTypes.REGISTER_FAILED, errorMsgUp : newErr})
      }
};

function* loginSaga (login) {
  console.log('loginSaga  login ======',login);
  // const reduxSagaFirebase = new ReduxSagaFirebase(firebase_config);
  // let email = login.payload.username.toLowerCase();
  // let FBemail = email.indexOf('@') == -1 ? email + '@lovapp.chat' : email;
  // let password = login.payload.password;
      try {
          // console.log('loginSaga login FBemail 22',FBemail);
          // console.log('loginSaga login payload.username 22',login.payload.username);
          // console.log('loginSaga login password 22',password);
          // const channel = yield call(firebase_config.auth.channel);
          // console.log('loginSaga login channel', channel);
          // const response = yield call([Auth,'login'], ({ username: login.username, password: login.password }));
          yield loginUserAction(login.payload.username, login.payload.password);
          // const auth = firebase_config.auth();
          // const firebaseUser = yield call([auth, auth.signInWithEmailAndPassword], FBemail, password);

          // const firebaseUser = yield call (firebase_config.auth.signInWithEmailAndPassword, FBemail, password);
          // yield put({ type : actionTypes.LOGIN_SUCCESS});
          // console.log('loginSaga login firebaseUser : ',firebaseUser);
          // yield put (loginUserAction(login.username, login.password));
          // yield call (loginUserAction,login);
          // yield storeAuthData('token',response.loginUserSession.idToken.jwtToken);
      } catch (err) {
            console.log('loginSaga err',err);
      //   let newErr = err.message;
      //     switch (newErr){
      //       case 'Custom auth lambda trigger is not configured for the user pool.' : 
      //         newErr = 'Password cannot be empty';
      //         break;
      //       case 'User does not exist.' : 
      //         newErr = 'Username does not exist';
      //         break;
      //       case 'Incorrect username or password.' : 
      //         newErr = 'Incorrect password';
      //         break;
      //     }
      //     yield put({ type : actionTypes.LOGIN_FAILED, errorMsgIn : newErr});
      }
};

function* logoutSaga (logout) {
  try {
    yield logoutAction(logout.payload.user, logout.payload.user_info);
    // yield AsyncStorage.clear();
    // yield put({ type : ActionType.LOGOUT_SUCCESS });
  } catch (err) {
      console.log('logoutSaga LOGOUT err: ' , err);
  }
}

// function* getUserSaga(getUserAction){
//   try {
//     const userSaga = yield (getUser(getUserAction));
//     yield put({ type : actionTypes.RETURN_USER, payload : userSaga});
//   } catch (err) {
//       console.log("sagas getUserSaga err: " , err);
//   }
// };

export function* loginStatusWatcher() {
  const reduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
  // events on this channel fire when the user logs in or logs out
  const channel = yield call(reduxSagaFirebase.auth.channel);
  console.log('loginStatusWatcher channel', channel);
  while (true) {
    const { user } = yield take(channel);
    // if (user) yield put(loginSuccess(user))
    // else yield put(logoutSuccess())
  }
}

function* watchPasswordMismatchSaga() {
  yield takeLatest(ActionType.PASSWORD_MISMATCH, passwordMismatchSaga);
}
function* watchRegisterSaga() {
  yield takeLatest(ActionType.REGISTER, registerSaga);
}
function* watchLoginSaga() {
  // const configureChanel = yield login({ type: 'LOGIN' });
  // yield takeEvery(configureChanel, configureSaga);
    yield takeEvery(ActionType.LOGIN, loginSaga);
}
function* watchLogoutSaga() {
  yield takeEvery(ActionType.LOGOUT, logoutSaga);
}
// function* watchGetUserSaga() {
//   yield takeLatest(actionTypes.GET_USER, getUserSaga);
// }

export default function* authSagas() {
    // yield fork(watchRegisterSaga);
    // yield fork(loginStatusWatcher);
    yield all([
      fork(loginStatusWatcher),
      fork(watchPasswordMismatchSaga),
      fork(watchLoginSaga),
      fork(watchRegisterSaga),
      fork(watchLogoutSaga),
      // takeEvery (actionTypes.LOGIN, loginSaga)//,
      // takeEvery(types.LOGOUT.REQUEST, logoutSaga),
    ]);

    // yield fork(watchLoginSaga);
    // yield fork(watchLogoutSaga);
    // yield fork(watchGetUserSaga);
}
