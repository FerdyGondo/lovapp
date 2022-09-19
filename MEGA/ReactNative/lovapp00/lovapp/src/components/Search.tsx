/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  View,
  Platform,
  ScrollView,
  TextInput,
  Text,
} from 'react-native';
import { Icon } from 'react-native-elements';
// import styled from 'styled-components';
import { config } from '../config';
import styles from './Styles';
import { initSearch } from '../store/action-creators';
import OnlineListItem from './OnlineListItem';
import {checkIfUserExistAction, addChildAction} from '../store/ListAction';

 const Search: ({navigation}) => React$Node = ({navigation}) => {
   const initSearchDispatch = useDispatch();
   const {t,i18n} = useTranslation();
   const authReducer = useSelector(state => state.authReducer);
   const listReducer = useSelector(state => state.listReducer);
   const [refreshingState, setRefreshingState] = React.useState<boolean | undefined>(false);
   const [notFound, setNotFound]      = React.useState<boolean | undefined>(false);
   const [searchText, setSearchText]  = React.useState<string | undefined>('');

   const userID = (authReducer.user.userID) ? authReducer.user.userID : authReducer.user.uid;
   const userType = authReducer.user.userType;
   const window:ScaledSize = Dimensions.get('window');
   const windowWidth = window.width;
   const windowHeight = window.height;
   const thumbWidth = Platform.OS === 'android' ? (windowWidth/4) - (2*4) : (windowWidth/4) - (2*4)
   const textInputWidth = windowWidth * 0.8;
   const textWidth 		= windowWidth * 0.6;

   React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Search'),
      headerStyle: { backgroundColor: '#efeff2'},
      headerTintColor: '#333',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold'},
    });
  }, []);

   const _dataProvider = new DataProvider((r1, r2) => {
            console.log('Search _dataProvider listReducer.searchList : ',listReducer.searchList);
     return r1 !== r2;
   }).cloneWithRows(listReducer.searchList);

   //Create the layout provider
   //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
   //Second: Given a type and object set the height and width for that type on given object
   //If you need data based check you can access your data provider here
   //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
   //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
   const _layoutProvider = new LayoutProvider(
     // () => 0,
     index => {
       // console.log('Search _rowRenderer index : ',index);
       return index
     },
     (type, dim) => {
       dim.width  = thumbWidth + 6;
       dim.height = thumbWidth + 6;
     },
   );
 
   //Given type and data return the view component
   const _rowRenderer = (type, data) => {
     //You can return any view here, CellContainer has no special significance
     // console.log('Search _rowRenderer type : ',type,' data : ',data);
     let thumbs = data.user_image.includes('WebArchive') ? (data.user_type === '210') ? config.THUMB_URL + '/WebArchive/' + data.user_name + '/live/LinkedImage.jpg' : config.THUMB_URL + '/WebArchive/Viewers/' + data.user_name + '/thumbs/LinkedImage.jpg' : data.user_image;
     // let thumbs = data.user_image;
     // if(data.user_image.includes('WebArchive')){
     // 	if(data.user_type == '210'){
     // 		thumbs = config.THUMB_URL + '/WebArchive/' + data.user_name + '/live/LinkedImage.jpg';
     // 	} else {
     // 		thumbs = config.THUMB_URL + '/WebArchive/Viewers/' + data.user_name + '/thumbs/LinkedImage.jpg';
     // 	}
     // }
     // console.log('thumbs : ', data.user_name,':',thumbs);
     return (
        //<View style={styles.thumblist}>
          <OnlineListItem
            navigation      = {navigation}
            onlineListProp	= {data}
            thumbs		      = {thumbs}
            thumbWidth      = {thumbWidth}
            onItemPress     = { (contact, navigation, authReducer, t) => _onItemPress(contact, navigation, authReducer, t) }
          />
        //</View>
      );
    };
     // console.log('_dataProvider._data.length : ', _dataProvider._data.length);
    //  const searchFB: () => React$Node = () => {
    const searchFB = () => {
      console.log('SearchList searchFB authReducer : ',authReducer);
      // const [userID, setUserID]          = React.useState<string | undefined>('');
      // const [userType, setUserType]      = React.useState<string | undefined>('');
      // setUserID(authReducer.user.userID ? authReducer.user.userID : authReducer.user.uid);
      // setUserType(authReducer.user.userType);
      console.log('SearchList searchFB searchText : ',searchText);
      console.log('SearchList searchFB userID : ',userID);
      console.log('SearchList searchFB userType : ',userType);
      let toLowerCaseText = searchText.toLowerCase();
      // if (!refreshingState && searchText && searchText.length >= 3){
      if (searchText && searchText.length >= 3){
        // setRefreshingState(true)
      // if(!this.props.refreshingProps){
        // this.props.refreshingProps = true;
        initSearchDispatch(initSearch(toLowerCaseText, userID, userType));
        // this.props.searchAction( toLowerCaseText, userID, userType , (notFound) => {
          // console.log('SearchList searchFB notFound : ',notFound);
          // this.setState({ notFound:notFound })
      }
    };

//  console.log('render listReducer ', listReducer.errText);
   return (
      <ScrollView keyboardShouldPersistTaps="never">
						<View style={in_styles.textStyle}>
						    <Text style={{alignSelf : 'center'}}>{t('Default Notice')}</Text>
						</View>
				<View style={styles.frameContainerStyle}>
					<View style={styles.searchContainerStyle}>
						<TextInput
							style={in_styles.searchInputStyle}
							placeholder= {t('Name search')}
							placeholderTextColor = "#807F83"
							selectTextOnFocus = {true}
							selectionColor = "#000"	//highlight and cursor color
							onChangeText = {setSearchText}		//{this.onPasswordChange}
							value={searchText}
							onSubmitEditing={searchFB}
							returnKeyType={ 'search' }
							autoFocus={false}
							autoCorrect={false}
							autoCapitalize= "none"
							underlineColorAndroid="transparent"
						/>
						<Icon name="close" type="simple-line-icon" color="#807F83" onPress = { () => setSearchText('') } />
					</View>
				</View>
				<View style={styles.spinner}>
						{listReducer.refreshing && <ActivityIndicator size="large"></ActivityIndicator>}
						{listReducer.refreshing && <Text style={styles.spinner}>{t('Loading')}</Text>}
				</View>

				{listReducer.errText && listReducer.errText === 'Nothing found' ? 
					<View style={styles.notFoundStyle}>
						<Text>{t('Nothing found')}</Text>
					</View> 
				: 
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {_dataProvider._data.length !== 0 &&
            <RecyclerListView style={{ flex: 1, width : windowWidth, height: windowHeight}}
              layoutProvider	= {_layoutProvider}
              dataProvider	  = {_dataProvider}
              rowRenderer		  = {_rowRenderer}
            />}
          </View>
				}
			</ScrollView>
    ////////////////////////////////////////////////////////////////////////
     // <SafeAreaView style={{ flex: 0, backgroundColor: '#efeff2' }}>
   // </SafeAreaView>
   );
 };

 const _onItemPress = (contact, navigation, authReducer, t) => {
	checkIfUserExistAction( authReducer.user.userID, contact.user_id, ( userExist, nick_name ) => {
		console.log('ChatMessage checkIfUserExistAction userExist : ', userExist);
		console.log('ChatMessage checkIfUserExistAction nick_name : ', nick_name);
		if (nick_name) contact.lower_case_name = nick_name;
		if (!userExist){
      //console.log('ChatMessage checkIfUserExistAction toUserID : ', this.props.user.toUserID);
      //console.log('ChatMessage checkIfUserExistAction this.props.navigation.state.params.navigation_param : ', this.props.navigation.state.params.navigation_param);
      Alert.alert(
        t('User Not Exist'),
        t('Do you want add user to your contact list?'),
        [
          {text: t('Cancel'), onPress: () => {
            console.log('Cancel Pressed');
            style: 'cancel';
            },
          },
          {text: t('OK'), onPress: () => {
            // exportfunction();
            // setSortingState();
              addChildAction( authReducer.user.userID, contact.user_id, contact.user_name, contact.user_name+t(' had just been added'), () => {
                userExist = true;
                //console.log('ChatMessage addChildAction userExist : ', userExist);
                navigation.navigate('ChatMsg', { navigation_params : contact });
                  // this.setAsyncStorage('recentchatlist_sort', "descend" );
                  // ContactList.callFromOtherComponent();
                  // setSortingState();
                  // exportfunction();
              });
          }}
        ]
      );
		} else {
        navigation.navigate('ChatMsg', { navigation_params : contact });
		}
		//this.setState({ toggleButton : userExist });
	});
};

 const in_styles = {
	searchInputStyle: {
		// fontColor: '#000',
		fontSize: 14,
		color: '#000', //no effect
		backgroundColor : '#fff',
		// borderRadius: 10,
		// borderWidth: 1,
		// borderColor: '#807F83',
		padding: 5,
		lineHeight: 20,
		width: 200, //textInputWidth,
    flex: 1,
  },
  textStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // width: 250, //textWidth,
    },
};

 export default Search;
 

      // const [_dataProvider, setDataProvider] = React.useState(
     //     new DataProvider((r1, r2) => {
     //         return r1 !== r2
     //     })
     //  )
 
     // const [_layoutProvider] = React.useState(
     //     new LayoutProvider(
     //     (index) => 1,
     //     (type, dim) => {
     //         dim.width = thumbWidth + 8;
     //         dim.height = thumbWidth + 6;
     //     }
     //   )
     // )
 
     // React.useEffect(() => {
     //         // if(listReducer.onlineList && listReducer.onlineList.length !== 0 ) {
     //             setDataProvider((prevState) => prevState.cloneWithRows(listReducer.onlineList))
     //         // }
     // }, [listReducer.onlineList])