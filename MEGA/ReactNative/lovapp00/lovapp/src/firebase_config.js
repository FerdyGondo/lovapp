/* eslint-disable prettier/prettier */
// import 'core-js/es6/symbol';
// import 'core-js/fn/symbol/iterator';

// global.Symbol = require('core-js/es6/symbol');
// require('core-js/fn/symbol/iterator');
// require('core-js/fn/map');
// require('core-js/fn/set');
// require('core-js/fn/array/find');

//import react-native-dev-menu from 'react-native-dev-menu';
import * as firebase_config from 'firebase';
// import ReduxSagaFirebase from 'redux-saga-firebase'
// import * as firebase_config from "firebase/app";
//import * as functions from 'firebase-functions';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/functions';
// const functions = require('firebase-functions');

// if (Platform.OS === 'android') {
//     if (typeof Symbol === 'undefined') {
//         if (Array.prototype['@@iterator'] === undefined) {
//             Array.prototype['@@iterator'] = function () {
//                 let i = 0;
//                 return {
//                     next: () => ({
//                         done: i >= this.length,
//                         value: this[i++],
//                     }),
//                 };
//              };
//         }
//     }
// }

// should go in a secret file
      // Initialize Firebase prod
      const config_prod = {
        apiKey: "AIzaSyAWNayf-D1feX0tUkAog6zrRol9bYqVpwc",
        authDomain: "messaging-dev-49fa2.firebaseapp.com",
        databaseURL: "https://messaging-dev-49fa2-2ef66.firebaseio.com/",
        projectId: "messaging-dev-49fa2",
        storageBucket: "messaging-dev-49fa2.appspot.com",
        messagingSenderId: "782276787914",
        fcmServerKey : 'AAAAtiNUfso:APA91bE7icygza2oR-EKvNOVxsthiZrde6nlbXTt0FlzwEBYUusvId9AyIbmau_ifCF7NernqSBD4sIg7AI34fyuHJMTNFZ2y0ZgfT-g5X9_mdS1NczBwBMQV3EZ-FoviBXq5_Pt3Zi6'
      };

      console.log('firebase_config config_prod ========================== ', config_prod);

      //__DEV__ = !__DEV__;
      // const config = '';
      //   config  = config_prod;

      /*console.log('firebase_config __DEV__ : ', __DEV__);
    if(__DEV__) {
        config  = config_dev;
	  } else {
      	config  = config_prod;
	  }*/

    // const firebase_config = firebase.initializeApp(config_prod);
    firebase_config.initializeApp(config_prod);

    // const firebase_init   = firebase.initializeApp(config_prod);
    // const firebase_config = new ReduxSagaFirebase(firebase_init);
    console.log('firebase_config firebase ========================== 2', firebase_config);
    // const whole_firebase = firebase_config.initializeApp(config);
    // const firebase_functions = whole_firebase.functions();

// Initialize Cloud Functions through Firebase
// var firebase_functions = firebase_config.functions();
// console.log('firebase_config firebase_config ========================== 3 ', firebase_config);
  export default firebase_config;
// }, 10);
