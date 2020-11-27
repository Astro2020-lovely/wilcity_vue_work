const getters = {
    getCurrentTab: state => state.currentTab,
    getTabContent: state => (tabKey, std) => state.tabs[tabKey] && state.tabs[tabKey].content ? state.tabs[tabKey].content : std,
    getTabValue: state => (tabKey, key, std) => state.tabs[tabKey] && state.tabs[tabKey][key] ? state.tabs[tabKey][key] : std
};
const actions = {
    updateCurrentTab({
        commit
    }, tabKey) {
        commit('updateCurrentTab', tabKey);
    },
    updateTabContent({
        commit
    }, {tabKey, content}) {
        commit('updateTabValue', {
            tabKey,
            value: content,
            key: 'content'
        });
    },
    updateTabValue({
        commit
    }, {tabKey, key, value}) {
        commit('updateTabValue', {tabKey, key, value});
    }
};
const mutations = {
    updateCurrentTab(state, tabKey) {
        state.currentTab = tabKey;
    },
    updateTabValue(state, {tabKey, key, value}) {
        if (state.tabs[tabKey]) {
            state.tabs = {
                ...state.tabs,
                [tabKey]: {
                    ...state.tabs[tabKey],
                    [key]: value
                }
            };
        } else {
            state.tabs = {
                ...state.tabs,
                [tabKey]: {
                    [key]: value
                }
            };
        }
    }
};
const state = {
    currentTab: WIL_SINGLE_LISTING ? WIL_SINGLE_LISTING.currentTab : "home",
    tabs: {}
};


export default {namespaced: true, getters, actions, mutations, state}
