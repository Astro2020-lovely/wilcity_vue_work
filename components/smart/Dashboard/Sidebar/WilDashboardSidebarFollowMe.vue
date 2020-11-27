<template>
  <div class="follow_module__17lY_ mt-20">
    <div class="follow_item__3GAob">
      <div class="follow_content__2R1YP">
        <a href="#">
          <span class="color-primary"></span>
          <span v-html="userShortInfo.totalFollowers ? userShortInfo.totalFollowers : 0"></span>
          <span>{{'Followers'|filterTranslation('follower')}}</span>
        </a>
      </div>
    </div>
    <div class="follow_item__3GAob">
      <div class="follow_content__2R1YP">
        <a href="#">
          <span class="color-primary"></span>
          <span v-html="userShortInfo.totalFollowings ? userShortInfo.totalFollowings : 0"></span>
          <span>{{'Following'|filterTranslation('following')}}</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { fetchUserInfo } from "./../../../../mixins/UserHelper";
export default {
  name: "wil-dashboard-sidebar-follow-me",
  mixins: [fetchUserInfo],
  mounted() {
    this.fetchUserInfo(this.userId, "totalFollowings,totalFollowers");
  },
  props: {
    userId: {
      type: Number,
      default: 0
    }
  }
};
</script>
