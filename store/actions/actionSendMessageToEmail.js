export const sendMessageToEmail = function ({
    state,
    getters,
    commit
}, oInfo) {
    if (getters.isUsingFirebase) {
        const msgKey = oInfo.chattedWithId + '_' + state.loggedInId
        if (state.oWatchSendMessageToEmail[msgKey]) {
            clearTimeout(state.oWatchSendMessageToEmail[msgKey])
        }
        const handleSetTimeout = setTimeout(() => {
            jQuery.ajax({
                type: 'POST',
                url: WILOKE_GLOBAL.ajaxurl,
                data: {
                    action: 'wilcity_send_message_to_email',
                    chattedWithId: oInfo.chattedWithId,
                    security: WILOKE_INLINE_GLOBAL.security,
                    msg: oInfo.msg
                }
            })
            clearTimeout(handleSetTimeout);
        }, 30000);
        commit('updateWatchSendMessageToEmail', {[msgKey]: handleSetTimeout});
    }
}
