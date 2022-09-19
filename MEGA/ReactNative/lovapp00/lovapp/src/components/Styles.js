/* eslint-disable prettier/prettier */
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	//===============================================
    //App.js
	//===============================================
	offlineContainer: {
		backgroundColor: '#b52424',
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		//width,
		position: 'absolute',
		top: 30
	  },

	offlineText: { color: '#fff' },

    container: {
        flex: 1,
        //alignItems: 'center',
		justifyContent: 'center',
		//backgroundColor: 'rgba(25, 28, 33, 0.85)', //#191C21
		backgroundColor: '#000'
	},
	
    containerStore: {
        flex: 1,
        //alignItems: 'center',
		justifyContent: 'center',
		//backgroundColor: 'rgba(25, 28, 33, 0.85)', //#191C21
		backgroundColor: '#000'
	},
	
	whiteBg :{
		backgroundColor: '#fff',
		flex: 1
	},


    recentChatStyle: {
        //flex: 1,
        fontSize: 20,
        alignSelf: 'center',
        color: 'blue',
        marginTop: 50,
        marginBottom: 100
    },

	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10
	  },
	  
	//===============================================
    //LoginForm.js
	//===============================================

	loginSection: {
    //backgroundColor: 'rgba(25, 28, 33, 0.85)', //#191C21
		flex: 1,
		// position: 'absolute',
		// top: 0,
		// bottom: 0,
		// left: 0,
		// right: 0,
	},

	topSection: {
        flex: 0.57,
        backgroundColor: 'rgba(25, 28, 33, 0.85)', //#191C21
    },

	logoContainer: {
		flex: 1,
		alignSelf: 'center',
		justifyContent: 'center',
	},

    bottomSection: {
        flex: 0.43,
        backgroundColor: 'rgba(25, 28, 33, 0.85)', //#191C21
		paddingTop: 10,
		paddingRight: 50,
		paddingLeft: 50
    },

	errorTextStyle: {
		fontSize: 12,
		lineHeight: 24,
		height: 24,
		width: 300,
		textAlign: 'center',
		// alignSelf: 'center',
		color: '#ff0000',
		paddingTop: 5,
		flex: 0.4,
		flexWrap: 'wrap',
	},

	createUserTextStyle: {
	    fontSize: 12,
	    alignSelf: 'center',
	    color: '#807F83',
	    marginTop: 12,
		//textDecorationLine: 'underline'
	    //marginBottom: 20,
	},

	versionTextStyle: {
	    fontSize: 10,
	    alignSelf: 'center',
	    color: '#807F83',
	    marginTop: 15,
	},

	//===============================================
	//Register.tsx
	//===============================================
	registerSection: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(25, 28, 33, 0.85)', //#191C21
		paddingTop: 50,
		paddingRight: 50,
		paddingLeft: 50,
	},

	/*
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
	*/

	//===============================================
    //ChatMesssage.tsx
	//===============================================

    giftedChatContainer: {
        backgroundColor : '#A8DF8D'
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        },
        footerText: {
        fontSize: 14,
        color: '#aaa',
    },

	//===============================================
    //ContactList.js
	//===============================================

    /*buttonStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 300
    },*/

	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
		marginHorizontal: 50,
		marginTop: 150
	},

    textStyle: {
        //flex: 1,
		//flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
		marginHorizontal: 50,
		//marginTop: 50
        //marginRight:
	},
	
	//===============================================
    //ContactListItem.js
	//===============================================

	titleStyle: {
		fontSize: 18,
		paddingLeft: 15
	},

	listItemStyle: {
		//marginTop: 10,
		//marginBottom: 5,
		//flex: 1
	},

  rightTitleStyle: {
    color:'#878787',
    fontSize: 10,
    marginTop: 0,
    marginRight:0,
    marginLeft: 0,
    paddingBottom: 10
  },

	modalOuter: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.8)'
	},

	modalInner: {
		width: 300,
		height: 380,
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingHorizontal: 8,
		paddingTop: 6
	},

	modalBlock: {
		width: 200,
		height: 150,
		backgroundColor: '#fff',
		borderRadius: 10,
		paddingHorizontal: 8,
		paddingTop: 6
	},

	modalClose: {
		alignItems: 'flex-end'
	},

	closeText: {
		fontSize: 20,
		marginRight: 5
	},

	modalTop: {
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 20
	},

	profileImage: {
		width: 250,
		height: 190,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#807F83'
	},

	modalProfileText :{
		color: '#252932',
		fontSize: 15,
		lineHeight: 24,
		height: 24,
		marginBottom: 10,
	},

	//===============================================
	//OnlineList.js
	//===============================================

	// thumblist: {
    //     justifyContent: 'flex-start',
    //     flexDirection: 'row',
    //     flexWrap: 'wrap'
    // },

    item: {
        backgroundColor: '#CCC',
        margin: 10,
        width: 100,
        height: 100
    },
    onlineListStyle:{
        alignItems: 'center',
    },
    titleStyle:{
        fontSize: 18,
		fontWeight: 'bold',
		paddingTop: 10
        //paddingLeft: 15
    },

	//===============================================
	//OnlineListItem.js
	//===============================================

	/*
	titleStyle:{
		fontSize: 18,
		paddingLeft: 15
	},
	*/

	//===============================================
	//Profile.js
	//===============================================

	profileTopSection: {
		flex: 0.4,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},

	profileBottomSection: {
		flex: 0.6,
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#fff'
		//alignItems: 'center',
	},

	profileLeft: {
		flex: 0.4,
		alignItems: 'flex-end',
		paddingRight: 10,
	},

	labelText: {
		color: '#807F83',
		fontSize: 15,
		lineHeight: 26,
		height: 24,
		marginBottom: 10,
	},

	profileRight: {
		flex: 0.6,
		alignItems: 'flex-start',
		paddingLeft: 10,
		//flexDirection: 'row',
	},

	profileText: {
		color: '#4776AD',
		fontSize: 17,
		lineHeight: 24,
		height: 24,
		marginBottom: 10,
	},

	textInput: {
		width: 80,
		color: '#4776AD',
		fontSize: Platform.OS === 'ios' ? 15 : 12,
		lineHeight: 24,
		height: Platform.OS === 'ios' ? 24 : 48,
		//marginTop: 20,
		marginBottom: 10,
	},

	editButton: {
		marginLeft: 10,
		marginBottom: 10
	},
 
	saveButton: {
		marginLeft: 10,
		marginBottom: 10
	},

	checkBoxText: {
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	//imageStyle: {
	//	justifyContent: 'center',
	//	alignItems: 'center',
		//height: 300,
		//flex:1,
		//width: null
	//},

	//textStyleProfile: {
	//	justifyContent: 'center',
	//	alignItems: 'center',
		//marginLeft: 0,
		//marginRight: 0
	//},

	//===============================================
	//ProfileDetail.js
	//===============================================

	imageStyleDetail : {
		//justifyContent: 'center',
		//alignItems: 'center',
		//height: 300,
		flex:1,
		//width: null
	},

	/*
	textStyle: {
		//flex: 1,
		//flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		//marginLeft: 0,
		//marginRight: 0
	},
	*/

	//===============================================
	//RecentChatList.js
	//===============================================

	buttonStyle: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 100
	},


	//===============================================
	//RecentChatListItem.js
	//===============================================

	titleStyleChat: {
		fontSize: 18,
		paddingLeft: 15
	},

	deleteButton:{
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
		width:80
	},

	spinner: {
		// flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#efeff2',
		margin: 5,
		// height: 30
	  },

 
	//===============================================
	//Search.js
	//===============================================
	frameContainerStyle: {
		paddingTop: 40,
		paddingBottom: 40,
		paddingLeft: 10,
		paddingRight: 10,
		height: 40,
		backgroundColor: '#efeff2',	//'#efeff2',
		// flex: 2,
		justifyContent: 'center',
	},

	  searchContainerStyle: {
		flexDirection: 'row',
		padding: 5,
		height: 40,
		backgroundColor: '#fff',	//'#efeff2',
		justifyContent: 'space-between',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#807F83',
		//flex: 1,
		//flexDirection: 'row',
		//alignItems: 'center',
	},

	notFoundStyle: {
        //flex: 1,
		//flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
		//marginTop: 50
        //marginRight:
	},
	
	inputBox: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#000',
		paddingBottom: 10,
	  },
});

export default styles;
