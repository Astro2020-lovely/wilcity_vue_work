<template>
  <div class="listing-table_module__2vE05 table-module pos-r">
    <content-placeholders v-if="isLoading">
      <content-placeholders-text :lines="4" />
    </content-placeholders>
    <wil-table
      wrapper-classes="listing-table_table__2Cfzq wil-table-responsive-lg table-module__table"
    >
      <template v-slot:thead>
        <wil-t-head
          icon="la la-archive"
          :title="'' | filterTranslation('date')"
        />
        <wil-t-head :title="'' | filterTranslation('gateway')" />
        <wil-t-head :title="'' | filterTranslation('subTotal')" />
        <wil-t-head :title="'' | filterTranslation('discount')" />
        <wil-t-head :title="'' | filterTranslation('totalLabel')" />
        <wil-t-head :title="'' | filterTranslation('currency')" />
      </template>
      <template v-slot:tbody>
        <tr v-if="hasBilling">
          <td class="before-hide" :data-th="'' | filterTranslation('date')">
            {{ invoice.created_at }}
          </td>
          <td class="before-hide" :data-th="'' | filterTranslation('gateway')">
            {{ invoice.gateway }}
          </td>
          <td class="before-hide" :data-th="'' | filterTranslation('subTotal')">
            {{ invoice.subTotal }}
          </td>
          <td class="before-hide" :data-th="'' | filterTranslation('discount')">
            {{ invoice.discount }}
          </td>
          <td
            class="before-hide"
            :data-th="'' | filterTranslation('totalLabel')"
          >
            {{ invoice.total }}
          </td>
          <td
            class="before-hide"
            :data-th="'Currency' | filterTranslation('currency')"
          >
            {{ invoice.currency }}
          </td>
          <td class="before-hide" :data-th="'' | filterTranslation('planName')">
            {{ invoice.planName }}
          </td>
        </tr>
      </template>
    </wil-table>
    <wil-alert v-if="errorMsg.length" :msg="errorMsg" aligment="align-center" />
  </div>
</template>
<script>
export default {
  name: "wil-billings-invoice-details",
  data() {
    return {
      errorMsg: "",
      isLoading: false,
      invoice: {},
      invoiceID: 1
    };
  },
  computed: {
    hasBilling() {
      return !_.isEmpty(this.invoice);
    }
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === "invoicedetails") {
          this.fetchMyBillingDetails();
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    fetchMyBillingDetails() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_fetch_my_billing_details",
          invoiceID: this.$route.params.id
        })
      })
        .then(response => {
          if (response.data.success) {
            this.invoice = { ...response.data.data };
          } else {
            this.errorMsg = response.data.data.msg;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
