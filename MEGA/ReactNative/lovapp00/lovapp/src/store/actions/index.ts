/* eslint-disable prettier/prettier */
import { ActionType } from '../action-types'

export type Action =
    | RegisterAction
    | RegisterFailedAction
    | PasswordMismatchAction
    | PasswordMismatchFailedAction
    | LoginAction
    | LoginSuccessAction
    | LoginFailedAction
    | LogoutAction
    | LogoutSuccessAction
    | InitOnlineListAction
    | OnlineListAction
    | InitSearchAction
    | SearchListAction
    | SearchNotFoundAction
    | InitContactListAction
    | ContactListAction
    | ContactListReverseAction
    | InitRecentChatListAction
    | RecentChatListReverseAction
    | RecentChatListAction
    | InviteUserAction
    | StoreProfileAction
    | GetProfileAction
    | StoreProfileResultAction
    | fetchMsgAction
    | fetchMsgResultAction
    | sendMsgAction
    | sendMsgResultAction
    | clearMsgAction
    | StoreImageAction
    | StoreImageResultAction
    ;
//AuthAction
export interface RegisterAction {
    type: ActionType.REGISTER;
    payload : {
        username:string;
        email:string;
        password:string;
    }
}
export interface RegisterFailedAction {
    type: ActionType.REGISTER_FAILED;
    payload: string;
}
export interface PasswordMismatchAction {
    type: ActionType.PASSWORD_MISMATCH;
}
export interface PasswordMismatchFailedAction {
    type: ActionType.PASSWORD_MISMATCH_FAILED;
    payload: string;
}
export interface LoginAction {
    type: ActionType.LOGIN;
    payload : {
        username:string;
        password:string;
      }
}
export interface LoginSuccessAction {
    type: ActionType.LOGIN_SUCCESS;
    payload: object,
    user_info_payload: object
}
export interface LoginFailedAction {
    type: ActionType.LOGIN_FAILED;
    payload: string
}
export interface LogoutAction {
    type: ActionType.LOGOUT;
    payload : {
        user:object;
        user_info:object;
    }
}
export interface LogoutSuccessAction {
    type: ActionType.LOGOUT_SUCCESS;
}
//ListAction
export interface InitOnlineListAction {
    type: ActionType.INIT_ONLINE_LIST;
    payload: {
        user_ID: string,
        user_type: string
    }
}
export interface OnlineListAction {
    type: ActionType.ONLINE_LIST;
    payload: object;
}

export interface InitSearchAction {
    type: ActionType.INIT_SEARCH;
    payload: {
        search_text: string,
        user_ID: string,
        user_type: string
    }
}

export interface SearchListAction {
    type: ActionType.SEARCH_LIST;
    payload: object;
}
export interface SearchNotFoundAction {
    type: ActionType.SEARCH_NOT_FOUND;
    payload: string;
}

export interface InitContactListAction {
    type: ActionType.INIT_CONTACT_LIST;
    payload: {
        user_ID: string,
        user_type: string
    }
}
export interface ContactListAction {
    type: ActionType.CONTACT_LIST;
    payload: object;
}
export interface ContactListReverseAction {
    type: ActionType.CONTACT_LIST_REVERSE;
    payload: object;
}

export interface InitRecentChatListAction {
    type: ActionType.INIT_RECENT_CHAT_LIST;
    payload: {
        user_ID: string,
        user_type: string
    }
}
export interface RecentChatListReverseAction {
    type: ActionType.RECENT_CHAT_LIST_REVERSE;
    payload: object;
    total_badge:number;
}
export interface RecentChatListAction {
    type: ActionType.RECENT_CHAT_LIST;
    payload: object;
    total_badge:number;
}

export interface InviteUserAction {
    type: ActionType.INVITE_USER;
    payload: {
        user:object,
        user_ID: string,
        message: string
    }
}
//ProfileAction
export interface StoreProfileAction {
    type: ActionType.STORE_PROFILE;
    payload: {
        user: object;
        response: object;
    }
}
export interface GetProfileAction {
    type: ActionType.GET_PROFILE;
    payload: {
        user: object;
    }
}
export interface StoreProfileResultAction {
    type: ActionType.STORE_PROFILE_RESULT;
    payload: string;
}
//MsgAction
export interface fetchMsgAction {
    type: ActionType.FETCH_MSG,
    payload : {
        user: object,
        user_info: object,
        navigation_params: object,
    }
}
export interface fetchMsgResultAction {
    type: ActionType.FETCH_MSG_RESULT,
    payload : {
        user: object,
        messages: object,
    }
}
export interface sendMsgAction {
    type: ActionType.SEND_MSG,
    payload : {
        msg: object,
        user: object,
        user_info: object,
        nav_param: object,
    }
}
export interface sendMsgResultAction {
    type: ActionType.SEND_MSG_RESULT,
    payload : {
        // obj:object,
        outOfBalance: boolean,
        goLoginForm: boolean,
        disableUser: boolean,
        chargeId: string,
    }
}

export interface clearMsgAction {
    type: ActionType.CLEAR_MSG,
}
export interface StoreImageAction {
    type: ActionType.STORE_IMAGE;
    payload: {
        user: object;
        response: object;
        point_amount: number;
        nav_param: object;
    }
}
export interface StoreImageResultAction {
    type: ActionType.STORE_IMAGE_RESULT;
    payload: {
        url : string;
        point_amount : number;
    };
}