export const updateChatRoomMessages = function ({
    state,
    commit,
    getters
}, oInfo) {
    if (state.oChatRoomMessages) {
        if (getters.isUsingFirebase) {
            // const oNewChatMessages = OrderedMap(oInfo.oNewChatMessages) // because loading message by scrolling up
            // state.oChatRoomMessages = fromJS(state.oChatRoomMessages)
            if (oInfo.isNewMessage) {
                commit('setChatMessages', {
                    ...state.oChatRoomMessages,
                    ... oInfo.oNewChatMessages
                });
            } else {
                commit('setChatMessages', {
                    ... oInfo.oNewChatMessages,
                    ...state.oChatRoomMessages
                });
            }
        } else {
            if (oInfo.isNewMessage) {
                commit('setChatMessages', [
                    ...state.oChatRoomMessages,
                    oInfo.oNewChatMessages
                ]);
            } else {
                commit('setChatMessages', [
                    oInfo.oNewChatMessages,
                    ...state.oChatRoomMessages
                ]);
            }
        }
    } else {
        if (getters.isUsingFirebase) {
            commit('setChatMessages', {
                ... oInfo.oNewChatMessages
            });
        } else {
            if (oInfo.isNewMessage) {
                commit('setChatMessages', [... oInfo.oNewChatMessages]);
            } else {
                commit('setChatMessages', {
                    ... oInfo.oNewChatMessages
                });
            }
        }
    }
}
