/* eslint-disable prettier/prettier */
import React from 'react';
import { useSelector } from 'react-redux';
// import styled from 'styled-components';
import {
	// Dimensions,
	// ScaledSize,
	View,
	Text,
	// TouchableOpacity,
	TouchableWithoutFeedback,
	// TouchableHighlight,
	// LayoutAnimation,
	// Alert,
	// Modal,
	Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
// import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/en-ca';

import {
	// ListItem,
	Avatar,
	Icon,
} from 'react-native-elements';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import Lightbox from 'react-native-lightbox-v2';

// import _ from 'lodash';
// import { config } from '../config';
// import styles from './Styles';
// import { deleteMsg } from '../store/MsgAction';
// const ChatMsgItem: () => React$Node = ({msgProp, contactProp, thumbs, sender, unreadText, onThumbPress, onImagePress, onRightIconPress, onSwipe}) => {
const ChatMsgItem: () => React$Node = ({msgProp, contactProp, sender, showAvatar, unreadText, window, onImagePress, onLongPress}) => {
	const {t,i18n} = useTranslation();
	const authReducer = useSelector(state => state.authReducer);
	// console.log('ChatMsgItem authReducer ', authReducer);
    // console.log('ChatMsgItem msgProp ', msgProp);
	// componentWillUpdate(){
	// 		LayoutAnimation.spring();
	// }
	const {
		// _id,
		point_amount,
		createdAt,
		image,
		text,
		// charge_id,
		// to_user_id,
		// unread,
		// user,
	} = msgProp;
	// let sender =  msgProp.to_user_id === authReducer.user.toUserID ? true : false;
	// let unreadText =  msgProp.unread === authReducer.user.toUserID ? true : false;
	// console.log('ChatMsgItem  sender', sender);
	// let nonDX =  authReducer.user.nonDX;
	//console.log(" ChatMsgItem  nonDX : ", nonDX);
	return (
		// <Swipeable renderRightActions = {unreadText ? RightActions : null} renderLeftActions = {LeftActions}>
			<TouchableWithoutFeedback onLongPress={()=>{onLongPress(msgProp);}} // onPress={() => {this._onItemPress()}}
				style={{backgroundColor: '#0f0'}}
			>
				{/* <View style={styles.whiteBg}> */}
				{/* <ListItem containerStyle={{width:window.width,
									backgroundColor: '#f0f',
									alignItems:'flex-end',
					}}> */}
				<View style = {{ width:window.width,
								justifyContent: sender ? 'flex-end':'flex-start',
								// backgroundColor: '#ff0',
								flexDirection: 'row', 
								padding: 5,
								margin : 5
							}}>
					{/* {sender ? null :  showAvatar ?
					<Avatar
						rounded
						size="small"
						// source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'reload'}) }
						source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'force-cache'}) }
						//source={require('../icons/no_image_user.png') && {uri:user_image}}
						//source={user_image && {uri:user_image}}
						// title={_id}
						activeOpacity={0.5}
						// onPress={ _.debounce(() => { this._onThumbPress() }, config.BOUNCE)}
						onPress={ () => { onThumbPress(contactProp); } }
					/> : <View style={{width:33}} />
					} */}
						<View style = {{margin:5, padding: 5, borderRadius:8, backgroundColor: sender ? '#64b727' : '#D5D5D5', marginLeft: sender ? 28:null, marginRight: sender ?null:28}}> 
							{image ?
							<View>
								<Lightbox swipeToDismiss={true} activeProps={{width: window.width, height: window.width}} >
									<Image source={{ uri: image }} style={{width: 100, height: 100, borderRadius:8}}
										blurRadius={point_amount > 0  && authReducer.user_info.user_type !== '210' ? 20 : 0}
										// PlaceholderContent={<ActivityIndicator />}
									/>
								</Lightbox>
								{(authReducer.user_info.user_type === '205' || authReducer.user_info.user_type === '206' || authReducer.user_info.user_type === '208' || authReducer.user_info.user_type === '215') ?
									point_amount > 0 ?
										<TouchableWithoutFeedback onPress={()=>{onImagePress(msgProp);}}>
											<View style={{minHeight:100, minWidth:100, position: 'absolute', zIndex: 10, }}>
												<Icon name="lock" type="simple-line-icon" size={90} />
											</View>
										</TouchableWithoutFeedback>
									: point_amount === 0 ?
										<View style={{bottom:98, right: 0}}>
											<View style={{minHeight:25, minWidth:25, position: 'absolute', zIndex: 10}}>
												<Icon name="lock-open" type="simple-line-icon" size={20}/>
											</View>
										</View> 
										: null
									: null }
								{point_amount > 0 && authReducer.user_info.user_type === '210'?
									<View style={{bottom:2, left:40}}>
										<View style={{minHeight:100, minWidth:100, position: 'absolute', zIndex: 10, }}>
											<Icon name='check-all' type='material-community' size={15} color={'#fff'} />
										</View>
									</View>
								: null }
							</View>
							: <Text style={{ color: sender ? '#FFF' : '#5E5E5E', 
											fontWeight: unreadText ? 'bold' : 'normal',
										}}>{text}</Text>
							}
								<Text style={{ color: sender ? '#FFF' : '#787878', 
										   fontWeight: unreadText ? 'bold' : 'normal',
										   fontSize: unreadText ? 11 : 10,
									}}>{moment(new Date(createdAt)).format('H:mm')}</Text>
						</View>
					</View>
				{/* </ListItem> */}
			</TouchableWithoutFeedback>
		// </Swipeable>
	);
};
export default ChatMsgItem;
///////////////////////////////////// end of file ///////////////////////////////////////////////


	// const RightActions = (progress, dragX) => {
	// 	let deletedMsgText = t('Message was deleted');
	// 	return (
	// 		<TouchableOpacity
	// 			onPress={() =>
	// 				Alert.alert(
	// 					t('Remove User'),
	// 					t('Are you sure want to delete?'),
	// 					[
	// 						{text: t('Cancel'), onPress: () => {
	// 							console.log('Cancel Pressed 2');
	// 							style: 'cancel';
	// 							},
	// 						},
	// 						{text: t('OK'), onPress: () => {
	// 							console.log('ChatMsgItem msgProp ', msgProp);
	// 							deleteMsg(msgProp.user._id, msgProp.to_user_id, msgProp._id, deletedMsgText);
	// 						}}
	// 					]
	// 				)
	// 			} >
	// 			<View style={styles.deleteButton}>
	// 				<Icon name="delete-forever" size={30} color={"#333"} />
	// 			</View>
	// 		</TouchableOpacity>
	// 	);};
	// 	const LeftActions = (progress, dragX) => {
	// 		let deletedMsgText = t('Message was deleted');
	// 		return (
	// 			<TouchableOpacity
	// 				onPress={() =>
	// 					Alert.alert(
	// 						t('Remove User'),
	// 						t('Are you sure want to delete?'),
	// 						[
	// 							{text: t('Cancel'), onPress: () => {
	// 								console.log('Cancel Pressed 2');
	// 								style: 'cancel';
	// 								},
	// 							},
	// 							{text: t('OK'), onPress: () => {
	// 								console.log('ChatMsgItem msgProp ', msgProp);
	// 								deleteMsg(msgProp.user._id, msgProp.to_user_id, msgProp._id, deletedMsgText);
	// 							}}
	// 						]
	// 					)
	// 				} >
	// 				<View style={styles.deleteButton}>
	// 					<Icon name="delete-forever" size={30} color={"#333"} />
	// 				</View>
	// 			</TouchableOpacity>
	// 		);};
	
// const showAlert = () => {
// 	Alert.alert(
// 		point_amount + ' ' + t('Point'),
// 		t('Do you want to pay point?'),
// 		[
// 			{text: t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
// 			{text: t('OK'), onPress: () => {
// 				console.log('ChatMessage onPress ');
// 				// this.props.chargingImage(this.props.user, props.currentMessage.point_amount, (outOfBalance, chargeId, goLoginForm, disableUser, axiosNetworkError) => {
// 				chargingImage(authReducer.user, point_amount, (response, axiosNetworkError) => {
// 					console.log('ChatMessage renderMessageImage response: ',response);
// 					if (response.data.response === 'success'){
// 						// updatePointAmount(authReducer.user, msgProp, () => {
// 						// console.log('ChatMessage renderMessageImage updatePointAmount : ');
// 						// })
// 					} else if (response.data.response === 'error'){
// 						Alert.alert(
// 							'Error : ',
// 							response.data.error,
// 							[
// 								{text: t('OK'), onPress: () => console.log('Close  alert'), style: 'cancel'},
// 							]
// 						);
// 					}
// 				});
// 			}}, 	//{text: t('OK'), onPress: () => {
// 		]
// 	);
// };
