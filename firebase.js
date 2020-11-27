import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'

let db = null;
let auth = null;

if (WILOKE_INLINE_GLOBAL.isUsingFirebase === 'yes') {
    let config = WILOKE_GLOBAL.oFirebaseConfiguration;
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    db = firebase.database();
    auth = firebase.auth();
}

export default {db, auth, firebase}
