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
          icon="la la-credit-card"
          :title="'' | filterTranslation('billingHistory')"
        />
        <wil-t-head :title="'' | filterTranslation('gateway')" />
        <wil-t-head :title="'' | filterTranslation('amount')" />
        <wil-t-head
          class="wil-text-right"
          :title="'' | filterTranslation('currency')"
        />
        <wil-t-head
          class="wil-text-right"
          :title="'View Details' | filterTranslation('viewDetails')"
        />
        <wil-t-head
          class="wil-text-right"
          :title="'Download' | filterTranslation('download')"
        />
      </template>
      <template v-slot:tbody>
        <tr v-for="item in aBillings" :key="`wil-billing-item-${item.ID}`">
          <td class="before-hide" :data-th="'' | filterTranslation('date')">
            {{ item.created_at }}
          </td>
          <td :data-th="'' | filterTranslation('gateway')">
            {{ item.gateway }}
          </td>
          <td :data-th="'' | filterTranslation('amount')">{{ item.total }}</td>
          <td :data-th="'' | filterTranslation('totalLabel')">
            {{ item.currency }}
          </td>
          <td :data-th="'' | filterTranslation('viewDetails')">
            <router-link
              :to="{ name: 'invoicedetails', params: { id: item.ID } }"
              >{{
                "View details" | filterTranslation("viewDetails")
              }}</router-link
            >
          </td>
          <td>
            <form :action="formInvoiceURL" method="POST">
              <input type="hidden" name="action" value="download_invoice" />
              <input type="hidden" name="invoiceID" :value="item.ID" />
              <button
                class="wil-btn wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
                type="submit"
              >
                {{ "Download" | filterTranslation("download") }}
              </button>
            </form>
          </td>
        </tr>
      </template>
    </wil-table>
    <wil-alert
      v-if="errorMsg.length"
      :msg="errorMsg"
      alignment="align-center"
    />
    <wil-pagination
      v-on:change="onSwitchPage"
      v-if="maxPages > 1"
      :current-page="page"
      :max-pages="maxPages"
    />
  </div>
</template>
<script>
export default {
  name: "wil-billings-invoices",
  data() {
    return {
      errorMsg: "",
      isLoading: false,
      aCacheBillings: [],
      aBillings: [],
      page: 1,
      maxPages: 1,
      billingType: null
    };
  },
  computed: {
    formInvoiceURL() {
      return WILOKE_GLOBAL.ajaxurl;
    }
  },
  methods: {
    fetchMyBillings() {
      if (this.aCacheBillings[this.page]) {
        this.aBillings = this.aCacheBillings[this.page];
        return true;
      }
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_my_billings&page=${this.page}`
      })
        .then(response => {
          if (response.data.success) {
            this.aBillings = response.data.data.aInvoices;
            this.aCacheBillings[this.page] = this.aBillings;
            this.maxPages = parseInt(response.data.data.maxPages, 10);
          } else {
            if (!response.data.reachedMaximum) {
              this.errorMsg = response.data.data.msg;
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    onSwitchPage(page) {
      this.page = page;
      this.fetchMyBillings();
    }
  },
  created() {
    this.fetchMyBillings();
  }
};
</script>
