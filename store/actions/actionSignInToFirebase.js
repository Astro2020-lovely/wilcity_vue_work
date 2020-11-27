import firebase from './../../firebase.js';

export const signInToFirebase = async function ({state, commit, getters}) {
    if (state.isLoggedIntoFirebase || !getters.isUsingFirebase) {
        commit('setLoggedIntoChatRoom', true);
        return true;
    }

    if (state.isCheckingLoginStatus === false) {
        commit('setIsCheckingLoginStatus', true);

        await jQuery.ajax({
            type: 'POST',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
                action: 'signin_firebase'
            },
            success: response => {
                if (response.success) {
                    firebase.auth.signInWithEmailAndPassword(response.data.email, response.data.password);
                    commit('setLoggedIntoFirebaseStatus', true);
                    commit('setLoggedIntoChatRoom', true);
                }
            }
        });
        return state.isLoggedIntoFirebase;
    }
}
