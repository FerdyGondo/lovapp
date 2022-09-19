/* eslint-disable prettier/prettier */
/**
 * @format
 */
import {Alert, AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import App from './src/App';
import {name as appName} from './app.json';

// import Dynatrace from './Dynatrace.js';
// import dynafetch from './dynafetch.js';
// global.dt = new Dynatrace();

// import React from 'react';
// const HeadlessCheck = ({isHeadless}) => {
//     if (isHeadless) {
//       // App has been launched in the background by iOS, ignore
//       return null;
//     }
//     return <App />;
//   };
// AppRegistry.registerComponent(appName, () => HeadlessCheck);

messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Alert.alert('Navigation setBackgroundMessageHandler ', JSON.stringify(remoteMessage));
    console.log('index remoteMessage', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
