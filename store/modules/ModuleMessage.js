import getterMessage from "./../getters/getterMessage";
import mutationMessage from "./../mutations/mutationMessage";
import { countTotalNewMessages } from "./../actions/actionCountTotalNewMessages";
import { fetchUserDisplayNameAndAvatar } from "./../actions/actionFetchUserDisplayNameAndAvatar";
import { fetchChattedWith } from "./../actions/actionFetchChattedWith";
import { fetchChatRoom } from "./../actions/actionFetchChatRoom";
import { buildChatRoomKey } from "./../actions/actionBuildChatRoomKey";
import { buildChatKey } from "./../actions/actionBuildChatKey";
import { setChattingWithId } from "./../actions/actionSetChattingWithId";
import { signInToFirebase } from "./../actions/actionSignInToFirebase";
import { generateChatKey } from "./../actions/actionGenerateChatKey";
import { handleChatWith } from "./../actions/actionHandleChatWith";
import { updateChatRoomMessages } from "./../actions/actionUpdateChatRoomMessages";
import { chatListenChildRemoved } from "./../actions/actionChatListenChildRemoved";
import { chatListenChildAdded } from "./../actions/actionChatListenChildAdded";
import { clearChatRoomMessages } from "./../actions/actionClearChatRoomMessages";
import { submitChatMessage } from "./../actions/actionSubmitChatMessage";
import { updateLatestMessage } from "./../actions/actionUpdateLatestMessage";
import { deleteMessage } from "./../actions/actionDeleteMessage";
import { ajaxFetchChattedWith } from "./../actions/actionAjaxFetchChattedWith";
import { setChattingWithFirebaseId } from "./../actions/actionSetChattingWithFirebaseId";
import { fetchChattingWithProfileDetails } from "./../actions/actionFetchChattingWithProfileDetails";
import { fetchFirstMessageKeyOfChatRoom } from "./../actions/actionFetchFirstMesageKeyOfChatRoom";
import { ajaxSearchUsers } from "./../actions/actionAjaxSearchUsers";
import { deleteChatRoom } from "./../actions/actionDeleteChatRoom";
import { deleteLatestMessage } from "./../actions/actionDeleteLatestMessage";
import { maskLatestMessageAsRead } from "./../actions/actionMaskLatestMessageAsRead";
import { fetchMyNewMessages } from "./../actions/actionFetchMyNewMessages";
import { updateReadMessage } from "./../actions/actionUpdateReadMessage";
// import {sendMessageToEmail} from './../actions/actionSendMessageToEmail'
import { updateChattedWith } from "./../actions/actionUpdateChattedWith";
// import {addNewChattedWith} from './../actions/actionAddNewChattedWith'
import { fixChatRoomUserKey } from "./../actions/actionFixChatRoomUserKey";
import { observerSendMessage } from "./../actions/actionObserverSendMessage";

export const ModuleMessage = {
  namespaced: true,
  state: {
    loggedInId: parseInt(WILOKE_INLINE_GLOBAL.userID),
    uId: "",
    sUsername: "",
    sMsgId: "",
    chattingWithId: null,
    chattingWithFirebaseID: null,
    oUserProfileDetails: null,
    oFirstMessageKeyOfChatRooms: {}, // Store first message key of all chat room => Infinite scroll up
    oUsersTotalNewMessages: {},
    countMyNewMsg: 0,
    isUsingFirebase: WILOKE_INLINE_GLOBAL.isUsingFirebase,
    aExcludeAuthors: [],
    oListOfChattedWith: null,
    oFirebaseFetchChattedWith: null,
    oUsersDisplayNameAndAvatar: {},
    isLoggedIntoFirebase: false,
    isLoggedIntoChatRoom: false,
    isCheckingLoginStatus: false,
    isTriggeredGetChatWithID: false,
    chatKey: null,
    aChatKeys: [],
    oChatRoomRef: null,
    chatRoomRef: {},
    oChatRoomMessages: null,
    oListenChatAdded: null,
    oListenChatRemoved: null,
    oDeleteChatRoomInfo: {},
    oDeleteMessageInfo: {},
    isDisablingChatMessage: false,
    oMyNewMessages: {},
    oChatRoomSubscription: null,
    oChattedWithSubscription: null,
    oFirstChattedWithInfo: null,
    // oWatchSendMessageToEmail: {},
    isFetchedChattedWithAvatar: false,
    isListenToChangedChattedWith: false,
    oListenToAddNewChattedWith: null,
    oObserverSendMessage: {},
    prevChatKey: ""
  },
  getters: {
    ...getterMessage
  },
  actions: {
    buildChatKey,
    countTotalNewMessages,
    fetchChattedWith,
    fetchUserDisplayNameAndAvatar,
    fetchChatRoom,
    buildChatRoomKey,
    setChattingWithId,
    signInToFirebase,
    generateChatKey,
    handleChatWith,
    updateChatRoomMessages,
    chatListenChildRemoved,
    chatListenChildAdded,
    clearChatRoomMessages,
    submitChatMessage,
    updateLatestMessage,
    deleteMessage,
    ajaxFetchChattedWith,
    setChattingWithFirebaseId,
    fetchChattingWithProfileDetails,
    fetchFirstMessageKeyOfChatRoom,
    ajaxSearchUsers,
    deleteChatRoom,
    deleteLatestMessage,
    maskLatestMessageAsRead,
    fetchMyNewMessages,
    updateReadMessage,
    // sendMessageToEmail,
    updateChattedWith,
    fixChatRoomUserKey,
    observerSendMessage
  },
  mutations: {
    ...mutationMessage
  }
};
