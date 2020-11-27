import firebase from './../../firebase.js'
export const deleteLatestMessage = function ({
    state,
    commit
}, latestMsgKey) { // latestMsgKey: This is key of firebase under messages -> users -> __state.loggedInId__
    firebase.db.ref('messages/users/___' + state.loggedInId + '___' + '/' + latestMsgKey).remove().then(() => {
        commit('deleteListOfChattedWith', latestMsgKey);
    }); // Remove latest messages
}
