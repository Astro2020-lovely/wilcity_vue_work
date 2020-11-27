// see: https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource
export const ajaxListenToChattedWith = function ({state, dispatch, getters}) {
    if (state.oChattedWithSubscription !== null) {
        clearInterval(state.oChatRoomSubscription);
    }

    state.oChattedWithSubscription = setInterval(() => {
        const url = WILOKE_GLOBAL.ajaxurl + '?action=wilcity_subscribe_chatted_with';
        jQuery.ajax({
            type: 'GET',
            url: url,
            success: (response => {
                const mode = response.data.codeMsg;
                if (response.success) {
                    switch (mode) {
                        case 'new_message':
                            dispatch('updateChatRoomMessages', {
                                oNewChatMessages: response.data.messages,
                                isNewMessage: true
                            });
                            break;
                    }
                }
            })
        });
    }, 15000);
}
