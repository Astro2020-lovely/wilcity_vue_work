import firebase from './../../firebase.js'

export const addNewChattedWith = function ({state, getters, commit}) {
    if (getters.isUsingFirebase) {
        if (!state.oListenToAddNewChattedWith) {
            return false
        }

        const oListenToAddNewChattedWith = firebase.db.ref(WilCityHelpers.buildFirebaseUsersKey(state.loggedInId))
        oListenToAddNewChattedWith.on('child_added', snap => {
            const {key} = snap;
            commit('updateListOfChattedWith', {[key]: snap.val()})
        });
        commit('setListenToAddNewChattedWith', oListenToAddNewChattedWith);
    }
}
