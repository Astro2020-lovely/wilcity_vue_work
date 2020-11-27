<template>
  <div>
    <div class="listing-table_module__2vE05 table-module pos-r">
      <wil-table
        wrapper-class="listing-table_table__2Cfzq wil-table-responsive-lg table-module__table"
      >
        <template v-slot:thead>
          <wil-t-head :title="'Payment ID'|filterTranslation('paymentID')" />
          <wil-t-head :title="'Plan Name'|filterTranslation('planName')" />
          <wil-t-head :title="'Remaining Items'|filterTranslation('remainingItems')" />
          <wil-t-head :title="''|filterTranslation('billingType')" />
          <wil-t-head :title="''|filterTranslation('changePlan')" />
          <wil-t-head :title="''|filterTranslation('viewDetails')" />
        </template>
        <template v-slot:tbody>
          <tr
            v-show="hasCurrentPlan"
            v-for="item in aCurrentPlans"
            :key="`plan-item-${item.paymentID}`"
          >
            <td class="before-hide" v-html="renderPaymentID(item.paymentID)"></td>
            <td
              class="before-hide"
              :data-th="''|filterTranslation('planName')"
              v-html="item.planName"
            ></td>
            <td
              class="before-hide"
              :data-th="''|filterTranslation('remainingItems')"
              v-text="printRemainingItem(item.remainingItems)"
            ></td>
            <td class="before-hide" :data-th="''|filterTranslation('billingType')"></td>
            <td class="before-hide" :data-th="''|filterTranslation('changePlan')">
              <router-link
                v-if="canChangePlan(item.category)"
                :to="{name: 'pricings', params: {type: item.postType}, query: {planID:
                        item.planID, paymentID: item.paymentID, gateway: item.gateway}}"
                class="wil-btn wil-btn--primary wil-btn--sm wil-btn--success wil-change-plan wil-btn--round"
              >{{'Change plan'|filterTranslation('changePlan')}}</router-link>
              <span v-else>x</span>
            </td>
            <td class="before-hide" :data-th="'View details'|filterTranslation('viewDetails')">
              <router-link
                :to="{name: 'billingdetails', params: {id: item.paymentID}, query: item}"
                class="wil-btn wil-btn--primary wil-btn--sm wil-btn--success wil-change-plan wil-btn--round"
              >{{''|filterTranslation('viewDetails')}}</router-link>
            </td>
          </tr>
        </template>
      </wil-table>
      <wil-alert v-if="erroMsg.length" :msg="erroMsg" alignment="align-center" />
    </div>
    <wil-billings-invoices />

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
import WilBillingsInvoices from "./Billings/WilBillingsInvoices.vue";

export default {
  name: "wil-dashboard-billings",
  data() {
    return {
      errorMsg: "",
      isLoading: false,
      oBilling: {},
      invoiceID: 1,
      aCurrentPlans: [],
      erroMsg: "",
      aCanChangePlans: ["addlisting", "paidClaim"]
    };
  },
  computed: {
    hasCurrentPlan() {
      return this.aCurrentPlans.length;
    }
  },
  components: {
    WilBillingsInvoices
  },
  methods: {
    canChangePlan(category) {
      return this.aCanChangePlans.indexOf(category) !== -1;
    },
    renderPaymentID(paymentID) {
      return "#" + paymentID;
    },
    printRemainingItem(remaining) {
      if (remaining >= 1000) {
        return this.$options.filters.filterTranslation("unlimited");
      } else {
        return remaining;
      }
    },
    fetchActivatingPlan() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_my_plan`
      })
        .then(response => {
          if (response.data.success) {
            this.aCurrentPlans = response.data.data;
          } else {
            this.erroMsg = response.data.data.msg;
          }
        })
        .finally(() => (this.isLoading = false));
    }
  },
  created() {
    this.fetchActivatingPlan();
  }
};
</script>

