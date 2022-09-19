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
    Animated,
    AppState,
    Dimensions,
    View,
    Linking,
    Platform,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    // ActivityIndicator,
    // RefreshControl,
    // ScrollView,
    Text,
    TouchableOpacity,
 } from 'react-native';
//  import { StackActions } from '@react-navigation/native';
 import {
    Avatar,
    Icon,
  } from 'react-native-elements';
 import { useTranslation } from 'react-i18next';
 import ModalDropdown from 'react-native-modal-dropdown';
 import Clipboard from '@react-native-clipboard/clipboard';
 import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
//  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
 import { config } from '../config';
 import { fetchMsg, sendMsg, clearMsg } from '../store/action-creators';
 import ChatMsgItem from './ChatMsgItem';
 import { ImagePickerModal } from './ImagePickerModal';
 import { PointModal } from './PointModal';
 import { UserListModal } from './UserListModal';
 import {
   chargingImage,
   updatePointAmount,
   saveUnsentMsg,
   getUnsentText,
   toggleBlockUser,
   checkBlockedUser,
   checkGotBlocked,
   deleteMsg,
   clearBadge,
} from '../store/MsgAction';
 import {
    removeChildAction,
} from '../store/ListAction';
 import styles from './Styles';

// export const Login: ({navigation:navigation}) => React.FC = ({navigation:navigation}):JSX.Element => {
const ChatMsg: ({route, navigation}) => React$Node = ({route, navigation}) => {
  const {t,i18n} = useTranslation();
  const fetchDispatch = useDispatch();
  const sendDispatch = useDispatch();
  // const clearDispatch = useDispatch();
  const authReducer = useSelector(state => state.authReducer);
  const msgReducer  = useSelector(state => state.msgReducer);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalVisible, setModalVisible]       = React.useState<boolean | undefined>(false);
  const [showImagePicker, setShowImagePicker] = React.useState<boolean | undefined>(false);
  const [showPoint, setShowPoint]             = React.useState<boolean>(false);
  const [imageData, setImageData]             = React.useState<object | undefined>({});
  const [msgProps, setMsgProps]               = React.useState<object | undefined>({});
  const [refreshingState, setRefreshingState] = React.useState<boolean | undefined>(false);
  const [blockedUserState, setBlockedUserState] = React.useState<boolean | undefined>(false);
  const [gotBlockedState, setGotBlockedState] = React.useState<boolean | undefined>(false);
  const [blockedUserParam, setBlockedUserParam] = React.useState<string | undefined>(t('Block User'));
  const [blockedParam, setBlockedParam] = React.useState<string | undefined>('');
  const [gotBlockedParam, setGotBlockedParam] = React.useState<string | undefined>(t(''));
  const [inputText, setInputText]   = React.useState<string | undefined>('');
  const [inputHeight, setInputHeight]   = React.useState<number | undefined>(18);
  const [unsentText, setUnsentText] = React.useState<string | undefined>('');
  // const [keyboardHeight, setKeyboardHeight] = React.useState(-50);
  // const _keyboardDidShow = () => setKeyboardHeight(Platform.OS === 'ios' ? 260 : 0);
  // const _keyboardDidHide = () => setKeyboardHeight(0);
	const window:ScaledSize = Dimensions.get('window');
  // console.log('ChatMsg msgReducer ', msgReducer);
  // console.log('ChatMsg route ', route);
  React.useLayoutEffect(() => {
    // Alert.alert('ChatMsg route.params.navigation_params ', JSON.stringify(route.params.navigation_params));
    // console.log('ChatMsg route.params.navigation_params ', route.params.navigation_params);
    // console.log('ChatMsg navigation ', navigation);
    // console.log('ChatMsg useLayoutEffect authReducer.user ', authReducer.user);
    navigation.setOptions({
      // tabBarStyle: { display: 'none' },
      headerLeft : ({color}) => (
        <TouchableOpacity onPress = {() => navigation.goBack()}
            style={{
              width: 100,
              height : 50,
              alignItems: 'flex-start',
              justifyContent: 'center',
              // backgroundColor: '#f0f',
        }}>
        <Icon name = "arrow-left" type="simple-line-icon" size={22} color={color} />
        </TouchableOpacity>),
      // headerLeft : ({color}) => <Icon name = "arrow-left" type="simple-line-icon" size={22} color={color} onPress = {() => navigation.navigate('RecentChatList') } style={{marginLeft:10}}/>,
      // headerLeft : ({color}) => <Icon name = "arrow-left" type="simple-line-icon" size={22} color={color} onPress = {() => navigation.dispatch(StackActions.pop(1)) } style={{marginLeft:10}}/>,
      headerTitle: 
      () => (
        <>
          <Avatar
              rounded
              size="small"
              // source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'reload'}) }
              // source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'force-cache'}) }
              // source={(route.params.navigation_params.user_image === '') ? require('../icons/no_image_user.png') : (route.params.navigation_params.user_image && {uri:route.params.navigation_params.user_image,cache:'force-cache'}) }
              source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'force-cache'}) }
              //source={require('../icons/no_image_user.png') && {uri:user_image}}
              //source={user_image && {uri:user_image}}
              // title={_id}
              activeOpacity={0.5}
              // onPress={ _.debounce(() => { this._onThumbPress() }, config.BOUNCE)}
              onPress={ () => { _onThumbPress(route.params.navigation_params); } }
          />
          <TitleStyle>{route.params.navigation_params.user_name}</TitleStyle>
        </>),

      // source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'force-cache'}) }
      // title: route.params.navigation_params.user_name,  //+ '22',
      headerRight: ({color}) => (
        <ModalDropdown
            options={ authReducer.user.nonDX ? [blockedUserParam, t('Remove User'), t('Report User')] : [blockedUserParam] }
            // options={ [blockedUserParam, t('Remove User'), t('Report User')] }
            onSelect={ (index, value) => modalSelection(index, value) }
            dropdownStyle={{
              height: authReducer.user.nonDX  ? 42 * 3 : 45,
              borderRadius: 6,
              backgroundColor: "#333",
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: { width: 5, height: 5 },
              shadowRadius: 20,
              shadowOpacity: 1,
              padding: 8
            }}
            dropdownTextStyle={{
              //fontFamily: "poppins-500",
              fontSize: 16,
              fontStyle: "normal",
              letterSpacing: 0,
              textAlign: "left",
              color: "#fff",
              backgroundColor: "#333",
            }}
            dropdownTextHighlightStyle={{
              color: '#ccc'
            }}
        >
        <Icon name = "menu" type="simple-line-icon" size={22} color={color} style={{marginRight:10}}/>
      </ModalDropdown>
      ),
      headerStyle: { backgroundColor: '#efeff2'},
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold'},
    });
  }, [blockedUserParam]);
  // }, [navigation, blockedUserParam, route.params.navigation_params.user_name]);

  const _onThumbPress = (contact) => {
    // console.log('ChatMsg _onThumbPress contact: ', contact);
    setSelectedItem(contact);
    setModalVisible(true);
    // console.log('ChatMsg _onThumbPress contact: ', modalVisible);
};

  const modalSelection = (index, value) => {
    console.log('ChatMessage modalSelection index: ',index, ' value : ', value);
    // setTimeout( () => {
      switch (index) {
        case 0 : FuncToggleBlockUser();    break;
        case 1 : FuncRemoveChildAction();  break;
        case 2 : FuncReportUser();         break;
      }
    // },100);
  };

  React.useEffect( () => {
    // console.log('ChatMessage inputText 11: ', inputText);
    // console.log('ChatMsg authReducer.user ', authReducer.user);
    // console.log('ChatMsg route.params.navigation_params ', route.params.navigation_params);
    fetchDispatch(fetchMsg(authReducer.user, authReducer.user_info, route.params.navigation_params));
    setRefreshingState(false);
    getUnsentText(authReducer.user, (unsentText) => {
        if (unsentText){
            setUnsentText(unsentText);
            // console.log('ChatMsg unsentText ', unsentText);
                setInputText(unsentText.concat(inputText));
            }
    });
    // checkBlockedUser(authReducer.user.userID , this.props.navigation.state.params.navigation_param.user_id, (blocked) => {
    checkBlockedUser(authReducer.user, (blocked) => {
      // console.log('ChatMsg checkBlockedUser blocked : ',blocked);
      setBlockedUserParam(blocked ? t('Unblock User') : t('Block User') );
      setBlockedParam(blocked ? ' (' + t('Blocked') + ')'  : '' );
      setBlockedUserState(blocked);
      // console.log('ChatMessage componentDidMount this.props.navigation.state.params.blockedUserParam : ', this.props.navigation);
      // this.props.navigation.setParams({ DX_array : [this.props.navigation.state.params.removeUserParam, this.props.navigation.state.params.blockedUserParam, this.props.navigation.state.params.reportUserParam] });
    });
    checkGotBlocked(authReducer.user, (gotBlocked) => {
      setGotBlockedParam(gotBlocked ? ' (' + t('Got Blocked') + ')'  : '' );
      //console.log('ChatMessage checkGotBlocked gotBlocked : ',gotBlocked);
      setGotBlockedState(gotBlocked);
    });
    return () => {
        clearBadge(authReducer.user);
        // console.log('ChatMsg return inputText 11', inputText);
        // clearDispatch(clearMsg());
        // console.log('ChatMsg navigation', navigation);
        // navigation.goBack();
    };
  }, []);

  // React.useEffect(() => {
  //   Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
  //   Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  //   return () => {  // cleanup function
  //     Keyboard.removeAllListeners('keyboardDidShow');
  //     Keyboard.removeAllListeners('keyboardDidHide');
  //   };
  // }, []);

  const stateRef = React.useRef();

  React.useEffect( () => {
      // console.log('ChatMsg return inputText 22', inputText);
      stateRef.current = inputText;
    }, [inputText]);

  React.useEffect( () => {
      return () => {
          // console.log('ChatMsg return inputText 33', stateRef.current);
          FuncSaveUnsentMsg(stateRef.current);
      };
    }, []);

  React.useEffect( () => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {  // || nextAppState == 'inactive'){ 
          navigation.goBack();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  let nonDX =  authReducer.user.nonDX;
  let thumbs = '';
  // let flashImg = '';
  if (route.params.navigation_params.user_image){
    // let img = route.params.navigation_params.user_image;
    let user_name = route.params.navigation_params.user_name;
      thumbs = (nonDX) ? route.params.navigation_params.user_image : route.params.navigation_params.user_image.toString().replace("/live/", "/thumbs/");
      // thumbs = config.THUMB_URL + thumbs;
      // thumbs =  thumbs.includes('WebArchive')  || !thumbs.includes('firebasestorage.googleapis.com') ? config.THUMB_URL + thumbs : thumbs;	// + ',cache:"reload"';//	 + '?random_number=' + new Date().getTime();
      thumbs = thumbs ? thumbs.includes('WebArchive') || !thumbs.includes('firebasestorage.googleapis.com') ? (authReducer.user.userType === '210') ? config.THUMB_URL + '/WebArchive/Viewers/' + user_name + '/thumbs/LinkedImage.jpg' : 
                                                                                                                                                      config.THUMB_URL + '/WebArchive/' + user_name + '/live/LinkedImage.jpg' : thumbs : thumbs;   
                                                                                                                      
    // let img = (item.user_image) ? config.THUMB_URL+item.user_image.toString().replace('/live/', '/thumbs/'):'';

      //console.log('ChatMsgItem renderAvatar thumbs : ', thumbs);
    // flashImg = (nonDX) ? route.params.navigation_params.user_image : route.params.navigation_params.user_image.toString().replace("/live/", "/flash/");
    // 	// flashImg = config.THUMB_URL + flashImg;
    // 	flashImg =  flashImg.includes('WebArchive') ? config.THUMB_URL + flashImg : flashImg;	// + ',cache:"reload"';//	 + '?random_number=' + new Date().getTime();
    // 	//console.log('ChatMsgItem renderAvatar flashImg : ', flashImg);
  }

  const FuncSaveUnsentMsg = (inputText) => {
    // console.log('ChatMsg FuncSaveUnsentMsg inputText ',inputText);
        // resetMessage(authReducer.user);
        saveUnsentMsg(authReducer.user, inputText, (success) => {
          if (success) {
            // console.log('ChatMsg FuncSaveUnsentMsg success ',success);
              // setInputText('');
              // setUnsentText('');
              // this.setState({runOnce : false});
          } 
        } );
  };

  const FuncToggleBlockUser = () => {
    console.log('ChatMessage FuncToggleBlockUser blockedUserState 11: ',blockedUserState);
    // console.log('ChatMessage FuncToggleBlockUser authReducer.user : ',authReducer.user);
    if (!blockedUserState){
      Alert.alert(
        t('Block User Title'),	//'Invite User',
        t('Do you want to block user?'),	//'Do you want to invite this user ?',
        [
          {text: t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: t('OK'), onPress: () => {
            toggleBlockUser(authReducer.user, blockedUserState, (blocked) => {
              // console.log('ChatMessage FuncToggleBlockUser blocked : ',blocked);
              setBlockedUserState(blocked);
              setBlockedUserParam(blocked ? t('Unblock User') : t('Block User') );
              // setBlockedParam(blocked ? ' (' + t('Blocked') + ')'  : '' );
              // console.log('ChatMessage FuncToggleBlockUser blockedUserState 33: ',blockedUserState);
            });
          }},   //{text: t('OK'), onPress: () => {
        ]
      );
    } else {
      toggleBlockUser(authReducer.user, blockedUserState, (blocked) => {
        setBlockedUserState(blocked);
        setBlockedUserParam(blocked ? t('Unblock User') : t('Block User') );
        // setBlockedParam(blocked ? ' (' + t('Blocked') + ')'  : '' );
        //console.log('ChatMessage FuncToggleBlockUser blockedUserState : ',blockedUserState);
      });
    }
  };

  const FuncRemoveChildAction = () => {
    // console.log('ChatMessage buttonOnPress this.props.user.userID : ',this.props.user.userID);
    // console.log('ChatMessage buttonOnPress this.navigation.state.params.toggleButtonParam', this.props.navigation.state.params.toggleButtonParam);
    const {
      userID,
      toUserID,
      userType,
    } = authReducer.user;

    // if (this.props.navigation.state.params.toggleButtonParam){
    //   //let user_name_phrase = t('You just added ') +
    //   this.props.addChildAction( userID, toUserID , userType, this.props.navigation.state.params.navigation_param.user_name, this.props.navigation.state.params.navigation_param.user_name+this.props.t(' had just been added'), () => {
    //     this.props.navigation.goBack();
    //   });
    // } else {
        Alert.alert(
          t('Remove User'),	//'Invite User',
          t('Do you want to remove user?'),	//'Do you want to invite this user ?',
          [
            {text: t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: t('OK'), onPress: () => {
                //console.log('OK Pressed = this.props.contactProp : ', this.props.contactProp);
                removeChildAction( userID, userType, toUserID, () => {
                  navigation.goBack();
                });
            }},  //{text: t('OK'), onPress: () => {
          ]
        );
    // }
  };

  const FuncReportUser = () => {
    Linking.openURL('mailto:' + config.mailTo + '?subject=' + t('Report User') + '&body=' + t('body') );
    // title="report@lovapp.chat"
  };

  const _onImagePress = (msgProp) => {
    // console.log('ChatMessage _onImagePress msgProp: ',msgProp);
    Alert.alert(
			msgProp.point_amount + ' ' + t('Point'),
			t('Do you want to pay point?'),
			[
				{text: t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: t('OK'), onPress: () => {
					console.log('ChatMessage onPress ');
					// this.props.chargingImage(this.props.user, props.currentMessage.point_amount, (outOfBalance, chargeId, goLoginForm, disableUser, axiosNetworkError) => {
					chargingImage(authReducer.user, msgProp.point_amount, (response, axiosNetworkError) => {
						// console.log('ChatMessage _onImagePress response: ',response);
						if (response.data.response === 'success'){
							updatePointAmount(authReducer.user, msgProp, () => {
							// console.log('ChatMessage renderMessageImage updated PointAmount : ');
							});
						} else if (response.data.response === 'error'){
							Alert.alert(
								'Error : ',
								response.data.error,
								[
									{text: t('OK'), onPress: () => console.log('Close  alert'), style: 'cancel'},
								]
							);
						}
					});
				}}, 	//{text: t('OK'), onPress: () => {
			]
		);
  };

  const _onLongPress = (message) => {
    setMsgProps(message);
    if (refActionSheet.current) refActionSheet.current.show();
    console.log('ChatMessage onLongPress message.unread : ', message.unread);
  };

  const sendMessage = () => {
    // console.log('ChatMsg sendMessage authReducer : ',authReducer);
    // console.log('ChatMsg sendMessage route.params.navigation_params ', route.params.navigation_params);
    let msg = Object();
    msg.text = inputText;
    // console.log('ChatMsg sendMessage msg : ',msg);
    sendDispatch(sendMsg(msg, authReducer.user, authReducer.user_info, route.params.navigation_params));
    setInputText('');
  };

  let runOnce = true;
  let previousSender = false;
  let showAvatar = true;
  const _renderItem = ({item}) => {
      // let img = (item.user_image)?config.THUMB_URL+item.user_image.toString().replace('/live/', '/thumbs/'):''
      // console.log('ChatMsg _renderItem item.to_user_id :', item.to_user_id);
      // console.log('ChatMsg _renderItem thumbs :', thumbs);
      // let debounce = true;
      // const _onThumbPress = (contact) => {
      //     // console.log('ChatMsg _onThumbPress contact: ', contact);
      //     setSelectedItem(contact);
      //     setModalVisible(true);
      //     // console.log('ChatMsg _onThumbPress contact: ', modalVisible);
      // };
      // let sender =  msgProp.to_user_id === authReducer.user.toUserID ? true : false;
      // let unreadText =  msgProp.unread === authReducer.user.toUserID ? true : false;

      // console.log('ChatMsg  authReducer.user', authReducer.user.userID);
      let sender =  item.to_user_id === route.params.navigation_params.user_id ? true : false;
      let unreadText =  item.unread === route.params.navigation_params.user_id ? true : false;
      // console.log('ChatMsg sender ======', sender);
      // console.log('ChatMsg msgProp.to_user_id', item.to_user_id);
      // console.log('ChatMsg msgProp.text', item.text);
        // if (runOnce) {
        //   // console.log('ChatMsg runOnce', runOnce);
        //   previousSender = sender;
        //   // console.log('ChatMsg previousSender once', previousSender);
        //   runOnce = false;
        // } else {
        //   if (previousSender === sender) {
        //     showAvatar = false;
        //   } else {
        //     showAvatar = true;
        //     previousSender = sender;
        //     // runOnce = true;
        //     // console.log('ChatMsg previousSender', previousSender);
        //   }
        // }
        // console.log('ChatMsg showAvatar', showAvatar);
      return (
          <ChatMsgItem
            msgProp			      = {item}
            contactProp       = {route.params.navigation_params}
            // thumbs			      = {thumbs}
            sender			      = {sender}
            showAvatar			  = {showAvatar}
            unreadText			  = {unreadText}
            window            = {window}
            // onThumbPress		  = { (contact) => _onThumbPress(contact) }
            onImagePress		  = { (msgProp) => _onImagePress(msgProp) }
            onLongPress		    = { (msgProp) => _onLongPress(msgProp) }
            // onSwipe		        = { (msgProp) => _onSwipe(msgProp) }
          />
      );
  };
  const refActionSheet = React.useRef(null);
  const options_unread = [
    t('Copy'),  // <Text style={{color:'gray', backgroundColor:'white'}}>{t('Copy')}</Text>,
    t('Delete'),  // <Text style={{color:'gray', backgroundColor:'white'}}>{t('Delete')}</Text>,
    t('Cancel'),  // <Text style={{color:'gray', backgroundColor:'white'}}>{t('Cancel')}</Text>,
  ];
  const options_read = [
    t('Copy'),
    t('Cancel'),
  ];
    // console.log('ChatMsg msgReducer ', msgReducer);
    // console.log('ChatMsg inputHeight ', inputHeight);
  return (
    // <KeyboardAwareScrollView>
    <KeyboardAvoidingView style={styles.loginSection}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -300}
          enabled
      >
    {/* <Animated.View style={{flex:1, paddingBottom: keyboardHeight}}> */}
      <FlatList
          data={msgReducer.messages}
          keyExtractor={item => item._id}
          // numColumns={numColumns}  //for thumb grid
          renderItem={_renderItem}
          showsHorizontalScrollIndicator={false}
          inverted
          maxToRenderPerBatch={8}
          windowSize={12}
          // initialScrollIndex={msgReducer.messages.length - 1}
      />
        <FrameContainerStyle windowWidth={Dimensions.get('window').width} windowHeight={inputHeight}>
          <SearchContainerStyle windowHeight={inputHeight}>
            <Icon name="plus" type="simple-line-icon" color="#807F83" onPress = { () => setShowImagePicker(true) } />
						<TextInputStyle
							placeholder = {
                msgReducer.disableUser ? t('User got disabled') :
                blockedUserState ? t('You blocked user') :
                gotBlockedState ? t('You have been blocked') :
                msgReducer.outOfBalance ? t('outOfBalance') :
                msgReducer.user.skip_charging_once  ? t('First Message Is Free') :
                t('placeholder')}
							placeholderTextColor = '#807F83'
              editable = {msgReducer.disableUser ? false :
                          blockedUserState ? false :
                          gotBlockedState ? false : true}
							selectTextOnFocus = {true}
							selectionColor = "#000"	//highlight and cursor color
							onChangeText = {setInputText}		//{this.onPasswordChange}
							value = {inputText}
              multiline = {true}
              onContentSizeChange={(event) => {
                // console.log('height ',event.nativeEvent.contentSize.height)
                if (event.nativeEvent.contentSize.height <= 144)
                  setInputHeight(event.nativeEvent.contentSize.height <= 18 ? 40 : 18 + event.nativeEvent.contentSize.height )
              }}
							// onSubmitEditing = {sendMessage}
              // blurOnSubmit={true}
							// onSubmitEditing = {() => Keyboard.dismiss()}
							returnKeyType = {'next'}
							autoFocus = {false}
							autoCorrect = {false}
							autoCapitalize = "none"
							underlineColorAndroid = "transparent"
						/>
            <TouchableOpacity onPress = { () => { if (inputText !== '') sendMessage(); }}>
                <ViewTextStyle><TextStyle> {t('Send')} </TextStyle></ViewTextStyle>
            </TouchableOpacity>
            {/* <Button title={t('Send')} buttonStyle={{height:34, marginBottom: 10, backgroundColor:"#807F83", borderRadius:8 }} onPress = { () => { if (inputText !== '') sendMessage(); }}/> */}
            <ActionSheet
              ref={refActionSheet}  // ref={o => this.ActionSheet = o}
              title={''}
              options={msgProps.unread ? options_unread : options_read}
              cancelButtonIndex={msgProps.unread ? 2 : 1}
              // destructiveButtonIndex={0}
              onPress={(index) => {
                switch (index) {
                  case 0:
                    Clipboard.setString(msgProps.text);
                    break;
                  case 1:
                      if (msgProps.unread) deleteMsg(msgProps.user._id, msgProps.to_user_id, msgProps._id, t('Message was deleted'));
                    break;
                  default:
                    break;
                }
              }}
            />
					</SearchContainerStyle>
        </FrameContainerStyle>
      {selectedItem && <UserListModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedItem={selectedItem}  />}
      {showImagePicker && <ImagePickerModal showImagePicker={showImagePicker} setShowImagePicker={setShowImagePicker} sendDispatch={sendDispatch} sendMsg={sendMsg} showPoint={showPoint} setShowPoint={setShowPoint} imageData={imageData} setImageData={setImageData} nav_param={route.params.navigation_params}/>}
      {showPoint && <PointModal showPoint={showPoint} setShowPoint={setShowPoint} imageData={imageData} setImageData={setImageData}/>}
    {/* </Animated.View> */}
    </KeyboardAvoidingView>
  );
};

const FlatList = styled.FlatList`
`;
const FrameContainerStyle = styled.View`
    padding-top: 30px;
    padding-bottom: 40px;
    padding-left: 10px;
    padding-right: 10px;
    width: ${props => props.windowWidth}px;
    height: ${props => props.windowHeight}px;
    background-color: #efeff2;
    justify-content: center;
`;
const SearchContainerStyle = styled.View`
    flex-direction: row;
    padding: 7px;
    height: ${props => props.windowHeight}px;
    backgroundColor: #efeff2;
    justify-content: center;
    align-self: center;
    borderRadius: 10px;
    borderWidth: 1px;
    borderColor: #807F83;
`;
const TextInputStyle = styled.TextInput`
    font-size: 14px;
    color: #000;
    background-color : #fff;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 18px;
    flex: 1;
`;
const ViewTextStyle = styled.View`
    background-color: #807F83;
    border-radius: 8px;
    justify-content: center;
`;
const TextStyle = styled.Text`
    color: #fff; 
    font-weight: bold; 
    padding :5px;
`;
const TitleStyle = styled.Text`
    color: #000; 
    font-weight: bold; 
    padding-left :10px;
`;

// const in_styles = {
// 	searchInputStyle: {
// 		fontSize: 14,
// 		color: '#000', //no effect
// 		backgroundColor : '#fff',
//     // justifyContent: 'center',
//     // alignSelf: 'center',
// 		// borderRadius: 10,
// 		// borderWidth: 1,
// 		// borderColor: '#807F83',
// 		// marginTop: -5,
//     paddingTop: 0,
//     paddingBottom: 0,
//     marginLeft: 5,
//     marginRight: 5,
// 		lineHeight: 18,
//     // textAlignVertical: 'center',
// 		// width: 200, //textInputWidth,
//     flex: 1,
//   },
// };
export default ChatMsg;

	// const _onSwipe = (msgProp, progress, dragX) => {
    // const _onSwipe = (msgProp) => {
    //   console.log('ChatMsg _onSwipe 2');
    //   return (
    //     <TouchableOpacity
    //       onPress={() =>
    //         Alert.alert(
    //           t('Remove User'),
    //           t('Are you sure want to delete?'),
    //           [
    //             {text: t('Cancel'), onPress: () => {
    //               console.log('Cancel Pressed 2');
    //               style: 'cancel';
    //               }
    //             },
    //             {text: t('OK'), onPress: () => {
    //                 console.log('ChatMsg msgProp 2 ', msgProp);
    //               // deleteMsg(message.user._id, message.to_user_id, message._id, deletedMsgText);
    //               // removeChildAction(authReducer.user.userID, authReducer.user.userType, msgProp.user_id, () => {
    //               // 	initContactListDispatch(initContactList(authReducer.user.userID, authReducer.user.userType));
    //               // 	initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType));
    //               // });
    //             }}
    //           ]
    //         )
    //       } >
    //       <View style={styles.deleteButton}>
    //         <Icon name="delete-forever" size={30} color={"#333"} />
    //       </View>
    //     </TouchableOpacity>
    //   );};