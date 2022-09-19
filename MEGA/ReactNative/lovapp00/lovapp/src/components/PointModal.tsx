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
    View,
    Text,
    Modal,
    TouchableHighlight,
 } from 'react-native';
 import {
    Icon,
    CheckBox,
  } from 'react-native-elements';
 import { useTranslation } from 'react-i18next';
 import styles from './Styles';
 import { storeImage  } from '../store/action-creators';

export const PointModal = ({showPoint, setShowPoint,imageData, setImageData}) => {
    const {t,i18n} = useTranslation();
    const storeImageDispatch = useDispatch();
    // const sendDispatch = useDispatch();
    const authReducer = useSelector(state => state.authReducer);
    const msgReducer = useSelector(state => state.msgReducer);
    console.log('PointModal  authReducer: ', authReducer);
    const [checked, setChecked] = React.useState<boolean | undefined>(false);
    console.log('PointModal  showPoint: ', showPoint);
    return (
        <Modal animationType="fade" transparent={true} visible={showPoint}
                onRequestClose={() => { Alert.alert('Modal has been closed.'); }}>
            <View style={styles.modalOuter}>
            <View style={styles.modalInner}>
                <TouchableHighlight
                    underlayColor='#fff'
                    style={styles.modalClose}
                    onPress={() => {
                        setShowPoint(!showPoint);
                    }}>
                    <Text style={styles.closeText}>X</Text>
                </TouchableHighlight>

                <View style={styles.checkBoxText}>
                    <Text style={styles.labelText}>{t('How many point')}</Text>
                    <CheckBox center title={t('Free')} checkedIcon="dot-circle-o" uncheckedIcon='circle-o' checked={false} size={10}
                        onPress={ () => { setChecked(!checked);
                                        storeImageDispatch(storeImage(authReducer, imageData, 0));
                                        setShowPoint(false);
                    }}/>
                    <CheckBox center title={'1 ' + t('Point')} checkedIcon="dot-circle-o" uncheckedIcon='circle-o' checked={false} size={10}
                        onPress={ () => { setChecked(!checked);
                                        storeImageDispatch(storeImage(authReducer, imageData, 1));
                                        setShowPoint(false);
                    }}/>
                    <CheckBox center title={'2 ' + t('Point')} checkedIcon="dot-circle-o" uncheckedIcon='circle-o' checked={false} size={10}
                        onPress={ () => { setChecked(!checked);
                                        storeImageDispatch(storeImage(authReducer, imageData, 2));
                                        setShowPoint(false);
                    }}/>
                    <CheckBox center title={'3 ' + t('Point')} checkedIcon="dot-circle-o" uncheckedIcon='circle-o' checked={false} size={10}
                        onPress={ () => { setChecked(!checked);
                                        storeImageDispatch(storeImage(authReducer, imageData, 3));
                                        setShowPoint(false);
                    }}/>
                    <CheckBox center title={'4 ' + t('Point')} checkedIcon="dot-circle-o" uncheckedIcon='circle-o' checked={false} size={10}
                        onPress={ () => { setChecked(!checked);
                                        storeImageDispatch(storeImage(authReducer, imageData, 4));
                                        setShowPoint(false);
                    }}/>
                    <CheckBox center title={'5 ' + t('Point')} checkedIcon="dot-circle-o" uncheckedIcon='circle-o' checked={false} size={10}
                        onPress={ () => { setChecked(!checked);
                                        storeImageDispatch(storeImage(authReducer, imageData, 5));
                                        setShowPoint(false);
                    }}/>
                </View>
            </View>
            </View>
        </Modal>
        );
      };