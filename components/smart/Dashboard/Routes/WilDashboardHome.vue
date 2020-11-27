<template>
  <div>
    <div
      class="row wilcity-listing-status pos-r"
      data-col-xs-gap="10"
      style="min-height: 175px;"
    >
      <content-placeholders v-if="isLoading">
        <content-placeholders-text :lines="4" />
      </content-placeholders>
      <wil-colorful-box
        v-for="(oInfo, order) in generalStatistics"
        :key="`listing-status-statistics-${order}`"
        :wrapper-classes="oInfo.wrapperClasses"
        :icon="oInfo.icon"
        :heading="oInfo.total"
        :desc="colorBoxLabel(oInfo.label)"
        :bg-color="oInfo.bgColor"
      />
    </div>
    <div class="row" data-col-xs-gap="10">
      <div class="col-md-9">
        <div class="row" data-col-xs-gap="10">
          <div class="col-md-6 wil-views-chart-wrapper">
            <wil-dashboard-views-chart :chart-color="parseChartsColor.view" />
          </div>
          <div class="col-md-6 wil-views-shares-wrapper">
            <wil-dashboard-shares-chart :chart-color="parseChartsColor.share" />
          </div>
          <div class="col-md-6 wil-views-favorites-wrapper">
            <wil-dashboard-favorites-chart
              :chart-color="parseChartsColor.favorite"
            />
          </div>
          <div class="col-md-6 wil-views-ratings-wrapper">
            <wil-dashboard-ratings-chart
              :chart-color="parseChartsColor.rating"
            />
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <wil-notifications :has-footer="true" />
      </div>
    </div>
  </div>
</template>
<script>
import WilColorfulBox from "./../../../dumbs/WilColorfulBox.vue";
import WilDashboardViewsChart from "./WilDashboardViewsChart.vue";
import WilDashboardSharesChart from "./WilDashboardSharesChart.vue";
import WilDashboardRatingsChart from "./WilDashboardRatingsChart.vue";
import WilDashboardFavoritesChart from "./WilDashboardFavoritesChart.vue";
import WilNotifications from "./WilNotifications.vue";

export default {
  name: "wil-dashboard-home",
  components: {
    WilDashboardRatingsChart,
    WilDashboardSharesChart,
    WilColorfulBox,
    WilDashboardViewsChart,
    WilDashboardFavoritesChart,
    WilNotifications
  },
  data() {
    return {
      generalStatistics: [],
      isLoading: false
    };
  },
  computed: {
    parseChartsColor() {
      if (!_.isEmpty(this.chartsColor)) {
        return this.chartsColor;
      }

      return WILOKE_GLOBAL.chartsColor;
    }
  },
  props: {
    chartsColor: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    colorBoxLabel(label) {
      return this.$options.filters.filterTranslation(label);
    },
    fetchGeneralStatistics() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_general_status_statistics`
      })
        .then(response => {
          this.generalStatistics = response.data.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  created() {
    this.fetchGeneralStatistics();
  }
};
</script>
