<template>
  <wil-chart
    v-if="isLoaded"
    :heading="'View Statistic' | filterTranslation('viewStatistic')"
    :label="'Views' | filterTranslation('views')"
    icon="la la-eye"
    :total="info.total"
    :data="info.data"
    :chart-color="chartColor"
    wrapper-classes="content-box_module__333d9 mb-0 wil-view-cart"
    :compare="info.compare"
  />
</template>

<script>
import WilChart from "./../../../dumbs/WilChart.vue";

export default {
  name: "wil-dashboard-views-chart",
  data() {
    return {
      statisticBy: "day",
      info: {},
      isLoaded: false
    };
  },
  props: {
    postId: {
      type: Number,
      default: 0
    },
    chartColor: {
      type: String,
      default: "#f06292"
    }
  },
  computed: {},
  components: {
    WilChart
  },
  methods: {
    fetchGeneralData() {
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_views_latest_week&postId=${this.postId}`
      })
        .then(response => {
          this.info = response.data.data;
        })
        .finally(() => {
          this.isLoaded = true;
        });
    }
  },
  created() {
    this.fetchGeneralData();
  }
};
</script>
