import firebase from './../../firebase.js'

export const maskLatestMessageAsRead = function ({state, getters}) {
    if (getters.isUsingFirebase) {
        firebase.db.ref('messages/users/').child('___' + state.loggedInId + '___').orderByChild('userID').equalTo(state.chattingWithId).once('value', snap => {
            const oVal = snap.val();
            if (oVal) {
                const key = Object.keys(oVal)[0];

                firebase.db.ref('messages/users/').child('___' + state.loggedInId + '___' + '/' + key).update({new: null});
            }
        });
    }
}
