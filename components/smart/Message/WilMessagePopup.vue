<template>
  <wil-popup
    id="wil-message-popup"
    @close="handleClosePopup"
    :is-open="true"
    :title="'' | filterTranslation('newMessage')"
    @submit="sendMessage"
    :is-loading="isSending"
    submit-btn-name="send"
    icon="la la-envelope"
  >
    <div slot="body">
      <wil-block-loading :is-loading="isSending" />
      <wil-alert
        v-if="msg.length"
        :msg="msg"
        :type="msgType"
        icon="la la-bullhorn"
      />

      <div class="pos-r">
        <wil-input
          :label="'' | filterTranslation('to')"
          :value="receiverName"
          field-classes="field_field__3U_Rt disabled"
        />
        <wil-textarea
          :label="'' | filterTranslation('message')"
          :value="message"
          @change="updateMessage"
        />
      </div>
    </div>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "wil-message-popup",
  data() {
    return {
      message: "",
      msg: "",
      msgType: "",
      isSending: false
    };
  },
  computed: {
    btnClasses() {
      let classes = "wil-btn wil-btn--primary wil-btn--block wil-btn--md";
      if (this.message.length) {
        classes = `${classes} disable`;
      }

      return classes;
    }
  },
  props: {
    receiverName: {
      type: String,
      default: ""
    },
    receiverId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClosePopup() {
      this.$emit("close");
    },
    updateMessage(val) {
      this.message = val;
    },
    sendMessage() {
      this.msg = "";
      this.isSending = true;

      const data = this.createFormData({
        action: "wilcity_submit_new_msg",
        message: this.message,
        receiveID: this.receiverId,
        isSentFromPopup: true
      });

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data
      })
        .then(response => {
          if (response.data.success) {
            this.msg = response.data.data.instantMessage;
            this.msgType = "success";
            this.isSending = false;
            setTimeout(() => {
              this.handleClosePopup();
            }, 3000);
          } else {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          }
        })
        .finally(() => (this.isSending = false));
    }
  }
};
</script>
