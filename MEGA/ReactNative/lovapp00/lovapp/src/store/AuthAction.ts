/* eslint-disable prettier/prettier */
import { all, fork, call, put, takeEvery, takeLatest, cancel, getContext, delay } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import axios , { AxiosResponse, AxiosPromise }	from 'axios';
import qs from 'qs';	//query string
import ReduxSagaFirebase from 'redux-saga-firebase';
import notifee from '@notifee/react-native';
// import ShortcutBadge from 'react-native-app-badge';
import BadgeAndroid from 'react-native-android-badge';

import firebase_config from '../firebase_config';
import { ActionType } from './action-types';
import {
	fetchContactListAction,
	saveContactToFirebase,
	clearList,
} from './ListAction';
import { config } from '../config';
import { Utilities as utils } from '../util';
// import { getProfile } from './action-creators';
// import { getProfile } from './ProfileAction';
// import { checkUserStatus } from './MessageAction';

const getAsyncStorage = (key:string) => {
	// console.log('AuthAction getAsyncStorage key:', key);
	function parseJson (item) {
		try {
			// console.log('AuthAction getAsyncStorage item 1',JSON.parse(item));
			return JSON.parse(item);
		} catch (e) {
			// console.log('AuthAction getAsyncStorage item 2',item);
			return item;
		}
	}
	// let returnItem = AsyncStorage.getItem(key).then(item => parseJson(item));
	// return returnItem;
	return AsyncStorage.getItem(key).then(item => parseJson(item));
};

const setAsyncStorage = (key:string, value:string) => {
	console.log('AuthAction setAsyncStorage key',key, ' value ',value);
	value = JSON.stringify(value);
	if (value) return AsyncStorage.setItem(key, value)
	else console.log('AuthAction not set, stringify failed:', key, value)
};

interface userInput {
	username:string,
	password:string
  }

export function* loginUserAction ( email:string, password:string ) {
	try {
		const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config);
		email = email.toLowerCase();
		if (email.indexOf('@') === -1) {	//DX
			yield loginAPI(email, password, false);
		} else {
			console.log('AuthAction loginUserAction email : ',email);
			const firebaseUser = yield call(reduxSagaFirebase.auth.signInWithEmailAndPassword, email, password);
			console.log('AuthAction loginUserAction firebaseUser.user.uid : ',firebaseUser.user.uid);
			try {
				const userData = yield call(reduxSagaFirebase.database.read, `user/${firebaseUser.user.uid}`);
				console.log('AuthAction loginUserAction userData : ',userData);
					if (userData.user_info.user_type === 900){	// nonDX user
						console.log('AuthAction loginUserAction nonDX firebaseUser : ',firebaseUser);
						firebaseUser.nonDX = true;
						firebaseUser.userID = firebaseUser.user.uid;
						setAsyncStorage('nonDX', 'true');
						setAsyncStorage('email', email);
						setAsyncStorage('password', password);
						yield loginUserSuccess(firebaseUser, userData.user_info);
					}
			} catch (e) {
				console.log('AuthAction loginUserAction e : ',e);
			}
		}
	} catch (err){
		yield loginUserFail(err.message);
		console.log('AuthAction loginUserAction err : ',err);
	}
}

// export const firebase_func = (obj:object):object => {
// 	console.log('AuthAction firebase_func obj : ', obj);
// 	return new Promise( (resolve, reject) => {
// 		var FBfunctions = firebase_config.functions().httpsCallable('callLoginAPI');
// 		FBfunctions({obj})
// 			.then( (result) => {
// 				console.log('AuthAction firebase_func result : ', result);
// 				resolve(result);
// 			})
// 			.catch((error) => {
// 				console.log('AuthAction firebase_func  error : ', error); // return error
// 				reject(error);
// 			});
// 	});
// };
// Adds a message to the Realtime Database by calling the `callLoginAPI` server-side function.
function* loginAPI  (email:string, password:string, FBfailed:boolean ) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
	console.log('AuthAction callLoginAPI FBfailed ================= : ' , FBfailed);
	try {
		let access_token:string = yield getAsyncStorage('access_token');
		console.log('AuthAction callLoginAPI access_token::: ',access_token);
		//http://api.lovapp.chat/mobileAuth/login?access_token=3d71c07dff5059db1f477b66d13d9af5&app_token=asdfghjkl&user_name=aa605a&password=test1234&version=10
	  	let url:string = (access_token && access_token !== '' && access_token !== null) ? `${config.ROOT_URL}/login?access_token=${access_token}&app_token=${config.APP_TOKEN}&user_name=${email}&password=${password}&version=${config.VERSION}`:
	  		`${config.ROOT_URL}/login?&app_token=${config.APP_TOKEN}&user_name=${email}&password=${password}&version=${config.VERSION}`;
	  	console.log('AuthAction callLoginAPI loginDXeapi url : ',url);
		// Send a POST request
		let paramStringify:string = qs.stringify({
				app_token: config.APP_TOKEN,
				user_name: email,
				password: password,
				version: config.VERSION,
				access_token: (access_token && access_token !== '' && access_token !== null) ? access_token : null,
				// access_token: access_token === null ? null : access_token,
			});
		//console.log('AuthAction loginUserAction [config.ROOT_URL+/login] : ',[config.ROOT_URL+'/login']);
		console.log('AuthAction callLoginAPI paramStringify : ',paramStringify);
		//let { response } = await axios.get(url);
		// let obj : {loginURL:string; params:string} = {
		// 	loginURL : [config.ROOT_URL + '/login'].toString(),
		// 	params : paramStringify,
		// }
		// console.log('AuthAction callLoginAPI obj : ',obj);
		try {
			// const user = yield firebase_func(obj);
			const user =  yield axios.post([config.ROOT_URL+'/login'].toString(), paramStringify);
			console.log('AuthAction callLoginAPI user 				: ', user);
			console.log('AuthAction callLoginAPI user.data 				: ', user.data);
			console.log('AuthAction callLoginAPI user.data.response 		: ', user.data.response);
			console.log('AuthAction callLoginAPI user.data.access_token 	: ', user.data.access_token);
			//user.data.response = 'error';	user.data.error = "8377466";	//simulate login error to update app
			if (user.data.response === 'success') {
				// user.data.userInfo.user_status  = "0";
				//if(user.data.error === 'please update new version') => move to login.ts
				//   testFlag = user.data.userInfo.test_flag;
				user.name 			= user.data.userInfo.user_name;
				user.userID 		= user.data.userInfo.user_id;
				user.access_token 	= user.data.access_token;
				user.app_token 		= config.APP_TOKEN;
				if (user.data.error) {user.error = user.data.error;}
				const testMode = yield call(reduxSagaFirebase.database.read, 'test_mode');
				console.log('AuthAction callLoginAPI testMode : ',testMode); 	//1
				console.log('AuthAction callLoginAPI testFlag : ',user.data.userInfo.test_flag); 	//0
				console.log('AuthAction callLoginAPI user.data : ', user.data);
				if ( testMode && user.data.userInfo.test_flag !== 1 &&  user.data.userInfo.user_type !== '215') {
					console.log('AuthAction callLoginAPI === Only for test user : ');
					yield loginUserFail('Only for test user');
				} else {
					if (FBfailed) {
						yield createFBuser(user, user.data.userInfo, email, password)
					} else {
						AsyncStorage.setItem('access_token', user.data.access_token);
						AsyncStorage.setItem('email', email);
						AsyncStorage.setItem('password', password);
						console.log('AuthAction callLoginAPI user : ',user);
						// yield call(reduxSagaFirebase.auth.signInWithEmailAndPassword, email, password);
						yield call(reduxSagaFirebase.auth.signInWithEmailAndPassword, config.USER_NAME, config.PWD);
						yield loginUserSuccess(user, user.data.userInfo);
					}
				}
				yield call(reduxSagaFirebase.database.patch, `user/${user.userID}/user_info`,{ test_flag : user.data.userInfo.test_flag }); //update lastest test flag from blue admin
			} else {
				console.log('AuthAction callLoginAPI user.data.response error : ', user.data.response);
				if (user.data.response === 'error' && (user.data.error === 'redirect' || user.data.error === 'Invalid_input'))
					AsyncStorage.removeItem('access_token');
				console.log('AuthAction callLoginAPI user.data.error : ', user.data.error);
				yield loginUserFail(user.data.error);
			}
		} catch (axiosError){
			console.log('AuthAction callLoginAPI axiosError : ', axiosError.message);
			yield loginUserFail(axiosError.message);
		}
	} catch (tryError){
		console.error('AuthAction callLoginAPI tryError : ',tryError);
		yield loginUserFail(tryError);
	}
}

function* checkTestMode () {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
	return yield call(reduxSagaFirebase.database.read, `_test_mode`);
}

function* createFBuser (user:object, user_info:object,  email:string, password:string ) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
	email = email.indexOf('@') === -1 ? email += '@lovapp.chat' : email;
	try {
		// firebase.auth().createUserWithEmailAndPassword(email, password).then( (firebaseUser) => {
		const firebaseUser = yield call (reduxSagaFirebase.auth.createUserWithEmailAndPassword, email, password);
			console.log('AuthAction createFBuser firebaseUser  : ',firebaseUser);
			console.log('AuthAction createFBuser user.access_token  : ',user.access_token);
			console.log('AuthAction createFBuser user_info  : ',user_info);
			AsyncStorage.setItem('access_token', user.access_token);
			AsyncStorage.setItem('email', email);
			AsyncStorage.setItem('password', password);
			console.log('AuthAction createFBuser user : ',user);
			yield loginUserSuccess(user, user_info);
		}
		catch (error) {
			yield loginUserFail(error.message );
			console.log('AuthAction createFBuser error.message : ',error.message);
		}
}

//non DX user registration 					//async await with redux thunk
// export const registerAction = ({ name, email, password }) => async dispatch => {
export function* registerAction (name:string, email:string, password:string) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
	//	//return (dispatch) => {
			// dispatch({
			// 	type: LOGIN_USER //will be dispatch when user login
			// });
	console.log('AuthAction registerAction name : ',name);
	console.log('AuthAction registerAction email : ',email);
	console.log('AuthAction registerAction password : ',password);
	try {
		const firebaseUser = yield call (reduxSagaFirebase.auth.createUserWithEmailAndPassword, email, password);
		// firebase_config.auth().createUserWithEmailAndPassword(email, password).then(firebaseUser => {
				console.log('AuthAction registerAction firebaseUser : ',firebaseUser);
				let	user_info = {
					user_id				: firebaseUser.user.uid,
					user_name			: name,
					user_email			: email,
					user_dob			: '',
					user_type			: 900,
					user_image			: '',//`require('../icons/no_image_user.png')`,//`https://identicon-1132.appspot.com/${user.uid}?p=8&s=30`,	//'https://pngimg.com/uploads/anonymous_mask/anonymous_mask_PNG2.png',
					user_message		: '',
					date_created		: new Date().toString()
				};
				firebaseUser.userID = firebaseUser.user.uid;	//for nonDX user
				firebaseUser.nonDX = true;
				AsyncStorage.setItem('nonDX', 'true');
				AsyncStorage.setItem('email', email);
				AsyncStorage.setItem('password', password);
				yield loginUserSuccess(firebaseUser, user_info);
	}	//)
	catch (error) {
		console.log('AuthAction registerAction err : ',error);
		console.log('AuthAction registerAction err.message : ',error.message);
		yield registerUserFail(error.message);
	}	//);
}

export function* passwordMismatchAction () {
	yield put({
		type: ActionType.PASSWORD_MISMATCH_FAILED,
		payload: 'Password Mismatch',
	});
}

function* loginUserSuccess (user:object, user_info:object) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
    try {
		console.log('AuthAction loginUserSuccess user : ',user);
		console.log('AuthAction loginUserSuccess user_info : ',user_info);
		let storage_url = ';';
		try {
			storage_url = yield firebase_config.storage().ref().child(`profileImages/${user.userID}`).getDownloadURL();
		} catch (err) {
			console.log('AuthAction loginUserSuccess storage err : ',err);
		}
		if (storage_url) {
			user_info.user_image = storage_url;
			yield call(reduxSagaFirebase.database.update, `user/${user.userID}/user_info/user_image`, storage_url );
			yield call(reduxSagaFirebase.database.update, `offline/${user.userID}/user_image`, storage_url );
		}
		console.log('AuthAction loginUserSuccess storage_url: ',storage_url);
		yield setUserStatus(user_info);
		let loggedIn:string = yield getAsyncStorage('loggedIn');	//await AsyncStorage.getItem('loggedIn');
		console.log('AuthAction loginUserSuccess loggedIn: ', loggedIn);
		let notificationsToken:string = yield getAsyncStorage('notificationsToken');
		console.log('AuthAction loginUserSuccess notificationsToken : ',notificationsToken);
		console.log('AuthAction loginUserSuccess user_info.user_type : ',user_info.user_type);
		user.userType = user_info.user_type; //user.userType = userType;
		let user_id = user.userID;
			if (loggedIn !== 'true'){	// && snap.val() !== '1'){
				//user_info.notificationsToken = notificationsToken;
				try {
					console.log('AuthAction loginUserSuccess user_id: ',user_id);
					const userStatus = yield checkLoginStatus(user_id);
					console.log('AuthAction loginUserSuccess userStatus: ',userStatus);
					console.log('AuthAction loginUserSuccess user_info.notificationsToken : ',notificationsToken);
					yield saveToFirebase(user, user_info, notificationsToken, userStatus);
				} catch (error){
					console.log('AuthAction loginUserSuccess checkLoginStatus error : ',error);
				}
			} else {
				yield put({
					type: ActionType.LOGIN_SUCCESS,
					payload: user,
					user_info_payload: user_info,
				});
			}
	} catch (err) {
		yield loginUserFail(err.message);
		console.log('AuthAction loginUserSuccess loginUserSuccess error :: ',err);
	}
}

function* checkLoginStatus (userID:string) {
    console.log("checkLoginStatus userID : ", userID);
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
	return yield call(reduxSagaFirebase.database.read, `user/${userID}/user_info/user_status`);
    // console.log("checkLoginStatus loginStatus : ", loginStatus);
	// return loginStatus;
  }

function* saveToFirebase (user:object, user_info:object, notificationsToken:string, userStatus:string)  {
	console.log('AuthAction saveToFirebase user :: ',user);
	console.log('AuthAction saveToFirebase user_info : ',user_info);
	console.log('AuthAction saveToFirebase user.uid : ',user.uid);
	console.log('AuthAction saveToFirebase user.userID : ',user.userID);
	console.log('AuthAction saveToFirebase user_info.user_id : ',user_info.user_id);
	console.log('AuthAction saveToFirebase user_info.user_type : ',user_info.user_type);
	console.log('AuthAction saveToFirebase notificationsToken : ',notificationsToken);
	// console.log('AuthAction saveToFirebase new Date().toLocaleString : ',new Date().toLocaleString());
	// console.log('AuthAction saveToFirebase new Date().toString : ',new Date().toString());
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config);
	let contactList_Array:object = {};
	let start_login:boolean = false;
	// let userType = (user_info.user_type === '210') ? 'performer' : 'viewer';
	// let createOwnerInfo = firebase_config.database().ref(`user/${user_info.user_id}`);
	//createOwnerInfo.push().set({
	try {
	console.log('AuthAction saveToFirebase userStatus: ',userStatus);
		if (userStatus === '1' || userStatus === '0') {
			console.log('AuthAction saveToFirebase user_info.user_id: ', user_info.user_id);
			console.log('AuthAction saveToFirebase notificationsToken: ', notificationsToken);
			yield call(reduxSagaFirebase.database.update, `user/${user_info.user_id}/device_info/${notificationsToken}`, {
				device_type	 : Platform.OS,
				date_created : new Date().toString(),
			});
			yield put({
				type: ActionType.LOGIN_SUCCESS,
				payload: user,
				user_info_payload: user_info,
			});
			setAsyncStorage('loggedIn', 'true');
			// if (!user_info.test_flag) 
			// let fb_user_info = yield call(reduxSagaFirebase.database.read, `user/${user_info.user_id}/user_info`);
			// yield setUserStatus(fb_user_info);
		} else {
			yield call(reduxSagaFirebase.database.update, `user/${user_info.user_id}/user_info`, user_info );
			yield call(reduxSagaFirebase.database.update, `user/${user_info.user_id}/device_info/${notificationsToken}`, {
				device_type	: Platform.OS,
				date_created	: new Date().toString(),
			});
			try {
				contactList_Array = yield fetchContactListAction(user, user_info);
				console.log('AuthAction saveToFirebase fetchContactListAction contactList_Array: ', contactList_Array);
			} catch (err){
				console.log('AuthAction saveToFirebase fetchContactListAction err: ', err);
			}
			start_login = yield saveContactToFirebase(contactList_Array, user, user_info);
			if (start_login){
				yield put({
					type: ActionType.LOGIN_SUCCESS,
					payload: user,
					user_info_payload: user_info,
				});
				setAsyncStorage('loggedIn', 'true');
				console.log('AuthAction saveToFirebase config.APP_TOKEN ',config.APP_TOKEN);
				console.log('AuthAction saveToFirebase user_info.user_type ',user_info.user_type);
				const testMode:boolean = yield checkTestMode();
				if (testMode && user_info.user_type === '215'){
					console.log('AuthAction saveToFirebase user_info.user_type ',user_info.user_type);
					yield call(reduxSagaFirebase.database.patch, `user/${user.userID}/user_info`,{ test_flag : '1' })
				}
				if (user.nonDX){
					console.log('AuthAction saveToFirebase flagEULA user.userID : ',user.userID);
					const eula = flagEULA(user.userID);
					console.log('AuthAction saveToFirebase flagEULA eula : ',eula);
				}
				// if (!user_info.test_flag) 
				// let fb_user_info = yield call(reduxSagaFirebase.database.read, `user/${user_info.user_id}/user_info`);
				// yield setUserStatus(fb_user_info);
			}
		}
	}
	catch (error) {
		registerUserFail(error.message) ;
		console.log('AuthAction saveToFirebase error : ',error.message);
	}
}

function* loginUserFail (error_message:string) {
	console.log('AuthAction loginUserFail error_message : ',error_message);
	yield put({
		type: ActionType.LOGIN_FAILED,
		payload: error_message,
	});
}

function* registerUserFail (error_message:string) {
	console.log('AuthAction registerUserFail error_message : ',error_message);
	yield put({
		type: ActionType.REGISTER_FAILED,
		payload: error_message,
	});
}

const setUserStatus = (user_info) => {
	console.log('AuthAction setUserStatus user_info.user_id ' , user_info.user_id );
	// Monitor connection state on browser tab
	// await firebase.database().ref(".info/connected").on("value", function (snap) {
	firebase_config.database().ref('.info/connected').on('value', (snap) => {
		user_info.timestamp = firebase_config.database.ServerValue.TIMESTAMP;
		user_info.lower_case_name = user_info.user_name.toLowerCase();
		console.log("AuthAction setUserStatus snap.key " , snap.key ," setUserStatus snap.val() " , snap.val() );
		if ( snap.val() ) {
			user_info.online_status = true;
			firebase_config.database().ref('offline').update( { [user_info.user_id] : user_info });
			// if we lose network then remove this user from the list set user's online status setUserStatus("online");
			// firebase_config.database().ref(`offline/${user_info.user_id}`).once('value', (user_info_data) => {
			// 	console.log("AuthAction setUserStatus user_info_data.key " , user_info_data.key ," setUserStatus user_info_data.val() " , user_info_data.val() );
			// 	if	(user_info_data.val()){
			// 		firebase_config.database().ref(`offline/${user_info.user_id}`).update({
			// 			timestamp : user_info.timestamp,
			// 			online_status : '1',
			// 		}).then( () => {
			// 			// callback (true);
			// 		});
			// 	} else {
			// 		firebase_config.database().ref('offline').update( { [user_info.user_id] : user_info }).then( () => {
			// 			// console.log("AuthAction setUserStatus callback " , true );
			// 			// callback (true);
			// 		});
			// 	}
			// });
			firebase_config.database().ref(`offline/${user_info.user_id}`).onDisconnect().update({online_status: false});
			// update_onDisconnect(user_info);
		} else { // never got called
			console.log("AuthAction setUserStatus snap.key" , snap.key ," setUserStatus snap.val() " , snap.val() );
			// client has lost network setUserStatus("offline");
			firebase_config.database().ref(`offline/${user_info.user_id}`).update({online_status: false}).then( () => {
				// callback (false);
			});
		}
	});
}
// const update_onDisconnect = (user_info) => {
// 	// setTimeout ( () => {
// 		// firebase.database().ref(`on_line/${user_info.user_id}`).remove();
// 		firebase.database().ref(`offline`).onDisconnect().update({ [user_info.user_id] : user_info }).then( () => {
// 			firebase.database().ref(`offline/${user_info.user_id}`).onDisconnect().update({ timestamp : firebase.database.ServerValue.TIMESTAMP });
// 		});
// 	// }, 10000);
// }

// export const logoutAction = (user, user_info, callback) => async dispatch =>{
export function* logoutAction (user, user_info) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config);
	user_info.timestamp = firebase_config.database.ServerValue.TIMESTAMP;
	console.log('AuthAction logoutAction user : ',user);
	console.log('AuthAction logoutAction user_info : ',user_info);
	let notificationsToken:string =  yield getAsyncStorage('notificationsToken');
	console.log('AuthAction logoutAction notificationsToken',notificationsToken);
	try {
		yield call(reduxSagaFirebase.auth.signOut);
		clearList(user.userID);
		yield call(reduxSagaFirebase.database.delete, `user/${user.userID}/device_info/${notificationsToken}`);
		yield call(reduxSagaFirebase.database.patch, `offline/${user.userID}`,{ online_status : false });
		// yield firebase_config.storage().ref().child(`profileImages/${user.userID}`).delete();
		// firebase_config.storage().refFromURL(`https://firebasestorage.googleapis.com/v0/b/messaging-dev-49fa2.appspot.com/o/profileImages%2F10700522?alt=media&token=8856b56c-637b-4dc7-b31e-2ede709487f2`).delete();
		// notifications.setBadgeNumber(0);
		if (Platform.OS === 'ios'){
			notifee.setBadgeCount(0).then(() => console.log('Badge cleared'));
		} else {
			console.log('AuthAction BadgeAndroid.setBadge(0)');
			BadgeAndroid.setBadge(0);
			// ShortcutBadge.setCount(0);
		}
		// firebase_config.notifications().setBadgeNumber(0);
		// notifications.unbind();
		// AsyncStorage.clear();	//cannot notificationsToken
		AsyncStorage.removeItem('access_token');
		AsyncStorage.removeItem('email');
		AsyncStorage.removeItem('password');
		AsyncStorage.removeItem('nonDX');
		AsyncStorage.removeItem('loggedIn');
		// AsyncStorage.removeItem('firstTime');
		// AsyncStorage.removeItem('userID');
		// AsyncStorage.removeItem('havePromo');
		// AsyncStorage.removeItem('contactlist_sort');
		// AsyncStorage.removeItem('recentchatlist_sort');
		yield put({
			type: ActionType.LOGOUT_SUCCESS,
			payload: {loggedOut:true, user:null}
		});
		logoutAPI(user_info.user_name, user_info.user_type, user.access_token)
			.then((result)=>{
				console.log('AuthAction logoutAction logoutAPI SUCCESS result : ',result);
			})
			.catch((error)=>{
				console.log('AuthAction logoutAction logoutAPI error : ',error);
				throw (error);
				// yield put({
				// 	type: ActionType.LOGOUT,
				// 	payload: {error:error},
				// });
			});
	} catch (error) {
		console.log('AuthAction logout firebase error : ',error);
		// yield put({
		// 	type: ActionType.LOGOUT_SUCCESS,
		// 	payload: {error:error},
		// });
	}
}

function logoutAPI(username, user_type, access_token){
	return new Promise((resolve,reject) => {
		if (user_type === 900){
			resolve('success');
		} else {
			var params = {
				user_name: username,
				access_token: access_token,
			};
			console.log('AuthAction logoutAPI fetchdata params : ', params);
			utils.fetchData('logout', params)
				.then((data) => {
					console.log('AuthAction logoutAPI fetchdata : ', data);
					if (data.response === 'success'){
	         			resolve(data.response);
					} else {
						reject(data.error);
					}
				})
				.catch((error)=>{
						console.log('AuthAction logoutAPI fetchdata error : ', data);
					reject(error);
				});
		}
	});
}

// const flagEULA = ( user_ID ) => {
function* flagEULA ( user_ID:string ) {
	const reduxSagaFirebase:ReduxSagaFirebase = new ReduxSagaFirebase(firebase_config)
	console.log("AuthAction flagEULA user_ID : ", user_ID);
	return yield call(reduxSagaFirebase.database.patch, `user/${user_ID}/user_info/eula`, true);
	// firebase.database().ref(`user/${user_ID}/user_info/eula`).set(true).then( callback(true))
}
