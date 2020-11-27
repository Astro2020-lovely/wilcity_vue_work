import firebase from "./../../firebase";

export const handleChatWith = async function(
  { state, commit, dispatch, getters },
  numberOfChats
) {
  numberOfChats = !numberOfChats ? 50 : parseInt(numberOfChats, 10);

  let oStatus = {
    success: true,
    isFoundAll: false
  };

  if (getters.isUsingFirebase) {
    const oCheckLoggedInStatus = dispatch("signInToFirebase");

    return oCheckLoggedInStatus.then(async status => {
      if (status) {
        if (!state.chattingWithId) {
          oStatus = {
            ...oStatus,
            success: false
          };
          return oStatus;
        }

        const oChatKeyPromise = dispatch("buildChatKey");
        await oChatKeyPromise.then(async chatKey => {
          if (chatKey) {
            commit("setIsDisablingChatMessage", false);
            if (!!state.chatKey) {
              commit("setPrevChatKey", state.chatKey);
            }
            const oChatRoomRef = firebase.db.ref(
              `messages/chats/${state.chatKey}/lists`
            );
            // if (!!wilUltilsFirebase.oChatRoomRef) {
            //   wilUltilsFirebase.oChatRoomRef.off();
            // }
            wilUltilsFirebase.oChatRoomRef = oChatRoomRef;
            let oQuery = null,
              oNewChatMessages = null;
            if (state.oChatRoomMessages) {
              const aKeys = Object.keys(state.oChatRoomMessages);
              oQuery = oChatRoomRef
                .orderByKey()
                .endAt(aKeys[0])
                .limitToLast(numberOfChats);
            } else {
              oQuery = oChatRoomRef.orderByKey().limitToLast(numberOfChats);
            }

            await oQuery.once("value", snap => {
              dispatch("fetchFirstMessageKeyOfChatRoom", oChatRoomRef);
              oNewChatMessages = snap.val();
              if (oNewChatMessages) {
                dispatch("updateChatRoomMessages", {
                  oNewChatMessages,
                  isNewMessage: false
                });
                const firstMessageKey = getters["getFirstMessageKeyOfChatRoom"];
                oStatus = {
                  ...oStatus,
                  isFoundAll: firstMessageKey in oNewChatMessages
                };
                // // Fix Chat Room Key
                dispatch("fixChatRoomUserKey");
              } else {
                oStatus = {
                  ...oStatus,
                  isFoundAll: true
                };
              }
            });
          } else {
            alert(WILCITY_I18.couldNotCreateChatRoom);
            oStatus = {
              ...oStatus,
              isFoundAll: false
            };
          }
        });
      } else {
        oStatus = {
          ...oStatus,
          isFoundAll: false
        };
      }

      return oStatus;
    });
  } else {
    await jQuery.ajax({
      type: "POST",
      url: WILOKE_GLOBAL.ajaxurl,
      data: {
        action: "wilcity_fetch_author_messages",
        excludes: this.aFetchedMessageIDs,
        chattingWithId: state.chattingWithId
      },
      success: response => {
        if (response.success) {
          dispatch("updateChatRoomMessages", {
            oNewChatMessages: response.data.msg,
            isNewMessage: false
          });

          if (
            response.data.reachedMaximum &&
            response.data.reachedMaximum === "yes"
          ) {
            oStatus = {
              ...oStatus,
              isFoundAll: true
            };
          }

          return oStatus;
        }

        oStatus = {
          ...oStatus,
          isFoundAll: false
        };
        return oStatus;
      }
    });
    return oStatus;
  }
};
