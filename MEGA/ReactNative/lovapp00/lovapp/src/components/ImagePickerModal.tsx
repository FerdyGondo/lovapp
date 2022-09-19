/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Modal,
    TextInput,
    TouchableOpacity,
    Platform,
    RefreshControl,
    TouchableWithoutFeedback,
    TouchableHighlight,
    LayoutAnimation,
    Image,
} from 'react-native';
 import {
    Avatar,
    Button,
    Icon,
    CheckBox,
    Overlay
  } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from './Styles';
import { storeImage  } from '../store/action-creators';

export const ImagePickerModal = ({showImagePicker, setShowImagePicker, sendDispatch, sendMsg, showPoint, setShowPoint,imageData, setImageData, nav_param }) => {
    console.log('ImagePickerModal  showImagePicker: ', showImagePicker);
    const {t,i18n} = useTranslation();
    const userReducer = useSelector(state => state.authReducer.user);
    console.log('ImagePickerModal  userReducer: ', userReducer);
    const [checked, setChecked] = React.useState<boolean | undefined>('');
    const storeImageDispatch = useDispatch();
    // const [showPoint, setShowPoint]  = React.useState<boolean>(false);
    // const [imageData, setImageData]  = React.useState<object>({});
    // const sendDispatch = useDispatch();
    const authReducer = useSelector(state => state.authReducer);
    // const msgReducer = useSelector(state => state.msgReducer);

    const handleChoosePhoto = async (setShowImagePicker) => {
          let options = {
            // noData: false,
          };
          launchImageLibrary(options, async (response) => { 
            console.log('ImagePickerModal handleChoosePhoto options: ', options);
            console.log('ImagePickerModal handleChoosePhoto response: ', response);
            setShowImagePicker(false);
            if (response.didCancel){
            } else {
              FuncStoreImage(response);
            }
          });
      };

      const handleCameraCapture = async (setShowImagePicker) => {
          let options = {
              storageOptions: {
                  skipBackup: true,
                  path: 'images',
              },
          };
          launchCamera(options, async response => {
            setShowImagePicker(false);
            if (response.didCancel){
            } else {
              FuncStoreImage(response);
            }
          });
      };

    const FuncStoreImage = (response) => {
        console.log('ImagePickerModal FuncStoreImage response: ', response);
        if (authReducer.user.userType === '210') {
          setImageData(response);
          setShowPoint(true);
          console.log('ImagePickerModal FuncStoreImage showPoint: ', showPoint);
        } else {
          console.log('ImagePickerModal FuncStoreImage authReducer.user.userType: ', authReducer.user.userType);
          // storeImageToFB(0, authReducer, msgReducer, response, storeImageDispatch);
          const pointAmount = 0;  //vw
          storeImageDispatch(storeImage(authReducer, response, pointAmount, nav_param));
        }
    };
    console.log('ImagePickerModal return showPoint: ', showPoint);

    return (
        <>
        {showImagePicker &&
        <Modal animationType="fade" transparent={true} visible={showImagePicker}
                  onRequestClose={() => { Alert.alert('Modal has been closed.'); }}>
                <View style={styles.modalOuter}>
                <View style={styles.modalInner}>
                    <TouchableHighlight underlayColor="#fff" style={styles.modalClose}
                                        onPress={ () =>  setShowImagePicker(!showImagePicker) } >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableHighlight>
                    <View style={styles.checkBoxText}>
                        <Button style={{ height:100, width : 200}}
                                title={t('Get Image gallery')}
                                onPress={ () => {
                                    handleChoosePhoto(setShowImagePicker);
                                    // setLoadingImage(true);
                                }} />
                        <Button style={{ height:100, width : 200}}
                                title={t('Take a picture')}
                                onPress={ () => {
                                    handleCameraCapture(setShowImagePicker);
                                    // setLoadingImage(true);
                                }} />
                    </View>
                </View>
                </View>
        </Modal>
        }
        {/* {showPoint && <PointModal showPoint={showPoint} setShowPoint={setShowPoint}/>} */}
        </>
        );
      };
