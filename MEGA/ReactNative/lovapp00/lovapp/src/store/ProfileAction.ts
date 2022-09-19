/* eslint-disable prettier/prettier */
// import ImgToBase64 from 'react-native-image-base64';
import RNFetchBlob from 'rn-fetch-blob';
// import ImgToBase64 from 'react-native-image-base64';
import ImageResizer from 'react-native-image-resizer';
import firebase_config from '../firebase_config';
// import { config } from '../config';
//   export const storeProfileAction = (user, response) => {
//       return new Promise( (resolve, reject) => {
//         // const task = storage().ref(`/profileImages/${user.userID}`).putFile(response.uri);
//         // console.log('storeProfileAction task : ', task);
//         const uploadUri = response.uri.replace('file://', '');
//         console.log('storeProfileAction uploadUri : ', uploadUri);
//         storage().ref(`/profileImages/${user.userID}`).putFile(response.uri)
//             .then( snapshot => {
//                 //You can check the image is now uploaded in the storage bucket
//                 // console.log(`profileImages/${user.userID} has been successfully uploaded.`);
//                 console.log('storeProfileAction snapshot : ', snapshot);
//                 // firebase_config.storage().ref(`/profileImages/${user.userID}`).getDownloadURL()
//                 // .then( url => {
//                 //     resolve(url);        //from url you can fetched the uploaded image easily
//                 // })
//                 // .catch( err => {
//                 //     console.log('getting downloadURL of image error => ', err)
//                 //     reject(err);
//                 // });
//             })
//             .catch( err => {
//                 console.log('getting downloadURL of image error => ', err)
//                 reject(err);
//             });
        
        // const imgUri = response.uri;
        // console.log('storeProfileAction imgUri : ', imgUri);
        // const uploadUri = response.uri.replace('file://', '');
        // console.log('storeProfileAction uploadUri : ', uploadUri);
        // ImgToBase64.getBase64String(imgUri)
        //     .then( base64String =>  { // setImageResponse({ response, base64String });
        //         console.log('storeProfileAction base64String : ', base64String);
        //         // const uploadUri  = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
        //         firebase_config.storage().ref(`profileImages/${user.userID}`).putFile(uploadUri)
        //             .then( snapshot => {
        //                 //You can check the image is now uploaded in the storage bucket
        //                 console.log(`profileImages/${user.userID} has been successfully uploaded.`);
        //                 firebase_config.storage().ref(`/profileImages/${user.userID}`).getDownloadURL()
        //                 .then( url => {
        //                     resolve(url);        //from url you can fetched the uploaded image easily
        //                 })
        //                 .catch( err => {
        //                     console.log('getting downloadURL of image error => ', e)
        //                     reject(err);
        //                 });
        //             })
        //             .catch( err => {
        //                 console.log('getting downloadURL of image error => ', e)
        //                 reject(err);
        //             });
        //     })
        // .catch(err => console.log ('convertPic err ', err) );
//     });
//   };

//   export const storeProfileAction = ( user, response ) => async dispatch => {
//     const {imageName} = this.state;
//     // let imageRef = firebase_config.storage().ref(`/profileImages/${user.userID}`);
//     // imageRef
//     firebase_config.storage().ref(`/profileImages/${user.userID}`).getDownloadURL()
//       .then((url) => {
//         resolve(url);        //from url you can fetched the uploaded image easily
//     })
//       .catch(err => {
//           console.log('getting downloadURL of image error => ', e)
//           reject(err);
//       });
//   }

/* export const reduceImageAction = async (user, response) => {
    console.log('reduceImageAction uploadImage response.assets[0].uri : ', response.assets[0].uri);
    const newResponse =  await ImageResizer.createResizedImage(response.assets[0].uri, 500, 500, 'JPEG', 500, 0);
    console.log('reduceImageAction newResponse',newResponse);
    storeProfileAction(user, newResponse);
    //   ImgToBase64.getBase64String(newResponse.uri).then(base64String =>  {
    //         // console.log('convertPic base64String',base64String);
    //         //   setImageResponse({ response, base64String });
    //         }).catch(err => console.log('convertPic err ', err));
}; */

//   export const storeImage = (response, mime = 'image/jpeg', name) => {
  export const storeProfileAction = async ( user, response ) => {
    response = await ImageResizer.createResizedImage(response.assets[0].uri, 100, 100, 'JPEG', 100, 0);
    console.log('storeProfileAction uploadImage response.assets[0].uri : ', response.uri);
    const mime = 'image/jpeg';
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    return new Promise((resolve, reject) => {
        let imgUri = response.uri;
        const uploadUri = imgUri.replace('file://', '');
        // const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
        console.log("storeProfileAction uploadUri : ", uploadUri);
        let uploadBlob = null;
        const imageRef = firebase_config.storage().ref(`profileImages/${user.userID}`);
        // imageRef.delete();
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
                console.log("storeProfileAction url : ", url);
                resolve(url);
                firebase_config.database().ref(`user/${user.userID}/user_info`).update({ user_image : url });
                firebase_config.database().ref(`offline/${user.userID}`).update({ user_image : url });
            })
            .catch(error => {
                reject(error);
        });
    });
  };

export const getProfile = ( user ) => {
    return new Promise( (resolve, reject) => {
        // Create a reference with an initial file path and name
        // var storage = firebase_config.storage();
        // var pathRef = storage.ref(`profileImages/${user.userID}`);

        // // Create a reference from a Google Cloud Storage URI
        // var gsRef = storage.refFromURL(`gs://bucket/profileImages/${user.userID}`)
        //   const { currentUser } = firebase_config.auth();

        // firebase_config.database().ref(`user/${user.userID}/user_info/user_image`).once('value', (url) => {
        //     console.log('getProfile url 2: ', url.val());
        //     resolve(url.val());
        // });
        firebase_config.storage().ref().child(`profileImages/${user.userID}`).getDownloadURL()
            .then(url => {
                console.log('getProfile url : ', url);
                resolve(url);
            } )
            .catch(err => {
                console.log('getProfile err : ', err);
                resolve(null);
                reject(err);
            });
    });
};

// export const deleteProfile = ( user ) => {
//         firebase_config.storage().ref().child(`profileImages/${user.userID}`).remove();
// };

// export const storeImage = ( user, response ) => {
//     //   export const storeProfileAction = ( user, response ) => async dispatch => {
//     //   export const storeImage = (response, mime = 'image/jpeg', name) => {
//         console.log("storeImage uploadImage response.uri : ", response.uri);
//         const mime = 'image/jpeg';
//         const Blob = RNFetchBlob.polyfill.Blob;
//         const fs = RNFetchBlob.fs;
//         window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
//         window.Blob = Blob;
//         return new Promise((resolve, reject) => {
//             let imgUri = response.uri;
//             const uploadUri = imgUri.replace('file://', '');
//             // const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
//             console.log("storeImage uploadUri : ", uploadUri);
//             let uploadBlob = null;
//             const imageRef = firebase_config.storage().ref(`images/${user.room_id}/${user.userID}`).child(`${imageTime}`)
//             // encode data with base64
//             fs.readFile(uploadUri, 'base64')
//                 .then(data => {
//                     return Blob.build(data, { type: `${mime};BASE64` });
//                 })
//                 // place blob into storage reference
//                 .then(blob => {
//                     uploadBlob = blob;
//                     return imageRef.put(blob, { contentType: mime, name: response.fileName });
//                 })
//                 .then(() => {
//                     uploadBlob.close()
//                     return imageRef.getDownloadURL();
//                 })
//                 .then(url => {
//                     console.log("storeImage url : ", url);
//                     resolve(url);
//                 })
//                 .catch(error => {
//                     reject(error)
//             })
//         })
//       }