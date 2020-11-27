<template>
  <wil-popup
    @close="handleClosePopup"
    :id="id"
    :title="title"
    :is-open="isOpen"
    wrapper-classes="popup_module__3M-0-pos-r pos-f-full popup_sm__Rc24D popup_mobile-full__1hyc4"
  >
    <div v-if="body" class="wil-scroll-container" slot="body">
      <wil-block-loading :is-loading="isLoading && msgType !== 'success'" />
      <div v-if="msgType!=='success'" class="promo-item_module__24ZhT">
        <div class="promo-item_group__2ZJhC">
          <p class="promo-item_description__2nc26" v-html="body"></p>
        </div>
      </div>
      <!-- End / promo-item_module__24ZhT -->
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" :msg-icon="msgIcon" />
    </div>
    <footer v-if="msgType!=='success'" class="popup_footer__2pUrl clearfix" slot="footer">
      <div class="popup_footerRight__qvdP6">
        <wil-link
          @click="handleClosePopup"
          wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
          :btn-name="'Cancel'|filterTranslation('cancel')"
        />
        <wil-link
          @click="handleConfirmation"
          wrapper-classes="wil-btn wil-btn--secondary wil-btn--sm wil-btn--round"
          :btn-name="'Oke'|filterTranslation('oke')"
        />
      </div>
    </footer>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "wil-confirmation-popup",
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    },
    msg: {
      type: String,
      default: ""
    },
    msgType: {
      type: String,
      default: ""
    },
    msgIcon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClosePopup() {
      this.$emit("close");
    },
    handleConfirmation() {
      this.$emit("confirmed");
    }
  }
};
</script>
