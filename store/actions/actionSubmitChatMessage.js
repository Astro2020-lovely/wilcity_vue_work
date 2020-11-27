import firebase from './../../firebase.js'
export const submitChatMessage = async function ({
    state,
    dispatch,
    getters,
    commit
}, message) {
    const oStatus = {
        success: true,
        isUsingFirebase: getters.isUsingFirebase
    }

    if (getters.isUsingFirebase) {
        const oChatRoomStatus = wilUltilsFirebase.oChatRoomRef.push({message: message, userID: state.loggedInId, timestamp: firebase.firebase.database.ServerValue.TIMESTAMP})
        dispatch('updateLatestMessage', message);

        oChatRoomStatus.then(status => {
            if (status) {
                dispatch('observerSendMessage', {
                    msg: message,
                    chattedWithId: state.chattingWithId
                });
            }
        })

        return oStatus
    } else {
        commit('setIsDisablingChatMessage', true);
        await jQuery.ajax({
            type: 'POST',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
                action: 'wilcity_submit_new_msg',
                message: message,
                receiveID: state.chattingWithId,
                isChatting: 'yes'
            },
            success: (response => {
                if (response.success) {
                    oState = {
                        ... oStatus,
                        oMsg: response.data
                    };

                    dispatch('updateChatRoomMessages', {
                        oNewChatMessages: response.data,
                        isNewMessage: true
                    });

                    dispatch('observerSendMessage', {
                        msg: message,
                        chattedWithId: state.chattingWithId
                    });
                } else {
                    oState = {
                        ... oStatus,
                        success: false,
                        errMsg: response.data.msg
                    };
                }

                commit('setIsDisablingChatMessage', false);
            })
        })

        return oStatus
    }
}
