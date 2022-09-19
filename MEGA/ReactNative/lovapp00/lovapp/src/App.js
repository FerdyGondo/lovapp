/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
// import type {Node} from 'react';
import 'react-native-gesture-handler';

import React from 'react';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware,
} from 'redux';
import {
  Alert,
  LogBox,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { ThemeProvider } from 'styled-components';
import createSagaMiddleware from 'redux-saga';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
// import firebase from '@react-native-firebase/app';
// import firebase_config from './firebase_config';
import i18n from './translations/i18n';
import reducers from './store/reducers';
import authSagas from './store/sagas/authSagas';
import listSagas from './store/sagas/listSagas';
import profileSagas from './store/sagas/profileSagas';
import msgSagas from './store/sagas/msgSagas';
import { App_Nav } from './Navigation';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  // {}, //empty obj for INITIAL STATE
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(authSagas);
sagaMiddleware.run(listSagas);
sagaMiddleware.run(profileSagas);
sagaMiddleware.run(msgSagas);

const setAsyncStorage = (key, value) => {
	// console.log('App setAsyncStorage key 1',key, ' value ',value);
	value = JSON.stringify(value);
  // console.log('App setAsyncStorage value 2', value)
	if (value) return AsyncStorage.setItem(key, value)
	else console.log('App not set, stringify failed:', key, value)
};
// LogBox.ignoreAllLogs();

// const checkPermission = async () => {
//   const permitted = await messaging().hasPermission();
//   console.log('App checkPermission permitted:', permitted);
//   if (permitted) {
//       // getFcmToken();
//   } else {
//       requestPermission();
//   }
// };

const requestPermission = async () => {
  console.log('App requestPermission');
  try {
    const authStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      alert: true,
      badge: true,
    });
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('App requestPermission enabled:', enabled);
    if (enabled) {
      console.log('App requestPermission authStatus:', authStatus);
      getFcmToken();
    }
  } catch (err){
    console.log('App requestPermission err:', err);
    Alert.alert('No permission received error:',err);
  }
};

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    // Alert.alert('fcmToken : ',fcmToken);
    console.log("App fcmToken :", fcmToken);
    messaging().setAutoInitEnabled(true);
    // messaging().registerDeviceForRemoteMessages();
    return setAsyncStorage('notificationsToken', fcmToken);
  } else {
   console.log("App Failed", "No token received");
   Alert.alert('No token received!');
  }
};

// const showAlert = (title, message) => {
//   Alert.alert(
//     title,
//     message,
//     [
//       {text: 'OK', onPress: () => console.log('OK Pressed')},
//     ],
//     {cancelable: false},
//   );
// };

const App: () => React$Node = () => {
  console.log('App =====================>>> 44 ');
  LogBox.ignoreAllLogs();
  React.useEffect(() => { // Get the device token
    SplashScreen.hide();
    requestPermission();
    // messaging().getToken().then(fcmToken => {
    //   requestPermission();
    //   messaging().setAutoInitEnabled(true);
    //   // messaging().registerDeviceForRemoteMessages();
    //       // Alert.alert('Token: ',fcmToken);
    //       console.log("App fcmToken :", fcmToken);
    //       return setAsyncStorage('notificationsToken', fcmToken);
    //   });
    // If using other push notification providers (ie Amazon SNS, etc) you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }
    return messaging().onTokenRefresh(fcmToken => {    // Listen to whether the token changes
      // Alert.alert('App onTokenRefresh fcmToken:', fcmToken);
      setAsyncStorage('notificationsToken', fcmToken);
    });
  }, []);

  React.useEffect(() => {   //Foreground state messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('App unsubscribe ', JSON.stringify(remoteMessage));
      // Alert.alert('App unsubscribe ', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

    return (
      <Provider store={store}>
        <App_Nav />
      </Provider>
    );

      // <>
      //     <SafeAreaView style={{ flex: 0, backgroundColor: '#efeff2' }}/>
      //     <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>

      //     <App_Nav />
      //     </SafeAreaView>
      // </>
};

export default App;
