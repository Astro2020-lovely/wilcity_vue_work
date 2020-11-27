<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-20">
      <wil-alert
        v-if="msg.length"
        :icon="msgIcon"
        :type="msgStatus"
        :msg="msg"
      />
    </div>

    <div
      v-if="defaultGateway == 'free' && !isUsingWooCommerce"
      class="col-md-12"
    >
      <div class="accordion-01__module">
        <div class="accordion-01_item__cM-3Z">
          <wil-select-tree
            v-on:change="handleGatewayChange"
            :options="aGateways"
            :label="'Gateway' | filterTranslation('gateway')"
          />
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-20">
      <div class="accordion-01_module__3L4t8">
        <!-- <div class="wil-text-right mb-20"> -->
        <!-- <router-link
            to="/billings"
            class="wil-btn wil-btn--primary wil-btn--sm"
        >{{'Back'|filterTranslation('back')}}</router-link>-->
        <!-- </div> -->
        <wil-billings-plans-belongs-to-post-type
          v-model="newPlanId"
          :o-args="$route.query"
          :gateway="currentGateway"
        />
        <wil-billings-listings-belongs-to-payment
          :payment-id="paymentID"
          :post-id="postID"
          v-on:change="handleChangePostIds"
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-20">
      <wil-checkbox
        :label="
          'cancelCurrentPayment' | filterTranslation('cancelCurrentPayment')
        "
        @change="updateCancelCurrentSubscriptionStatus"
      />
      <wil-link
        @click.prevent="changePlan"
        :is-loading="isLoading"
        :btn-name="'Change Plan' | filterTranslation('changePlan')"
      />
    </div>

    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-30">
      <wil-alert
        v-if="msg.length"
        :icon="msgIcon"
        :type="msgStatus"
        :msg="msg"
      />
    </div>
  </div>
</template>
<script>
import WilBillingsListingsBelongsToPayment from "./WilBillingsListingsBelongsToPayment.vue";
import WilBillingsPlansBelongsToPostType from "./WilBillingsPlansBelongsToPostType.vue";
import StripeSCA from "./../../../../../StripeSCA.js";
import WilokePayPal from "./../../../../../WilokePayPal.js";

export default {
  name: "wil-billings-pricing",
  data() {
    return {
      cancelCurrentSubscription: "no",
      isUsingWooCommerce: false,
      currentPlanID: this.$route.query.planID,
      defaultGateway: this.$route.query.gateway,
      currentGateway: this.$route.query.gateway,
      paymentID: parseInt(this.$route.query.paymentID, 10),
      postID: parseInt(this.$route.query.postID, 10),
      isLoading: false,
      msgIcon: "la la-smile-o",
      msg: "",
      msgStatus: "success",
      isChangingPlan: false,
      xhr: null,
      oPlanInfo: {},
      newPlanId: null,
      aPostIds: [],
      aGateways: []
    };
  },
  components: {
    WilBillingsListingsBelongsToPayment,
    WilBillingsPlansBelongsToPostType,
    StripeSCA,
    WilokePayPal
  },
  computed: {
    btnClass() {
      return {
        "wil-btn wil-btn--primary wil-btn--md wil-btn--round wil-btn--block":
          1 == 1,
        "wil-btn--loading": this.isLoading == "yes"
      };
    }
  },
  created() {
    this.fetchGateways();
  },
  methods: {
    updateCancelCurrentSubscriptionStatus(newStatus) {
      this.cancelCurrentSubscription = newStatus;
    },
    handleChangePostIds(postIds) {
      this.aPostIds = [...postIds];
    },
    triggerButtonID(ID) {
      return "wil-trigger-change-plan-" + ID;
    },
    errorMsg(msg) {
      this.msgStatus = "danger";
      this.msgIcon = "la la-frown-o";
      this.msg = msg;
    },
    successMsg(oResponse) {
      this.msgStatus = "success";
      this.msgIcon = "";
      this.msg = oResponse.msg;

      if (oResponse.listings) {
        let details = "<ul>";
        for (let key in oResponse.listings) {
          details += `<li>${oResponse.listings[key].postTitle} | ${oResponse.listings[key].postStatus} |
                        ${oResponse.listings[key].planInfo}</li>`;
        }

        details += "</ul>";
        this.msg += "<br />";
        this.msg += details;
      }

      if (oResponse.listings) {
        this.msg += "<br />";
        this.msg += `${oResponse.warning}`;
      }

      setTimeout(() => {
        this.$router.push({ path: "/billings" });
      }, 3000);
    },
    fetchGateways() {
      if (this.isUsingWooCommerce) {
        this.currentGateway = "woocommerce";
        return true;
      }

      if (this.defaultGateway != "free") {
        return false;
      }

      this.isLoading = true;
      Vue.axios({
        type: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_gateways`
      })
        .then(response => {
          if (!response.data.success) {
            this.msgIcon = "la la-frown-o";
            this.msgStatus = "danger";
            this.msg = response.data.data.msg;
          } else {
            this.aGateways = response.data.data.aGateways;
            if (response.data.data.isUsingWooCommerce) {
              this.isUsingWooCommerce = true;
              this.currentGateway = "woocommerce";
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    handleGatewayChange(val) {
      this.currentGateway = val;
    },
    changePlan() {
      this.msg = "";
      this.msgStatus = "danger";

      if (this.currentGateway == "free") {
        this.msg = WILCITY_I18.gatewayIsRequired;
        return false;
      }

      if (this.xhr !== null && this.xhr.status !== 200) {
        this.xhr.abort();
      }

      if (!this.newPlanId) {
        this.msg = WILCITY_I18.planIsRequired;

        return false;
      }

      const iWantToChange = confirm(WILCITY_I18.askChangePlan);
      if (!iWantToChange) {
        return false;
      }

      this.isLoading = true;

      let oQuery = {
        action: "wiloke_submission_change_plan",
        paymentID: this.paymentID,
        currentPlanID: this.currentPlanID,
        newPlanID: this.newPlanId,
        gateway: this.currentGateway,
        security: WILOKE_INLINE_GLOBAL.security,
        postIds: this.aPostIds,
        cancelCurrentSubscription: this.cancelCurrentSubscription
      };

      if (typeof oAdditionalQuery !== "undefined") {
        oQuery = Object.assign({}, oQuery, oAdditionalQuery);
      }

      this.xhr = jQuery
        .ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: oQuery,
          success: response => {
            if (response.success) {
              if (response.data.gateway == "stripe") {
                new StripeSCA(response.data.sessionID);
              }

              if (!_.isUndefined(response.data.redirectTo)) {
                if (!!response.data.beforeRedirect) {
                  const timeout = !!response.data.beforeRedirect.timeout
                    ? parseInt(response.data.beforeRedirect.timeout, 10)
                    : 3000; // ms
                  this.msg = response.data.beforeRedirect.msg;
                  setTimeout(() => {
                    window.location.href = response.data.redirectTo;
                  }, timeout);
                } else {
                  window.location.href = response.data.redirectTo;
                }
              }
              this.successMsg(response.data);
            } else {
              this.errorMsg(response.data.msg);
            }
          }
        })
        .always(() => {
          this.isLoading = false;
          this.isChangingPlan = false;
        });
    }
  }
};
</script>
