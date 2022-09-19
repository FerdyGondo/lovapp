/* eslint-disable prettier/prettier */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
	LayoutAnimation,
	Dimensions,
	ScaledSize,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Alert,
} from 'react-native';
import {
	ListItem,
	Avatar,
	Icon,
} from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import Swipeable from 'react-native-gesture-handler/Swipeable';
// import _ from 'lodash';
import { config } from '../config';
import { removeChildAction } from '../store/ListAction';
import styles from './Styles';
import { initContactList , initRecentChatList } from '../store/action-creators';

const ContactListItem: () => React$Node = ({navigation, contactProp, thumbs, onItemPress, onThumbPress, deleteItem, onRightIconPress}) => {
	const {t,i18n} = useTranslation();
	const window:ScaledSize = Dimensions.get('window');
	const authReducer = useSelector(state => state.authReducer);
	const listReducer = useSelector(state => state.listReducer);
	const [nonDX, setNonDX] = React.useState<boolean | undefined>(false);
	const inviteUserDispatch = useDispatch();
	// const initContactListDispatch = useDispatch();
	// const initRecentChatListDispatch = useDispatch();
	// console.log('ContactListItem authReducer.user ', authReducer.user);
    // console.log('ContactListItem listReducer ', listReducer);
    // console.log('ContactListItem contactProp ', contactProp);
	const {
		user_name,
		lower_case_name,
		user_id,
		user_type,
		user_image,
		user_message,
		user_status,
		invited,
		test_flag
	} = contactProp;
	// console.log('ContactListItem user_type : ', user_type, '=>', user_image);
	React.useEffect( () => {
		setNonDX(authReducer.user.nonDX);
	},[listReducer]);
		// // let debounce = true;
		// console.log('ContactListItem renderAvatar thumbs::: ', thumbs);
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

		// LayoutAnimation.spring();

		return (
			<Swipeable renderRightActions={RightActions} >
				<TouchableWithoutFeedback
					onPress={() => {
						onItemPress(contactProp, navigation);
						// navigation.navigate('ChatMsg', { navigation_params : contactProp });
					}}				>
					{/* <View style={styles.whiteBg}> */}
					<ListItem topDivider bottomDivider style={{width:window.width}}>
						<Avatar
							rounded
							size="medium"
							source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'reload'}) }
							//source={require('../icons/no_image_user.png') && {uri:user_image}}
							//source={user_image && {uri:user_image}}
							// title={user_id}	// will show user id when loading
							activeOpacity={0.5}
							// onPress={ _.debounce(() => { this._onThumbPress() }, config.BOUNCE)}
							onPress={ () => { onThumbPress(contactProp); } }
						/>
						<View >
							<ListItem.Title>{lower_case_name} </ListItem.Title>
							<ListItem.Subtitle style={{ width:window.width*0.8, color:'#787878', fontSize: 11, fontWeight: 'normal'}} >{user_message} </ListItem.Subtitle>
						</View>
						<ListItem.Chevron name = {user_status === 2 && !invited ? 'plus-circle-outline' : null} type='material-community' color='#787878' size={24} 
									onPress = { () => { onRightIconPress( contactProp , t , authReducer.user, inviteUserDispatch ) } } />
					</ListItem>
				</TouchableWithoutFeedback>
			</Swipeable>
		);
};

export default ContactListItem;
