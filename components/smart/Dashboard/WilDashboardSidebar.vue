<template>
  <div class="dashboard__sidebar js-sticky" data-margin-top="0">
    <div>
      <wil-dashboard-sidebar-profile :user-id="userId" />
      <wil-dashboard-sidebar-follow-me :user-id="userId" />
    </div>
    <wil-dashboard-sidebar-navigation />
  </div>
</template>
<script>
import WilDashboardSidebarFollowMe from "./Sidebar/WilDashboardSidebarFollowMe.vue";
import WilDashboardSidebarProfile from "./Sidebar/WilDashboardSidebarProfile.vue";
import WilDashboardSidebarNavigation from "./Sidebar/WilDashboardSidebarNavigation.vue";

export default {
  name: "wil-dashboard-sidebar",
  props: {
    userId: {
      type: Number,
      default: 0
    }
  },
  components: {
    WilDashboardSidebarFollowMe,
    WilDashboardSidebarProfile,
    WilDashboardSidebarNavigation
  }
};
</script>
