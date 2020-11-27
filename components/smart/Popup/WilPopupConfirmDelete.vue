<template>
  <wil-popup
    @close="handleClosePopup"
    :id="id"
    :title="title"
    :is-open="true"
    wrapper-classes="popup_module__3M-0- pos-f-full popup_sm__Rc24D popup_mobile-full__1hyc4"
  >
    <template slot="body">
      <wil-line-loading :is-loading="isLoading" />
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" />
      <wil-alert v-if="!isDeleted" :msg="confirmDeletemMsg"></wil-alert>
    </template>
    <template v-if="!isDeleted" slot="footer">
      <footer class="popup_footer__2pUrl clearfix">
        <div class="popup_footerRight__qvdP6">
          <div v-if="msgType !=='success'">
            <wil-link
              @click="handleClosePopup"
              wrapper-classes="wil-btn wil-btn--secondary wil-btn--sm wil-btn--round"
              :btn-name="'Cancel'|filterTranslation( 'cancel')"
            />
            <wil-link
              @click="handleDelete"
              wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
              :btn-name="'yes'|filterTranslation( 'yes')"
            />
          </div>
        </div>
      </footer>
    </template>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "wil-popup-confirm-delete",
  data() {
    return {
      msg: "",
      msgType: "",
      isLoading: false,
      isDeleted: false
    };
  },
  props: {
    postID: {
      type: Number,
      required: true
    },
    ajaxAction: {
      type: String,
      required: true
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleDelete() {
      this.isLoading = true;
      this.msg = "";

      const data = WilQueryHelper.buildFormData({
        action: this.ajaxAction,
        postID: this.postID,
        ...this.formData
      });

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data
      })
        .then(response => {
          this.msg = response.data.data.msg;
          if (response.data.success) {
            this.msgType = "success";
            this.isDeleted = true;
            setTimeout(() => {
              this.handleClosePopup();
            }, 1000);
          } else {
            this.msgType = "error";
          }
        })
        .finally(() => (this.isLoading = false));
    },
    handleClosePopup() {
      this.$emit("close");
    }
  }
};
</script>
