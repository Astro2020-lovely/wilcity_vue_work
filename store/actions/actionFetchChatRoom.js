/**
 * Created by pirates on 6/27/19.
 */
export const fetchChatRoom = async function ({state, commit, dispatch, getters}) {
    this.$store.dispatch('buildChatRoomKey', state.chattingWithId).then(chatRoomKey => {});
}
