/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config';
import axios 		from 'axios';
import qs 		from 'qs';	//query string

export const getAsyncStorage = (key) => {
  // return new Promise( (resolve, reject) => {
    function parseJson (item) {
      try {
        // console.log(' util getAsyncStorage item',JSON.parse(item));
        return JSON.parse(item);
      }
      catch (e) { return item }
    }
    return ( AsyncStorage.getItem(key).then(item => parseJson(item)) );
  // });
};

export const setAsyncStorage = (key, value) => {
  value = JSON.stringify(value)
  if (value) return AsyncStorage.setItem(key, value)
  else console.log('Utility : LoginForm not set, stringify failed:', key, value)
}

const fetchData = (action, paramsObj) => {
  return new Promise((resolve,reject) => {
    try {
        var conParams = {
            app_token: config.APP_TOKEN,
            version: config.VERSION
        };
        var params = qs.stringify({...conParams, ...paramsObj});
        // console.log('=====> Utility fetchData params : ', params);
        // console.log('=====> Utility fetchData url : ', config.ROOT_URL + '/' + action);
        axios.post([config.ROOT_URL + '/' + action].toString(), params)
          .then(result => {
            // console.log('=====> Utility fetchData result: ', result.data);
            resolve(result.data);
          })
          .catch((axiosError) => {
            console.log('=====> Utility fetchData axiosError : ', axiosError.message);
              reject(axiosError.message);
          })
    } catch (tryError){
        console.log('Utility fetchData tryError : ',tryError);
        reject(tryError);
    }
  })
}

const reverse = a => {
	var b = [], counter = 0;
	var len = a.length-1;
	for (var i = len; i >= 0; i -= 1) {
		b[counter] = a[i];
		counter += 1;
	}
	return b;
}

const Utilities = {
  getAsyncStorage,
  setAsyncStorage,
  fetchData,
  reverse,
};

export { Utilities };
