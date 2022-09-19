/* eslint-disable prettier/prettier */

import { ActionType } from "../action-types";
import {
    RegisterAction,
    RegisterFailedAction,
    PasswordMismatchAction,
    PasswordMismatchFailedAction,
    LoginAction,
    LoginSuccessAction,
    LoginFailedAction,
    LogoutAction,
    LogoutSuccessAction,
    InitOnlineListAction,
    OnlineListAction,
    InitSearchAction,
    SearchListAction,
    SearchNotFoundAction,
    InitContactListAction,
    ContactListAction,
    ContactListReverseAction,
    InitRecentChatListAction,
    RecentChatListReverseAction,
    RecentChatListAction,
    InviteUserAction,
    StoreProfileAction,
    GetProfileAction,
    StoreProfileResultAction,
    fetchMsgAction,
    fetchMsgResultAction,
    sendMsgAction,
    sendMsgResultAction,
    clearMsgAction,
    StoreImageAction,
    StoreImageResultAction,
} from '../actions';

export const register = (username:string, email:string, password:string) : RegisterAction => {
    return {
        type: ActionType.REGISTER,
        payload : {
          username,
          email,
          password,
        },
    };
  }; 
export const registerFailed = (errorMsg:string) : RegisterFailedAction => {
  return {
    type: ActionType.REGISTER_FAILED,
    payload: errorMsg,
  };
};
export const passwordMismatch = () : PasswordMismatchAction => {
  return {
    type: ActionType.PASSWORD_MISMATCH,
  };
};
export const passwordMismatchFailed = (errorMsg:string) : PasswordMismatchFailedAction => {
  return {
    type: ActionType.PASSWORD_MISMATCH_FAILED,
    payload: errorMsg,
  };
};
export const login = (username:string, password:string) : LoginAction => {
    console.log('action-creators loginAction username :::::::::::::::::::::::::::', username);
    console.log('action-creators loginAction password :::::::::::::::::::::::::::', password);
    return {
        type: ActionType.LOGIN,
        payload : {
          username,
          password,
        },
    };
  };
  export const loginSuccess = (user:object, user_info:object) : LoginSuccessAction => {
    return {
        type: ActionType.LOGIN_SUCCESS,
        payload: user,
				user_info_payload: user_info,
    };
  };
  export const loginFailed = (errorMsg:string) : LoginFailedAction => {
    return {
      type: ActionType.LOGIN_FAILED,
      payload: errorMsg,
    };
  };
  export const logout = (user:object, user_info:object) : LogoutAction => {
    return {
        type: ActionType.LOGOUT,
        payload : {
          user,
          user_info,
        },
    };
  };
  export const logoutSuccess = () : LogoutSuccessAction => {
    return {
        type: ActionType.LOGOUT_SUCCESS,
    };
  };

  export const initOnlineList = (user_ID:string, user_type:string) : InitOnlineListAction => {
    return {
      type: ActionType.INIT_ONLINE_LIST,
      payload : {
        user_ID,
        user_type,
      },
    };
  };
  export const onlineListResult = (onlineList:object) : OnlineListAction => {
    return {
      type: ActionType.ONLINE_LIST,
      payload: onlineList,
    };
  };

  export const initSearch = (search_text:string, user_ID:string, user_type:string) : InitSearchAction => {
    return {
      type: ActionType.INIT_SEARCH,
      payload : {
        search_text,
        user_ID,
        user_type,
      },
    };
  };
  export const searchResult = (searchList:object) : SearchListAction => {
    return {
      type: ActionType.SEARCH_LIST,
      payload: searchList,
    };
  };
  export const searchNotFound = (errText:string) : SearchNotFoundAction => {
    return {
      type: ActionType.SEARCH_NOT_FOUND,
      payload: errText,
    };
  };

  export const initContactList = (user_ID:string, user_type:string) : InitContactListAction => {
    return {
      type: ActionType.INIT_CONTACT_LIST,
      payload : {
        user_ID,
        user_type,
      },
    };
  };
  export const contactListResult = (contactList:object) : ContactListAction => {
    return {
      type: ActionType.CONTACT_LIST,
      payload: contactList,
    }
  }
  export const contactListReverseResult = (contactListReverse:object) : ContactListReverseAction => {
    return {
      type: ActionType.CONTACT_LIST_REVERSE,
      payload: contactListReverse,
    }
  }

  export const initRecentChatList = (user_ID:string, user_type:string) : InitRecentChatListAction => {
    return {
      type: ActionType.INIT_RECENT_CHAT_LIST,
      payload : {
        user_ID,
        user_type,
      }
    }
  };
  export const recentChatListReverseResult = (recentChatListREVERSE:object, total_badge:number) : RecentChatListReverseAction => {
    return {
      type: ActionType.RECENT_CHAT_LIST_REVERSE,
      payload: recentChatListREVERSE,
      total_badge: total_badge,
    }
  }
  export const recentChatListResult = (recentChatList:object, total_badge:number) : RecentChatListAction => {
    return {
      type: ActionType.RECENT_CHAT_LIST,
      payload: recentChatList,
      total_badge: total_badge,
    }
  };

  export const inviteUser = (user:object,user_ID:string, message:string) : InviteUserAction => {
    return {
      type: ActionType.INVITE_USER,
      payload : {
        user,
        user_ID,
        message
      }
    }
  };
  //ProfileAction
  export const storeProfile = (user:object, response:object) : StoreProfileAction => {
    return {
      type: ActionType.STORE_PROFILE,
      payload : {
        user,
        response,
      },
    };
  };
  export const getProfile = (user:object) : GetProfileAction => {
    return {
      type: ActionType.GET_PROFILE,
      payload : {
        user,
      },
    };
  };
  export const storeProfileResult = (url:string) : StoreProfileResultAction => {
    return {
      type: ActionType.STORE_PROFILE_RESULT,
      payload : url,
    };
  };
  //msgAction
  export const fetchMsg = (user:object, user_info:object, navigation_params:object) : fetchMsgAction => {
    return {
        type: ActionType.FETCH_MSG,
        payload : {
          user,
          user_info,
          navigation_params,
        },
    };
  };
  export const fetchMsgResult = (user:object, messages:object) : fetchMsgResultAction => {
    return {
      type: ActionType.FETCH_MSG_RESULT,
      payload: {
        user,
        messages,
      },
    };
  };
  export const sendMsg = (msg:object, user:object, user_info:object, nav_param:object) : sendMsgAction => {
    return {
        type: ActionType.SEND_MSG,
        payload : {
          msg,
          user,
          user_info,
          nav_param,
        },
    };
  };
  export const sendMsgResult = (outOfBalance:boolean, goLoginForm:boolean, disableUser:boolean, chargeId:string) : sendMsgResultAction => {
  // export const sendMsgResult = (obj: object) : sendMsgResultAction => {
    return {
      type: ActionType.SEND_MSG_RESULT,
      payload : {
        // obj,
        outOfBalance,
        goLoginForm,
        disableUser,
        chargeId,
      },
    };
  };
  export const clearMsg = () : clearMsgAction => {
    return {
        type: ActionType.CLEAR_MSG,
    };
  };

  export const storeImage = (user:object, response:object, point_amount:number, nav_param:object) : StoreImageAction => {
    return {
      type: ActionType.STORE_IMAGE,
      payload : {
        user,
        response,
        point_amount,
        nav_param,
      },
    };
  };
  export const storeImageResult = (url:string, point_amount:number) : StoreImageResultAction => {
    return {
      type: ActionType.STORE_IMAGE_RESULT,
      payload : { url, point_amount },
    };
  };