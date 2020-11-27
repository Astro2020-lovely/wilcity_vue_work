<template>
  <div>
    <!-- <div class="wil-text-right mb-20">
      <router-link
        to="/billings"
        class="wil-btn wil-btn--primary wil-btn--sm"
        v-text="parseBackBtnName"
      ></router-link>
    </div>-->
    <div class="listing-table_module__2vE05 table-module pos-r">
      <content-placeholders v-if="isLoading">
        <content-placeholders-text :lines="4" />
      </content-placeholders>
      <table
        class="listing-table_table__2Cfzq wil-table-responsive-lg table-module__table"
      >
        <thead>
          <tr>
            <th :data-th="'Details' | filterTranslation('details')">
              <span>
                <i class="la la-archive"></i>
              </span>
              <span
                v-text="
                  $options.filters.filterTranslation('Details', 'details')
                "
              ></span>
            </th>
            <th
              :data-th="'Gateway' | filterTranslation('gateway')"
              v-text="$options.filters.filterTranslation('Gate way', 'gateway')"
            ></th>
            <th
              :data-th="'Billing Type' | filterTranslation('billingType')"
              v-text="
                $options.filters.filterTranslation(
                  'Billing Type',
                  'billingType'
                )
              "
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="before-hide" v-html="renderPaymentID"></td>
            <td class="before-hide" v-html="oInfo.gateway"></td>
            <td class="before-hide" v-html="oInfo.remainingItems"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="listing-table_module__2vE05 table-module pos-r">
      <table
        class="listing-table_table__2Cfzq wil-table-responsive-lg table-module__table"
      >
        <thead>
          <tr>
            <th>
              <span>
                <i class="la la-archive"></i>
              </span>
              <span
                v-text="
                  $options.filters.filterTranslation('Pricing', 'pricing')
                "
              ></span>
            </th>
            <th
              :data-th="'Post Type' | filterTranslation('postType')"
              v-text="
                $options.filters.filterTranslation('Post Type', 'postType')
              "
            ></th>
            <th
              :data-th="'Remaining items' | filterTranslation('remainingItems')"
              v-text="
                $options.filters.filterTranslation(
                  'Remaining items',
                  'remainingItems'
                )
              "
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="before-hide" v-html="oInfo.planName"></td>
            <td class="before-hide" v-html="oInfo.postType"></td>
            <td class="before-hide" v-html="oInfo.remainingItems"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="
        oInfo.isNonRecurringPayment == 'no' &&
          oInfo.gateway != 'free' &&
          oInfo.status == 'active'
      "
      class="listing-table_module__2vE05 table-module pos-r"
    >
      <table
        class="listing-table_table__2Cfzq wil-table-responsive-lg table-module__table"
      >
        <thead>
          <tr>
            <th
              :data-th="
                'Next Billings Date' | filterTranslation('nextBillingDate')
              "
            >
              <span>
                <i class="la la-archive"></i>
              </span>
              <span
                v-text="
                  $options.filters.filterTranslation(
                    'Next Billings Date',
                    'nextBillingDate'
                  )
                "
              ></span>
            </th>
            <th :data-th="'Cancel' | filterTranslation('cancel')">
              <span
                v-text="$options.filters.filterTranslation('Cancel', 'cancel')"
              ></span>
            </th>
            <th :data-th="'Change Plan' | filterTranslation('Change plan')">
              <span
                v-text="
                  $options.filters.filterTranslation(
                    'Change Plan',
                    'changePlan'
                  )
                "
              ></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="before-hide" v-html="oInfo.nextBillingDate"></td>
            <td class="before-hide">
              <button
                style="margin-left:0px;"
                class="wil-btn wil-btn--primary wil-btn--sm wil-btn--danger wil-change-plan wil-btn--round"
                v-text="$options.filters.filterTranslation('Cancel', 'cancel')"
                @click.prevent="handleCancelPlan"
              ></button>
            </td>
            <td class="before-hide">
              <router-link
                :to="{
                  name: 'pricings',
                  params: { type: oInfo.postType },
                  query: oInfo
                }"
                class="wil-btn wil-btn--primary wil-btn--sm wil-btn--success wil-change-plan wil-btn--round"
                v-text="
                  $options.filters.filterTranslation(
                    'Change Plan',
                    'changePlan'
                  )
                "
              ></router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <portal to="wil-modal" v-if="isOpenCancelPlanPopup">
      <ask-for-cancel-plan
        :payment-id="this.oInfo.paymentID"
        @close="handleClosePopup"
      ></ask-for-cancel-plan>
    </portal>
  </div>
</template>
<script>
// import Message from "./../../shortcodes/WilokeMessage.vue";
// import BlockLoading from "./../../shortcodes/BlockLoading.vue";
import { mapState } from "vuex";
import AskForCancelPlan from "./AskForCancelPlan.vue";

export default {
  data() {
    return {
      errorMsg: "",
      isLoading: false,
      oInfo: {},
      gateway: "",
      isOpenCancelPlanPopup: false
    };
  },
  components: {
    // Message,
    // BlockLoading
    AskForCancelPlan
  },
  computed: {
    // ...mapState({
    //   calledSubscription: state => state.ModuleBilling.calledSubscription
    // }),
    renderPaymentID() {
      return "#" + this.oInfo.paymentID;
    },
    parseBackBtnName() {
      return this.$options.filters.filterTranslation("Back", "back");
    }
  },
  watch: {
    // calledSubscription: function(paymentID) {
    //   if (paymentID == this.oInfo.paymentID) {
    //     setTimeout(() => {
    //       this.$store.dispatch(
    //         "ModuleBilling/actionAskForCancelPopupPlan",
    //         "close"
    //       );
    //       this.$root.$router.push({ path: "/billings" });
    //     }, 3000);
    //   }
    // }
  },
  methods: {
    handleClosePopup() {
      this.isOpenCancelPlanPopup = false;
    },
    fetchMyBillingDetails() {
      this.isLoading = true;
      jQuery
        .ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: "wilcity_fetch_my_billing_details",
            invoiceID: this.$route.params.id
          },
          success: response => {
            if (response.success) {
              this.oBilling = response.data;
            } else {
              this.errorMsg = response.data.msg;
            }
          }
        })
        .done(() => (this.isLoading = false));
    },
    parseInfo() {
      this.oInfo = this.$route.query;
    },
    handleCancelPlan() {
      this.isOpenCancelPlanPopup = true;
    }
  },
  created() {
    this.parseInfo();
  }
};
</script>
