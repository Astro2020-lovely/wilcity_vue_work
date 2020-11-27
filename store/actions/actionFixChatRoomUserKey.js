import firebase from './../../firebase.js'

export const fixChatRoomUserKey = async function ({getters, commit, state}) {
    const oCheckFirstUser = firebase.db.ref('messages/chats/' + state.chatKey + '/fUser')
    const oCheckSecondUser = firebase.db.ref('messages/chats/' + state.chatKey + '/sUser')
    const oResult = {
        fUser: null,
        sUser: null
    }

    oCheckFirstUser.once('value', (snap => {
        oResult.fUser = snap.val();
    }));

    await oCheckSecondUser.once('value', (snap => {
        oResult.sUser = snap.val();
    }));

    if (! oResult.fUser || ! oResult.sUser) {
        jQuery.ajax({
            type: 'POST',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
                action: 'wilcity_fix_chat_room_key',
                chatKey: state.chatKey,
                security: WILOKE_INLINE_GLOBAL.security,
                tested: oResult
            }
        });
    }
}
