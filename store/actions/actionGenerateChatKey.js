export const generateChatKey = function ({
    state
}, isSenderFirst) {
    let fKey = '',
        sKey = '';
    if (isSenderFirst === true) {
        sKey = state.chattingWithId;
        fKey = state.loggedInId;
    } else {
        fKey = state.chattingWithId;
        sKey = state.loggedInId;
    }

    return WilCityHelpers.generateChatRoomKey(fKey, sKey);
}
