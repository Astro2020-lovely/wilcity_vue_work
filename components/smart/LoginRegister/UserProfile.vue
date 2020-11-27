<template>
  <div
    id="wil-profile-nav-menu"
    :class="wrapperClasses"
    v-click-outside="closeProfileMenu"
  >
    <a
      class="header_loginHead__3HoVP"
      href="#"
      @click.prevent="toggleProfileMenu"
    >
      <div
        class="header_avatar__3lw1r bg-cover"
        :style="{ 'background-image': `url(${userShortInfo.avatar})` }"
      >
        <img :src="userShortInfo.avatar" :alt="userShortInfo.displayName" />
      </div>
    </a>
    <div class="header_loginBody__2hz2g" :class="dropdownClasses">
      <wil-block-loading :is-loading="isLoading" />
      <keep-alive>
        <div
          v-if="!isLoading"
          class="dashboard-nav_module__3c0Pb list-none dashboard-nav_abs__2IGwx arrow--top-right"
        >
          <ul>
            <li
              v-for="(item, key) in menuItems"
              :key="`wil-dashboard-menu-item-${key}`"
              :class="[
                'dashboard-nav_item__2798B',
                item.extraClasses,
                `wilcity-dashboard-item-${key}`
              ]"
            >
              <a
                class="dashboard-nav_link__2BmK9 text-ellipsis color-primary--hover"
                :href="getItemLink(item)"
                :target="getItemLinkTarget(item)"
              >
                <span v-if="item.icon" class="dashboard-nav_icon__2gZV4">
                  <i :class="item.icon"></i>
                </span>
                <span
                  v-if="item.name"
                  class="dashboard-nav_text__x-_IZ"
                  v-text="getItemName(item.name)"
                ></span>
                <span class="dashboard-nav_number__5N1Ch color-primary"></span>
              </a>
            </li>
          </ul>
        </div>
      </keep-alive>
    </div>
  </div>
</template>
<style scoped>
.wil-height-200 {
  min-height: 200px;
}
</style>
<script>
import { DashboardMenuHelper } from "./../../../mixins/DashboardMenuHelper";
import { fetchUserInfo } from "./../../../mixins/UserHelper";
export default {
  mixins: [DashboardMenuHelper, fetchUserInfo],
  data() {
    return {
      isShowing: false,
      isLoading: false
    };
  },
  props: {
    userId: {
      // userID,avatar,displayName
      type: Number,
      default: 0
    }
  },
  watch: {
    isShowing() {
      this.fetchDashboardMenuItems();
    }
  },
  created() {
    this.fetchUserInfo(this.userId);
  },
  computed: {
    wrapperClasses() {
      return this.isShowing
        ? "header_loginItem__oVsmv account active"
        : "header_loginItem__oVsmv account";
    },
    dropdownClasses() {
      return this.isShowing ? "active wil-height-200" : "";
    }
  },
  methods: {
    getItemName(name) {
      const translation = this.$options.filters.filterTranslation(name);
      if (_.isObject(translation)) {
        return name;
      }

      return translation;
    },
    toggleProfileMenu() {
      this.isShowing = !this.isShowing;
    },
    closeProfileMenu(event) {
      if (this.isShowing) {
        event.preventDefault();
        this.isShowing = false;
      }
    },
    navWrapperClass() {
      return "dashboard-nav_item__2798B";
    }
  }
};
</script>
