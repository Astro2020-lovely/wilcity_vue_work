<template>
  <div :class="wrapperClasses" v-click-outside="hideSocialSharing">
    <wil-link
      @click="toggleSocialsSharing"
      :wrapper-classes="btnClasses"
      icon="color-primary la la-share"
      :span-classes="spanClasses"
      :btn-name="'Share' | filterTranslation('share')"
    ></wil-link>
    <div v-if="isOpen" class="listing-detail_shareContent__2nr-2 active">
      <keep-alive>
        <wil-social-sharing-lists
          @shared="handleClick"
          :settings="parseSettings"
          :socials="socials"
        ></wil-social-sharing-lists>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "wil-social-sharing-btn",
  data() {
    return {
      isOpen: false
    };
  },
  components: {
    WilSocialSharingLists: () =>
      import(
        /*webpackChunkName: "WilSocialSharingLists" */
        /*webpackPreload: true */
        "./WilSocialSharingLists.vue"
      )
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "listing-detail_rightItem__2CjTS wil-single-tool-share"
    },
    btnClasses: {
      type: String,
      default: "wil-btn wil-btn--border wil-btn--round wil-btn--sm"
    },
    spanClasses: {
      type: String,
      default: ""
    },
    socials: {
      type: Array,
      default: () => []
    },
    settings: {
      type: [Object, String], // {postID, title: "", link: "", img: "", quote: "", code: "", hashtags: ""}
      default: () => {}
    }
  },
  computed: {
    parseSettings() {
      if (typeof this.settings === "string") {
        return JSON.parse(window.atob(this.settings));
      }

      return this.settings;
    }
  },
  methods: {
    toggleSocialsSharing() {
      this.isOpen = !this.isOpen;
    },
    hideSocialSharing() {
      this.isOpen = false;
    },
    handleClick() {
      if (!this.parseSettings.postID) {
        return false;
      }
      this.toggleSocialsSharing();
      this.$emit("click");

      const data = this.createFormData({
        action: "wilcity_count_shares",
        postID: this.parseSettings.postID
      });

      Vue.axios({
        method: "POST",
        url: `${WILOKE_GLOBAL.ajaxurl}`,
        data
      });
    }
  }
};
</script>
