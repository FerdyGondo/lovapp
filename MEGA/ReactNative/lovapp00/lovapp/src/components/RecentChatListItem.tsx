/* eslint-disable prettier/prettier */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
	LayoutAnimation,
	Dimensions,
	ScaledSize,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Alert,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/en-ca';
import {
	ListItem,
	Avatar,
	Badge,
	Icon,
} from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import _ from 'lodash';
import { config } from '../config';
import { removeChildAction } from '../store/ListAction';
import styles from './Styles';
import { initContactList , initRecentChatList } from '../store/action-creators';

const RecentChatListItem: () => React$Node = ({  navigation, contactProp, thumbs, onItemPress, onThumbPress, deleteItem, onRightIconPress }) => {
// const RecentChatListItem: () => React$Node = ({  navigation, contactProp, onThumbPress, onRightIconPress }) => {
	const {t,i18n} = useTranslation();
	const window:ScaledSize = Dimensions.get('window');
	const authReducer = useSelector(state => state.authReducer);
	const listReducer = useSelector(state => state.listReducer);
	const inviteUserDispatch = useDispatch();
	const [nonDX, setNonDX] = React.useState<boolean | undefined>(false);
	// const initContactListDispatch = useDispatch();
	// const initRecentChatListDispatch = useDispatch();
	// console.log('RecentChatListItem authReducer.user ', authReducer.user);
    // console.log('RecentChatListItem contactProp ', contactProp);
	const {
		user_name,
		lower_case_name,
		user_id,
		user_image,
		user_message,
		last_msg_timestamp,
		last_msg,
		badge,
		invited,
		user_status,
		test_flag,
	} = contactProp;
	let badgeNumber = badge;
	// var ts = moment(last_msg_timestamp).unix();
	// var m = moment.unix(last_msg_timestamp);
	//console.log('RecentChatListItem render last_msg_timestamp ::::::::: ', last_msg_timestamp);
	//console.log('RecentChatListItem render new Date(last_msg_timestamp).toLocaleString() : ', new Date(last_msg_timestamp).toLocaleString());
	//console.log('RecentChatListItem render moment(Date(last_msg_timestamp)) : ', moment(Date(last_msg_timestamp)));
	//let formattedDate = moment(Date(last_msg_timestamp)).format('MM/DD HH:mm');
	let formattedDate = last_msg_timestamp === 999 ? '' : moment(new Date(last_msg_timestamp)).locale(RNLocalize.getCountry === 'ja' ? 'ja' : 'en').format('M/D H:mm');
	// console.log('RecentChatListItem render RNLocalize.getCountry : ', RNLocalize.getCountry);
	//console.log('RecentChatListItem render formattedDate : ', formattedDate);
	// let debounce = true;
	React.useEffect( () => {
		setNonDX(authReducer.user.nonDX);
	},[listReducer]);

	const RightActions = (progress, dragX) => {
		return (
			<TouchableOpacity
				onPress={() =>
					Alert.alert(
						t('Remove User'),
						t('Are you sure want to delete?'),
						[
							{text: t('Cancel'), onPress: () => {
								console.log('Cancel Pressed 2');
								style: 'cancel';
								},
							},
							{text: t('OK'), onPress: () => {
								deleteItem();
								removeChildAction(authReducer.user.userID, authReducer.user.userType, contactProp.user_id, () => {
									// initContactListDispatch(initContactList(authReducer.user.userID, authReducer.user.userType));
									// initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType));
								});
							}},
						]
					)
				} >
				<View style={styles.deleteButton}>
					<Icon name="delete-forever" size={30} color={'#333'} />
				</View>
			</TouchableOpacity>
		);
	};
	// React.useEffect(() => {
	// 	// console.log('RecentChatListItem contactProp',contactProp);
	// }, [contactProp]);
	// console.log('RecentChatListItem badgeNumber',user_name + ' ' + badgeNumber);
	// LayoutAnimation.spring();

	return (
		<Swipeable renderRightActions={RightActions} >
			<TouchableWithoutFeedback
				onPress={() => {
					onItemPress(contactProp, navigation);
					// navigation.navigate('ChatMsg', { navigation_params : contactProp });
				}} >
				{/* <View style={styles.whiteBg}> */}
				<ListItem topDivider bottomDivider style={{width:window.width}} >
					<Avatar
						rounded
						size="medium"
						source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'reload'}) }
						//source={require('../icons/no_image_user.png') && {uri:user_image}}
						//source={user_image && {uri:user_image}}
						// title={user_id}	// will show user id when loading
						activeOpacity={0.5}
						// onPress={ _.debounce(() => { this._onThumbPress() }, config.BOUNCE)}
						onPress={ () => { onThumbPress(contactProp); }}
					/>
					<View style={{flexDirection:'row', flex:1, justifyContent:'space-between'}}>
						<View>
							<ListItem.Title style={{fontSize: 15, paddingLeft: 10}}>{lower_case_name} </ListItem.Title>
							<ListItem.Subtitle numberOfLines={1} style={{width:window.width*0.6, color:'#787878', fontSize: 12, paddingLeft: 10, fontWeight: 'normal'}} >{last_msg} </ListItem.Subtitle>
						</View>
						<View style={{ marginRight:10 }}>
							<Text style={styles.rightTitleStyle}>{formattedDate}</Text>
							{badgeNumber === 0 || badgeNumber === null || badgeNumber === '' ? null : <Badge value={badgeNumber} status="error" />}
						</View>
						{user_status === 2 && !invited ?
						<TouchableOpacity style={{
								height: 20,
								borderWidth: 1,
								borderRadius: 20,
								alignSelf: 'center',
							}}
							onPress = { () => { onRightIconPress( contactProp , t , authReducer.user, inviteUserDispatch ); } }>
							<Text style={{paddingLeft:5, paddingRight:5}}>+</Text>
						</TouchableOpacity> : null }
							{/* <ListItem.Chevron name = {user_status === 2 && !invited ? 'plus-circle-outline' : null} type="material-community" color="#787878" size={23} onPress = { () => { onRightIconPress( contactProp , t , authReducer.user, inviteUserDispatch ); } } /> */}
					</View>
				</ListItem>
			</TouchableWithoutFeedback>
		</Swipeable>
	);
};
export default RecentChatListItem;
