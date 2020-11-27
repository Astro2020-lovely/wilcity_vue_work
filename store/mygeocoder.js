const state = {
    oGeocoder: {
        lat: null,
        lng: null
    }
};

const getters = {
    getMyGeocoder(state) {
        return state.oGeocoder;
    }
};

const mutations = {
    setMyGeocoder(state, geocoder) {
        state.oGeocoder = geocoder;
    }
};

const actions = {
    updateMyGeocoder({
        commit
    }, geocoder) {
        commit('setMyGeocoder', geocoder);
    }
};

export default {namespaced: true, state, actions, mutations, getters};
