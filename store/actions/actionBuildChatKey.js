import firebase from './../../firebase.js'
export const buildChatKey = async function ({state, commit, dispatch}) {
    let secondTest = null,
        firstTest = null;

    dispatch('generateChatKey').then(key => {
        firstTest = key;
    });

    await dispatch('generateChatKey', true).then(key => {
        secondTest = key;
    });

    if (state.aChatKeys[firstTest]) {
        commit('setChatKey', firstTest);
        return firstTest;
    }

    if (state.aChatKeys[secondTest]) {
        commit('setChatKey', secondTest);
        return secondTest;
    }

    let isFistTestCorrect = false,
        isSecondTestCorrect = false;

    firebase.db.ref('messages/chats').child(firstTest).once('value').then(snap => {
        if (snap.exists()) {
            commit('setChatKey', firstTest);
            isFistTestCorrect = true;
        }
    });

    await firebase.db.ref('messages/chats').child(secondTest).once('value').then(snap => {
        if (snap.exists()) {
            commit('setChatKey', secondTest);
            isSecondTestCorrect = true;
        }
    });

    if (isFistTestCorrect) {
        return firstTest;
    }

    if (isSecondTestCorrect) {
        return secondTest;
    }

    // temporary disable chat box until they chat room key has been created
    commit('setIsDisablingChatMessage', true);
    await jQuery.ajax({
        type: 'POST',
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
            action: 'build_chat_room',
            chattingWithId: state.chattingWithId
        },
        success: (response => {
            if (response.success) {
                dispatch('generateChatKey', true).then(key => {
                    secondTest = key;
                    commit('setChatKey', key);
                });
                isSecondTestCorrect = true;
                return true;
            } else {
                return false;
            }
        })
    })

    if (isSecondTestCorrect) {
        return secondTest;
    }

    return false;
}
