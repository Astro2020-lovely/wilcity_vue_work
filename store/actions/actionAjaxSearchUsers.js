export const ajaxSearchUsers = async function ({
    commit,
    state
}, specifyChattedWith) {
    let oStatus = {
        success: true,
        isFoundAll: true
    };

    await jQuery.ajax({
        type: 'POST',
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
            action: 'wilcity_search_users',
            s: specifyChattedWith
        },
        success: (response => {
            if (response.success) {
                let oListOfChattedWith;
                if (state.oListOfChattedWith && specifyChattedWith) {
                    oListOfChattedWith = {
                        ...state.oListOfChattedWith,
                        ...response.data.users
                    };
                } else {
                    oListOfChattedWith = {
                        ...response.data.users
                    };
                }

                oStatus = {
                    ... oStatus,
                    users: {
                        ... oListOfChattedWith
                    }
                };
            } else {
                oStatus = {
                    ... oStatus,
                    success: false
                }
            }
        })
    });

    return oStatus;
}
