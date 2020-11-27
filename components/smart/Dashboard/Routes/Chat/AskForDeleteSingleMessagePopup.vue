<template>
  <wil-popup
    @close="closePopup"
    :popup-id="id"
    :popup-title="title"
    :is-active="isActive"
    wrapper-class="popup_module__3M-0- pos-f-full popup_sm__Rc24D popup_mobile-full__1hyc4"
  >
    <block-loading :is-loading="isLoading" position></block-loading>
    <div class="wil-scroll-container" slot="body">
      <wiloke-error-msg v-show="errMsg.length" :msg="errMsg" :has-remove="false"></wiloke-error-msg>
      <message
        v-show="successMsg.length"
        :msg="successMsg"
        has-remove="no"
        icon="la la-bullhorn"
        status="success"
      ></message>

      <div v-if="!errMsg.length" class="promo-item_module__24ZhT">
        <div class="promo-item_group__2ZJhC">
          <p class="promo-item_description__2nc26" v-html="body"></p>
        </div>
      </div>
      <!-- End / promo-item_module__24ZhT -->
    </div>

    <footer class="popup_footer__2pUrl clearfix" slot="footer">
      <div class="popup_footerRight__qvdP6">
        <button
          v-show="!successMsg.length"
          @click.prevent="deleteMessage"
          class="wil-btn wil-btn--primary wil-btn--sm wil-btn--round mr-30"
          type="submit"
          v-html="yes"
        ></button>
        <button
          v-show="!successMsg.length"
          @click.prevent="closePopup"
          class="wil-btn wil-btn--secondary wil-btn--sm wil-btn--round"
          type="submit"
          v-html="cancel"
        ></button>
      </div>
    </footer>
  </wil-popup>
</template>
<script lang="javascript">
// import WilokeErrorMsg from "./../shortcodes/WilokeErrorMsg.vue";
// import Message from "./../shortcodes/WilokeMessage.vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      errMsg: "",
      successMsg: "",
      isLoading: "no",
      xhr: null,
      id: "ask-delete-single-message-popup"
    };
  },
  props: ["cancel", "yes", "title", "body"],
  components: {
    // Message,
    // WilokeErrorMsg
  },
  computed: {
    ...mapState({
      isActive(state) {
        return state.oPopupStatus[this.id] === "open";
      }
    })
  },
  methods: {
    closePopup() {
      this.$store.commit("updatePopupStatus", {
        id: this.id,
        status: "close"
      });
    },
    deleteMessage() {
      let oInfo = this.$store.getters["ModuleMessage/getDeleteMessageInfo"];
      if (this.xhr !== null && this.xhr.status !== 200) {
        this.xhr.abort();
      }
      this.$emit("line-loading", "yes");
      this.errMsg = "";

      const oResponse = this.$store.dispatch(
        "ModuleMessage/deleteMessage",
        oInfo
      );
      oResponse.then(oStatus => {
        this.$emit("line-loading", "no");
        if (!oStatus.success) {
          this.errMsg = oStatus.msg;
        } else {
          this.closePopup();
        }
      });
    }
  }
};
</script>
