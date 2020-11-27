<template>
  <!-- utility-box-1_module__MYXpX -->
  <div class="utility-box-1_module__MYXpX wil-text-center">
    <div
      class="utility-box-1_avatar__DB9c_ rounded-circle"
      :style="`background-image: url(${userShortInfo.avatar})`"
    >
      <img :src="userShortInfo.avatar" :alt="userShortInfo.displayName" />
    </div>
    <div class="utility-box-1_body__8qd9j">
      <div class="utility-box-1_group__2ZPA2">
        <h3 class="utility-box-1_title__1I925" v-html="userShortInfo.displayName"></h3>
      </div>
      <div
        v-if="profileMeta && Object.keys(profileMeta).length"
        class="utility-box-1_description__2VDJ6"
      >
        <div
          v-for="(val, key) in profileMeta"
          :key="`wil-profile-meta-data-${key}`"
          class="utility-box-1_description__2VDJ6"
          v-html="val"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { fetchUserInfo } from "./../../../../mixins/UserHelper";

export default {
  name: "wil-dashboard-sidebar-profile",
  mixins: [fetchUserInfo],
  computed: {
    profileMeta() {
      let meta = { ...this.userShortInfo };
      if (meta) {
        delete meta.displayName;
        delete meta.avatar;
        delete meta.isLoggedIn;
      }
      return meta;
    }
  },
  mounted() {
    this.fetchUserInfo(this.userId, "avatar,displayName,position");
  },
  props: {
    userId: {
      type: Number,
      default: 0
    }
  }
};
</script>
