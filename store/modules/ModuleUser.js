const state = {
    shortProfileInfo: {}
};

const getters = {
    getShortProfileInfo: state => (userId, pluck) => {
        if (state.shortProfileInfo[userId]) {
            const info = state.shortProfileInfo[userId];
            if (pluck) {
                if (info.pluck === pluck) {
                    return info.info;
                }
            } else {
                return info.info
            }
        }

        return false;
    }
};

const mutations = {
    updateShortProfileInfo(state, {userId, info, pluck}) {
        state.shortProfileInfo[userId] = {
            info,
            pluck
        };
    }
};
const actions = {
    updateShortProfileInfo({
        commit
    }, info) {
        commit('updateShortProfileInfo', info);
    }
};

export default {namespaced: true, state, mutations, getters, actions};
