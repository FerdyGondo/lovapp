/* eslint-disable prettier/prettier */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
	Alert,
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	TouchableWithoutFeedback,
	TouchableHighlight,
	LayoutAnimation,
	Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
// import _ from 'lodash';
const OnlineListItem: () => React$Node = ({ navigation, onlineListProp, onItemPress, thumbs, thumbWidth }) => {
	const {t,i18n} = useTranslation();
	const authReducer = useSelector(state => state.authReducer);
	/* 		const {
			user_name,
			user_id,
			user_image,
			user_message,
			test_flag,
			user_type
		} = onlineListProp; */
		// let debounce = true;
	return (
		<View style={{ padding : 4}}>
			{/* {thumbs !== '' && */}
			<TouchableOpacity
			 	/* onPress={ _.debounce(() => { this._onItemPress() }, config.BOUNCE)} */
				onPress={() => {
					onItemPress(onlineListProp, navigation, authReducer, t);
					// navigation.navigate('ChatMsg', { navigation_params : onlineListProp });
				}}
			>
				<ImageBackground style={{width : thumbWidth, height : thumbWidth }}
					source={(thumbs === '') ? require('../icons/no_image_user.png') : (thumbs && {uri:thumbs,cache:'reload'}) }
					// source= { (onlineListProp.user_type == '900') ? require('../icons/no_image_user.png') : thumbs && { uri:thumbs} } 
				>
					<View style={{alignItems: 'flex-end'}}>
						<Icon name = {onlineListProp.online_status ? 'circle' : null} type = "font-awesome" size={12} color="#0cb103" />
					</View>
					<View style={{flex: 1, justifyContent: 'flex-end',  paddingLeft: 5}}>
						<Text style={{color: '#FFF', backgroundColor: 'rgba(0, 0, 0, 0.4)', fontSize: 10, fontWeight: 'bold'}}
						> { onlineListProp.user_name }</Text>
					</View>
				</ImageBackground>
			</TouchableOpacity>
		</View>
	);
};

export default OnlineListItem;

