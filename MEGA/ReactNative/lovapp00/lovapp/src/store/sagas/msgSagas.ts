/* eslint-disable prettier/prettier */
import { all, fork, call, put, take, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionType } from '../action-types';
import {
  fetchMessage,
  sendMessage,
  storeImageToFBAction
}  from '../MsgAction';
import {
  fetchMsg,
  sendMsg,
}  from '../action-creators';
import ReduxSagaFirebase from 'redux-saga-firebase';
import firebase_config from '../firebase_config';
// import { storeAuthData }   from '../shared/utils';
// import { getUser } from './getUser';

function* fetchSaga (fetchMsg:object) {
    // console.log('fetchSaga fetchMsg', fetchMsg);
    try {
        yield fetchMessage(fetchMsg.payload.user, fetchMsg.payload.user_info, fetchMsg.payload.navigation_params);
        // const obj = yield fetchMessage(fetchMsg.payload.user, fetchMsg.payload.user_info, fetchMsg.payload.navigation_params);
        // console.log('fetchSaga obj',obj);
        // const user = obj.user;
        // const messages = obj.messages;
        // yield put({
        //     type: ActionType.FETCH_MSG_RESULT,
        //     payload: {
        //       user,
        //       messages,
        //     },
        // });
    } catch (err) {
          console.log('fetchSaga err',err);
    }
}

function* sendSaga (sendMsg:object){
    // console.log('sendSaga sendMsg', sendMsg);
    try {
        yield sendMessage(sendMsg.payload.msg, sendMsg.payload.user, sendMsg.payload.user_info, sendMsg.payload.nav_param);
    } catch (err) {
        console.log('sendSaga err',err);
    }
}

function* storeImageSaga (storeImage:object) {
    console.log('storeImageSaga storeImage', storeImage);
        try {
            const url = yield storeImageToFBAction(storeImage.payload.user, storeImage.payload.response);
            const point_amount = storeImage.payload.point_amount;
            console.log('storeImageSaga url ',url);
                let msg = Object();
                msg.image = url;
                msg.messageType = 'image';
                msg.text = '';
                msg.pointAmount = point_amount;
                console.log('storeImageSaga msg : ',msg);
                // sendDispatch(sendMsg(msg, authReducer.user, authReducer.user_info));
            yield sendMessage(msg, storeImage.payload.user.user, storeImage.payload.user.user_info, storeImage.payload.nav_param);
            yield put({
              type : ActionType.STORE_IMAGE_RESULT,
              payload: { url, point_amount },
            });
        } catch (err) {
              console.log('storeImageSaga err',err);
        }
  }

function* watchFetchSaga() {
    yield takeEvery (ActionType.FETCH_MSG, fetchSaga);
}
function* watchSendSaga() {
    yield takeEvery (ActionType.SEND_MSG,   sendSaga);
}
function* watchstoreImageSaga() {
    yield takeEvery (ActionType.STORE_IMAGE,   storeImageSaga);
}

export default function* msgSagas() {
    // yield fork(watchRegisterSaga);
    // yield fork(loginStatusWatcher);
    yield all([
      fork(watchFetchSaga),
      fork(watchSendSaga),
      fork(watchstoreImageSaga),
    ]);
    // yield fork(watchLoginSaga);
    // yield fork(watchLogoutSaga);
    // yield fork(watchGetUserSaga);
}
