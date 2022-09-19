/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import styled from 'styled-components';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import {
  Alert,
  Dimensions,
  View,
  Platform,
  RefreshControl,
} from 'react-native';
// import { StackActions } from '@react-navigation/native';

import { config } from '../config';
import { initOnlineList  } from '../store/action-creators';
import OnlineListItem from './OnlineListItem';
import {checkIfUserExistAction, addChildAction} from '../store/ListAction';

const OnlineList: ({navigation}) => React$Node = ({navigation}) => {
  const initOnlineListDispatch = useDispatch();
  const {t,i18n} = useTranslation();
  const authReducer = useSelector(state => state.authReducer);
  const listReducer = useSelector(state => state.listReducer);
  const [refreshingState, setRefreshingState] = React.useState<boolean | undefined>(false);
  const window:ScaledSize = Dimensions.get('window');
  const windowWidth = window.width;
  const windowHeight = window.height;
  const thumbWidth = Platform.OS === 'android' ? (windowWidth / 4) - (2 * 4) : (windowWidth / 4) - (2 * 4);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Users'),// + ' 0',
      headerStyle: { backgroundColor: '#efeff2'},
      headerTintColor: '#333',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold'},
    });
  }, []);

  React.useEffect( () => {
    // console.log('OnlineList initOnlineListDispatch authReducer.user ', authReducer.user);
    initOnlineListDispatch(initOnlineList(authReducer.user.userID, authReducer.user.userType));
    setRefreshingState(false);
    const unsubscribe = navigation.addListener('focus', () => {
      // console.log('OnlineList focus');
      initOnlineListDispatch(initOnlineList(authReducer.user.userID, authReducer.user.userType));
    });
    return unsubscribe;
  },[]);

  const _dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(listReducer.onlineList);

  //Create the layout provider
  //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
  //Second: Given a type and object set the height and width for that type on given object
  //If you need data based check you can access your data provider here
  //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
  //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
  const _layoutProvider = new LayoutProvider(
      // () => 0,
      index => {
        // console.log('OnlineList _rowRenderer index : ',index);
        return index;
      },
      (type, dim) => {
        dim.width  = thumbWidth + 6;
        dim.height = thumbWidth + 6;
      },
  );

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

  //Given type and data return the view component
  const _rowRenderer = (type, data) => {
    //You can return any view here, CellContainer has no special significance
    // console.log('OnlineList _rowRenderer type : ',type,' data : ',data);
    // console.log('OnlineList _renderItem data.user_id :',  data.user_id)
    // console.log('OnlineList _renderItem data.user_image :',  data.user_image)
    let img = data.user_image ? data.user_image.includes('WebArchive') || !data.user_image.includes('firebasestorage.googleapis.com') ? (authReducer.user.userType === '210') ? config.THUMB_URL + '/WebArchive/Viewers/' + data.user_name + '/thumbs/LinkedImage.jpg' : 
                                                                                                                                                                                config.THUMB_URL + '/WebArchive/' + data.user_name + '/thumbs/LinkedImage.jpg' : data.user_image : data.user_image;
    // console.log('OnlineList _renderItem img :',  img)
    // if(data.user_image.includes('WebArchive')){
    // 	if(data.user_type == '210'){
    // 		thumbs = config.THUMB_URL + '/WebArchive/' + data.user_name + '/live/LinkedImage.jpg';
    // 	} else {
    // 		thumbs = config.THUMB_URL + '/WebArchive/Viewers/' + data.user_name + '/thumbs/LinkedImage.jpg';
    // 	}
    // }
    // console.log('OnlineList thumbs : ', data.user_name,':',thumbs);
    return (
      //<View style={styles.thumblist}>
        <OnlineListItem
          navigation      = {navigation}
          onlineListProp	= {data}
          thumbs		      = {img}
          thumbWidth      = {thumbWidth}
          onItemPress     = { (contact, navigation, authReducer, t) => _onItemPress(contact, navigation, authReducer, t) }
        />
      //</View>
    );
  };

    const dispatchRefresh = () => {
      initOnlineListDispatch(initOnlineList(authReducer.user.userID, authReducer.user.userType));
    };
        // console.log('_dataProvider._data.length : ', _dataProvider._data.length);
  return (
    // <SafeAreaView style={{ flex: 0, backgroundColor: '#efeff2' }}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {_dataProvider._data.length !== 0 &&
      <RecyclerListView style={{ flex: 1, width : windowWidth, height: windowHeight}}
        layoutProvider	= {_layoutProvider}
        dataProvider	  = {_dataProvider}
        rowRenderer		  = {_rowRenderer}
        refreshControl  = {
							<RefreshControl
									refreshing={refreshingState}
									onRefresh={dispatchRefresh}
									tintColor="#000000"
									title={t('Loading')}
									titleColor="#000000"
									colors={['#ff0000', '#00ff00', '#0000ff']}
									progressBackgroundColor="#ffff00"
									// size='enum(RefreshLayoutConsts.SIZE.SMALL)'
							/>
						}
      />}
    </View>
  // </SafeAreaView>
  );
};

const _onItemPress = (contact, navigation, authReducer, t) => {
	checkIfUserExistAction( authReducer.user.userID, contact.user_id, ( userExist, nick_name ) => {
		// console.log('ChatMessage checkIfUserExistAction userExist : ', userExist);
		// console.log('ChatMessage checkIfUserExistAction nick_name : ', nick_name);
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
          }},
        ]
      );
		} else {
      navigation.navigate('ChatMsg', { navigation_params : contact });
      // navigation.navigate('RecentChatListStack', {
      //   screen: 'ChatMsg',
      //   initial: false, //render the initial route specified in the navigator, you can disable the behaviour of using the specified screen as the initial screen
      //   params: { navigation_params : contact} ,
      // });
      // const pushAction = StackActions.push('RecentChatListScreen', { 
      //   screen: 'ChatMsg',
      //   params: { navigation_params : contact} ,
      // });
      // navigation.dispatch(pushAction);
      // const pushAction = StackActions.push('ChatMsg', {
      //   navigation_params : contact,
      // });
      // navigation.dispatch(pushAction);
		}
		//this.setState({ toggleButton : userExist });
	});
};

export default OnlineList;
