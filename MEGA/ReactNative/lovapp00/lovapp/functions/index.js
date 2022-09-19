/* eslint-disable prettier/prettier */
const functions = require('firebase-functions');
const admin 	= require('firebase-admin');
const axios 	= require('axios');
const qs 	= require('qs');
// const cors = require('cors')({ origin: true });
//admin.initializeApp(functions.config().firebase);
admin.initializeApp();
const otherDatabase = admin.initializeApp({
    databaseURL: 'https://messaging-dev-49fa2-2ef66.firebaseio.com/',
}, 'otherDatabase');

// https://firebase.google.com/docs/functions/write-firebase-functions
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     functions.logger.info('Hello logs!', {structuredData: true});
//     console.log('Hello from Firebase!');
//     response.send('Hello from Firebase!');
//   });

//   exports.storepf = functions.https.onRequest((request, response) => {
//     //   functions.logger.info('storepf!', {structuredData: true});
//       var paramStringify = qs.stringify({
//         app_token: 'asdfghjkl',
//         user_name: 'eroka',
//         password: 'test1234',
//         version: '40',
//     });
//     cors(request, response, () => {
// 	return axios.post('https://api.lovapp.chat/mobileAuth/login', paramStringify)
// 		.then( (result) => {
// 			console.log('storePF 55 response.data : ', result);
//             // response.status(200).send(result);
// 			// var contactList_ref = firebase_config.database().ref(`user/${userID}/contact_list/`);
// 			// var ref = admin.database(otherDatabase).ref(`/pf/`);
// 			// // ref.set();
// 			// ref.child(`${response.userID}`).set({
// 			// 			user_name			: response.userName,
// 			// 			lower_case_name 	: response.userName.toLowerCase(),
// 			// 			last_login 			: response.lastLogin,
// 			// });
// 			response.status(200).send(result);
// 			// return resolve(response.status(200).send(result.data.response));
// 			// return resolve(result.data);
// 		})
// 		.catch( (error) => {
// 			console.log('storePF 55 error : ', error);
//             // response.status(400).send(error);
// 			response.status(400).send(error);
// 			// return reject(response.status(400).send(error));
// 			// return reject(error);
// 		});
//     });
//  });

  exports.storepf = functions.https.onRequest((request, response) => {
    return new Promise( (resolve, reject) => {
    // cors(req, res, () => {
    functions.logger.info('storepf!', {structuredData: true});
    var paramStringify = qs.stringify({
            app_token: 'asdfghjkl',
            user_name: 'eroka',
            password: 'test1234',
            version: '40',
        });
	// console.log('storePF paramStringify : ', paramStringify);
    // response.send(200, 'storePF paramStringify : ', paramStringify.app_token);
    // response.status(200).send(paramStringify);
	axios.post('https://api.lovapp.chat/mobileAuth/login', paramStringify)
		.then( (result) => {
			console.log('storePF 33 response.data : ', result.data);
			// var contactList_ref = firebase_config.database().ref(`user/${userID}/contact_list/`);
			// var ref = admin.database(otherDatabase).ref('/pf/');
			// ref.set(result.data.userInfo);
            admin.database(otherDatabase).ref('/pf/').ref.set(result.data.userInfo);
			// ref.child(`${response.userID}`).set({
			// 			user_name			: response.userName,
			// 			lower_case_name 	: response.userName.toLowerCase(),
			// 			last_login 			: response.lastLogin,
			// });
			return resolve(response.status(200).send(result.data));
			// return resolve(result.data);
		})
		.catch( (error) => {
			console.log('storePF 33 error : ', error);
            // response.status(400).send(error);
			return reject(response.status(400).send(error));
			// return reject(error);
		});
    });
 });

 exports.updatetime = functions.https.onRequest((request, response) => {
     functions.logger.info('storepf1', {structuredData: true});
     console.log('storepf1 request : ', request.query);
     console.log('storepf1 new Date().getTime : ', new Date().getTime);
         response.status(200).send(request.query);
        //  response.status(200).send(new Date().getTime);
		//  admin.database(otherDatabase).ref('/pf/date_modified').ref.update(new Date().getTime);

    // return new Promise( (resolve, reject) => {
    // // cors(req, res, () => {
    // // response.send(200, 'storepf1 paramStringify : ', paramStringify.app_token);
    // // response.status(200).send(paramStringify);
	// axios.post('https://api.lovapp.chat/mobileAuth/login', request)
	// 	.then( (result) => {
	// 		console.log('storepf1 33 response.data : ', result.data);
	// 		// var contactList_ref = firebase_config.database().ref(`user/${userID}/contact_list/`);
	// 		// var ref = admin.database(otherDatabase).ref('/pf/');
	// 		// ref.set(result.data.userInfo);
    //         admin.database(otherDatabase).ref('/pf/').ref.set(result.data.userInfo);
	// 		// ref.child(`${response.userID}`).set({
	// 		// 			user_name			: response.userName,
	// 		// 			lower_case_name 	: response.userName.toLowerCase(),
	// 		// 			last_login 			: response.lastLogin,
	// 		// });
	// 		return resolve(response.status(200).send(result.data));
	// 		// return resolve(result.data);
	// 	})
	// 	.catch( (error) => {
	// 		console.log('storepf1 33 error : ', error);
    //         // response.status(400).send(error);
	// 		return reject(response.status(400).send(error));
	// 		// return reject(error);
	// 	});
    // });
 });

exports.callLoginAPI =  functions.https.onCall( (data) => {
	// console.log('callLoginAPI context :::::::::::::::::::::::: ', context);
	// console.log('callLoginAPI data :::::::::::::::::::::::: ', data);
	// console.log('callLoginAPI data.obj.loginURL : ', data.obj.loginURL);
	// console.log('callLoginAPI data.obj.params   : ', data.obj.params);
	//return data.obj;
	return new Promise( (resolve, reject) => {
			axios.post(data.obj.loginURL, data.obj.params)
				.then( (response) => {
					// console.log('callLoginAPI response.data : ', response.data)
					return resolve(response.data);
				})
				.catch( (error) => {
					// console.log('callLoginAPI loginAPI error : ', error)
					return reject(error);
				});
		});
});
