export const fetchFirstMessageKeyOfChatRoom = function ({
    commit,
    state
}, oChatRoomRef) {
    if (!state.chatKey) {
        return false;
    }

    if (state.oFirstMessageKeyOfChatRooms[state.chatKey]) {
        return true;
    }

    oChatRoomRef.limitToFirst(1).once('value', snap => {
        const oVal = snap.val();
        if (oVal !== null) {
            commit('updateFirstMessageKeyOfChatRooms', Object.keys(oVal)[0]);
        }
    });
}
