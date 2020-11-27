/**
 * Created by pirates on 6/27/19.
 */
import firebase from './../../firebase.js'
export const buildChatRoomKey = async function ({
    getters
}, chatWithID) {
    let chatRoomKey = getters.getChatRoomKey(chatWithID)
    let reserveChatRoomKey = getters.getChatRoomKey(chatWithID)
    let realChatRoomKey = ''

    firebase.db.ref('messages/chats').child(chatRoomKey).once('value').then(snap => {
        if (snap.exists()) {
            realChatRoomKey = chatRoomKey
        }
    })

    await firebase.db.ref('messages/chats').child(reserveChatRoomKey).once('value').then(snap => {
        if (snap.exists()) {
            realChatRoomKey = chatRoomKey
        }
    })

    return realChatRoomKey
}
