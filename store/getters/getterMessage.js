export default {
  getMyUserId: state => {
    return state.loggedInId;
  },
  isUsingFirebase: state => {
    return state.isUsingFirebase === "yes";
  },
  getTotalNewMessages: state => uID => {
    return !state.oUsersTotalNewMessages[uID]
      ? 0
      : state.oUsersTotalNewMessages[oTotalNewMessages.uID];
  },
  getMyTotalNewMessages: state => {
    return state.countMyNewMsg;
  },
  getChattingWithId: state => {
    return state.chattingWithId;
  },
  getListOfChattedWith: state => {
    return state.oListOfChattedWith;
  },
  getUserAvatar: state => uid => {
    return state.oUsersDisplayNameAndAvatar[uid];
  },
  getChatRoomKey: state => (chatWithId, isReverse) => {
    return typeof isReverse === "undefined"
      ? "___" + state.loggedInId + "___" + chatWithId
      : "___" + chatWithId + "___" + state.loggedInId;
  },
  getChatRoomMessages: state => {
    return state.oChatRoomMessages;
  },
  getDeleteMessageInfo: state => {
    return state.oDeleteMessageInfo;
  },
  getDeleteChatRoomInfo(state) {
    return state.oDeleteChatRoomInfo;
  },
  getIsDisablingChatMessage: state => {
    return state.isDisablingChatMessage;
  },
  getChattingWithProfileDetails: state => {
    if (!state.oUserProfileDetails) {
      return {};
    }
    return !state.oUserProfileDetails[state.chattingWithId]
      ? {}
      : {
          ...state.oUserProfileDetails[state.chattingWithId]
        };
  },
  getChatWithProfile: state => {
    if (state.oListOfChattedWith === null) {
      return {};
    }

    if (state.isUsingFirebase === "yes") {
      return {
        ...state.oListOfChattedWith[state.chattingWithFirebaseID]
      };
    }
  },
  getFirstMessageKeyOfChatRoom: state => {
    return state.oFirstMessageKeyOfChatRooms[state.chatKey]
      ? {
          ...state.oFirstMessageKeyOfChatRooms[state.chatKey]
        }
      : "";
  },
  isLoadedAllMessageInTheChatRoom(state) {
    return (
      state.oChatRoomMessages &&
      state.oFirstMessageKeyOfChatRooms[state.chatKey] in
        state.oChatRoomMessages
    );
  },
  getMyNewMessages(state) {
    return state.oMyNewMessages;
  },
  getPrevChatKey(state) {
    return state.prevChatKey;
  }
};
