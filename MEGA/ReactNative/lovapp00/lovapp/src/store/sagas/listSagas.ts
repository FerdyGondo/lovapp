/* eslint-disable prettier/prettier */
import { all, fork, call, put, take, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionType } from '../action-types';
import {
  initOnlineListAction,
  initSearchAction,
  initContactListAction,
  queryContactListReverseAction,
  initRecentChatListAction,
  queryRecentChatListAction,
  inviteUserAction,
}  from '../ListAction';
import {
  initOnlineList,
  initSearch,
  initContactList,
  initRecentChatList,
  inviteUser,
}  from '../action-creators';
// import { storeAuthData }   from '../shared/utils';
// import { getUser } from './getUser';

function* initOnlineListSaga (initOnlineList:object) {
  // console.log('initOnlineListSaga initOnlineList ======', initOnlineList);
      try {
          const onlineListObjUser = yield initOnlineListAction(initOnlineList.payload.user_ID, initOnlineList.payload.user_type);
          // console.log('initOnlineListSaga onlineListObjUser ',onlineListObjUser);
          yield put({
            type : ActionType.ONLINE_LIST,
            payload: onlineListObjUser,
          });
          // console.log('loginSaga login firebaseUser : ',firebaseUser);
          // yield put (loginUserAction(login.username, login.password));
          // yield call (loginUserAction,login);
          // yield storeAuthData('token',response.loginUserSession.idToken.jwtToken);
      } catch (err) {
            console.log('initOnlineListSaga err',err);
      //     yield put({ type : actionTypes.LOGIN_FAILED, errorMsgIn : newErr});
      }
}

function* searchSaga (initSearch:object) {
  console.log('searchSaga initSearch ======', initSearch);
      try {
          const searchListObjUser = yield initSearchAction(initSearch.payload.search_text, initSearch.payload.user_ID, initSearch.payload.user_type);
          console.log('searchSaga searchListObjUser ',searchListObjUser);
          yield put({
            type : ActionType.SEARCH_LIST,
            payload: searchListObjUser,
          });
          // console.log('loginSaga login firebaseUser : ',firebaseUser);
          // yield put (loginUserAction(login.username, login.password));
          // yield call (loginUserAction,login);
          // yield storeAuthData('token',response.loginUserSession.idToken.jwtToken);
      } catch (err) {
            console.log('searchSaga err',err);
            yield put({
              type : ActionType.SEARCH_NOT_FOUND,
              payload: err,
            });
      }
}

function* initContactListSaga (initContactList:object) {
  // console.log('initcontactListSaga initContactList ======', initContactList);
      try {
          const contactListObjUser:object = yield initContactListAction(initContactList.payload.user_ID, initContactList.payload.user_type);
          // console.log('initcontactListSaga contactListObjUser ',contactListObjUser);
          yield put({ 
            type : ActionType.CONTACT_LIST,
            payload: contactListObjUser,
            contact_sort_payload: true,
          });
          // yield put (loginUserAction(login.username, login.password));
          // yield call (loginUserAction,login);
          // yield storeAuthData('token',response.loginUserSession.idToken.jwtToken);
      } catch (err) {
            console.log('initcontactListSaga err',err);
      //     yield put({ type : actionTypes.LOGIN_FAILED, errorMsgIn : newErr});
      }
}

function* queryContactListReverseSaga () {
      try {
        yield queryContactListReverseAction();
        // const contactListREVERSE = yield queryContactListReverseAction();
          // const contactListObjUser:object = yield queryContactListAction();
      } catch (err) {
            console.log('queryContactListReverseSaga err',err);
      //     yield put({ type : actionTypes.LOGIN_FAILED, errorMsgIn : newErr});
      }
}

function* initRecentChatListSaga (initRecentChatList:object) {
  // console.log('initRecentChatListSaga initRecentChatList ======', initRecentChatList);
      try {
          const recentChatListObjUser:object = yield initRecentChatListAction(initRecentChatList.payload.user_ID, initRecentChatList.payload.user_type);
          // console.log('initRecentChatListSaga recentChatListUserREVERSE ',recentChatListObjUser.recentChatListUserREVERSE);
          console.log('initRecentChatListSaga totalBadge ',recentChatListObjUser.totalBadge);
          yield put({
            type : ActionType.RECENT_CHAT_LIST_REVERSE,
            payload: recentChatListObjUser.recentChatListUserREVERSE,
            total_badge: recentChatListObjUser.totalBadge,
          });
          // yield put (loginUserAction(login.username, login.password));
          // yield call (loginUserAction,login);
      } catch (err) {
            console.log('initcontactListSaga err',err);
      //     yield put({ type : actionTypes.LOGIN_FAILED, errorMsgIn : newErr});
      }
}

function* queryRecentChatListSaga () {
  try {
    yield queryRecentChatListAction();
    // const contactListREVERSE = yield queryContactListReverseAction();
      // const contactListObjUser:object = yield queryContactListAction();
  } catch (err) {
        console.log('queryRecentChatListAction err',err);
  //     yield put({ type : actionTypes.LOGIN_FAILED, errorMsgIn : newErr});
  }
}

function* inviteUserSaga (inviteUser){
  try {
    const inviteMsg = yield inviteUserAction(inviteUser.payload.user, inviteUser.payload.user_ID, inviteUser.payload.message);
    console.log('inviteUserSaga inviteMsg',inviteMsg);
  } catch (err){ console.log('inviteUserSaga err',err) }
}
// function* getUserSaga(getUserAction){
//   try {
//     const userSaga = yield (getUser(getUserAction));
//     yield put({ type : actionTypes.RETURN_USER, payload : userSaga});
//   } catch (err) {
//       console.log("sagas getUserSaga err: " , err);
//   }
// };
function* watchInitOnlineListSaga() {
    yield takeEvery (ActionType.INIT_ONLINE_LIST, initOnlineListSaga);
}
function* watchSearchSaga() {
    yield takeEvery (ActionType.INIT_SEARCH, searchSaga);
}
function* watchInitContactListSaga() {
    yield takeEvery (ActionType.INIT_CONTACT_LIST, initContactListSaga);
}
function* watchQueryContactListReverseSaga() {
    yield takeEvery (ActionType.CONTACT_LIST, queryContactListReverseSaga);
}
function* watchInitRecentChatListSaga() {
    yield takeEvery (ActionType.INIT_RECENT_CHAT_LIST, initRecentChatListSaga);
}
function* watchQueryRecentChatListSaga() {
    yield takeEvery (ActionType.RECENT_CHAT_LIST_REVERSE, queryRecentChatListSaga);
}
function* watchInviteUserSaga() {
    yield takeEvery (ActionType.INVITE_USER, inviteUserSaga);
}

export default function* authSagas() {
    // yield fork(watchRegisterSaga);
    // yield fork(loginStatusWatcher);
    yield all([
      fork(watchInitOnlineListSaga),
      fork(watchSearchSaga),
      fork(watchInitContactListSaga),
      fork(watchQueryContactListReverseSaga),
      fork(watchInitRecentChatListSaga),
      fork(watchQueryRecentChatListSaga),
      fork(watchInviteUserSaga)
      // takeEvery (actionTypes.LOGIN, loginSaga)//,
      // takeEvery(types.LOGOUT.REQUEST, logoutSaga),
    ]);
    // yield fork(watchLoginSaga);
    // yield fork(watchLogoutSaga);
    // yield fork(watchGetUserSaga);
}
