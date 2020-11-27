import firebase from './../../firebase.js'

export const updateLatestMessage = async function ({
    state
}, message) {
    return await firebase.db.ref('messages/users/').child('___' + state.chattingWithId + '___').orderByChild('userID').equalTo(state.loggedInId).once('value', snap => {
        const oVal = snap.val()
        const oMessageInfo = {
            active: true,
            avatar: WILOKE_INLINE_GLOBAL.user.avatar,
            displayName: WILOKE_INLINE_GLOBAL.user.displayName,
            message: message,
            timestamp: firebase.firebase.database.ServerValue.TIMESTAMP,
            userID: state.loggedInId,
            new: true
        };

        if (oVal !== null) {
            const key = Object.keys(oVal)[0];
            firebase.db.ref('messages/users/' + '___' + state.chattingWithId + '___' + '/' + key).update(oMessageInfo)
        } else {
            firebase.db.ref('messages/users/' + '___' + state.chattingWithId + '___').push(oMessageInfo)
        }
    });
}
