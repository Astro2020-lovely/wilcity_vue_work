import firebase from './../../firebase.js'

export const deleteChatRoom = async function ({
    state,
    getters,
    dispatch,
    commit
}, oInfo) { // The user id of partner
    if (getters.isUsingFirebase) {
        const chatRoomKey = WilCityHelpers.generateChatRoomKey(state.loggedInId, oInfo.userID);
        const reverseChatRoomKey = WilCityHelpers.generateChatRoomKey(oInfo.userID, state.loggedInId);
        let errMsg = '',
            oFinalStatus = {};

        const isSuccess = firebase.db.ref(`messages/chats/${chatRoomKey}`).remove().then(msg => {
            return msg ? true : false;
        }).catch((err) => {
            errMsg = err;
            return false;
        });

        const oReverseStatus = await firebase.db.ref(`messages/chats/${reverseChatRoomKey}`).remove().then(msg => {
            return true;
        }).catch(err => {
            errMsg = err;
            return false;
        });

        if (isSuccess) {
            oFinalStatus = {
                success: true
            };
            dispatch('fetchChattedWith', 'deleted_an_author');
        } else {
            oFinalStatus = oReverseStatus.then(status => {
                return status ? {
                    success: true
                } : {
                    success: false,
                    msg: errMsg
                };
            });
        }

        if (oFinalStatus.success) {
            dispatch('deleteLatestMessage', oInfo.key);
        }

        return oFinalStatus;
    } else {
        let oStatus = {};
        await jQuery.ajax({
            type: 'post',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
                action: 'wilcity_delete_chat_room',
                chattingWithId: oInfo.userID
            },
            success: (response => {
                oStatus.success = response.success;
                if (!response.success) {
                    oStatus.msg = response.data.msg;
                } else { // re-update chatting with
                    commit('deleteChatRoom', oInfo.userID);

                    if (oInfo.userID == state.chattingWithId && typeof state.oListOfChattedWith === 'object') {
                        const aListOfChattedWithValues = Object.values(state.oListOfChattedWith);
                        if (aListOfChattedWithValues.length) {
                            commit('setChattingWithId', aListOfChattedWithValues[0].userID);
                        }
                    }
                    dispatch('fetchChattedWith', 'deleted_an_author');
                }
            })
        });

        return oStatus;
    }
}
