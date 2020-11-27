import firebase from "./../../firebase";
export const chatListenChildRemoved = function({ state, getters, commit }) {
  if (getters.isUsingFirebase) {
    if (!_.isEmpty(wilUltilsFirebase.oPrevChildRemovedChatRoomRef)) {
      wilUltilsFirebase.oPrevChildRemovedChatRoomRef.off("child_added");
    }

    const oListenChatRemoved = wilUltilsFirebase.oChatRoomRef.on(
      "child_removed",
      snap => {
        commit("deleteMessageItem", snap.key);
      }
    );
    wilUltilsFirebase.oPrevChildRemovedChatRoomRef = oListenChatRemoved;
  }
};
