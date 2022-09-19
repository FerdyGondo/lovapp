/* eslint-disable prettier/prettier */
import { all, fork, take, call, put, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';

import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import qs from 'qs';	//query string
// import ImgToBase64 from 'react-native-image-base64';
import ImageResizer from 'react-native-image-resizer';
import { ActionType } from './action-types';
import { sendPushNotification } from './NotificationAction';
import notifee from '@notifee/react-native';
// import ShortcutBadge from 'react-native-app-badge';
import BadgeAndroid from 'react-native-android-badge';

import { eventChannel, buffers } from 'redux-saga';
import ReduxSagaFirebase from 'redux-saga-firebase';

import firebase_config from '../firebase_config';
import { config } from '../config';
import { Alert, Platform } from 'react-native';

// function* startListener() {
//     const channel = eventChannel(emiter => {
//       const listener = database.ref("todos").on("value", snapshot => {
//         emiter({ data: snapshot.val() || {} });
//       });
//       return () => {
//         listener.off();
//       };
//     });
//     while (true) {
//       const { data } = yield take(channel);
//       yield put(actionsCreators.updateList(data));
//     }
//   }

// export const fetchMessage = ( user, user_info, navigation_params ) => async (dispatch) => {
export function* fetchMessage ( user, user_info, navigation_params ) {
    user.toUserID = navigation_params.user_id;
    // console.log('MsgAction fetchMessage user.toUserID 1 ', user.toUserID );
    // console.log('MsgAction fetchMessage navigation_params.user_id ', navigation_params.user_id );
    // console.log('MsgAction fetchMessage navigation_params', navigation_params );
    let room = '';
    // let messages = {};
    try {
        yield put({
            type : ActionType.LOADING_MSG,
            payload: {},
        });
        // console.log('MsgAction fetchMessage user.toUserID 2 : ', user.toUserID );
        if (user.userID === user.toUserID || !user.userID || user.userID === ''  || user.userID === null || !user.toUserID || user.toUserID === '' || user.toUserID === null){
            console.log(' MsgAction fetchMessage NO_USER_ALERT' );
            yield put({
                type: ActionType.NO_USER_ALERT,
                payload:{},
            });
        }
        const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config);
        const snapshot = yield call(reduxSagaFirebase.database.read, `messages/room_${user.toUserID}_${user.userID}`);
        // firebase_config.database().ref(`messages/room_${user.toUserID}_${user.userID}`).once('value').then(snapshot => {
                // console.log('MsgAction fetchMessage snapshot 1 ',snapshot);
                // room = snapshot ? `room_${user.toUserID}_${user.userID}` : `room_${user.userID}_${user.toUserID}`;
                if (snapshot !== null) {
                    room = `room_${user.toUserID}_${user.userID}`;
                } else {
                    room = `room_${user.userID}_${user.toUserID}`;
                }
                if (!room || room === '' || room === null ){
                    console.log(' MsgAction fetchMessage NO_USER_ALERT' );
                    yield put({
                        type: ActionType.NO_USER_ALERT,
                        payload:{},
                    });
                }
                console.log('MsgAction fetchMessage room  : ', room );
                user.room_id = room;
                const newMsgRef = firebase_config.database().ref(`messages/${room}`).push();
                let msg = {
                        _id: newMsgRef.key, //assign firebase generated key to msg
                        user: { _id     : user.userID,
                                name    : user_info.user_name,
                                avatar  : user_info.user_image }, //user.avatar,// need avatar from different source
                        to_user_id: user.toUserID,
                        text: '',
                        //system: outOfBalance,
                        createdAt: '',//firebase_config.database.ServerValue.TIMESTAMP,//new Date(),
                        charge_id: '',  //chargeId,
                        unread: user.toUserID
                };
                // console.log('MsgAction fetchMessage msg  : ', msg );
                if (msg.text !== '') newMsgRef.set(msg);

                // const updateChannel = createEventChannel(room);
                // console.log('MsgAction fetchMessage updateChannel  : ', updateChannel );
                // while (true) {
                //     let data = yield take(updateChannel);
                //     console.log('MsgAction fetchMessage data  : ', data );
                //     let messages = Object.values(data).reverse() || []
                //     console.log('MsgAction getMessages messages 2 : ', messages );
                //     yield put({
                //         type: ActionType.FETCH_MSG_RESULT,
                //         payload: {user, messages},
                //     });
                // }
                const channel = eventChannel( emiter => { //Create eventChannel & start the listener
                    const listener = firebase_config.database().ref(`messages/${room}`).orderByChild('createdAt').on('value', snapshot => {
                        // console.log('MsgAction fetchMessage snapshot 2 : ', snapshot.val() );
                        emiter({ messages: snapshot.val() !== null ? Object.values(snapshot.val()).reverse() || {} : null });
                        // emiter({ messages: Object.values(snapshot.val()).reverse() || {} });
                        snapshot.forEach(function(childSnap){
                            // console.log('MessageAction getMessages childSnap.key : ', childSnap.key , 'childSnap.val()  : ', childSnap.val());
                            if (childSnap.val().unread === user.userID){     //clearUnread
                                firebase_config.database().ref(`messages/${room}/${childSnap.key}`).update({ unread : '' }); // or false
                            }
                            if ((childSnap.val().text === '' || !childSnap.val().text) && (childSnap.val().image === '' || !childSnap.val().image)){
                                firebase_config.database().ref(`messages/${room}/${childSnap.key}`).remove();
                            }
                        });
                    });
                    return () => {  //Return the shutdown method
                        listener.off();
                    };
                }, buffers.expanding(0));
                while (true) {  //Creates a loops to keep the execution in memory;
                    // console.log('MsgAction getMessages channel 2 : ', channel );
                    let { messages } = yield take(channel);
                    // console.log('MsgAction getMessages messages 2 : ', messages );
                    yield put({ //Pause the task until the channel emits a signal and dispatch an action in the store
                        type: ActionType.FETCH_MSG_RESULT,
                        payload: {user, messages},
                    });
                    if (messages){     // gets around Redux panicking about actions in reducers
                        if (user.userType === '205' || user.userType === '206' || user.userType === '208' || user.userType === '215'){
                            user.skip_charging_once = true;    //initialize skip charging once
                            for (var i = 0; i < messages.length; i++){
                                if (messages[i].to_user_id !== user.userID && (messages[i].text !== '' || (messages[i].image !== '' && messages[i].image))) {
                                    user.skip_charging_once = false;
                                }
                            }
                        }
                    } else {
                        console.log('MsgAction getMessages messages EMPTY : ', messages);
                        if (user.userType === '205' || user.userType === '206' || user.userType === '208' || user.userType == '215')
                            user.skip_charging_once = true;    //skip charging once
                        yield put({ //Pause the task until the channel emits a signal and dispatch an action in the store
                            type: ActionType.FETCH_MSG_RESULT,
                            payload: {user, messages},
                        });
                    }
                } // while true
/*                     firebase_config.database().ref(`messages/${room}`).orderByChild("createdAt").on('value', (snapshot) => {
                        if (snapshot){     // gets around Redux panicking about actions in reducers
                            messages = Object.values(snapshot.val()).reverse() || [];
                            if (user.userType === '205' || user.userType === '206' || user.userType === '208' || user.userType === '215'){
                                user.skip_charging_once = true;    //initialize skip charging once
                                for (var i = 0; i < messages.length; i++){
                                    if (messages[i].to_user_id !== user.userID && (messages[i].text !== '' || (messages[i].image !== '' && messages[i].image))) {
                                        user.skip_charging_once = false;
                                    }
                                }
                            }
                            console.log('MsgAction getMessages messages  : ', messages );
                            // resolve({messages, user});
                         } else {
                            console.log('MsgAction getMessages snapshot.val() EMPTY : ', snapshot.val());
                            if (user.userType === '205' || user.userType === '206' || user.userType === '208' || user.userType == '215')
                                user.skip_charging_once = true;    //skip charging once
                                // reject('EMPTY ARRAY');
                        }
                    }); //firebase_config... */
                } catch (error) {
                    console.log('MsgAction getMessages catch error : ', error);
                        errorMessage(error);
                }
                                        // setTimeout ( () => {
                                            // clearBadge(user);
                                            // }, 1000);
        // });     //firebase_config.database()
}

// function createEventChannel(room) {
//     console.log('MsgAction createEventChannel  room : ', room);
//     let listener = new eventChannel(
//         emit => {
//             firebase_config.database().ref(`messages/${room}`).orderByChild('createdAt').on('value', data => emit(data.val()));
//             return () => firebase_config.database().ref(`messages/${room}`).orderByChild('createdAt').off(listener);
//         }, buffers.expanding(0)
//     );
//     console.log('MsgAction createEventChannel  listener : ', listener);
//     return listener;
// };

function* errorMessage(error){
    //console.log('ChatMessage errorMessage messages : ', messages);
    yield put({
        type: ActionType.ERROR_MSG,
        payload: {
            firebase_error : error,
        },
    });
}
export const chargingImage = ( user, point, callback)  => {
    //http://api.lovapp.chat/mobileAuth/charge?userId=60154768&performerId=13619243&access_token=07952eda735f9aba6ec32c5a7b8a5764&roomId=000001&app_token=asdfghjkl&version=10
    let url = `${config.ROOT_URL}/charge?userId=${user.userID}&performerId=${user.toUserID}&access_token=${user.access_token}&roomId=${user.room_id}&app_token=${config.APP_TOKEN}&version=${config.VERSION}`;
    // console.log('MsgAction charging url : ',url);
    //console.log('MsgAction charging user.userID : ',user.userID);
    //console.log('MsgAction charging user.toUserID : ',user.toUserID);
    //console.log('MsgAction charging access_token : ',user.access_token);
    //console.log('MsgAction charging config : ',config);
    // Send a POST request
    var params = qs.stringify({
        userId: user.userID,
        performerId: user.toUserID,
        access_token: user.access_token,
        roomId: user.room_id,
        app_token: config.APP_TOKEN,
        version: config.VERSION,
        points: point,
        charge_type : '520',
    });
    //console.log('MsgAction charging [config.ROOT_URL+/charge] : ',[config.ROOT_URL+'/charge']);
    axios.post([config.ROOT_URL + '/charge'].toString(), params).then(response => {
          // console.log('MsgAction charging response		: ', response);
          // console.log('MsgAction charging response.data.error	: ', response.data.error);
          // console.log('MsgAction charging response.data.response : ', response.data.response);
          // console.log('MsgAction charging response.data.balance     : ', response.data.balance);
          // console.log('MsgAction charging user.user.userID 	       : ', user.userID);
          // console.log('MsgAction charging user.toUserID 	           : ', user.toUserID);
          if (response.data.balance){
              firebase_config.database().ref(`user/${user.userID}/user_info`).update({
                  user_balance : response.data.balance,
              });
            }
        if (response.data.response === 'error' && response.data.error === 'redirect'){
            console.log('MsgAction chargingImage response.data.error : ', response.data.error);
            }
            callback(response);
        //   callback(outOfBalance, outOfBalance ? '' : response.data.chargeId, goLoginForm, disableUser);
      })
      .catch( (axiosError) => {
          console.log('MsgAction charging axiosError : ', axiosError);
          callback('',axiosError);
        });
  };

// export const charging = ( user, room_id, text, callback) => {
export const charging = ( user, room_id, text) => {
    return new Promise( (resolve, reject) => {
    //http://api.lovapp.chat/mobileAuth/charge?userId=60154768&performerId=13619243&access_token=07952eda735f9aba6ec32c5a7b8a5764&roomId=000001&app_token=asdfghjkl&version=10
    let url = `${config.ROOT_URL}/charge?userId=${user.userID}&performerId=${user.toUserID}&access_token=${user.access_token}&roomId=${room_id}&app_token=${config.APP_TOKEN}&version=${config.VERSION}`;
    //console.log('MsgAction charging url : ',url);
    //console.log('MsgAction charging user : ',user);
    //console.log('MsgAction charging access_token : ',user.access_token);
    //console.log('MsgAction charging config : ',config);
    var params = qs.stringify({    // Send a POST request
        userId: user.userID,
        performerId: user.toUserID,
        access_token: user.access_token,
        roomId: room_id,
        app_token: config.APP_TOKEN,
        version: config.VERSION,
    })
    //console.log('MsgAction charging [config.ROOT_URL+/charge] : ',[config.ROOT_URL+'/charge']);
    axios.post([config.ROOT_URL+'/charge'].toString(), params).then(response => {
          // console.log('MsgAction charging response		: ', response);
          // console.log('MsgAction charging response.data.error	: ', response.data.error);
          // console.log('MsgAction charging response.data.response : ', response.data.response);
          // console.log('MsgAction charging response.data.balance     : ', response.data.balance);
          // console.log('MsgAction charging user.user.userID 	       : ', user.userID);
          // console.log('MsgAction charging user.toUserID 	           : ', user.toUserID);
          if (response.data.balance){
              firebase_config.database().ref(`user/${user.userID}/user_info`).update({
                  user_balance : response.data.balance,
              });
          }
         if (response.data.response === 'error' && response.data.error === 'redirect'){
             console.log('MsgAction charging user : ', user);
             console.log('MsgAction charging text : ', text.text);
             firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}`).update({
                 unsent_text         : text.text,
            });
        }
          let obj = {};
          obj.goLoginForm  = (response.data.response === 'error' && response.data.error === 'redirect')       ? true : false;
          obj.outOfBalance = (response.data.response === 'error' && response.data.error === 'out of balance') ? true : false;
          obj.disableUser  = (response.data.response === 'error' && response.data.error === 'Invalid_user')   ? true : false;
          obj.chargeId   = obj.outOfBalance ? '' : response.data.chargeId;
          resolve(obj);
        //   callback(outOfBalance, outOfBalance ? '' : response.data.chargeId, goLoginForm, disableUser);
      })
      .catch( (axiosError) => {
          console.log('MsgAction charging axiosError : ', axiosError);
        //   callback('','','',axiosError);
        reject(axiosError);
        });
    });
  };

  // export const getBalance = (callback) => async dispatch => {
  //   let balance = 1;
  //   let outOfBalance = (balance == 0) ? true : false;
  //   callback(outOfBalance);
  // }

  export const checkBalance = ( user_ID, callback) => {
    //console.log("MsgAction user_ID : ", user_ID);
    firebase_config.database().ref(`user/${user_ID}/user_info/user_balance`).on("value", (snap) => {
        //console.log("MsgAction snap.val() : ", snap.val());
        callback(snap.val());
    });
  };

  export const checkUserStatus = ( userID, callback) => {
    //console.log("MsgAction userID : ", userID);
    firebase_config.database().ref(`user/${userID}/user_info/user_status`).on("value", (snap) => {
        // console.log("MsgAction checkUserStatus snap.val() : ", snap.val());
        callback(snap.val());
    })
  }

  export const checkOtherUserStatus = ( toUserID, callback) => {
      //console.log("MsgAction user_ID : ", user_ID);
      firebase_config.database().ref(`user/${toUserID}/user_info/user_status`).on("value", (snap) => {
          //console.log("MsgAction checkUserStatus snap.val() : ", snap.val());
          callback(snap.val());
      });
    };

  export function* sendMessage (text, user, user_info, nav_param)  {
      // console.log('MsgAction sendMessage text     : ', text);
      // console.log('MsgAction sendMessage user_info ', user_info);
      // console.log('MsgAction sendMessage user ', user);
    //   nav_param.test_flag = '0';
      // console.log('MsgAction sendMessage nav_param ', nav_param);
      let havePromo = user.promo === 'true' ? true : false;
      // console.log('MsgAction sendMessage havePromo : ', havePromo);
      if ((user.userType === '205' || user.userType === '206' || user.userType === '208' || user.userType === '215') && !havePromo && !user.skip_charging_once && nav_param.test_flag !== '1'){
        // console.log('MsgAction sendMessage user : ', user);
        // charging(user, user.room_id, text, (outOfBalance, chargeId, goLoginForm, disableUser, axiosNetworkError) => {
        const chargeData = yield charging(user, user.room_id, text);
              //callback(outOfBalance, goLoginForm, axiosNetworkError);
              console.log('MsgAction sendMessage chargeData : ', chargeData);
              // console.log('MsgAction sendMessage outOfBalance : ', outOfBalance);
              // console.log('ChatMessage sendMessage goLoginForm : ', goLoginForm);
              // console.log('ChatMessage sendMessage axiosNetworkError : ', axiosNetworkError);
            yield put({
                type: ActionType.SEND_MSG_RESULT,
                // payload: { outOfBalance, goLoginForm, disableUser, axiosNetworkError}
                payload: chargeData,
            });
            if (chargeData.axiosNetworkError && chargeData.axiosNetworkError.message === 'Network Error'){
                //console.log('MsgAction sendMessage  axiosNetworkError.message : ', axiosNetworkError.message);
            } else {
                // if (!chargeData.outOfBalance && !chargeData.goLoginForm && !chargeData.disableUser)
                    sendMessage2(text, user_info, user, chargeData.chargeId);
            }
            //   }); //  charging(user, room, (outOfBalance) => {
      } else {
          const chargeData = {};
          chargeData.outOfBalance = false;
          chargeData.goLoginForm = false;
          chargeData.disableUser = false;
          chargeData.chargeId = '';
        yield put({
            type: ActionType.SEND_MSG_RESULT,
            payload: chargeData,
        });
          sendMessage2(text, user_info, user, '');
      }
  };

//   export const sendMessage2 = (text, user_info, user, chargeId, outOfBalance, goLoginForm, axiosNetworkError) => {
  export const sendMessage2 = (text, user_info, user, chargeId) => {
    //const { currentUser } = firebase_config.auth();
    const newMsgRef = firebase_config.database().ref(`messages/${user.room_id}`).push();
    // console.log('MsgAction sendMessage2 user : ', user);
    // console.log('MsgAction sendMessage2 user_info : ', user_info);
    // console.log('MsgAction sendMessage2 chargeId : ', chargeId);
    let totalBadge = 0;
    let msg = {
            _id: newMsgRef.key, //assign firebase generated key to msg
            user: {
                    _id     : user.userID,
                    name    : user_info.user_name,
                    avatar  : user_info.user_image, //user.avatar,// need avatar from different source
            },
            to_user_id: user.toUserID,
            // text: outOfBalance ? user_info.user_name + ' Is Out Of Balance' : text.text,
            text: text.text,
            //system: outOfBalance,
            createdAt: '',//firebase_config.database.ServerValue.TIMESTAMP,//new Date(),
            charge_id: chargeId,
            unread: user.toUserID,
            message_type    : text.messageType === 'image' ? 'image'          : null,
            image           : text.image                   ? text.image       : null,
            point_amount    : text.pointAmount             ? text.pointAmount : null,
            image_token     : text.image_token             ? text.image_token : null,
        };
    msg.createdAt = firebase_config.database.ServerValue.TIMESTAMP;
    // console.log('MsgAction sendMessage2 msg : ', msg);
    newMsgRef.set(msg)
        .then( () => {
            firebase_config.database().ref(`user/${user.toUserID}/contact_list`).once('value')
            .then(snapshot => {
                    if (snapshot.child(`${user.userID}`).exists()){
                        // firebase_config.database().ref(`user/${user.toUserID}/contact_list/${user.userID}`).set({
                        //     badge               : firebase_config.database.ServerValue.increment(1),
                        //     last_msg_timestamp  : firebase_config.database.ServerValue.TIMESTAMP,
                        //     last_msg            : msg.text,
                        //     invited             : true,
                        //     unsent_text         : '',
                        //     user_name           : msg.user.name,
                        //     // lower_case_name     : msg.user.name,
                        // });
                        var contactUser = firebase_config.database().ref(`user/${user.toUserID}/contact_list/${user.userID}`)
                        // console.log('MsgAction sendMessage2 contactUser', contactUser);
                        contactUser.transaction(function(userdata) {
                            // console.log('MsgAction sendMessage2 userdata 1 ', userdata);
                            if (userdata){
                                userdata.badge++;
                                userdata.last_msg_timestamp = firebase_config.database.ServerValue.TIMESTAMP;
                                userdata.last_msg = msg.text;
                                userdata.invited  = true;
                                userdata.user_name = msg.user.name;
                            }
                            // console.log('MsgAction sendMessage2 userdata 2 ', userdata);
                            return userdata;
                            //return (currentBadge || 0) + 1; //We use current_value || 0 to see if the counter is null or hasn't been incremented yet, since transactions can be called with null if no default value was written.
                        });
                    } else {    // for adding user upon receiving message
                            // console.log('MsgAction sendMessage2 user.toUserID : ', user);
                            // console.log('MsgAction sendMessage2 msg : ', msg);
                            firebase_config.database().ref(`user/${user.toUserID}/contact_list/${user.userID}`).set({
                                badge               : 1,
                                last_msg_timestamp  : firebase_config.database.ServerValue.TIMESTAMP,
                                last_msg            : msg.text,
                                invited             : true,
                                unsent_text         : '',
                                user_name           : msg.user.name,
                                lower_case_name     : msg.user.name,
                            });
                    }
                }) //    .then(function (snapshot) {
                .then( () => {
                    firebase_config.database().ref(`user/${user.toUserID}/contact_list`).once('value', snap => {
                        // console.log('MsgAction sendMessage2 snap.key 11 : ', snap.key, ' snap.val() 11 : ', snap.val());
                        snap.forEach(function(childSnap){
                            //console.log('MsgAction sendMessage2 childSnap.key 11 : ', childSnap.key, 'childSnap.val() 11 : ', childSnap.val());
                            //console.log('MsgAction sendMessage2 childSnap.val().badge 11 : ', childSnap.val().badge);
                            if (childSnap.val().badge) totalBadge += childSnap.val().badge;
                            // console.log('MsgAction sendMessage2 totalBadge: ', totalBadge);
                        });
                    })
                    .then( () => {              //SEND NOTIFICATION
                        firebase_config.database().ref(`user/${user.toUserID}/device_info`).once('value', snap => {
                            // console.log('MsgAction sendMessage2 user ::::::::::::::: ', user);
                            // console.log('MsgAction sendMessage2 snap.key 22 : ', snap.key, ' snap.val() 22 : ', snap.val());
                            snap.forEach(function(childSnap){
                                    // console.log('MsgAction sendMessage2 msg ::::::::::::::: ', msg);
                                    // console.log('MsgAction sendMessage2 childSnap.key 22 : ', childSnap.key, ' childSnap.val() 22 : ', childSnap.val().device_type);
                                    // console.log('MsgAction SEND NOTIFICATION totalBadge: ', totalBadge);
                                    sendPushNotification(childSnap.key, {
                                        user_name     : msg.user.name,
                                        text          : msg.text,
                                        user_image    : msg.user.avatar,
                                        chatId        : msg._id,   //
                                        user_id       : msg.user._id,
                                        to_user_id    : msg.to_user_id,
                                        device_type   : childSnap.val().device_type,
                                        badge         : totalBadge,
                                        //room_id       : user.room_id,
                                    })
                                })    //snap.forEach(function(childSnap){
                        })  //firebase_config.database().ref(`user/${user.toUserID}/device_info`).once("value", (snap) => {
                            .then( () => {
                                firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}`).update({
                                    last_msg_timestamp  : firebase_config.database.ServerValue.TIMESTAMP,
                                    last_msg            : msg.text,
                                    invited             : true,
                                    unsent_text         : '',
                                    // room_id             : user.room_id,
                                })
                                .then( () => {  //remove empty messages from message room // it ll remove image with empty message
                                    firebase_config.database().ref(`messages/${user.room_id}`).once('value', snap => {
                                        snap.forEach(function(childSnap){
                                            if ((childSnap.val().text === '' || !childSnap.val().text) && (childSnap.val().image === '' || !childSnap.val().image)){
                                                firebase_config.database().ref(`messages/${user.room_id}/${childSnap.key}`).remove();
                                            }
                                        });
                                    });
                                });
                            });  //      ..then( () => {
                    });  //.then( () => {firebase_config.database().ref(`user/${user.toUserID}/contact_list`).once("value")
                });  //.then( () => {firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}`).update({
        });  //firebase_config.database().ref(`user/${user.toUserID}/contact_list`).once("value")
  };

export const saveUnsentMsg = ( user, text, callback ) => {
    // console.log('MsgAction saveUnsentMsg text : ', text);
    // console.log('MsgAction saveUnsentMsg user : ', user);
    firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}`).update({unsent_text : text})
        .then( () => {
            // user.toUserID = '';
            // console.log('MsgAction saveUnsentMsg user.toUserID : ', user.toUserID);
            callback(true);
        });
    // console.log('MsgAction saveUnsentMsg user.room_id : ', user.room_id);
    firebase_config.database().ref(`messages/${user.room_id}`).off();
    //firebase_config.database().ref(`user/${user.userID}/contact_list`).off();
    //firebase_config.database().ref(`messages/${room_id}`).off('child_added', (snapshot) => {});
    //firebase_config.database().ref(`messages/${room_id}`).off('child_added');
    //firebase_config.database().ref(`messages/${room_id}`).orderByKey().limitToLast(100).off('child_added');    
};

// export const resetMessage = ( user ) => {
//     //console.log('ChatMessage MsgAction resetMessage user.room_id : ', user.room_id);
//     dispatch(
//         {
//         type: RESET_MSG,
//             payload:{},
//         }
//     );
// };

export const getUnsentText = ( user, callback) => {
    // console.log("MsgAction getUnsentText user", user);
    firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}/unsent_text`).on("value", (snap) => {
        // console.log("MsgAction getUnsentText snap.val() : ", snap.val());
         callback(snap.val());
    });
};

export const clearBadge = (user) => {
    let totalCurrentBadge = 0;
    //console.log('MsgAction clearBadge user.roon_id ::::::::::: 11 ', room_id);
    //console.log('MsgAction clearBadge ::::::::::: :::::::: 22 ', user.toUserID);
    //console.log('MsgAction clearBadge user.roon_id ::::::::::: 22 ', user.room_id);
    firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}`).update({badge : 0})
        .then( () => {
            firebase_config.database().ref(`user/${user.userID}/contact_list`).once('value', (snap) => {
                //console.log('MsgAction clearBadge snap.key  : ', snap.key);
                //console.log('MsgAction clearBadge snap.val() : ', snap.val());
                snap.forEach(function(childSnap){
                    //console.log('MsgAction clearBadge childSnap.key 33 : ', childSnap.key);
                    //console.log('MsgAction clearBadge childSnap.val() 33 : ', childSnap.val());
                    //console.log('MsgAction clearBadge childSnap.val().badge 33 : ', childSnap.val().badge);
                        if (childSnap.val().badge) totalCurrentBadge += childSnap.val().badge;
                });
            });
            if (Platform.OS === 'ios'){
                notifee.setBadgeCount(totalCurrentBadge).then(() => {
                    // Alert.alert('totalCurrentBadge ', totalCurrentBadge.toString());
                    // console.log('MsgAction clearBadge totalCurrentBadge', totalCurrentBadge);
                });
            } else {
                // console.log('AuthAction BadgeAndroid.setBadge(totalCurrentBadge)', totalCurrentBadge);
                BadgeAndroid.setBadge(totalCurrentBadge);
                // ShortcutBadge.setCount(totalCurrentBadge);
            }
            // firebase_config.notifications().setBadge(totalCurrentBadge);
            //   notificationAction.setBadgeNumber(totalCurrentBadge);
        });  //    .then( () => {
};

export const checkBlockedUser = ( user, callback) => {
    //console.log("MsgAction checkBlockedUser user : ", user);
    firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}/block`).once('value', (snap) => {
        //console.log("MsgAction checkBlockedUser snap.val() : ", snap.val());
        callback(snap.val());
    });
  };

  export const checkGotBlocked = ( user, callback) => {
    //console.log("MsgAction checkGotBlocked user : ", user);
    firebase_config.database().ref(`user/${user.toUserID}/contact_list/${user.userID}/block`).on("value", (snap) => {
        //console.log("MsgAction checkGotBlocked snap.val() : ", snap.val());
        callback(snap.val());
    });
  };

  export const toggleBlockUser = ( user, blockedUser, callback ) => {
    // console.log("MsgAction user : ", user);
    // console.log("MsgAction blockedUser : ", blockedUser);
    firebase_config.database().ref(`user/${user.userID}/contact_list/${user.toUserID}/block`).set(!blockedUser)
        .then(callback(!blockedUser));
  };

export const updatePointAmount = ( user, msgProp, callback ) => {
    // console.log('MsgAction saveUnsentMsg user : ', user);
    // console.log('MsgAction saveUnsentMsg msgProp : ', msgProp);
    firebase_config.database().ref(`messages/${user.room_id}/${msgProp._id}`).update({point_amount  : 0})
        .then(() => { callback();});
};

  export const deleteMsg = (userID, toUserID, msgID, deletedMsgText) => {
    // console.log("MsgAction deleteMsg userID ", userID);
    // console.log("MsgAction deleteMsg toUserID ", toUserID);
    // console.log("MsgAction deleteMsg msgID ", msgID);
    // let room = '';
    firebase_config.database().ref('messages').child(`room_${toUserID}_${userID}`).once('value')
        .then(snapshot => {
            let room = snapshot.val() ? `room_${toUserID}_${userID}` : `room_${userID}_${toUserID}`;
            // if(snapshot.val()) {
            //     room = `room_${toUserID}_${userID}`;
            // } else {
            //     room = `room_${userID}_${toUserID}`;
            // }
            firebase_config.database().ref(`messages/${room}/${msgID}`).remove()
        })
        .then( () => {
            firebase_config.database().ref(`user/${userID}/contact_list/${toUserID}`).update({
                last_msg_timestamp  : firebase_config.database.ServerValue.TIMESTAMP,
                last_msg            : deletedMsgText,
            })
            .then( () => {
                firebase_config.database().ref(`user/${toUserID}/contact_list/${userID}`).update({
                    last_msg_timestamp  : firebase_config.database.ServerValue.TIMESTAMP,
                    last_msg            : deletedMsgText,
                })
            })
        })
  };
/* 
  export const reduceImageAction = async (user, response) => {
        console.log('reduceImageAction uploadImage response.assets[0].uri : ', response.assets[0].uri);
        const newResponse =  await ImageResizer.createResizedImage(response.assets[0].uri, 500, 500, 'JPEG', 500, 0);
        console.log('reduceImageAction newResponse',newResponse);
        storeImageToFBAction(user, newResponse);
        //   ImgToBase64.getBase64String(newResponse.uri).then(base64String =>  {
        //         // console.log('convertPic base64String',base64String);
        //         //   setImageResponse({ response, base64String });
        //         }).catch(err => console.log('convertPic err ', err));
    }; */

    export const storeImageToFBAction = async ( user, response ) => {
    //   export const storeImage = (response, mime = 'image/jpeg', name) => {
        response = await ImageResizer.createResizedImage(response.assets[0].uri, 500, 500, 'JPEG', 100, 0);
        console.log('storeImageToFBAction uploadImage response.uri : ', response.uri);
        const mime = 'image/jpeg';
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        return new Promise((resolve, reject) => {
            let imgUri = response.uri;
            const uploadUri = imgUri.replace('file://', '');
            // const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
            console.log('storeImageToFB uploadUri : ', uploadUri);
            const imageTime = new Date().getTime();
            let uploadBlob = null;
            const imageRef = firebase_config.storage().ref(`images/${user.user.room_id}/${user.user.userID}`).child(`${imageTime}`)
            // encode data with base64
            fs.readFile(uploadUri, 'base64')
                .then(data => {
                    return Blob.build(data, { type: `${mime};BASE64` });
                })
                // place blob into storage reference
                .then(blob => {
                    uploadBlob = blob;
                    return imageRef.put(blob, { contentType: mime, name: response.fileName });
                })
                .then(() => {
                    uploadBlob.close();
                    return imageRef.getDownloadURL();
                })
                .then(url => {
                    // console.log("storeImageToFB url : ", url);
                    resolve(url);
                })
                .catch(error => {
                    reject(error)
            });
        });
      };

// const clearUnread = ( room_id, user ) => {
//     //export const clearUnread = ( room_id, user ) => async (dispatch) => {
//         //clearBadge(user, room_id);
//         firebase_config.database().ref(`messages/${room_id}`).once("value", (snap) => {
//             //.then(function(snap) {
//              snap.forEach(function(childSnap){
//                  if(childSnap.val().unread === user.userID){
//                      firebase_config.database().ref(`messages/${room_id}/${childSnap.key}`).update({
//                          unread : ''
//                       })
//                   }
//               })
//           })
//       }

/*
// User actions
export const checkUserExists = () => {
    return function (dispatch) {
        dispatch(startAuthorizing());

        firebase_config.auth()
                .signInAnonymously()
                .then(() => firebase_config.database()
                                    .once('value', (snapshot) => {
                                        const val = snapshot.val();

                                        if (val === null) {
                                            dispatch(userNoExist());
                                        }else{
                                            dispatch(setUserName(val.name));
                                            dispatch(setUserAvatar(val.avatar));
                                            startChatting(dispatch);
                                        }
                                    }))
                .catch(err => console.log(err))
    }
}
*/
