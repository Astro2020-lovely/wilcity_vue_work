export const deleteMessage = async function ({
    state,
    commit,
    dispatch,
    getters
}, oMessageInfo) { // If we are using Firebase, the chat id is firebase chat key
    if (getters.isUsingFirebase) {
        return await wilUltilsFirebase.oChatRoomRef.child(oMessageInfo.firebaseChatKey).remove().then(() => {
            return {success: true}
        }).catch(error => {
            return {success: false, msg: error}
        });
    } else {
        let oResponse = {};
        await jQuery.ajax({
            type: 'post',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
                action: 'wilcity_delete_single_message',
                ID: oMessageInfo.ID
            },
            success: (response => {
                if (response.success) {
                    commit('deleteMessageOfChatRoom', oMessageInfo.ID);
                    oResponse = {
                        success: true
                    }
                } else {
                    oResponse = {
                        success: false,
                        msg: response.data.msg
                    }
                }
            })
        });

        return oResponse;
    }
}
