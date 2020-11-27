import firebase from "./../../firebase";
export const chatListenChildAdded = function({
  state,
  dispatch,
  getters,
  commit
}) {
  if (getters.isUsingFirebase) {
    // When switching to chat with new customer, We will disable this child_added on previous
    if (!_.isEmpty(wilUltilsFirebase.oPrevChildAddedChatRoomRef)) {
      wilUltilsFirebase.oPrevChildAddedChatRoomRef.off("child_added");
    }

    const oListenChatAdded = wilUltilsFirebase.oChatRoomRef;
    oListenChatAdded.limitToLast(1).on("child_added", snap => {
      dispatch("updateChatRoomMessages", {
        oNewChatMessages: {
          [snap.key]: snap.val()
        },
        isNewMessage: true
      });
    });
    wilUltilsFirebase.oPrevChildAddedChatRoomRef = oListenChatAdded;
  } else {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource
    if (state.oChatRoomSubscription) {
      clearInterval(state.oChatRoomSubscription);
    }

    const handleSetInterval = setInterval(() => {
      const oLastMsg =
        state.oChatRoomMessages === null
          ? {
              ID: ""
            }
          : Object.values(state.oChatRoomMessages).pop();
      const url =
        WILOKE_GLOBAL.ajaxurl +
        "?action=wilcity_subscribe_chat_room&chatWith=" +
        state.chattingWithId +
        "&lastMaxID=" +
        oLastMsg.ID;
      jQuery.ajax({
        type: "GET",
        url: url,
        success: response => {
          const mode = response.data.codeMsg;
          if (response.success) {
            switch (mode) {
              case "new_messages":
                dispatch("updateChatRoomMessages", {
                  oNewChatMessages: response.data.messages,
                  isNewMessage: true
                });
                break;
            }
          } else {
            switch (mode) {
              case "chat_room_not_exist":
                clearInterval(handleSetInterval);
                break;
            }
          }
        }
      });
    }, 15000);

    commit("updateChatRoomSubscription", handleSetInterval);
  }
};
