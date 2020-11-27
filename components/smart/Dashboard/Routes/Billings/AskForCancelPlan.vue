<template>
  <wil-popup
    :id="id"
    :title="''|filterTranslation('cancelPlan')"
    :is-open="true"
    :is-loading="isLoading"
    @submit="handleCancelPlan"
    @close="handleClosePopup"
  >
    <template slot="body">
      <wil-alert v-if="msg.length" :msg="msg"></wil-alert>
      <div v-if="!isLoading" class="promo-item_module__24ZhT">
        <div class="promo-item_group__2ZJhC">
          <p class="promo-item_description__2nc26">{{''|filterTranslation('askForCancelPlan')}}</p>
        </div>
      </div>
      <!-- End / promo-item_module__24ZhT -->
    </template>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "ask-for-cancel-plan",
  data() {
    return {
      msg: "",
      msgType: "",
      xhr: null,
      id: "ask-for-cancel-plan",
      isLoading: false
    };
  },
  props: {
    // body: {
    //   type: String,
    //   required: true
    // },
    // title: {
    //   type: String
    // },
    paymentId: {
      type: Number | String,
      default: 0
    }
  },
  methods: {
    handleClosePopup() {
      this.$emit("close");
    },
    handleCancelPlan() {
      if (this.xhr !== null && this.xhr.status !== 200) {
        this.xhr.abort();
      }
      this.isLoading = true;
      this.xhr = jQuery
        .ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: "wiloke_submission_cancel_add_listing_plan",
            security: WILOKE_INLINE_GLOBAL.security,
            paymentID: this.paymentId
          },
          success: response => {
            if (response.success) {
              this.msg = response.data.msg;
              // this.$store.dispatch(
              //   "ModuleBilling/actionCancelledSubscription",
              //   this.$store.getters["ModuleBilling/getPaymentID"]
              // );
              setTimeout(() => {
                this.handleClosePopup();
              }, 1000);
            } else {
              this.msg = response.data.msg;
            }

            // this.$emit("line-loading", "no");
          }
        })
        .done(() => (this.isLoading = false));
    }
  }
};
</script>
