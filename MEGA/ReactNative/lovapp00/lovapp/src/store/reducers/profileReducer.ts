/* eslint-disable prettier/prettier */
import { ActionType } from '../action-types';
import { Action } from '../actions';

const INITIAL_STATE = {
	url:'',
};

interface INITIAL_TS {
	url: string,
}

const profileReducer = ( state : INITIAL_TS = INITIAL_STATE, action:Action ):INITIAL_TS => {
    // console.log('listReducer action.type',action.type, ' action',action);
    switch (action.type) {
		case ActionType.STORE_PROFILE:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			return {
				...state,
			};
		case ActionType.GET_PROFILE:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			return {
				...state,
			};
		case ActionType.STORE_PROFILE_RESULT:
			// console.log('ListReducer CONTACT_LIST action.payload : ', action.payload);
			return {
				...state,
				url: action.payload,
			};

		default:
			return state;
		}
};

export default profileReducer;
