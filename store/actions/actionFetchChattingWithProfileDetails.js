export const fetchChattingWithProfileDetails = function ({
    commit,
    state
}, userID) {
    if (state.oUsersTotalNewMessages[userID]) {
        return true;
    }

    jQuery.ajax({
        type: 'GET',
        url: WILOKE_GLOBAL.ajaxurl + '?action=chat_fetch_user_profile_details&userId=' + userID,
        success: response => {
            if (response.success) {
                commit('updateUserProfileDetails', {
                    userId: userID,
                    oProfile: response.data
                })
            }
        }
    })
}
