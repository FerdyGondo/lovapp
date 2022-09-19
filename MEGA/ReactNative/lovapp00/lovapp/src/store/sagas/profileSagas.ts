/* eslint-disable prettier/prettier */
import { all, fork, call, put, take, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionType } from '../action-types';
import {
  storeProfileAction,
  getProfile
}  from '../ProfileAction';
import {
  storeProfile,
}  from '../action-creators';
import ReduxSagaFirebase from 'redux-saga-firebase';
// import ImgToBase64 from 'react-native-image-base64';

import firebase_config from '../../firebase_config';
// import { storeAuthData }   from '../shared/utils';
// import { getUser } from './getUser';

function* storeProfileSaga (storeProfile:object) {
  console.log('storeProfileSaga storeProfile', storeProfile);
      try {
          const url = yield storeProfileAction(storeProfile.payload.user, storeProfile.payload.response);
          console.log('storeProfileSaga url ',url);
          // console.log('storeProfileSaga userID ',`/profileImages/${storeProfile.payload.user.userID}`);
          // console.log('storeProfileSaga storeProfile.payload.response.uri ',storeProfile.payload.response.uri);
          // const base64Image = yield (ImgToBase64.getBase64String(storeProfile.payload.response.uri));
          // console.log('storeProfileSaga base64Image ',base64Image);
          // const profilePath = reduxSagaFirebase.storage.uploadFile(`/profileImages/${storeProfile.payload.user.userID}`, base64Image);
          // const profilePath = yield call(reduxSagaFirebase.upload, `/profileImages/${storeProfile.payload.user.userID}`, storeProfile.payload.response.uri);
          // .uploadFile(storagePath, file, dbPath, { metadata: fileMetadata })
          // const profilePath = yield call(reduxSagaFirebase.storage.uploadString, `/profileImages/${storeProfile.payload.user.userID}`, storeProfile.payload.response.uri);
          // console.log('storeProfileSaga profilePath ',profilePath);
          // const channel = eventChannel(emit => task.on('state_changed', emit));
          // yield takeEvery(channel, ...);
          // // Wait for upload to complete
          // yield task
          // const url = yield call(reduxSagaFirebase.storage.getDownloadURL, `/profileImages/${storeProfile.payload.user.userID}`);
          // console.log('storeProfileSaga url ',url);
          // yield call(fetch, url, ...);
          yield put({
            type : ActionType.STORE_PROFILE_RESULT,
            payload: url,
          });
      } catch (err) {
            console.log('storeProfileSaga err',err);
      }
}

function* getProfileSaga (storeProfile:object) {
  // console.log('getProfileSaga storeProfile', storeProfile);
      try {
          const url = yield getProfile(storeProfile.payload.user);
          // console.log('getProfileSaga url ',url);
          yield put({
            type : ActionType.STORE_PROFILE_RESULT,
            payload: url,
          });
      } catch (err) {
            console.log('getProfileSaga err',err);
      }
}

function* watchStoreProfileSaga() {
    yield takeEvery (ActionType.STORE_PROFILE, storeProfileSaga);
}
function* watchGetProfileSaga() {
    yield takeEvery (ActionType.GET_PROFILE, getProfileSaga);
}

export default function* profileSagas() {
    // yield fork(watchRegisterSaga);
    // yield fork(loginStatusWatcher);
    yield all([
      fork(watchStoreProfileSaga),
      fork(watchGetProfileSaga),
    ]);
    // yield fork(watchLoginSaga);
    // yield fork(watchLogoutSaga);
    // yield fork(watchGetUserSaga);
}
