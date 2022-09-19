/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { all, fork, call, put, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Moment from 'react-moment';
import qs from 'qs';	//query string
import ReduxSagaFirebase from 'redux-saga-firebase';
import firebase_config from '../firebase_config';
// import * as firebase from '../firebase_config';
import { ActionType } from "./action-types";
import { config } from '../config';

//const ROOT_URL = 'http://api.lovapp.chat/mobileAuth/getContacts?ownerID=';
let contactListObjUser:object = [];
let contactListObjUserREVERSE:object = [];
let recentChatListUser:object = [];
let recentChatListUserREVERSE:object = [];
let onlineListObjUserArray = [];
let onLineListObjUserArrayREVERSE = [];
let offLineListObjUserArray = [];
let offLineListObjUserArrayREVERSE = [];
let offLineListObjUserArrayREVERSE_Slice = [];
let totalBadge:number = 0;

export const clearList = (userID) => {
	contactListObjUser = [];
	contactListObjUserREVERSE = [];
	recentChatListUser = [];
	recentChatListUserREVERSE = [];
	onlineListObjUserArray = [];
	onLineListObjUserArrayREVERSE = [];
	offLineListObjUserArray = [];
	offLineListObjUserArrayREVERSE = [];
	offLineListObjUserArrayREVERSE_Slice = [];
	// onlineListObjUser24 = {}
	// onlineListObjUser24 = {}
	// firebase.database().ref(`logout_time`).orderByValue().off("value", (snap) => {});
	// firebase.database().ref(`online`).orderByValue().off("value", (snap) => {});
	// firebase_config.database().ref(`user/${userID}/contact_list`).off();
};

// export const fetchContactListAction = (dispatch, userID , userType , access_token, callback) => {
// export function* fetchContactListAction (user:object , user_info:object) {
export const fetchContactListAction = (user:object , user_info:object) => {
	return new Promise( (resolve, reject) => {
		contactListObjUser = [];
		contactListObjUserREVERSE = [];
		recentChatListUser = [];
		recentChatListUserREVERSE = [];
		// try {
			let url = `${config.ROOT_URL}/getFavorite?access_token=${user.access_token}&app_token=${config.APP_TOKEN}&version=${config.VERSION}&userId=${user.userID}`;	//&limit=200`;
			//let url = 'http://api.lovapp.chat/mobileAuth/getFavorite?access_token=3d71c07dff5059db1f477b66d13d9af5&app_token=asdfghjkl&version=10&userId=61743398&limit=5';
			console.log('ListAction fetchContactListAction getContacts url:: ',url);
			var params = qs.stringify({
					access_token: user.access_token,
					app_token: config.APP_TOKEN,
					version: config.VERSION,
					userId: user.userID,
					// limit: 200,
			});
			//console.log('ListAction fetchContactListAction params : ',params);
			axios.post([config.ROOT_URL + '/getFavorite'].toString(), params).then(response => {
					/*dispatch({
						type: CONTACT_LIST,
						payload: response.data.contacts
					})*/
					//console.log('ListAction fetchContactListAction response ',response);
					// console.log('ListAction fetchContactListAction response.data1 ',response.data);
					if (response.data !== 'no favorites' && response.data.response !== 'error' && response.data.error !== 'Invalid_input'){
							// console.log('ListAction fetchContactListAction response.data.contacts ',response.data.contacts);
							// saveContactToFirebase(dispatch,response.data.contacts, userID, userType , callback);
							resolve(response.data.contacts);
							// yield saveContactToFirebase(response.data.contacts, user, user_info);
					} else {
							reject(response.data.error);
							// callback(response.data.error);
					}
			}).catch( (axiosError) => {
					console.log('ListAction fetchContactListAction axiosError : ', axiosError);
					reject(axiosError);
					// callback(axiosError);
			});
		// } catch (tryError){
		// 	console.log('ListAction fetchContactListAction tryError ',tryError);
		// }
	});
};

// const saveContactToFirebase = (dispatch, contactList_Array, userID, userType, callback) => {
// export function* saveContactToFirebase (contactList_Array, user, user_info) {
export const saveContactToFirebase = (contactList_Array, user, user_info) => {
	return new Promise( (resolve, reject) => {
	console.log('ListAction saveContactToFirebase user.userID 		 : ',user.userID);
	console.log('ListAction saveContactToFirebase contactList_Array  : ',contactList_Array);
	var contactList_ref = firebase_config.database().ref(`user/${user.userID}/contact_list/`);
	for (var i = 0; i < contactList_Array.length; i++){
		contactList_ref.child(`${contactList_Array[i].user_id}`).set({
			user_name		: contactList_Array[i].user_name,
			lower_case_name : contactList_Array[i].user_name.toLowerCase(),
			last_msg_timestamp : 999, //firebase.database.ServerValue.TIMESTAMP,
			last_msg : '',
			badge : 0,
			invited : '',
			unsent_text : '',
		});
		let userExist = true;
		let each_user_id = contactList_Array[i].user_id;
		let localArray = contactList_Array[i];
		//console.log('ListAction saveContactToFirebase each_user_id 1 : ',each_user_id);
		firebase_config.database().ref('user/').once('value').then(function(snapshot) {
			//console.log('ListAction saveContactToFirebase each_user_id 2 : ',each_user_id);
			//userExist = snapshot.hasChild(`${contactList_Array[i].user_id}`) // true
			userExist = snapshot.child(`${each_user_id}`).exists(); //true
			//console.log('ListAction saveContactToFirebase userExist : ', userExist);
			//if (!userExist && localArray.user_status == 1){
				if (!userExist){
					//console.log('ListAction saveContactToFirebase each_user_id 3 : ',each_user_id);
					//console.log('ListAction saveContactToFirebase localArray 3 : ',localArray);
					firebase_config.database().ref(`user/${each_user_id}`).set({
						user_info:{
							user_id			: localArray.user_id,
							user_name		: localArray.user_name,
							user_status		: 2,	//user is not on firebase yet //localArray.user_status,
							user_image		: localArray.user_image,
							user_message	: localArray.user_message,
							date_created	: localArray.date_created,
							date_modified	: localArray.date_modified
						},
					});
				}
			});
		}	//for(var i=0; i < contactList_Array.length; i++){
		// this.setTimeout(() => {
				console.log('ListAction saveContactToFirebase callback ==================== : ');
				// yield put({
				// 	type: ActionType.LOGIN_SUCCESS,
				// 	payload: user,
				// 	user_info_payload: user_info,
				// });
				resolve(true);
				// callback();//navigate to contactlist
			//queryContactListAction(dispatch, userID, callback)
			// }, 2000);		//delay to wait data ready for contact list screen
	});
};

export const initContactListAction = (userID:string, userType:string) =>  {
	// console.log('ListAction initContactListAction userID============== : ', userID);
	// console.log('ListAction initContactListAction userType============ : ', userType);
	return new Promise( (resolve, reject) => {
		// const snapshot = yield call( rsf.database.read, firebase_config.database().reference(`user/${userID}/contact_list`).orderByChild('lower_case_name') );
		firebase_config.database().ref(`user/${userID}/contact_list`).orderByChild("lower_case_name").on("value", (snapshot) => {
			let chatsObj:Array = {};
			let cnt:number = 0;
			// console.log(' ##### ListAction initContactListAction  snapshot.key : ', snapshot.key ,' snapshot.val() : ', snapshot.val());
			snapshot.forEach(function(childSnap){
				// console.log(' ##### ListAction initContactListAction childSnap.key : ', childSnap.key, ' childSnap.val() : ', childSnap.val());
				if (childSnap.key === 'undefined') {		//clean up empty list
					firebase_config.database().ref(`user/${userID}/contact_list/undefined`).remove();
				}
				if (childSnap.val().user_name){
						var username = childSnap.val().user_name;
						// console.log('ListAction initContactListAction username ============ : ', username);
						chatsObj[username] = {};
						firebase_config.database().ref(`user/${childSnap.key}`).once('value', (userSnap) => {
							// console.log('ListAction initContactListAction userSnap.val() ============ : ', userSnap.val());
							if (userSnap.val() && userSnap.val().user_info ) {
								chatsObj[userSnap.val().user_info.user_name] = userSnap.val().user_info;
								chatsObj[userSnap.val().user_info.user_name].invited = childSnap.val().invited;
								chatsObj[userSnap.val().user_info.user_name].lower_case_name = childSnap.val().lower_case_name;
								// chatsObj[userSnap.val().user_info.user_name].room_id = childSnap.val().room_id;
								// console.log(' ##### ListAction initContactListAction chatsObj IN ', chatsObj);
							} else {
								firebase_config.database().ref(`user/${userID}/contact_list/${childSnap.key}`).remove();
							}
							cnt++;
						})
						.then( () => {
							var objCount = 0; var i;
							for (i in chatsObj) {
								if (chatsObj.hasOwnProperty(i)) {
									objCount++;
								}
							}
							// console.log(' ListAction initContactListAction cnt ::::::::::::::: ', cnt);
							// console.log(' ListAction initContactListAction snapshot.numChildren() : ', snapshot.numChildren());
							// console.log(' ListAction initContactListAction objCount : ', objCount);
							//if (cnt ===  snapshot.numChildren()) {
							if (cnt ===  objCount) {
									// console.log(' ListAction initContactListAction chatsObj : ', chatsObj);
									// console.log(' ListAction initContactListAction user_list : ', Object.values(chatsObj));
									contactListObjUser = Object.values(chatsObj);
									// console.log(' ##### ListAction initContactListAction contactListObjUser : ', contactListObjUser);
									contactListObjUserREVERSE = reverse1(contactListObjUser);
									// console.log(' ##### ListAction initContactListAction contactListObjUserREVERSE : ', contactListObjUserREVERSE);
									resolve(contactListObjUser);
							}
						}); //end userSnap
				}
			}); //end snapshot forEach
		}); // end snapshot
	});	//	return new Promise( (resolve, reject) => {
};

export function* queryContactListReverseAction () {
	// console.log('queryContactListReverseActionSaga contactListREVERSE ',contactListObjUserREVERSE);
	yield put({
		type : ActionType.CONTACT_LIST_REVERSE,
		payload: contactListObjUserREVERSE,
		contact_sort_payload: false,
	});
	// return new Promise( (resolve, reject) => {
	// 	resolve(contactListObjUserREVERSE);
	// });
};

const reverse1 = a => {
	//console.log('ListAction reverse1 a : ', a);
	var b = [], counter = 0;
	var len = a.length-1;
	//console.log('ListAction reverse1 len : ', len);
	for (var i = len; i >= 0; i -= 1) {
		b[counter] = a[i];
		counter += 1;
	}
	return b;
}

export const initContactListAction30days = (userID, userType, callback) => async dispatch => {
	//console.log('ListAction initContactListAction userID============== : ', userID);
	//console.log('ListAction initContactListAction userType============ : ', userType);
	let dateLimit = new Date() - (30*24*60*60*1000);
	firebase.database().ref(`user/${userID}/contact_list`).orderByChild("lower_case_name").on("value", (snapshot) => {
		var chatsObj = {};
		var cnt = 0;
		// console.log(' ##### ListAction initContactListAction  snapshot.key : ', snapshot.key ,' snapshot.val() : ', snapshot.val());
        snapshot.forEach(function(childSnap){
			// console.log(' ##### ListAction initContactListAction childSnap.key : ', childSnap.key, ' childSnap.val() : ', childSnap.val());
			if(childSnap.key === "undefined") firebase.database().ref(`user/${userID}/contact_list/undefined`).remove();
			if(childSnap.val().user_name && childSnap.val().last_msg_timestamp > dateLimit){			 
					var username = childSnap.val().user_name;
					//console.log('ListAction initContactListAction username ============ : ', username);
					chatsObj[username] = {}
					firebase.database().ref(`user/${childSnap.key}`).once("value", (userSnap) => {
						// console.log('ListAction initContactListAction userSnap.val() ============ : ', userSnap.val());
						if( userSnap.val() && userSnap.val().user_info ) {
								chatsObj[userSnap.val().user_info.user_name] = userSnap.val().user_info;
								chatsObj[userSnap.val().user_info.user_name].invited = childSnap.val().invited;
								chatsObj[userSnap.val().user_info.user_name].lower_case_name = childSnap.val().lower_case_name;
								// chatsObj[userSnap.val().user_info.user_name].room_id = childSnap.val().room_id;
								// console.log(' ##### ListAction initContactListAction chatsObj ::: ', chatsObj);
							}
							cnt ++;
						})
						.then ( () => {
							var objCount = 0;
							var i;
							for (i in chatsObj) {
								if (chatsObj.hasOwnProperty(i)) {
									objCount++;
								}
							}
							// console.log(' ListAction initContactListAction cnt ::::::::::::::: ', cnt);
							// console.log(' ##### ListAction initContactListAction snapshot.numChildren() : ', snapshot.numChildren());
							// console.log(' ListAction initContactListAction objCount : ', objCount);
							//if (cnt ===  snapshot.numChildren()) {
							if (cnt ===  objCount) {
              						// console.log(' ListAction initContactListAction chatsObj : ', chatsObj);
									// console.log(' ListAction initContactListAction user_list : ', Object.values(chatsObj));
									contactListObjUser = Object.values(chatsObj);
									// console.log(' ##### ListAction initContactListAction contactListObjUser : ', contactListObjUser);
									contactListObjUserREVERSE = reverse1(contactListObjUser);
									// console.log(' ##### ListAction initContactListAction contactListObjUserREVERSE : ', contactListObjUserREVERSE);
									dispatch({
										type: CONTACT_LIST,
										payload: contactListObjUser,
										contact_sort_payload: true
									});
									callback();
              				}
					}) //end userSnap
			}
		}) //end snapshot forEach
    }) // end snapshot
}

export const initRecentChatListAction30days = (userID, userType, callback) => async dispatch => {
	console.log('ListAction initRecentChatListAction30days userID============== : ', userID);
	let dateLimit = new Date() - (30*24*60*60*1000);
	console.log('ListAction initRecentChatListAction30days dateLimit : ', dateLimit);
	firebase.database().ref(`user/${userID}/contact_list`).orderByChild("last_msg_timestamp").on("value", (snapshot) => {
			var chatsObj = {};
			var cnt = 0;
			totalBadge = 0;
       		snapshot.forEach(function(childSnap){	//snapshotToArray(snapshot).reverse().forEach(function(childSnap){
				// console.log('ListAction initRecentChatListAction30days childSnap.val() ============ : ', childSnap.val());
				if(childSnap.key === "undefined") firebase.database().ref(`user/${userID}/contact_list/undefined`).remove();
				if(childSnap.val().user_name && childSnap.val().last_msg_timestamp > dateLimit){ 	// && childSnap.val().timestamp <  dateLimit){			   
					var username = childSnap.val().user_name
					// console.log('ListAction initRecentChatListAction30days childSnap.val().badge ============ : ', childSnap.val().badge);
					if(childSnap.val().badge) totalBadge += childSnap.val().badge;
					chatsObj[username] = {}
					firebase.database().ref(`user/${childSnap.key}`).once("value", (userSnap) => {
	            		if( userSnap.val() && userSnap.val().user_info ) {
							//console.log('ListAction initRecentChatListAction30days userSnap.val().user_info ============ : ', userSnap.val().user_info);
							//console.log('ListAction initRecentChatListAction30days chatsObj : ', chatsObj);
							//console.log('ListAction initRecentChatListAction30days chatsObj : ', Object.values(chatsObj));
							chatsObj[userSnap.val().user_info.user_name] = userSnap.val().user_info;
							//chatsObj[userSnap.val().user_info.user_name].last_msg_timestamp = new Date(childSnap.val().last_msg_timestamp).toLocaleString();
							chatsObj[userSnap.val().user_info.user_name].last_msg_timestamp = childSnap.val().last_msg_timestamp;
							//console.log('ListAction initRecentChatListAction30days childSnap.val().user_name : ', childSnap.val().user_name);
							//console.log('ListAction initRecentChatListAction30days new Date(childSnap.val().last_msg_timestamp).toLocaleString() : ', new Date(childSnap.val().last_msg_timestamp).toLocaleString());
							chatsObj[userSnap.val().user_info.user_name].last_msg = childSnap.val().last_msg;
							chatsObj[userSnap.val().user_info.user_name].badge = childSnap.val().badge;
							chatsObj[userSnap.val().user_info.user_name].invited = childSnap.val().invited;
							chatsObj[userSnap.val().user_info.user_name].lower_case_name = childSnap.val().lower_case_name;
							// chatsObj[userSnap.val().user_info.user_name].room_id = childSnap.val().room_id;
	            		}
						cnt ++;
	          		})
						.then ( () => {
							var objCount = 0;
							var i;
							for (i in chatsObj) {
								if (chatsObj.hasOwnProperty(i)) {
									objCount++;
								}
							}
							//if (cnt ===  snapshot.numChildren()) {
							if (cnt ===  objCount) {
              						//console.log(' ##### ListAction initContactListAction user_list : ', chatsObj);
									//console.log(' ##### ListAction initRecentChatListAction30days chatsObj : ', Object.values(chatsObj));
									recentChatListUser = Object.values(chatsObj)
									recentChatListUserREVERSE = reverse1(recentChatListUser);
									//console.log(' ##### ListAction initRecentChatListAction30days recentChatListUser : ', recentChatListUser);
									//console.log(' ##### ListAction initRecentChatListAction30days recentChatListUserREVERSE : ', recentChatListUserREVERSE);
									dispatch({
										type: RECENT_CHAT_LIST,
										payload: recentChatListUserREVERSE,
										recentchat_sort_payload: true
									});
									callback(totalBadge);
              				 }
						}) //end userSnap
				}	//if(childSnap.val().user_name){
			}) //end snapshot forEach
    }) // end snapshot
}

export const initRecentChatListAction = (userID:string, userType:string) => {
	// console.log('ListAction initRecentChatListAction userID============== : ', userID);
	return new Promise( (resolve, reject) => {
	firebase_config.database().ref(`user/${userID}/contact_list`).orderByChild("last_msg_timestamp").on("value", (snapshot) => {
			let chatsObj = {};
			let cnt = 0;
			totalBadge = 0;
       		snapshot.forEach(function(childSnap){	//snapshotToArray(snapshot).reverse().forEach(function(childSnap){
				if (childSnap.key === 'undefined') firebase_config.database().ref(`user/${userID}/contact_list/undefined`).remove();
				if (childSnap.val().user_name){
					var username = childSnap.val().user_name
					// console.log('ListAction initRecentChatListAction childSnap.val().username ============ : ', childSnap.val().user_name);
					// console.log('ListAction initRecentChatListAction childSnap.val().badge ============ : ', childSnap.val().badge);
					if (childSnap.val().badge) totalBadge += childSnap.val().badge;
					chatsObj[username] = {};
					firebase_config.database().ref(`user/${childSnap.key}`).once("value", (userSnap) => {
	            		if (userSnap.val() && userSnap.val().user_info) {
							//console.log('ListAction initRecentChatListAction userSnap.val().user_info ============ : ', userSnap.val().user_info);
							//console.log('ListAction initRecentChatListAction chatsObj : ', chatsObj);
							//console.log(' ##### ListAction initRecentChatListAction chatsObj : ', Object.values(chatsObj));
							chatsObj[userSnap.val().user_info.user_name] = userSnap.val().user_info;
							//chatsObj[userSnap.val().user_info.user_name].last_msg_timestamp = new Date(childSnap.val().last_msg_timestamp).toLocaleString();
							chatsObj[userSnap.val().user_info.user_name].last_msg_timestamp = childSnap.val().last_msg_timestamp;
							//console.log('ListAction initRecentChatListAction childSnap.val().user_name : ', childSnap.val().user_name);
							//console.log('ListAction initRecentChatListAction new Date(childSnap.val().last_msg_timestamp).toLocaleString() : ', new Date(childSnap.val().last_msg_timestamp).toLocaleString());
							chatsObj[userSnap.val().user_info.user_name].last_msg = childSnap.val().last_msg;
							chatsObj[userSnap.val().user_info.user_name].badge = childSnap.val().badge;
							chatsObj[userSnap.val().user_info.user_name].invited = childSnap.val().invited;
							chatsObj[userSnap.val().user_info.user_name].lower_case_name = childSnap.val().lower_case_name;
							// chatsObj[userSnap.val().user_info.user_name].room_id = childSnap.val().room_id;
						} else {
							firebase_config.database().ref(`user/${userID}/contact_list/${childSnap.key}`).remove();
						}						
						cnt ++;
	          		})
						.then ( () => {
							var objCount = 0;
							var i;
							for (i in chatsObj) {
								if (chatsObj.hasOwnProperty(i)) {
									objCount++;
								}
							}
							//if (cnt ===  snapshot.numChildren()) {
							if (cnt ===  objCount) {
              						//console.log(' ##### ListAction initContactListAction user_list : ', chatsObj);
									//console.log(' ##### ListAction initRecentChatListAction chatsObj : ', Object.values(chatsObj));
									recentChatListUser = Object.values(chatsObj)
									recentChatListUserREVERSE = reverse1(recentChatListUser);
									//console.log(' ##### ListAction initRecentChatListAction recentChatListUser : ', recentChatListUser);
									// console.log(' ##### ListAction initRecentChatListAction recentChatListUserREVERSE : ', recentChatListUserREVERSE);
									console.log(' ##### ListAction initRecentChatListAction totalBadge : ', totalBadge);
									resolve ({recentChatListUserREVERSE,totalBadge});
									// return ;
									// callback(totalBadge);
              				 }
						}) //end userSnap
				}	
			}) //end snapshot forEach
    }) // end snapshot
})
}

export function* queryRecentChatListAction () {
	// console.log('queryRecentChatListAction recentChatListUser ',recentChatListUser);
	yield put({
		type : ActionType.RECENT_CHAT_LIST,
		payload: recentChatListUser,
		total_badge: totalBadge,
	});
// return new Promise( (resolve, reject) => {
// 	resolve(contactListObjUserREVERSE);
// });
};

// export const checkIfUserExistAction = (userID, toUserID, callback) => async dispatch => {
export const checkIfUserExistAction = (userID, toUserID, callback) => {
	let childExist = true;
	let nick_name = '';
	if (userID !== toUserID){
		// console.log('ListAction checkIfUserExistAction 	 userID', userID);
		// console.log('ListAction checkIfUserExistAction toUserID', toUserID);
		firebase_config.database().ref(`user/${userID}/contact_list`).once('value').then(function(snapshot) {
			//childExist = snapshot.hasChild(`${toUserID}`) // true
			//console.log('ListAction checkIfUserExistAction childExist 1: ', childExist);
			childExist = snapshot.child(`${toUserID}`).exists(); //true
			//console.log('ListAction checkIfUserExistAction childExist 2: ', childExist);
			if (childExist && snapshot.val()[toUserID].lower_case_name)
				nick_name = snapshot.val()[toUserID].lower_case_name;
			// console.log('ListAction checkIfUserExistAction snapshot.val()[toUserID].lower_case_name : ', nick_name);
		})
		.then( () => {
			callback(childExist, nick_name);
			//	return childExist;
		});
	}
};

// export const removeChildAction = (userID, toUserID, userType, callback) => async dispatch => {
export const removeChildAction = (userID, userType, toUserID, callback)  => {
	console.log('ListAction removeChild userID ', userID);
	console.log('ListAction removeChild toUserID  ', toUserID);
	firebase_config.database().ref(`user/${userID}/contact_list/${toUserID}`).remove()
		.then( () => { callback(); })
		.catch( e => console.log('ListAction removeChildAction e',e) );
};

//export const addChildAction = (userID, toUserID, userType, userName, addedUserName, callback) => async dispatch => {
// export const addChildAction = (userID, toUserID, userName, addedUserName, callback) => async dispatch => {
export const addChildAction = (userID, toUserID, userName, addedUserName, callback) => {
	console.log('ListAction addChildAction userName ', userName);
	console.log('ListAction addChildAction userID ', userID);
	console.log('ListAction addChildAction toUserID ', toUserID);
	var contactList_ref = firebase_config.database().ref(`user/${userID}/contact_list/`);
		contactList_ref.child(`${toUserID}`).set({
					user_name			: userName,
					lower_case_name 	: userName.toLowerCase(),
					last_msg_timestamp 	: firebase_config.database.ServerValue.TIMESTAMP,
					last_msg 			: addedUserName,
					badge 				: '',
					invited 			: '',
					unsent_text 		: ''
					// room_id : '',
		});
		callback();
};

export const dispatchOfflineListAction = (callback) => async dispatch => {
	dispatch({
		type: OFFLINE_LIST,
		payload: offLineListObjUserArrayREVERSE_Slice
	});
	callback();	//
};

export const initOnlineListAction = (userID, userType) => {
	return new Promise( (resolve, reject) => {
		// console.log('ListAction initOnlineListAction userID============== : ', userID);
		// console.log('ListAction initOnlineListAction userType============ : ', userType);
		// var moment = require('moment');
		let dateLimit = new Date() - (365 * 24 * 60 * 60 * 1000);
		// console.log('ListAction initOnlineListAction dateLimit : ', dateLimit);
		let userTypeMatch = (userType == '900') ? 900 : ((userType === '210') ? 'viewer' : '210' );
		// console.log('ListAction initOnlineListAction userTypeMatch : ', userTypeMatch);
		// firebase.database().ref(`offline`).orderByChild('user_type').startAt('205').endAt('206').limitToLast(100).on("value", (snap) => {
		// firebase.database().ref(`offline`).orderByChild("timestamp").limitToLast(300).once("value", (snap) => {
		firebase_config.database().ref('offline').orderByChild('timestamp').once('value', (snap) => {
			// console.log('ListAction initOnlineListAction snap.key : ', snap.key , ' snap.val() : ', snap.val());
			//if(snap.val() )
			let offLineListObjUser = {}; // clearing the list
			//console.log('ListAction initOnlineListAction callback onlineListObjUser ========= 111 ', offLineListObjUser);
			// snapshotToArray(snap).reverse().forEach(function(childSnap){
			snap.forEach(function(childSnap){
				// console.log('ListAction initOnlineListAction childSnap.key : ', childSnap.key , ' childSnap.val() : ', childSnap.val());
				if (childSnap.key !== userID){
					//if ( childSnap.val() > (moment().valueOf() - (60*60)) ) {
					if ( childSnap.val().timestamp >  dateLimit ) {
						if (userTypeMatch === 'viewer'){
							if (childSnap.val().user_type === '205' || childSnap.val().user_type === '206' || childSnap.val().user_type === '208' || childSnap.val().user_type === '215'){
								offLineListObjUser[childSnap.val().timestamp] = childSnap.val();
								// console.log('ListAction initOnlineListAction callback onlineListObjUser vw ', offLineListObjUser);
							}
						} else {
							if (childSnap.val().user_type === userTypeMatch){	//210 or 900
								offLineListObjUser[childSnap.val().timestamp] = childSnap.val();
								// console.log('ListAction initOnlineListAction callback onlineListObjUser pf ', offLineListObjUser);
							}
						}
						// console.log('ListAction initOnlineListAction offLineListObjUser ++++++++ ', offLineListObjUser);
						offLineListObjUserArray = Object.values(offLineListObjUser)
					}
				}
			});
		})	//	firebase_config.database()...
		.then( () => {
			offLineListObjUserArrayREVERSE = reverse1(offLineListObjUserArray);
			if (offLineListObjUserArrayREVERSE && offLineListObjUserArrayREVERSE.length !==0 ) {
				// offLineListObjUserArrayREVERSE_Slice = offLineListObjUserArrayREVERSE.slice(0, 100)
				// console.log('ListAction initOnlineListAction offLineListObjUserArrayREVERSE_Slice.length ', offLineListObjUserArrayREVERSE_Slice.length);
				// console.log('ListAction initOnlineListAction offLineListObjUserArrayREVERSE_Slice ', offLineListObjUserArrayREVERSE_Slice);
				resolve(offLineListObjUserArrayREVERSE);
			}
		});
	});	//return new Promise( (resolve, reject) => {
};

export const initSearchAction = (searchText, userID, userType) => {
	return new Promise( (resolve, reject) => {
		console.log('ListAction initSearchAction userID   ============== : ', userID);
		console.log('ListAction initSearchAction userType ============== : ', userType);
		console.log('ListAction initSearchAction searchText ============ : ', searchText);
		let userTypeMatch = (userType === '900') ? '900' : ((userType === '210') ? 'viewer' : '210' );
		// console.log('ListAction initSearchAction userTypeMatch : ', userTypeMatch);
		let searchListObjUser = {}; // clearing the list
		let searchListObjUserArray = {}; // clearing the list
		// firebase.database().ref(`offline`).orderByChild("timestamp").startAt(searchText).endAt(`${searchText}\uF7FF`).once("value", (snap) => {
		// firebase.database().ref(`offline`).orderByChild("user_name").startAt(searchText).endAt(searchText + 'uF8FF').once("value", (snap) => {
		firebase_config.database().ref('offline').orderByChild('lower_case_name').startAt(searchText).endAt(searchText + '\uF8FF').once('value', (snap) => {
			console.log('ListAction initSearchAction snap.key : ', snap.key , ' snap.val() : ', snap.val());
				snap.forEach(function(childSnap){
					// console.log('ListAction initSearchAction childSnap.key : ', childSnap.key , ' childSnap.val() : ', childSnap.val());
					if (childSnap.key !== userID){
						if (userTypeMatch === 'viewer'){
							if (childSnap.val().user_type === '205' || childSnap.val().user_type === '206' || childSnap.val().user_type === '208' || childSnap.val().user_type === '215'){
								searchListObjUser[childSnap.val().timestamp] = childSnap.val();
							}
						} else {
							if (childSnap.val().user_type == userTypeMatch){	//210 or 900
								searchListObjUser[childSnap.val().timestamp] = childSnap.val();
							}
						}
						searchListObjUserArray = Object.values(searchListObjUser)
					}
				});
			})
			.then( () => {
				let searchListObjUserArrayREVERSE = reverse1(searchListObjUserArray);
				console.log('ListAction initSearchAction searchListObjUserArrayREVERSE ', searchListObjUserArrayREVERSE);
				if (searchListObjUserArrayREVERSE.length !== 0) {
					resolve(searchListObjUserArrayREVERSE);
				} else {
					reject('Nothing found');
				}
			})
			.catch(err => {
				console.log('ListAction initSearchAction err ', err);
				// reject(err);
			} )
	});	//return new Promise( (resolve, reject) => {
};

export const initSearchAction_dup_toLowerCase = (searchText, userID, userType, callback) => async dispatch => {
	// console.log('ListAction initSearchAction userID============== : ', userID);
	firebase.database().ref(`offline`).once("value", (snapshot) => { 
		// console.log('ListAction initSearchAction snapshot : ', snapshot.val());
		snapshot.forEach(function(childSnap){
			console.log('ListAction initSearchAction childSnap.key: ', childSnap.key);
			// console.log('ListAction initSearchAction childSnap.user_name : ', childSnap.val().user_name);
			firebase.database().ref(`offline/${childSnap.key}`).update({
				lower_case_name   : childSnap.val().user_name.toLowerCase()
			});
		})
	});
}

export const checkTestMode = (callback) => async dispatch => {
	// let nonDX = await AsyncStorage.getItem('nonDX');
	if ( ! (await AsyncStorage.getItem('nonDX') ) ) {	
		firebase.database().ref(`_test_mode`).once("value", (snap) => {
			// console.log('ListAction checkTestMode app_mode ============ : ', snap.val());
			callback(snap.val());
		})
	}
}

export const saveNickName = (userID, toUserID, nickName, callback) => {
	console.log('ListAction saveNickName userID',userID);
	console.log('ListAction saveNickName toUserID',toUserID);
	console.log('ListAction saveNickName nickName',nickName);
	firebase_config.database().ref(`user/${userID}/contact_list/${toUserID}`).update({   
        lower_case_name         : nickName
    })
	.then ( () => { callback() })
	.catch( e => console.log('ListAction saveNickName e',e) )
}

export function* inviteUserAction (user:object, user_id:string, message:string) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config);
	const invitedData = yield call (reduxSagaFirebase.database.read, `user/${user.userID}/contact_list/${user_id}`);
	console.log('ListAction inviteUserAction invitedData: ',invitedData);
	if(!invitedData.invited){
		try {
			var params = qs.stringify({
					access_token: user.access_token,
					app_token: config.APP_TOKEN,
					version: config.VERSION,
					userId: user_id,
			})
			//console.log('SelectAction inviteUserAction params : ',params);
			const response =  yield axios.post([config.ROOT_URL+'/sendEmail'].toString(), params);
			console.log('SelectAction inviteUserAction response ',response);
			console.log('SelectAction inviteUserAction response.data ',response.data);
			let timestamp = firebase_config.database.ServerValue.TIMESTAMP
			console.log('SelectAction inviteUserAction timestamp ',timestamp);
			if (response.data.response === 'success') {
				yield call(reduxSagaFirebase.database.patch, `user/${user.userID}/contact_list/${user_id}`, {
					last_msg_timestamp  : timestamp,
					last_msg			: message,
					invited				: true,
				});
			}
			return (response.data.response);
		} catch (err){
			console.log('ListAction inviteUserAction err ',err);
		}
	} else {
		console.log('ListAction inviteUserAction user had been invited ',invitedData.invited);
		return ('Invited');
	}
}
