/* eslint-disable prettier/prettier */
import { ActionType } from '../action-types';
import { Action } from '../actions';

const INITIAL_STATE = {
	loading: false,
	isNoUser:false,
	isSending: false,
	user: {},
	contact: {},
	messages: {},
	// obj: {},
	outOfBalance: false,
	goLoginForm: false,
	disableUser: false,
	chargeId: '',
	skip_charging_once: false,
	url:'',
	point_amount: 0,
};

interface INITIAL_TS {
	loading: boolean,
	isNoUser: boolean,
	isSending: boolean,
	user: object,
	messages: object,
	outOfBalance: boolean,
	goLoginForm: boolean,
	disableUser: boolean,
	chargeId: string,
	skip_charging_once: false,
	url:string,
	point_amount: number,
}

const msgReducer = ( state : INITIAL_TS = INITIAL_STATE, action:Action ):INITIAL_TS => {
    // console.log('msgReducer action.type',action.type, ' action',action);
    switch (action.type) {
		case ActionType.LOADING_MSG:
			return {
				...state,
			};
			// return { ...INITIAL_STATE};
		case ActionType.NO_USER_ALERT:
			// console.log('ChatMessage reducer NO_USER_ALERT action.payload   : ',action.payload);
			return {
				...state,
				isNoUser:true,
			};
		case ActionType.FETCH_MSG:
			//console.log('ChatMessage reducer FETCH_MESSAGES action.payload   : ',action.payload);
			return {
				...state,
				// loading: true,
			};
		case ActionType.FETCH_MSG_RESULT:
			// console.log('ChatMessage reducer FETCH_MESSAGES action.payload   : ',action.payload);
			return {
				...state,
				user: action.payload.user,
				messages: action.payload.messages,
				loading: true,
			};
		case ActionType.SEND_MSG:
			//console.log('ChatMessage reducer SEND_MESSAGE action.payload   : ',action.payload);
			return {
				...state,
				// ...action.payload
			};
		case ActionType.SEND_MSG_RESULT:
			// console.log('ChatMessage reducer SEND_MSG_RESULT action.payload   : ',action.payload);
			return {
				...state,
				outOfBalance: action.payload.outOfBalance,
				goLoginForm: action.payload.goLoginForm,
				disableUser: action.payload.disableUser,
				chargeId: action.payload.chargeId,
				// obj: action.payload.obj,

			};
		case ActionType.CLEAR_MSG:
			return {
				...state,
				messages: {},
			};
		case ActionType.SENDING_MSG:
			return {
				...state,
				isSending:true,
			};
		case ActionType.RESET_MSG:
			// console.log('ChatMessage reducer RESET_MESSAGES action.payload   : ',action.payload);
			return {
				...state,
				loading:false,
			};
		case ActionType.ERROR_MSG:
			return {
				...state,
				// ...action.payload
			};
		case ActionType.STORE_IMAGE:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			return {
				...state,
			};
		case ActionType.STORE_IMAGE_RESULT:
			console.log('msgReducer STORE_IMAGE_RESULT action.payload : ', action.payload);
			return {
				...state,
				url: action.payload.url,
				point_amount: action.payload.point_amount,
			};
		default:
			return state;
		}
};

export default msgReducer;
