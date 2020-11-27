export const ajaxFetchChattedWith = async function ({
    commit,
    state
}, limit) {
    let oStatus = {
        success: true,
        isFoundAll: false
    };

    let oArgs = {
        action: 'wilcity_fetch_chatted_with',
        excludes: state.aExcludeAuthors,
        security: WILOKE_INLINE_GLOBAL.security
    };

    if (limit) {
        oArgs = {
            ... oArgs,
            limit
        }
    }

    if (state.oListOfChattedWith) {
        const aPlusExcludes = Object.values(state.oListOfChattedWith).map(oItem => {
            return oItem.userID;
        });

        oArgs.excludes = oArgs.excludes.concat(aPlusExcludes);
    }

    await jQuery.ajax({
        type: 'POST',
        url: WILOKE_GLOBAL.ajaxurl,
        data: oArgs,
        success: (response => {
            commit('setLoggedIntoChatRoom', true);
            if (response.success) {
                commit('updateListOfChattedWith', {
                    ...response.data.users
                });
                oStatus.users = {
                    ...response.data.users
                };
                if (response.data.reachedMaximum) {
                    oStatus = {
                        ... oStatus,
                        isFoundAll: true
                    };
                }
            } else {
                oStatus = {
                    ... oStatus,
                    success: false,
                    isFoundAll: true
                };
            }
        })
    })

    return oStatus;
}
