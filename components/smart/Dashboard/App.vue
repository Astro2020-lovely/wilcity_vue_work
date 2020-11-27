<template>
  <div id="wilcity-dashboard" class="wil-dashboard wil-content">
    <notifications
      group="dashboard-notification"
      classes="vue-notification dashboard-notification"
    />
    <section
      id="wilcity-dashboard-inner"
      class="wil-section wil-dashboard-inner bg-color-gray-2 pd-0"
    >
      <div class="dashboard-content_module__zpEtP clearfix">
        <!-- Sidebar -->
        <wil-dashboard-sidebar :user-id="userId" />
        <!-- End / Sidebar -->

        <!-- Content -->
        <div class="dashboard__content">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
        <!-- End / Content -->
      </div>
    </section>
  </div>
</template>
<style>
.dashboard-notification {
  margin-top: 50px;
}
</style>
<script>
import { dashboardRouter } from "./../../../routers/dashboard.js";
import WilDashboardSidebar from "./WilDashboardSidebar.vue";

export default {
  data() {
    return {
      userId: parseInt(WILOKE_INLINE_GLOBAL.userID, 10)
    };
  },
  components: {
    WilDashboardSidebar
  },
  router: dashboardRouter,
  mounted() {
    // console.log(this.$route);
  }
};
</script>
