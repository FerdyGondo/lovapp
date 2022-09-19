/* eslint-disable prettier/prettier */
import { ActionType } from '../action-types';
import { Action } from '../actions';

const INITIAL_STATE = {
	onlineList:'',
	searchList:'',
	contactList: '',
	contactListReverse: '',
	recentChatListREVERSE: '',
	recentChatList: '',
	total_badge: 0,
	errText: '',
	refreshing: false,
};

interface INITIAL_TS {
	onlineList: Array,
	searchList: Array,
	contactList: Array,
	contactListReverse: Array,
	recentChatListREVERSE: Array,
	recentChatList: Array,
	total_badge: number,
	errText: string,
	refreshing: boolean,
}

const listReducer = ( state : INITIAL_TS = INITIAL_STATE, action:Action ):INITIAL_TS => {
    // console.log('listReducer action.type',action.type, ' action',action);
    switch (action.type) {
		case ActionType.INIT_ONLINE_LIST:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			//return {...state, contactList: action.payload, sortContactList: action.sort};
			return {
				...state,
			};
		case ActionType.ONLINE_LIST:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			//return {...state, contactList: action.payload, sortContactList: action.sort};
			return {
				...state,
				onlineList: action.payload,
			};
		case ActionType.INIT_SEARCH:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			return {
				...state,
				refreshing: true,
			};
		case ActionType.SEARCH_LIST:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			return {
				...state,
				searchList: action.payload,
				errText: '',
				refreshing: false,
			};
		case ActionType.SEARCH_NOT_FOUND:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			return {
				...state,
				errText: action.payload,
				refreshing: false,
			};
		case ActionType.INIT_CONTACT_LIST:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			//return {...state, contactList: action.payload, sortContactList: action.sort};
			return {
				...state,
			};
		case ActionType.CONTACT_LIST:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			return {
				...state,
				contactList: action.payload,
			};
		case ActionType.CONTACT_LIST_REVERSE:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			return {
				...state,
				contactListReverse: action.payload,
			};

		case ActionType.INIT_RECENT_CHAT_LIST:
			// console.log('ListReducer INIT_RECENT_CHAT_LIST action.payload : ', action.payload);
			return {
				...state,
			};
		case ActionType.RECENT_CHAT_LIST_REVERSE:
			// console.log('ListReducer RECENT_CHAT_LIST_REVERSE action.payload : ', action.payload);
			return {
				...state,
				recentChatListREVERSE: action.payload,
				total_badge: action.total_badge,
			};
		case ActionType.RECENT_CHAT_LIST:
			// console.log('ListReducer RECENT_CHAT_LIST action.payload : ', action.payload);
			return {
				...state,
				recentChatList: action.payload,
				total_badge: action.total_badge,
			};

		case ActionType.INVITE_USER:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			//return {isFetching=false, ...state, contactList: action.payload};
			//return {...state, contactList: action.payload, sortContactList: action.sort};
			return {
				...state,
				// user: action.payload,
				// contact_sort: action.contact_sort_payload
			};
		// case LOGOUT:
		// 	// return state = INITIAL_STATE;
		// 	console.log('ListReducer LOGOUT action.payload : ', action.payload);
		// 	return { ...INITIAL_STATE};

		default:
			return state;
		}
};

export default listReducer;
