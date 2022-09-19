/* eslint-disable prettier/prettier */
// import 'react-native-gesture-handler';
import React from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import { useTranslation } from 'react-i18next';
import { Login } from './components/Login';
import { Register } from './components/Register';
import OnlineList from './components/OnlineList';
import ChatMsg from './components/ChatMsg';
import Search from './components/Search';
import ContactList from './components/ContactList';
import RecentChatList from './components/RecentChatList';
import Profile from './components/Profile';
import firebase_config from './firebase_config';

const NativeStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export const App_Nav = ({navigation}) => {
    const authReducer = useSelector(state => state.authReducer);
    const [loggedIn, setloggedIn] = React.useState(false);

    React.useEffect( () => {
      console.log('Navigation authReducer.loggedIn ============', authReducer.loggedIn);
      setloggedIn(authReducer.loggedIn ? true : false);
      // console.log('Navigation loggedIn', loggedIn);
    });
    return ( <NavigationContainer>
                {loggedIn ?
                  <>
                      <SafeAreaView style={{ flex: 0, backgroundColor: '#efeff2' }}/>
                      <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
                        <BottomStackNavigator />
                      </SafeAreaView>
                  </>
                : <AuthStackNavigator />}
            </NavigationContainer>
      );
};

const messageListener = async (navigation) => {
  console.log('Navigation messageListener navigation',navigation);
  navigation.navigate('RecentChatList');
  try {
      // Assume a message-notification contains a "type" property in the data payload of the screen to open
      messaging().onNotificationOpenedApp(remoteMessage => {
          // firebase_config.notifications().removeAllDeliveredNotifications() 
          console.log('Navigation onNotificationOpenedApp',remoteMessage);
          // Alert.alert('Navigation onNotificationOpenedApp ', JSON.stringify(remoteMessage));
          // if (remoteMessage) navigation.navigate('ChatMsg', { navigation_params : remoteMessage.data });
          if (remoteMessage) navigation.navigate('RecentChatList');
      });
    } catch (e){ console.log('onNotificationOpenedApp e',e); };
  try {
      // Check whether an initial notification  available
      messaging().getInitialNotification().then(remoteMessage => {
          // Alert.alert('Navigation getInitialNotification ', JSON.stringify(remoteMessage));
          if (remoteMessage) navigation.navigate('RecentChatList');
      });
    } catch (e){ console.log('getInitialNotification e',e); }
};

const AuthStackNavigator = ({navigation}) => {
  return ( <NativeStack.Navigator initialRouteName="LoginForm" screenOptions={{headerShown: false}} >
            <NativeStack.Screen name="LoginForm"    component={Login} />
            <NativeStack.Screen name="RegisterForm" component={Register} />
          </NativeStack.Navigator>
          );
        };

const BottomStackNavigator = ({navigation}) => {
  return ( <NativeStack.Navigator initialRouteName="BottomTabNavigator" 
              // screenOptions={{headerShown: false}}
              >
            <NativeStack.Screen name="BottomTabNavigator" component={BottomTabNavigator}
              // options={({ route }) => ({ title: route.params.name })}
              options={({ route }) => ({
                  headerShown: false,//getHeaderShown(route),
                  // headerTitle: getHeaderTitle(route),
                  // headerStyle: { backgroundColor: '#1b1be6',},
                  // headerTintColor: '#333',
                  // headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center' },
              })}
            />
            <NativeStack.Screen name = "ChatMsg" component = {ChatMsg}
                options={(route) => ({
                  // headerShown: false, //getHeaderShown(route),
                  headerStyle: { backgroundColor: '#efeff2' },
                  headerTintColor: '#333',
                  headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 50 : null},
              })} />
          </NativeStack.Navigator>
    );
  };

const BottomTabNavigator = ({navigation}) => {
  // const window = useWindowDimensions();
  // const insets = useSafeAreaInsets();
  const listReducer = useSelector(state => state.listReducer);
  // console.log('Navigation App_Nav listReducer.total_badge', listReducer.total_badge);
  React.useEffect(() => {
      console.log('Navigation BottomTabNavigator navigation',navigation);
      messageListener(navigation);
    return () => {
    };
  }, []);

  React.useEffect(() => {
    // console.log('Navigation App_Nav listReducer',listReducer);
  }, [listReducer]);

  return (
      <BottomTab.Navigator
              initialRouteName="RecentChatList"
              // lazy={false}  //all tabs are rendered immediately
              screenOptions={
                ({ route }) => ({
                  tabBarIcon : ({ focused, color }) => {
                      let iconName;
                      let iconType;
                      switch (route.name){
                        // tabBarIcon: ({ tintColor }) => (<Icon name='settings' type='simple-line-icon' size={23} color={tintColor} />),
                        case 'RecentChatList' : iconName = 'bubbles';   iconType = 'simple-line-icon'; break;
                        case 'OnlineList'     : iconName = 'people';    iconType = 'simple-line-icon'; break;
                        case 'Search'         : iconName = 'magnifier'; iconType = 'simple-line-icon'; break;
                        case 'ContactList'    : iconName = 'list';      iconType = 'simple-line-icon'; break;
                        case 'Profile'        : iconName = 'settings';  iconType = 'simple-line-icon'; break;
                      }
                      // return (<Image source={ iconName } tintColor={color} />)
                      return (<Icon name={iconName} type={iconType} color={color} size={23}/>)
                    },
                    // tabBarLabel : () => {
                    //     let tabLabel;
                    //     switch (route.name){
                    //       case 'OnlineList'     : tabLabel = 'OnlineList';      break;
                    //       case "Search"         : tabLabel = 'Search';          break;
                    //       case "ContactList"    : tabLabel = 'ContactList';     break;
                    //       case "RecentChatList" : tabLabel = 'RecentChatList';  break;
                    //       case "Profile "       : tabLabel = 'Profile';         break;
                    //     }
                    //     return <Text>{tabLabel}</Text> 
                    //   }
                    tabBarShowLabel: false,
                    tabBarShowIcon : true,  //show icon on Android
                    tabBarIconStyle: {
                      width: 40,
                      height: 40,
                    },
                    tabBarStyle: {
                      backgroundColor: '#333', //display: 'none',
                    },
                    tabBarActiveTintColor: '#333',
                    tabBarInactiveTintColor: '#fff',
                    tabBarActiveBackgroundColor: '#fff',
                    tabBarInactiveBackgroundColor: '#333',
                    // style: {height: Platform.OS === 'android' ? window.height/14 : window.height/11}  
                })
              }
      >
        <BottomTab.Screen name="RecentChatList" component={RecentChatList}  options={{ tabBarBadge: listReducer.total_badge !== 0 ? listReducer.total_badge : null, 
          // headerShown: false
          }}/>
        <BottomTab.Screen name="OnlineList"  component={OnlineList}
          // listeners={({ navigation, route }) => ({
          //   tabPress: e => {
          //       if (route.state && route.state.routeNames.length > 0) {
          //           navigation.navigate('OnlineList')
          //       }
          //   },
          // })}
        />
        <BottomTab.Screen name="Search"         component={Search} />
        <BottomTab.Screen name="ContactList"    component={ContactList} />
        <BottomTab.Screen name="Profile"        component={Profile} />
      </BottomTab.Navigator>
  );
};

/* const ContactListStackNavigator = ({navigation}) => {
  const {t,i18n} = useTranslation();
  return (
      <NativeStack.Navigator>
        <NativeStack.Screen name = "ContactList"    component = {ContactList}
                  options={(route) => ({
                    // headerShown: getHeaderShown(route),
                    headerTitle: t('Contacts'),   //getHeaderTitle(route),
                    headerStyle: { backgroundColor: '#efeff2' },
                    headerTintColor: '#333',
                    headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 50 : null},
                })}
        />
      </NativeStack.Navigator>
    );
  }; */

// const RecentChatListStackNavigator = ({navigation}) => {
//   const {t,i18n} = useTranslation();
//   return (
//       <NativeStack.Navigator>
//         <NativeStack.Screen name = "RecentChatListScreen" component = {RecentChatList}
//               // options={(route) => ({
//               //   // headerShown: false, //getHeaderShown(route),
//               //   // headerBackTitle: 'test',
//               //   // headerBackTitleVisible: true,
//               //   headerBackVisible: false,
//               //   headerTitle: t('Recent Chats'),   //getHeaderTitle(route),
//               //   headerStyle: { backgroundColor: '#efeff2' },
//               //   headerTintColor: '#333',
//               //   headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 50 : null},
//             // })}
//             />
//         <NativeStack.Screen name = "ChatMsg" component = {ChatMsg}
//                     //   options={(route) => ({
//                     //     // headerShown: false, //getHeaderShown(route),
//                     //     headerStyle: { backgroundColor: '#efeff2' },
//                     //     headerTintColor: '#333',
//                     //     headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 50 : null},
//                     // })} 
//                     />
//       </NativeStack.Navigator>
//     );
//   };

/*   const ProfileStackNavigator = ({navigation}) => {
    const {t,i18n} = useTranslation();
    return (
        <NativeStack.Navigator>
          <NativeStack.Screen name = "Profile"    component = {Profile} 
                    options={(route) => ({
                      // headerShown: getHeaderShown(route),
                      headerTitle: t('My Profile'),   //getHeaderTitle(route),
                      headerStyle: { backgroundColor: '#efeff2'},
                      headerTintColor: '#333',
                      headerTitleStyle: { fontWeight: 'bold', alignSelf: 'center' },
                  })}
          />
        </NativeStack.Navigator>
      );
    }; */

/* const getHeaderShown = (route) => {
  const routeName2 = getFocusedRouteNameFromRoute(route) ?? 'OnlineList';
  switch (routeName2) {
    case 'OnlineList':      return true;
    case 'Search':          return true;
    case 'ContactList':     return false;
    case 'RecentChatList':  return false;
    case 'Profile':         return false;
  }
}; */

  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
/*   const getHeaderTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'OnlineList';
    const {t,i18n} = useTranslation();
    switch (routeName) {
      case 'OnlineList':      return t('Users');
      case 'Search':          return t('Search');
      case 'ContactList':     return t('Contacts');
      case 'RecentChatList':  return t('Recent Chats');
      case 'Profile':         return t('My Profile');
    }
  }; */