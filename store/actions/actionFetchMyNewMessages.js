import firebase from './../../firebase.js'

export const fetchMyNewMessages = function ({state, commit}) {
    firebase.db.ref('messages/users/').child('___' + state.loggedInId + '___').orderByChild('timestamp').limitToLast(10).on('value', snap => {
        commit('setMyNewMessages', snap.val());
    })
}
