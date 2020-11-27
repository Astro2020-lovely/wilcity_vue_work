<template>
  <div class="listing-table_module__2vE05 table-module pos-r">
    <wil-block-loading :is-loading="isLoading" />
    <wil-table>
      <template v-slot:thead>
        <wil-t-head icon="la la-archive" :title="'Position'|filterTranslation('position')" />
        <wil-t-head :title="'Expiry On'|filterTranslation('expiryOn')" />
      </template>
      <template v-slot:tbody>
        <tr v-if="errorMsg.length">
          <td colspan="2">{{errorMsg}}</td>
        </tr>
        <tr v-for="item in items" :key="`wil-promotion-position-${item.position}`">
          <td class="before-hide" :data-th="'Expiry on'|filterTranslation('expiryOn')">
            <wil-td-item :item="item" />
          </td>
          <td
            class="before-hide"
            :data-th="'Gateway'|filterTranslation('gateway')"
          >{{item.expiryOn}}</td>
        </tr>
      </template>
      <template v-slot:tfoot>
        <td colspan="2">
          <router-link
            class="wil-btn wil-btn wil-btn--primary2 wil-btn--sm wil-float-right"
            :to="backRoute"
          >{{'Back'|filterTranslation('back')}}</router-link>
        </td>
      </template>
    </wil-table>
  </div>
</template>
<script>
import WilTdItem from "./../../../dumbs/table/WilTdItem.vue";

export default {
  name: "wil-dashboard-promotion-details",
  components: {
    WilTdItem
  },
  watch: {
    $route: {
      handler(route) {
        this.postType =
          route.query && route.query.postType ? route.query.postType : "";
        this.fetchPromotionDetails();
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    backRoute() {
      if (this.postType === "event") {
        return {
          name: "events"
        };
      }

      return {
        name: "listings",
        params: {
          postType: this.postType
        }
      };
    }
  },
  data() {
    return {
      errorMsg: "",
      isLoading: false,
      items: [],
      postType: ""
    };
  },
  methods: {
    fetchPromotionDetails() {
      this.isLoading = true;
      this.errorMsg = "";
      this.items = [];
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_listing_promotions&postID=${this.$route.params.id}`
      })
        .then(response => {
          if (response.data.success) {
            this.items = [...response.data.data];
          } else {
            this.errorMsg = response.data.data.msg;
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
