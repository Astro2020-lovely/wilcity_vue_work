import firebase from './../../firebase.js'

export const countTotalNewMessages = async ({
    commit,
    state
}, uID) => {
    if (state.isUsingFirebase === 'yes') {
        await firebase.db.ref('messages/users').child('___' + uID + '___').orderByChild('new').equalTo(true).on('value', (snap => {
            let oNewMessages = snap.val();
            if (oNewMessages !== null) {
                commit('setUserTotalNewMessages', {
                    uID: uID,
                    total: (Object.values(oNewMessages)).length
                })

                commit('setCountMyNewMessages', (Object.values(oNewMessages)).length)
            }
        }))
    }
}
