/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  Dimensions,
  ScaledSize,
  Keyboard,
  View,
  Text,
  Modal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import {  CheckBox } from 'react-native-elements';
import { WebView } from 'react-native-webview';

import {
	Card,
	CardSection,
	LoginRegInput,
	Button,
	Spinner,
	Input,
} from './common';
import styles from './Styles';
import { config } from '../config';
// import authReducer from '../store/reducers';
// import { loginAction } from '../store/authActions';
import { register, passwordMismatch } from '../store/action-creators';
import { useTranslation } from 'react-i18next';
import { getAsyncStorage } from '../util';
// interface Navigation  {
//   navigation: () => {}
// }

interface userInput {
  username:string;
  email:string;
  password:string;
  retypePassword:string;
  eulaChecked:boolean;
}
interface LogoSize {
  logoWidthNew:number;
  logoHeightNew:number;
}

// export const Register: ({navigation:navigation}) => React$Node = ({navigation:navigation}) => {
export const Register: ({navigation:navigation}) => React.FC = ({navigation:navigation}):JSX.Element => {
  const window:ScaledSize = Dimensions.get('window');
  // const [logoWidthNew, setLogoWidthNew] = React.useState<number>(0);
  // const [logoHeightNew, setLogoHeightNew] = React.useState<number>(0);
  // setLogoWidthNew(Math.round(window.width * 3 / 5));
  // setLogoHeightNew(Math.round(logoWidthNew * 9 / 16));
  const logoWidthNew:LogoSize  = Math.round(window.width * 3 / 5);
  const logoHeightNew:LogoSize = Math.round(logoWidthNew * 9 / 16);
  const [username, setUsername] = React.useState<string | undefined>('');
  const [email, setEmail]       = React.useState<string | undefined>('');
  const [password, setPassword] = React.useState<string | undefined>('');
  const [retypePassword, setRetypePassword] = React.useState<string | undefined>('');
  const [eulaChecked, setEulaChecked] = React.useState<boolean | undefined>(false);
  const [modalVisible, setModalVisible] = React.useState<boolean | undefined>(false);
  const authReducer = useSelector(state => state.authReducer);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const {t,i18n} = useTranslation();

  return (
        <Card>
          <Modal animationType="fade" transparent={true} visible={modalVisible}
                  onRequestClose={() => { alert('Modal has been closed.'); }}>
            <View style={styles.modalOuter}>
              <View style={{
                    // flex: 1,
                    width:  window.width - 20,
                    height: window.height - 40,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    paddingHorizontal: 8,
                    paddingTop: 10,
                    paddingBottom: 10
                  }}>
                  <WebView
                      originWhitelist={['*']}
                      // source={{uri: 'http://www.comharinfosystems.com/lovapp/eula.html'}}
                      source={{uri: (RNLocalize.getCountry === 'ja') ? config.EULA_JP : config.EULA}}
                      //style={{marginTop: 20}}
                    />
                  <CardSection>
                    <Button onPress={() => { setModalVisible(false); setEulaChecked(true); }}>
                          {t('Agree')}
                    </Button>
                  </CardSection>
                  <CardSection>
                    <Button onPress={() => { setModalVisible(false); setEulaChecked(false); }}>
                          {t('Cancel')}
                    </Button>
                  </CardSection>
              </View>
            </View>
          </Modal>

        <View style={styles.registerSection}>
                <CardSection>
                  <LoginRegInput
                    placeholder = {t('Name')}
                    value={username}
                    onChangeText= {setUsername}
                    />
                </CardSection>
                <CardSection>
                  <LoginRegInput
                    placeholder = {t('Email')}
                    value={email}
                    onChangeText= {setEmail}
                    />
                </CardSection>
                <CardSection>
                  <LoginRegInput
                    secureTextEntry
                    placeholder = {t('Password')}
                    value={password}
                    onChangeText= {setPassword}
                  />
                </CardSection>
                <CardSection>
                  <LoginRegInput
                    secureTextEntry
                    placeholder = {t('Retype Password')}
                    value={retypePassword}
                    onChangeText= {setRetypePassword}
                  />
                </CardSection>
                <Text style={styles.errorTextStyle}>
                  {translateError(authReducer.errorMsg, t)}
                  {/* {authReducer.errorMsg} */}
                </Text>
                <CardSection style={{ justifyContent : 'center' }}>
                  <CheckBox center
                    containerStyle={{backgroundColor: 'rgba(25, 28, 33, 0.85)', borderRadius: 5}}
                    textStyle={{color:'#fff', fontSize: 10 }}
                    title= {t('End User License Agreement')}
                    checked={eulaChecked}
                    onPress={() => {setModalVisible(true); }}
                  />
                </CardSection>
                <CardSection>
                  {RenderButton(username, email, password, retypePassword, eulaChecked)}
                  {/* <RenderButton username={username} password={password} /> */}
                </CardSection>
                <Text style={styles.createUserTextStyle} onPress={ () => navigation.navigate('LoginForm') } >
                    {t('Tap Here to Login')}
                </Text>
              </View>
        </Card>
    );
};

// const RenderButton = ({username, password} :userInput):JSX.Element => {
  const RenderButton: React.FC<userInput> = (username:string, email:string, password:string, retypePassword:string, eulaChecked:boolean ):JSX.Element => {
    const authReducer = useSelector(state => state.authReducer);
    const {t,i18n} = useTranslation();
    const registerDispatch = useDispatch();
    const passwordMismatchDispatch = useDispatch();
    console.log('Register authReducer.loading ', authReducer.loading);
    setTimeout( () => {
      authReducer.loading = false;
    }, 5000);
    return (
        authReducer.loading ? <Spinner size="large" /> :
            <Button onPress={ () => { 
              if (password === retypePassword){
                if (eulaChecked) sendRegister(username, email, password, registerDispatch);
              } else {
                console.log('Register passwordMismatch ');
                passwordMismatchDispatch(passwordMismatch());
              }
            }} > {t('Register')} </Button>
      );
};

const sendRegister = (username:string, email:string, password:string, registerDispatch:any) => {
  console.log('Register username ', username,' password ', password);
  Keyboard.dismiss();
  registerDispatch(register(username, email, password) );
};

const translateError = (errorMsgReducer:string, t) => {
  let errorMsg = '';
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
    case 'Password Mismatch' :
      errorMsg = t('Password Mismatch');
      break;
    case '' :
      errorMsg = '';
      break;
    default :
      errorMsg = errorMsgReducer;
      break;
  }
  console.log('Login translateError errorMsg ', errorMsg);
  return errorMsg;
};
