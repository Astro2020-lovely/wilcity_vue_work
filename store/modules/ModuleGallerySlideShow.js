const state = {
    isOpen: false,
    images: [],
    index: null
};

const getters = {
    getStatus(state) {
        return state.isOpen;
    },
    getIndex(state) {
        return state.index;
    },
    getImages(state) {
        return state.images;
    }
};

const actions = {
    updateImages({
        commit
    }, images) {
        commit('updateImages', images);
    },
    updateIndex({
        commit
    }, index) {
        commit('updateIndex', index);
    },
    openGallery({commit}) {
        commit('updateStatus', true);
    },
    closeGallery({commit}) {
        commit('updateIndex', null);
        commit('updateStatus', false);
    }
};

const mutations = {
    updateStatus(state, status) {
        state.isOpen = status;
    },
    updateIndex(state, index) {
        state.index = index;
    },
    updateImages(state, images) {
        state.images = images;
    }
};

export default {namespaced: true, state, mutations, getters, actions};
