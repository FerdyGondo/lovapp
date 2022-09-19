/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Dimensions,
  ScaledSize,
  Image,
  View,
  Text,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
	Card,
	CardSection,
	LoginRegInput,
	Button,
	Spinner,
} from './common';
import styles from './Styles';
import { config } from '../config';
import { login } from '../store/action-creators';
import { useTranslation } from 'react-i18next';
import { getAsyncStorage, setAsyncStorage } from '../util';
import { Dynatrace } from '@dynatrace/react-native-plugin';

// interface Navigation  {
//   navigation: () => {}
// }

interface userInput {
  username:string;
  password:string;
}
interface LogoSize {
  logoWidthNew:number;
  logoHeightNew:number;
}

// export const Login: ({navigation:navigation}) => React$Node = ({navigation:navigation}) => {
export const Login: ({navigation:navigation}) => React.FC = ({navigation:navigation}):JSX.Element => {
  const window:ScaledSize = Dimensions.get('window');
  // const [logoWidthNew, setLogoWidthNew] = React.useState<number>(0);
  // const [logoHeightNew, setLogoHeightNew] = React.useState<number>(0);
  // setLogoWidthNew(Math.round(window.width * 3 / 5));
  // setLogoHeightNew(Math.round(logoWidthNew * 9 / 16));
  const logoWidthNew:LogoSize  = Math.round(window.width * 3 / 5);
  const logoHeightNew:LogoSize = Math.round(logoWidthNew * 9 / 16);
  const [username, setUsername] = React.useState<string | undefined>('');
  const [password, setPassword] = React.useState<string | undefined>('');
  const [errorMsg, setErrorMsg] = React.useState<string | undefined>('');
  const [alertExist, setAlertExist] = React.useState<boolean | undefined>(false);
  // const [store_ver, setStore_ver] = React.useState<string | undefined>('');
  const authReducer = useSelector(state => state.authReducer);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const {t,i18n} = useTranslation();
  const loginDispatch = useDispatch();

  React.useEffect(  () => {
    let timer:any;
    (async () => {
        setLoggedIn(await getAsyncStorage('loggedIn'));
        if (loggedIn) {
            // console.log('Login loggedIn ', loggedIn);
            setUsername(await getAsyncStorage('email'));
            setPassword((await getAsyncStorage('password')).toString());
            if (username && password) {
              // console.log('Login username 22', username);
              // console.log('Login password 22', password);
              // timer = setInterval( () => {
                Keyboard.dismiss();
                loginDispatch(login(username, password) );
                // global.dt.identifyUser(username);
                //Perform the action and whatever else is needed.
                let myAction = Dynatrace.enterAction('Login');
                  myAction.reportStringValue('userId', username);
                  Dynatrace.identifyUser(username);
                // myAction.leaveAction();
              // }, 2000);
            }
        }
    })();
    return () => {
      // console.log('Login useEffect return');
      // clearInterval(timer);
    };
  },[loggedIn, username, password]);

  // console.log('Login translateError authReducer.errorMsg ', authReducer.user.error);
  if (authReducer.user.error === 'please update new version') {
    if (!alertExist){
      setAlertExist(true);
      Alert.alert(
        t('The app is out of date'),	//'Invite User',
        t('Please update to new version'),	//'Do you want to invite this user ?',
        [
          {text: t('OK'), onPress: () => {
            let storeURL = Platform.OS === 'android' ? config.ANDROID_URL : config.IOS_URL;
            console.log('translateError storeURL : ', storeURL);
            Linking.openURL(storeURL);
          }},
        ]
      );
    }
  }
  return (
        <Card>
          <KeyboardAvoidingView style={styles.loginSection}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Animated.View style={{flex: 1, paddingBottom: keyboardHeight}}>
                <View style={styles.topSection}>
                  <View style={styles.logoContainer}>
                    <Image source={require('../images/loveapp-logo.png')} style={{width: logoWidthNew, height: logoHeightNew, resizeMode: 'contain' }} />
                  </View>
                </View>
                <View style={styles.bottomSection}>
                  <CardSection>
                    <LoginRegInput
                      placeholder = {t('UserName')}
                      value={username}
                      onChangeText= {setUsername}
                      // onChangeText= {(event) => setUsername(event.target.value)}
                      //onSubmitEditing = {this.onButtonPress.bind(this)}
                      />
                  </CardSection>
                  <CardSection>
                    <LoginRegInput
                      secureTextEntry
                      placeholder = {t('Password')}
                      value={password}
                      onChangeText= {setPassword}
                      // onChangeText= {(event) => setPassword(event.target.value)}
                      //onSubmitEditing = {this.onButtonPress.bind(this)}
                    />
                  </CardSection>
                  <Text style={styles.errorTextStyle}>
                    {translateError(authReducer.errorMsg, t, alertExist, setAlertExist)}
                    {/* {authReducer.errorMsg} */}
                  </Text>
                  <CardSection>
                    {RenderButton(username, password)}
                    {/* <RenderButton username={username} password={password} /> */}
                  </CardSection>
                  <Text style={styles.createUserTextStyle} onPress={ () => navigation.navigate('RegisterForm') } >
                      {t('Tap Here to Register')}
                  </Text>
                  <Text style={styles.versionTextStyle} >
                    Version: {config.STORE_VER}  Build {config.STORE_BUILD}
                  </Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Card>
    );
};

// const RenderButton = ({username, password} :userInput):JSX.Element => {
const RenderButton: React.FC<userInput> = (username:string, password:string ):JSX.Element => {
    const authReducer = useSelector(state => state.authReducer);
    const {t,i18n} = useTranslation();
    const loginDispatch = useDispatch();
    setTimeout( () => {
      authReducer.loading = false;
    }, 2000);
        console.log('Login authReducer.loading ', authReducer.loading);
    return (
        authReducer.loading ? <Spinner size="large" /> :
              <Button onPress={ () => {
                Keyboard.dismiss();
                sendLogin(username, password, loginDispatch);
              }}
            > {t('Login')} </Button>
      );
};

const sendLogin = (username:string, password:string, loginDispatch) => {
    // console.log('Login username ', username,' password ', password);
    loginDispatch(login(username, password) );
    // global.dt.identifyUser(username);
    //Perform the action and whatever else is needed.
    let myAction = Dynatrace.enterAction('Login');
      myAction.reportStringValue('userId', username);
      Dynatrace.identifyUser(username);
    // myAction.leaveAction();
};

const translateError = (errorMsgReducer:string, t, alertExist, setAlertExist) => {
  let errorMsg = '';
  console.log('Login translateError errorMsgReducer ', errorMsgReducer);
  switch (errorMsgReducer) {
    case 'The email address is already in use by another account.' :
      errorMsg = t('The email address is already in use by another account');
      break;
    case 'Invalid_input' :
      errorMsg = t('Invalid Input');
      break;
    case 'redirect' :
      errorMsg = t('Redirect');
      break;
    case 'Network Error' :
      errorMsg = t('Network Error');
      break;
    case 'Axios Network Error' :
      if (!alertExist){
        setAlertExist(true);
        Alert.alert(t('Network Error'), t('Please delete app then redownload') );
      }
      break;
    case config.APP_UPDATE ://need to update app
        if (!alertExist){
              setAlertExist(true);
              Alert.alert(
                t('The app is out of date'),	//'Invite User',
                t('Please update to new version'),	//'Do you want to invite this user ?',
                [
                  {text: t('OK'), onPress: () => {
                    let storeURL = Platform.OS === 'android' ? config.ANDROID_URL : config.IOS_URL;
                    console.log('translateError storeURL : ', storeURL);
                    Linking.openURL(storeURL);
                  }},
                ]
              );
        }
      errorMsg = t('The app is out of date');
      break;
    default :
      errorMsg = errorMsgReducer;
      break;
  }
  // console.log('Login translateError errorMsg ', errorMsg);
  return errorMsg;
};


/*   React.useEffect( () => {
    (async () => {
      setStore_ver(await getAsyncStorage('store_ver'));
      // console.log('LoginForm componentWillMount store_build : ',this.state.store_build);
      console.log('Login store_ver : ', store_ver);
      if (store_ver === '' || store_ver === null) {
        setAsyncStorage('store_ver', config.STORE_VER);
      } else if (store_ver !== config.STORE_VER) {
        //logout
      }
    })();
  },[store_ver]); */