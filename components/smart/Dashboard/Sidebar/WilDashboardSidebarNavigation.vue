<template>
  <div class="dashboard-nav_module__3c0Pb list-none mt-30 mb-30 pos-r">
    <ul>
      <li
        v-for="(item, key) in menuItems"
        :key="`wil-dashboard-menu-item-${key}`"
        :class="liClasses(item)"
      >
        <router-link
          v-if="!isExternalLink(item)"
          :class="
            `dashboard-nav_link__2BmK9 text-ellipsis color-primary--hover wilcity-dashboard-item-${key}`
          "
          :to="parseQueryArgs(item)"
        >
          <template>
            <span v-if="item.icon" class="dashboard-nav_icon__2gZV4">
              <i :class="item.icon"></i>
            </span>
            <span
              v-if="item.name"
              class="dashboard-nav_text__x-_IZ"
              v-text="getItemName(item.name)"
            ></span>
            <span class="dashboard-nav_number__5N1Ch color-primary"></span>
          </template>
        </router-link>
        <a
          v-else
          :href="getItemLink(item)"
          :class="
            `dashboard-nav_link__2BmK9 text-ellipsis color-primary--hover wilcity-dashboard-item-${key}`
          "
        >
          <span v-if="item.icon" class="dashboard-nav_icon__2gZV4">
            <i :class="item.icon"></i>
          </span>
          <span v-if="item.name" class="dashboard-nav_text__x-_IZ">{{
            item.name | filterTranslation(item.translation)
          }}</span>
          <span class="dashboard-nav_number__5N1Ch color-primary"></span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import { DashboardMenuHelper } from "./../../../../mixins/DashboardMenuHelper";
export default {
  name: "wil-dashboar-sidebar-navigation",
  watch: {
    $route: {
      handler(to, from) {
        this.currentRoute = to.name;
      },
      immediate: true
    }
  },
  data() {
    return {
      currentRoute: "dashboard"
    };
  },
  mixins: [DashboardMenuHelper],
  created() {
    this.fetchDashboardMenuItems();
  },
  mounted() {
    this.currentRoute = this.$route.name;
  },
  methods: {
    getItemName(name) {
      const translation = this.$options.filters.filterTranslation(name);
      if (_.isObject(translation)) {
        return name;
      }

      return translation;
    },
    liClasses(item) {
      let classes = `dashboard-nav_item__2798B`;
      if (!!item.name) {
        classes = `${classes} wilcity-dashboard-route-${item.name
          .replace(/\s/, "")
          .toLowerCase()}`;
      }

      if (item.extraClasses) {
        classes = `${classes} ${item.extraClasses}`;
      }
      if (
        item.params &&
        item.params.postType &&
        item.params.postType === this.$route.params.postType
      ) {
        return `${classes} active`;
      } else if (
        this.currentRoute === item.endpoint &&
        !this.$route.params.postType
      ) {
        return `${classes} active`;
      }

      return classes;
    },
    parseQueryArgs(item) {
      let args = { name: item.routeName ? item.routeName : item.endpoint };
      if (this.isExternalLink(item)) {
        args = {
          ...args,
          query: {
            redirectTo: this.getItemLink(item)
          }
        };
      } else {
        if (item.params) {
          args = {
            ...args,
            params: { ...item.params }
          };
        } else {
          args = {
            ...args,
            to: `/${item.endpoint}`
          };
        }
      }
      return args;
    }
  }
};
</script>
