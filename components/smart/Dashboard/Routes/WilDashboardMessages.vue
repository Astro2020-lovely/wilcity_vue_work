<template>
  <div class="message_module__2nm7D">
    <div class="content-box_module__333d9 message_box__3dDJa">
      <wil-heading icon="la la-envelope" :heading="''|filterTranslation('index')" />
      <div class="content-box_body__3tSRB">
        <wil-chat-lists
          :s-username="queryUsername"
          :msg-id="msgId"
          :is-using-firebase="isUsingFirebase"
        />
        <wil-chat-window :sender-id="userId" />
        <wil-chat-recipient-info />
      </div>
    </div>
  </div>
</template>
<script>
import WilChatWindow from "./Chat/WilChatWindow.vue";
import WilChatRecipientInfo from "./Chat/WilChatRecipientInfo.vue";
import WilChatLists from "./Chat/WilChatLists.vue";
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      total: 0,
      msg: "",
      queryUsername: "",
      msgId: "",
      userId: 0
    };
  },
  computed: mapState({
    isUsingFirebase: state => state.ModuleMessage.isUsingFirebase === "yes"
  }),
  methods: {
    init() {
      this.userId = parseInt(WILOKE_INLINE_GLOBAL.userID, 10);
      this.queryUsername = this.$route.query.u ? this.$route.query.u : "";
      this.msgId = this.$route.query.id ? this.$route.query.id : "";
    },
    fetchCountMsg() {
      Vue.axios({
        type: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_count_messages_to_me`
      }).then(response => {
        if (response.data.success) {
          this.total = response.data.data;
        } else {
          this.msg = response.data.data.msg;
        }
      });
    }
  },
  components: {
    WilChatLists,
    WilChatRecipientInfo,
    WilChatWindow
  },
  created() {
    this.init();
    if (this.isUsingFirebase) {
      this.$store.dispatch("ModuleMessage/signInToFirebase");
    }

    this.fetchCountMsg();
  }
};
</script>
