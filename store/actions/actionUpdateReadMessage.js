export const updateReadMessage = function ({state, getters, commit}) {
    if (getters.isUsingFirebase) {} else {
        jQuery.ajax({
            type: 'POST',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
                action: 'wilcity_update_read_message',
                chattingWithId: state.chattingWithId
            },
            success: (response => {
                commit('updateSeenMessage');
            })
        })
    }
}
