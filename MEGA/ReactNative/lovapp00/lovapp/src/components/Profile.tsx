/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import { useNavigation } from '@react-navigation/native';
import {
  Alert,
  View,
  Text,
} from 'react-native';
import { Icon, Avatar, Button } from 'react-native-elements';
import styled from 'styled-components';
import {
	Card,
	CardSection,
} from './common';
import styles from './Styles';
import importStyles from './Styles';
import { config } from '../config';
import { storeProfile, getProfile, logout  } from '../store/action-creators';

// const Profile: () => React$Node = () => {
//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       title: value === '' ? 'No title' : value,
//     });
//   }, [navigation, value]);
//   return <Text>Profile</Text>
// };

const Profile: ({navigation}) => React$Node = ({navigation}) => {
  // const _useNavigation = useNavigation();
	const {t,i18n} = useTranslation();
  const storeProfileDispatch = useDispatch();
  const getProfileDispatch = useDispatch();
  const logoutDispatch = useDispatch();
  const authReducer = useSelector(state => state.authReducer);
  const profileReducer = useSelector(state => state.profileReducer);
  const [flashImg, setFlashImg] = React.useState<string>('');
  const [nonDX, setNonDX] = React.useState<boolean | undefined>(false);
  const [modalVisible, setModalVisible] = React.useState<boolean | undefined>(false);
  const [loadingImage, setLoadingImage] = React.useState<boolean | undefined>(false);
  // console.log('Profile navigation =====', navigation);
  // console.log('Profile authReducer =====', authReducer);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('My Profile'),   //getHeaderTitle(route),
      headerStyle: { backgroundColor: '#efeff2'},
      headerTintColor: '#333',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold'},
      headerRight: ({color}) => <Icon name = "logout"  type="material-community" size={23} color={color} onPress = {() => Logout()} style={{marginRight:10}}/>
    });
    getProfileDispatch(getProfile(authReducer.user));
    console.log('Profile React.useLayoutEffect authReducer : ', authReducer);
    setNonDX(authReducer.user.nonDX);
    return () => {
      console.log('Profile React.useLayoutEffect return');
    };
  }, []);

  React.useEffect( () => {
    console.log('Profile url : ', profileReducer.url);
    console.log('Profile authReducer.user_info.user_image : ', authReducer.user_info.user_image);
    let temp = '';
    if (profileReducer.url) {
      temp = profileReducer.url;
    } else {
      temp = authReducer.user_info.user_image;
      // console.log('Profile temp : ', temp);
    }
    temp = temp.includes('WebArchive') ? config.THUMB_URL + temp : temp;
    // setFlashImg(flashImg.includes('WebArchive') ? config.THUMB_URL + flashImg : flashImg);	// + ',cache:"reload"';//	 + '?random_number=' + new Date().getTime();
    setFlashImg(temp);
    // console.log('Profile flashImg', flashImg);

    return () => {
      console.log('Profile React.useEffect return');
      setFlashImg('');
    };
  },[profileReducer]);

const handleChoosePhoto = async (setModalVisible) => {
    let options = {
      // noData: false,
    };
    launchImageLibrary(options, async (response) => { 
      console.log('Profile handleChoosePhoto options: ', options);
      console.log('Profile handleChoosePhoto response: ', response);
      if (response.didCancel){
        setLoadingImage(false);
        setModalVisible(false);
      } else {
        storeProfileToFB(options, response, setModalVisible);
      }
    });
};

const handleCameraCapture = async (setModalVisible) => {
    let options = {
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };
    launchCamera(options, async response => {
      if (response.didCancel){
        setLoadingImage(false);
        setModalVisible(false);
      } else {
        storeProfileToFB(options, response, setModalVisible);
      }
    });
};

const storeProfileToFB = async (options, response, setModalVisible) => {
    if (!response.didCancel) {
      console.log('Profile storeProfileToFB authReducer.user : ',authReducer.user);
      console.log('Profile storeProfileToFB response : ',response);
      storeProfileDispatch(storeProfile(authReducer.user, response));
      console.log('Profile storeProfileToFB profileReducer.image_path : ',profileReducer.image_path);
      // let image_token = image_path.slice(image_path.indexOf("&token=")+7);
      // flashImg = profileReducer.image_path;
      setLoadingImage(false);
      setModalVisible(false);
    }
  };

  const Logout = () => {
      console.log('Profile Logout navigation : ',navigation);
      // console.log('Profile FuncLogout this.props.user_info: ', this.props.user_info);
      Alert.alert(
        t('Do you want to log out?'),	//'Do you want to invite this user ?',
        '',//t('Invite User'),	//'Invite User',
          [
            {text: t('NO')},
            {text: t('YES'), onPress: () => {
              logoutDispatch(logout(authReducer.user, authReducer.user_info));
            }},
          ]
      );
  };
  // console.log('Profile render flashImg :::::::::::::::::: ',flashImg);
  return (
    <Card style={{backgroundColor: '#fff'}}>
      <CardSection style={styles.profileTopSection}>
          <View>
            <Avatar
                size="xlarge"
                rounded
                source={(flashImg === '') ? require('../icons/no_image_user.png') : (flashImg && {uri:flashImg,cache:'reload'}) }
                onPress={ () => setModalVisible(true) }
                //activeOpacity={0.7}
            />
            <TouchableOpacity onPress={ () => setModalVisible(true)}>
                <IconView>
                  <Icon name="camera" type="foundation" size={35} color="#666"/>
                </IconView>
            </TouchableOpacity>
          </View>
      </CardSection>
      <CardSection style={styles.profileBottomSection}>
          <View style={styles.profileLeft}>
              <Text style={styles.labelText}>{t('Name')}</Text>
              {nonDX ? null : <Text style={styles.labelText}>{t('Version')}</Text>}
              {/*<Text style={styles.labelText}>{t('Age')}</Text>
              <Text style={styles.labelText}>{t('Info')}</Text>
              { this.props.user_info.user_type == 205 || this.props.user_info.user_type == 206 || this.props.user_info.user_type == 208 || this.props.user_info.user_type == 215 ? <Text style={styles.labelText}>{t('Balance')}</Text> : null }
              <Text style={styles.labelText}>Ver</Text>*/}
          </View>
          <View style={styles.profileRight}>
              <Text style={styles.profileText}>
                {authReducer.user_info.user_name}
              </Text>
              {nonDX ? null : <Text style={styles.profileText}>
                {config.STORE_VER}
              </Text>}
          </View>
				</CardSection>

        <Modal animationType="fade"
							transparent={true}
							visible={modalVisible}
							onRequestClose={() => { alert('Modal has been closed.'); }}>
							{ loadingImage ? 
								<View style={importStyles.modalOuter}>
									<View style={importStyles.modalInner}>
										<View style={{ alignItems: 'center', justifyContent : 'center', flex: 1 }}>
											<ActivityIndicator animating={true} size={'large'} color={"#333"} />
											<Text style={{marginTop : 20 }}>
												{t('Loading')}
											</Text>
										</View>
									</View>
								</View>
							:
								<View style={importStyles.modalOuter}>
									<View style={importStyles.modalInner}>
										<TouchableHighlight underlayColor='#fff' style={importStyles.modalClose}
															onPress={ () =>  setModalVisible(!modalVisible) } >
											<Text style={importStyles.closeText}>X</Text>
										</TouchableHighlight>
										<View style={importStyles.checkBoxText}>
											<Button style={{ width : 200, margin:10}}
													title={t('Get Image gallery')}
													onPress={ () => {
														handleChoosePhoto(setModalVisible);
														setLoadingImage(true);
													}} />
											<Button style={{ width : 200, margin:10}}
													title={t('Take a picture')}
													onPress={ () => {
														handleCameraCapture(setModalVisible);
														setLoadingImage(true);
													}} />
										</View>
									</View>
								</View>
							}
						</Modal>
    </Card>

  );
};

const TouchableOpacity = styled.TouchableOpacity`
  bottom:40px;
  left:85px;
`;
const IconView = styled.View`
  min-height:100px;
  min-width:100px;
  position: absolute;
  z-index: 10;
`;
const Modal = styled.Modal`
`;
const ActivityIndicator = styled.ActivityIndicator`
`;
const TouchableHighlight = styled.TouchableHighlight`
`;

export default Profile;
