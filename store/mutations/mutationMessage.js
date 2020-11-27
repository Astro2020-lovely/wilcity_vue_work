const { fromJS, OrderedMap } = require("immutable");

export default {
  updateChatRoomSubscription(state, info) {
    state.oChatRoomSubscription = {
      ...state.oChatRoomSubscription,
      info
    };
  },
  updateWatchSendMessageToEmail(state, info) {
    state.oWatchSendMessageToEmail = {
      ...state.oWatchSendMessageToEmail,
      info
    };
  },
  updateObserverSendMessage(state, info) {
    state.oObserverSendMessage = {
      ...state.oObserverSendMessage,
      ...info
    };
  },
  setListenChatRemoved(state, controller) {
    state.oListenChatRemoved = {
      ...controller
    };
  },
  setPrevChatKey(state, chatKey) {
    state.prevChatKey = chatKey;
  },
  setListenToAddNewChattedWith(state, controller) {
    state.oListenToAddNewChattedWith = {
      ...controller
    };
  },
  setListenChatAdded(state, oListenChatAdded) {
    state.oListenChatAdded = {
      ...oListenChatAdded
    };
  },
  setChatRoomRef(state, controller) {
    console.log(controller); // resolve vuex mutations
    state.chatRoomRef = JSON.parse(controller);
  },
  setIsListenToChangedChattedWith(state, status) {
    state.isListenToChangedChattedWith = status;
  },
  setIsFetchedChattedWithAvatar(state, status) {
    state.isFetchedChattedWithAvatar = status;
  },
  setFirstChattedWithInfo(state, info) {
    state.oFirstChattedWithInfo = {
      ...info
    };
  },
  setIsUsingFirebase(state, status) {
    state.isUsingFirebase = status;
  },
  setUserTotalNewMessages(state, oTotalNewMessages) {
    state.oUsersTotalNewMessages = {
      ...state.oUsersTotalNewMessages,
      [oTotalNewMessages.uID]: oTotalNewMessages.total
    };
  },
  setCountMyNewMessages(state, newMsg) {
    state.countMyNewMsg = newMsg;
  },
  setChattingWithId(state, uid) {
    state.chattingWithId = uid;
  },
  setChattingWithFirebaseId(state, firebaseId) {
    state.chattingWithFirebaseID = firebaseId;
    state.isTriggeredGetChatWithID = true;
  },
  updateUserProfileDetails(state, oInfo) {
    state.oUserProfileDetails = {
      ...state.oUserProfileDetails,
      [oInfo.userId]: oInfo.oProfile
    };
  },
  setExcludeAuthors(state, aUserIds) {
    state.aExcludeAuthors = aUserIds;
  },
  updateUserAvatarAndDisplayName(state, oInfo) {
    state.oListOfChattedWith = OrderedMap(state.oListOfChattedWith);
    let oAvatarAndDisplayName = fromJS({ [oInfo.firebaseHashedKey]: oInfo });
    state.oListOfChattedWith = state.oListOfChattedWith
      .mergeDeep(oAvatarAndDisplayName)
      .toJS();
  },
  setListOfChattedWith(state, oChattedWith) {
    state.oListOfChattedWith = {
      ...oChattedWith
    };
  },
  updateListOfChattedWith(state, info) {
    if (state.oListOfChattedWith === null) {
      state.setListOfChattedWith = {
        ...info
      };
    } else {
      state.oListOfChattedWith = {
        ...state.oListOfChattedWith,
        ...info
      };
    }
  },
  deleteListOfChattedWith(state, key) {
    if (state.oListOfChattedWith) {
      state.oListOfChattedWith = wilModifyObject.deleteItem(
        key,
        state.oListOfChattedWith
      );
    }
  },
  setChatKey(state, chatKey) {
    state.chatKey = chatKey;
    state.aChatKeys = {
      ...state.aChatKeys,
      chatKey
    };
  },
  setCacheChatKey(state, chatKey) {
    state.aChatKeys = {
      ...state.aChatKeys,
      chatKey
    };
  },
  setChatMessages(state, oChatRoomMessages) {
    state.oChatRoomMessages = Array.isArray(oChatRoomMessages)
      ? [...oChatRoomMessages]
      : {
          ...oChatRoomMessages
        };
  },
  deleteMessageItem(state, key) {
    if (state.oChatRoomMessages) {
      delete state.oChatRoomMessages[key];
    }
  },
  clearChatRoomMessage(state) {
    state.oChatRoomMessages = null;
  },
  setDeleteMessageInfo(state, oInfo) {
    state.oDeleteMessageInfo = {
      ...oInfo
    };
  },
  setLoggedIntoFirebaseStatus(state, status) {
    state.isLoggedIntoFirebase = status;
  },
  setLoggedIntoChatRoom(state, status) {
    state.isLoggedIntoChatRoom = status;
  },
  setIsCheckingLoginStatus(state, status) {
    state.isLoggedIntoFirebase = status;
  },
  setIsDisablingChatMessage(state, status) {
    state.isDisablingChatMessage = status;
  },
  updateFirstMessageKeyOfChatRooms(state, firstMessageKey) {
    state.oFirstMessageKeyOfChatRooms = {
      ...state.oFirstMessageKeyOfChatRooms,
      [state.chatKey]: firstMessageKey
    };
  },
  setDeleteChatRoomInfo(state, aInfo) {
    state.oDeleteChatRoomInfo = Array.isArray(aInfo)
      ? [...aInfo]
      : {
          ...aInfo
        };
  },
  setMyNewMessages(state, oNewMessages) {
    state.oMyNewMessages = {
      ...oNewMessages
    };
  },
  deleteMessageOfChatRoom(state, messageID) {
    let oItem = state.oChatRoomMessages.find(oItem => {
      return messageID === oItem.ID;
    });

    const key = state.oChatRoomMessages.indexOf(oItem);

    let oChatRoomMessages = [...state.oChatRoomMessages];
    if (key !== null) {
      oChatRoomMessages.splice(key, 1);
    }
    state.oChatRoomMessages = [...oChatRoomMessages];
  },
  deleteChatRoom(state, chattedWithId) {
    if (state.isUsingFirebase !== "yes" || state.isUsingFirebase === false) {
      Vue.delete(state.oListOfChattedWith, chattedWithId);
    }
  },
  updateSeenMessage(state) {
    if (state.isUsingFirebase === "yes" || state.isUsingFirebase === true) {
      state.oListOfChattedWith[state.chattingWithId] = {
        ...state.oListOfChattedWith[state.chattingWithId],
        ...{
          seen: "yes"
        }
      };
    }
  }
};
