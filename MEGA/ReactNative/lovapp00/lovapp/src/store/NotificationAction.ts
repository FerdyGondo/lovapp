/* eslint-disable prettier/prettier */
import fcm_param from '../fcm_config';

// const setBadgeNumber = (totalCurrentBadge) => {
//     // console.log('notificationAction setBadgeNumber totalCurrentBadge : ', totalCurrentBadge);
//     FCM.setBadgeNumber(totalCurrentBadge);
//   }
export const sendPushNotification = async (token, data) => {
    // const FIREBASE_API_KEY = fcm_param.FirebaseServerKey
    // const message = {
    //     registration_ids: [token],
    //     notification: {
    //         title: 'india vs south africa test',
    //         body: 'IND chose to bat',
    //         vibrate: 1,
    //         sound: 1,
    //         show_in_foreground: true,
    //         priority: 'high',
    //         content_available: true,
    //     },
    //     data: {
    //         title: 'india vs south africa test',
    //         body: 'IND chose to bat',
    //         score: 50,
    //         wicket: 1,
    //     },
    // };
    // console.log('notificationAction sendNotification TO token : ', token);
    // console.log('notificationAction sendNotification to Platform : ', data.device_type);
    // console.log('notificationAction sendNotification data.badge : ', data.badge);
    // console.log('notificationAction sendNotification data : ', data);
    if (data.device_type === 'android'){
        // console.log('notificationAction sendNotification ANDROID data.badge : ', data.badge);
        // console.log('notificationAction sendNotification to ANDROID = ', data.device_type);
        // console.log('notificationAction sendNotification TO ANDROID token : ', token);
        // console.log('notificationAction sendNotification from user_name = ', data.user_name);
            var body = JSON.stringify({
                  'to': token,  //'d3BMmPBToPc:APA91bE2rseo5oVxnkHdBJ2esJ17jzyMxqG6rCLK_ZNz7OIDT1wgkMPXcUXomU62DzAI1lt3ECwq7zvZDMuoIlezndIfws96HGTmYDKddYCBf_YrinNDK_eOv6-Az6SBknZ2Pkf_-myy',//token,
                  'content_available': true,
                  'notification': {
                        'title'             : data.user_name || '',
                        'user_name'         : data.user_name,
                        'body'              : data.text,
                        'text'              : data.text,
                        'user_id'           : data.user_id,
                        'to_user_id'        : data.to_user_id,
                        'user_image'        : data.user_image,
                        'sound'             : 'default',
                        'auto_cancel'       : true,
                        'show_in_foreground': true,
                        'badge'             : data.badge,
                        'token'             : token,
                        'device_type_sender': data.device_type,
                        //'click_action'    : 'fcm.ACTION.HELLO',
                    },
                  'data': {
                        // 'custom_notification': {
                            'title'             : data.user_name,
                            'user_name'         : data.user_name,
                            'text'              : data.text,
                            'user_id'           : data.user_id,
                            'to_user_id'        : data.to_user_id,
                            'user_image'        : data.user_image,
                            'sound'             : 'default',
                            'priority'          : 'high',
                            'click_action'      : 'fcm.ACTION.HELLO',
                            'auto_cancel'       : true,
                            'show_in_foreground': true,
                            'token'             : token,
                            'device_type_sender': data.device_type,
                            'body'              : data.text,
                            targetScreen        : 'detail',
                        // },
                    'badge': data.badge,
                    //'title' : 'data', //data.sender,
                    //'body'  : data.text,
                    //'sound' : 'default',
                    //'priority': 'high',
                    //targetScreen: 'detail'
                    //'chatId': data.chatId,
                    //'image': data.image
                    //'click_action': fcm.ACTION.PUSH
                     //'show_in_background': true,
                     //'show_in_foreground': false
                  },
                  'priority': 'high',  //10 //for IOS 5 or 10
            });
      } else if (data.device_type === 'ios'){
            // console.log('notificationAction sendNotification to IOS = ', data.device_type);
            // console.log('notificationAction sendNotification IOS data.badge : ', data.badge);
            // console.log('notificationAction sendNotification TO IOS token : ', token);
            // console.log('notificationAction sendNotification from user_name = ', data.user_name);
            var body = JSON.stringify({
                  'to': token,  //'d3BMmPBToPc:APA91bE2rseo5oVxnkHdBJ2esJ17jzyMxqG6rCLK_ZNz7OIDT1wgkMPXcUXomU62DzAI1lt3ECwq7zvZDMuoIlezndIfws96HGTmYDKddYCBf_YrinNDK_eOv6-Az6SBknZ2Pkf_-myy',//token,
                  'content_available': true,
                  'notification': {
                      'title'             : data.user_name || '',
                      'user_name'         : data.user_name,
                      'body'              : data.text,
                      'user_id'           : data.user_id,
                      'to_user_id'        : data.to_user_id,
                      'user_image'        : data.user_image,
                      'sound'             : 'default',
                      'auto_cancel'       : true,
                      'show_in_foreground': true,
                      'badge'             : data.badge,
                      'token'             : token,
                      'device_type_sender': data.device_type,
                      //'click_action'    : 'fcm.ACTION.HELLO',
                  },
                  data: {
                        'title'         : data.user_name,
                        'user_name'     : data.user_name,
                        'text'          : data.text,
                        'user_id'       : data.user_id,
                        'to_user_id'    : data.to_user_id,
                        'user_image'    : data.user_image,
                        'sound'         : 'default',
                        'priority'      : 'high',
                        'auto_cancel'   : true,
                        targetScreen    : 'detail',
                        //'click_action' : 'fcm.ACTION.HELLO',
                  },
                  'priority': 'high'  //10 //for IOS 5 or 10
            });
      } else {
            console.log('notificationAction sendNotification NO DEVICE TYPE ', data.device_type);
            var body = JSON.stringify({
                  'to': token,  //'d3BMmPBToPc:APA91bE2rseo5oVxnkHdBJ2esJ17jzyMxqG6rCLK_ZNz7OIDT1wgkMPXcUXomU62DzAI1lt3ECwq7zvZDMuoIlezndIfws96HGTmYDKddYCBf_YrinNDK_eOv6-Az6SBknZ2Pkf_-myy',//token,
                  'content_available': true,
                  'notification': {
                      'title'             : data.user_name || '',
                      'user_name'         : data.user_name,
                      'text'              : data.text || '',
                      'user_id'           : data.user_id,
                      'to_user_id'        : data.to_user_id,
                      'user_image'        : data.user_image,
                      'sound'             : 'default',
                      'show_in_foreground': false,
                      'auto_cancel'       : true,
                      'badge'             : 0,
                      //'click_action' : 'fcm.ACTION.HELLO',
                  },
                  'data': {
                        'custom_notification': {
                            'title'             : data.user_name,
                            'user_name'         : data.user_name,
                            'text'              : data.text,
                            'user_id'           : data.user_id,
                            'to_user_id'        : data.to_user_id,
                            'user_image'        : data.user_image,
                            'sound'             : 'default',
                            'priority'          : 'high',
                            'show_in_foreground': false,
                            'auto_cancel'       : true,
                            'badge'             : 0,
                            targetScreen        : 'detail'
                            //'click_action' : 'fcm.ACTION.HELLO',
                        },
                    /*
                    'title' : 'data', //data.sender,
                    'body'  : data.text,
                    'sound' : 'default',
                    'priority': 'high',
                    targetScreen: 'detail'*/
                    //'chatId': data.chatId,
                    //'image': data.image
                  },
                  'priority': 10,   //'high'  //10 //for IOS 5 or 10
            });
      }

    let headers = new Headers({
        'Content-Type': 'application/json',
        // 'Content-Length': parseInt(body.length),
        Authorization: 'key=' + fcm_param.FirebaseServerKey,
    });

    let response = await fetch(fcm_param.API_URL, {
        method: 'POST',
        headers,
        body,    //: JSON.stringify(message),
    });
    response = await response.json();
    // console.log('NotificationAction response',response);
  };
