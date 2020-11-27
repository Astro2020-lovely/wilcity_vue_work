export const observerSendMessage = function ({
    state,
    getters,
    commit
}, oInfo) {
    if (getters.isUsingFirebase) {
        const msgKey = oInfo.chattedWithId + '_' + state.loggedInId
        if (state.oObserverSendMessage && state.oObserverSendMessage[msgKey]) {
            clearTimeout(state.oObserverSendMessage[msgKey])
        }

        const timeoutHandling = setTimeout(() => {
            jQuery.ajax({
                type: 'POST',
                url: WILOKE_GLOBAL.ajaxurl,
                data: {
                    action: 'wilcity_send_message',
                    chattedWithId: oInfo.chattedWithId,
                    security: WILOKE_INLINE_GLOBAL.security,
                    msg: oInfo.msg
                }
            });
            if (state.oObserverSendMessage[msgKey]) {
                clearTimeout(state.oObserverSendMessage[msgKey]);
            } else {
                clearTimeout(timeoutHandling);
            }
        }, 3000);
        commit('updateObserverSendMessage', {[msgKey]: timeoutHandling});
    }
}
