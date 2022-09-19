/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Alert, Animated, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
// import { useNavigation } from '@react-navigation/native';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { config } from '../config';
import { initRecentChatList, inviteUser } from '../store/action-creators';
import RecentChatListItem from './RecentChatListItem';
import { UserListModal } from './UserListModal';
import { Icon } from 'react-native-elements';

const RecentChatList: ({navigation}) => React$Node = ({navigation}) => {
  const {t,i18n} = useTranslation();
  const initRecentChatListDispatch = useDispatch();
  const authReducer = useSelector(state => state.authReducer);
  const listReducer = useSelector(state => state.listReducer);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState<boolean | undefined>(false);
  const [refreshingState, setRefreshingState] = React.useState<boolean | undefined>(false);
  const [sort, setSort] = React.useState<boolean | undefined>(true);

  React.useLayoutEffect(() => {
    console.log('RecentChatList useLayoutEffect');
    navigation.setOptions({
      headerTitle: t('Recent Chats'),
      headerStyle: { backgroundColor: '#efeff2' },
      headerTintColor: '#333',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold'},
      // headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 50 : null},
      // headerLeft: ({back}) => {
      //   leftButton={
      //     back : undefined,
      //   };
      // },
      headerRight: ({color}) => <Icon name = {sort ? 'sort-ascending' : 'sort-descending'}  type="material-community" size={22} color={color} onPress = {() => setSort(!sort) } style={{marginRight:10}}/>
    });
    initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType));
    setRefreshingState(false);
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('RecentChatList focus listReducer',listReducer.total_badge);
      // Alert.alert('RecentChatList focus listReducer.total_badge',listReducer.total_badge.toString());
      initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType));
    });
    return unsubscribe;
  }, [navigation,sort]);

    React.useEffect( () => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (nextAppState === 'active') {
          console.log('RecentChatList nextAppState', nextAppState);
          initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType));
        }
      });
      return () => {
        subscription.remove();
      };
    }, []);

  const _renderItem = ({item, index}) => {
    // console.log('RecentChatList _renderItem item.user_id :', item.user_id)
    // console.log('RecentChatList _renderItem item.user_image :', item.user_image)
    let img = item.user_image ? item.user_image.includes('WebArchive') || !item.user_image.includes('firebasestorage.googleapis.com') ? (authReducer.user.userType === '210') ? config.THUMB_URL + '/WebArchive/Viewers/' + item.user_name + '/thumbs/LinkedImage.jpg' : 
                                                                                                                                                                                config.THUMB_URL + '/WebArchive/' + item.user_name + '/live/LinkedImage.jpg' : item.user_image : item.user_image;
    // let img = (item.user_image) ? config.THUMB_URL+item.user_image.toString().replace('/live/', '/thumbs/'):''
    // console.log('RecentChatList _renderItem img :',  img);
    // let debounce = true;
    const _onThumbPress = (contact) => {
      console.log('RecentChatList _onThumbPress contact: ', contact);
      setSelectedItem(contact);
      setModalVisible(true); 
      console.log('RecentChatList _onThumbPress contact: ', modalVisible);
    };

    const _deleteItem = () => {
      console.log('RecentChatList _deleteItem item: ', item);
      console.log('RecentChatList _deleteItem index: ', index);
      listReducer.recentChatListREVERSE.splice(index, 1);
      listReducer.recentChatList.splice(index, 1);
      // console.log('RecentChatList _deleteItem listReducer.recentChatListREVERSE: ', listReducer.recentChatListREVERSE);
      initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType));
    };

    return (
      <RecentChatListItem
        navigation        = {navigation}
        contactProp			  = {item}
        thumbs			      = {img}
        //  testModeProp	= {this.state.testModeState}
        //  onItemPress		= { _.debounce( (contact) => _onItemPress(contact) }, config.BOUNCE)}
        onItemPress       = { (contact, navigation) => _onItemPress(contact, navigation) }
        onThumbPress		  = { (contact) => _onThumbPress(contact) }
        deleteItem		    = { (contact) => _deleteItem(contact) }
        onRightIconPress	= { (contact,t, user, inviteUserDispatch) => _onRightIconPress(contact,t, user, inviteUserDispatch) }
      />
    );
  };
  // console.log('render listReducer.total_badge', listReducer.total_badge);
  // Alert.alert('render listReducer.total_badge', listReducer.total_badge.toString());
  // const ITEM_HEIGHT = 200;
  return (
    <Animated.View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <FlatList
          data={sort?listReducer.recentChatListREVERSE : listReducer.recentChatList}
          keyExtractor={item => item.user_id}
          // numColumns={numColumns}  //for thumb grid
          renderItem={_renderItem}
          showsHorizontalScrollIndicator={false}
          maxToRenderPerBatch={8}
          windowSize={12}
          // getItemLayout={(data, index) => (
          //   {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
          // )}
          refreshControl={
            <RefreshControl
                refreshing={refreshingState }
                onRefresh={() => initRecentChatListDispatch(initRecentChatList(authReducer.user.userID, authReducer.user.userType))}
                tintColor="#000000"
                title={t('Loading')}
                titleColor="#000000"
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor="#ffff00"
                // size='enum(RefreshLayoutConsts.SIZE.SMALL)'
            />
          }
      />
      {selectedItem && <UserListModal modalVisible={modalVisible} setModalVisible={setModalVisible} selectedItem={selectedItem}  />}
    </Animated.View>
  );
};

const _onRightIconPress = (contact,t, user, inviteUserDispatch) => {
  console.log('RecentChatList _onRightIconPress contact', contact);
  console.log('RecentChatList _onRightIconPress t', t);
  console.log('RecentChatList _onRightIconPress user', user);
  if (contact.user_status === 2) {
      Alert.alert(
        t('Invite User'),	//'Invite User',
        t('Invite User Msg'),	//'Do you want to invite this user ?',
        [
            { text: t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            { text: t('OK'), onPress: () => {
                console.log('RecentChatList contact : ', contact);
                console.log('RecentChatList user : ', user);
                const status = inviteUserDispatch(inviteUser(user, contact.user_id, t('I sent you invitation to download the app')));
                console.log('RecentChatList status : ', status);
                    if (status.payload.user.data.response === 'success') {
                            Alert.alert( t('User had been invited') );
                            user.toUserID = contact.user_id;
                            user.avatar   = contact.user_image;
                      }  else if (status === 'Invited') {
                            Alert.alert( t('You have invited this user'), t('Please wait until user download the app') )
                      } else {
                          Alert.alert( t('Invite user failed'), t('Please try again later') )
                      }
            } },
        ],
        { cancelable: true }
      );
  }
};

const _onItemPress = (contact, navigation) => {
  console.log('=====> RecentChatList _onItemPress contact : ', contact);
  console.log('=====> RecentChatList _onItemPress navigation : ', navigation);
  // if(this.state.testModeState  ){
  //   if (contact.test_flag == 1){
  //     if (contact.user_status != 2 ){
  //       setTimeout(() => {
  //         if(contact.user_id){
  //           this.props.navigation.navigate({ routeName:'chatMessageScreen',
  //             key:contact.user_name,
  //             params:{ navigation_param : {...contact} }
  //             // params:{ toggleButtonParam:false, navigation_param : {...contact} }
  //           });
  //         }
  //       },500);
  //     }
  //   }
  // } else {
      // if (contact.user_status !== 2 ){
        // if (contact.user_id) {
          navigation.navigate('ChatMsg', { navigation_params : contact });
          // navigation.push('ChatMsg', { navigation_params : contact });
          // const pushAction = StackActions.push('ChatMsg', { navigation_params : contact });
          // navigation.dispatch(pushAction);
          // navigation.navigate({ routeName:'ChatMsg',
          //     key:contact.user_name,
          //     params:{ navigation_param : {...contact} }
          //     // params:{ toggleButtonParam:false, navigation_param : {...contact} }
          // });
        // }
      // }
  // }
};

const FlatList = styled.FlatList`
`
const RefreshControl = styled.RefreshControl`
`
// const View = styled.View`
// `
export default RecentChatList;


