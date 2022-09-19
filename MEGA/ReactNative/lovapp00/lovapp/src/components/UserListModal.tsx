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
    TextInput,
    TouchableHighlight,
    Image,
 } from 'react-native';
 import { Icon } from 'react-native-elements';
 import { useTranslation } from 'react-i18next';
 import { config } from '../config';
 import styles from './Styles';
 import { saveNickName } from '../store/ListAction';
 import { initContactList , initRecentChatList } from '../store/action-creators';

 const setFlashImg = (flashImg) => {
    if (flashImg){
      // flashImg = (this.props.user.nonDX) ? flashImg : flashImg.toString().replace("/live/", "/flash/");
      // flashImg = config.THUMB_URL + flashImg;
      flashImg =  flashImg.includes('WebArchive') ? config.THUMB_URL + flashImg : flashImg;	// + ',cache:"reload"';//	 + '?random_number=' + new Date().getTime();
      //console.log('RecentChatListItem renderAvatar flashImg : ', flashImg);
    }
    return (flashImg);
  };

export const UserListModal = ({modalVisible, setModalVisible, selectedItem}) => {
    // console.log('UserListModal  selectedItem: ', selectedItem);
    // console.log('UserListModal  modalVisible: ', modalVisible);
    const {t,i18n} = useTranslation();
    const userReducer = useSelector(state => state.authReducer.user);
    // console.log('UserListModal  userReducer: ', userReducer);
    const [editable, setEditable] = React.useState<boolean | undefined>(false);
    const [nickName, setNickName] = React.useState<string | undefined>('');
    const initContactListDispatch = useDispatch();
	const initRecentChatListDispatch = useDispatch();
    return (
          <Modal animationType="fade" transparent={true} visible={modalVisible}
                  onRequestClose={() => {
                      setEditable(false);
                      setNickName('');
                      alert('Modal has been closed.');
                  }}>
                <View style={styles.modalOuter}>
                <View style={styles.modalInner}>
                    <TouchableHighlight underlayColor='#fff' style={styles.modalClose}
                        onPress={() => { setModalVisible(!modalVisible); setNickName(''); }} 
                        >
                        <Text style={styles.closeText}>X</Text>
                    </TouchableHighlight>
                    <View style={styles.modalTop}>
                        <Image source={(selectedItem.user_image) ? (setFlashImg(selectedItem.user_image) && {uri:setFlashImg(selectedItem.user_image),cache:'reload' } ) : (require('../icons/no_image_user.png')) } style={styles.profileImage} />
                    </View>
                    <View  style={styles.profileBottomSection}>
                        <View style={styles.profileLeft}>
                            <Text style={styles.labelText}>{t('Name')}</Text>
                            <Text style={styles.labelText}>{t('Nick Name')}</Text>
                            <Text style={styles.labelText}>{t('Info')}</Text>
                        </View>
                        <View style={styles.profileRight}>
                            <Text style={styles.modalProfileText}>{selectedItem.user_name}</Text>
                            {editable ?		
                                <View style={{ flexDirection : 'row' }}>
                                    <TextInput 
                                            style={styles.textInput}
                                            placeholder = {t('Nick Name')}
                                            placeholderTextColor = '#4776AD' 
                                            autoCapitalize = 'none'
                                            maxLength = {20}
                                            underlineColorAndroid="transparent"
                                            onChangeText = {setNickName}
                                        >
                                    </TextInput>
                                    <Icon iconStyle={styles.saveButton} name='done' type='material' color='#069806'	size={20} //raised
                                        onPress = { () => { setEditable(false) 
                                            if(nickName){
                                                selectedItem.lower_case_name = nickName;
                                                saveNickName(userReducer.userID, selectedItem.user_id, nickName, () => {
                                                    initContactListDispatch(initContactList(userReducer.userID, userReducer.userType));
                                                    initRecentChatListDispatch(initRecentChatList(userReducer.userID, userReducer.userType));
                                                })
                                            }
                                        }}
                                    />
                                </View>
                                :
                                <View style={{ flexDirection : 'row' }}>
                                    <Text style={styles.modalProfileText}>{selectedItem.lower_case_name}</Text>
                                    <Icon iconStyle={styles.editButton} name='edit' type='material' color='#4776AD' size={16}
                                        onPress = { () => { setEditable(true) } } />
                                </View>
                            }
                            <Text style={styles.modalProfileText}>{selectedItem.user_message}</Text>
                        </View>
                    </View>
                </View>
                </View>
            </Modal>
        )
      }