export const fetchUserDisplayNameAndAvatar = async ({
    commit,
    state
}, oInfo) => {
    let status = false;
    if (state.oUsersDisplayNameAndAvatar[oInfo.uid]) {
        await jQuery.ajax({
            type: 'GET',
            url: `${
                WILOKE_GLOBAL.ajaxurl
            }?action=wilcity_user_display_name_avatar&uid=oInfo.uid`,
            success: (response => {
                commit('updateUserAvatarAndDisplayName', {
                    firebaseHashedKey: oInfo.firebaseHashedKey,
                    displayName: response.data.displayName,
                    avatar: response.data.avatar
                });
                status = true;
            })
        });
        return status;
    } else {
        return true;
    }
}
