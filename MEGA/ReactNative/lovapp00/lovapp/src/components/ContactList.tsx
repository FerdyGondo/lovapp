/* eslint-disable prettier/prettier */
/**
 * @format
 * @flow strict-local
 */
 import React from 'react';
 import { useSelector, useDispatch } from 'react-redux';
 import styled from 'styled-components';
 import { Alert, Animated } from 'react-native';
 import { Icon } from 'react-native-elements';
 import { useTranslation } from 'react-i18next';

 import { config } from '../config';
 import { initContactList , inviteUser } from '../store/action-creators';
 import ContactListItem from './ContactListItem';
 import { UserListModal } from './UserListModal';

// export const Login: ({navigation:navigation}) => React.FC = ({navigation:navigation}):JSX.Element => {
const ContactList: ({navigation}) => React$Node = ({navigation}) => {
  const {t,i18n} = useTranslation();
  const initContactListDispatch = useDispatch();
  const authReducer = useSelector(state => state.authReducer);
  const listReducer = useSelector(state => state.listReducer);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState<boolean | undefined>(false);
  const [refreshingState, setRefreshingState] = React.useState<boolean | undefined>(false);
  const [sort, setSort] = React.useState<boolean | undefined>(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('Contacts'),   //getHeaderTitle(route),
      headerStyle: { backgroundColor: '#efeff2' },
      headerTintColor: '#333',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontWeight: 'bold'},
      // headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 50 : null},
      headerRight: ({color}) => <Icon name = {sort ? 'sort-ascending' : 'sort-descending'}  type="material-community" size={22} color={color} onPress = {() => setSort(!sort) } style={{marginRight:10}}/>
    });
    const unsubscribe = navigation.addListener('focus', () => {
      // console.log('Contactlist focus');
      initContactListDispatch( initContactList(authReducer.user.userID, authReducer.user.userType));
    });
    return unsubscribe;
  }, [navigation,sort]);

  React.useEffect( () => {
    // console.log('initContactListDispatch authReducer.user ', authReducer.user);
    // console.log('initContactListDispatch listReducer ', listReducer);
    initContactListDispatch( initContactList(authReducer.user.userID, authReducer.user.userType));
    setRefreshingState(false);
  },[]);

  const _renderItem = ({item, index}) => {
    let img = item.user_image ? item.user_image.includes('WebArchive') || !item.user_image.includes('firebasestorage.googleapis.com') ? (authReducer.user.userType === '210') ? config.THUMB_URL + '/WebArchive/Viewers/' + item.user_name + '/thumbs/LinkedImage.jpg' : 
                                                                                                                                                                                config.THUMB_URL + '/WebArchive/' + item.user_name + '/live/LinkedImage.jpg' : item.user_image : item.user_image;   // let img = (item.user_image) ? config.THUMB_URL+item.user_image.toString().replace('/live/', '/thumbs/'):'';
    // console.log('ContactList _renderItem img :',  img)
    // let debounce = true;
    const _onThumbPress = (contact) => {
      // console.log('ContactList _onThumbPress contact: ', contact);
      setSelectedItem(contact);
      setModalVisible(true); 
      // console.log('ContactList _onThumbPress contact: ', modalVisible);
    };

    const _deleteItem = () => {
      console.log('ContactList _deleteItem item: ', item);
      console.log('ContactList _deleteItem index: ', index);
      listReducer.contactList.splice(index, 1);
      listReducer.contactListReverse.splice(index, 1);
      // console.log('ContactList _deleteItem listReducer.recentChatListREVERSE: ', listReducer.recentChatListREVERSE);
      initContactListDispatch( initContactList(authReducer.user.userID, authReducer.user.userType));
    };

    return (
      <ContactListItem
        navigation        = {navigation}
        contactProp			  = {item}
        thumbs			      = {img}
        //  testModeProp	={this.state.testModeState}
        //  onItemPress		={ _.debounce( (contact) => {this._onItemPress(contact) }, config.BOUNCE)} 
        onItemPress       = { (contact, navigation) => _onItemPress(contact, navigation) }
        onThumbPress		  = { (contact) => _onThumbPress(contact) }
        deleteItem		    = { (contact) => _deleteItem(contact) }
        onRightIconPress	= { (contact,t, user, inviteUserDispatch) => _onRightIconPress(contact,t, user, inviteUserDispatch) }
      />
    )
  }
  return (
    <Animated.View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <FlatList
          data={sort ? listReducer.contactList : listReducer.contactListReverse}
          keyExtractor={item => item.user_id}
          // numColumns={numColumns}  //for thumb grid
          renderItem={_renderItem}
          showsHorizontalScrollIndicator={false}
          maxToRenderPerBatch={8}
          windowSize={12}
          refreshControl={
            <RefreshControl
                refreshing={refreshingState}
                onRefresh={() => initContactListDispatch(initContactList(authReducer.user.userID, authReducer.user.userType))}
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
  console.log('Contactlist _onRightIconPress t: ', t);
  console.log('Contactlist _onRightIconPress contact: ', contact);
  if (contact.user_status === 2) {
      Alert.alert(
        t('Invite User'),	
        t('Invite User Msg'),	//'Do you want to invite this user ?',
        [
            {text: t('Cancel'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: t('OK'), onPress: () => {
                console.log('OK Pressed = this.props.contact : ', contact);
                console.log('ContactList contact : ', contact);
                console.log('ContactList user : ', user);
                const status = inviteUserDispatch(inviteUser(user, contact.user_id, t('I sent you invitation to download the app')));
                console.log('ContactList status : ', status);
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
      )
  }
}

const _onItemPress = (contact, navigation) => {
  console.log('=====> ContactList _onItemPress contact : ', contact);
  console.log('=====> ContactList _onItemPress navigation : ', navigation);
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
`;
const RefreshControl = styled.RefreshControl`
`;
// const View = styled.View`
// `;
export default ContactList;
