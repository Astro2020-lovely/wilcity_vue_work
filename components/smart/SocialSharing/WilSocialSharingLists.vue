<template>
  <ul v-if="socials.length && type === 'list'" :class="wrapperClasses">
    <li
      :class="innerClasses"
      v-for="social in socials"
      :key="`social-network-${social}`"
      @click="handleClick"
    >
      <component
        :is="determineComponent(social)"
        :settings="settings"
        :wrapper-classes="socialClasses"
        @click="handleShared"
      ></component>
    </li>
  </ul>
  <div v-else-if="socials.length" :class="wrapperClasses" @click="handleClick">
    <component
      v-for="social in socials"
      type="button"
      :key="`social-network-${social}`"
      :is="determineComponent(social)"
      @click="handleShared"
      :settings="settings"
      :wrapper-classes="socialClasses"
    ></component>
  </div>
</template>
<script>
export default {
  name: "wil-social-sharing-lists",
  components: {
    WilSocialSharingCopy: () =>
      import(
        /*webpackChunkName: "WilSocialSharingCopy" */
        /*webpackPreload: true */
        "./WilSocialSharingCopy.vue"
      ),
    WilSocialSharingWhatsapp: () =>
      import(
        /*webpackChunkName: "WilSocialSharingWhatsapp" */
        /*webpackPreload: true */
        "./WilSocialSharingWhatsapp.vue"
      ),
    WilSocialSharingVk: () =>
      import(
        /*webpackChunkName: "WilSocialSharingVk" */
        /*webpackPreload: true */
        "./WilSocialSharingVk.vue"
      ),
    WilSocialSharingTwitter: () =>
      import(
        /*webpackChunkName: "WilSocialSharingTwitter" */
        /*webpackPreload: true */
        "./WilSocialSharingTwitter.vue"
      ),
    WilSocialSharingTwitter: () =>
      import(
        /*webpackChunkName: "WilSocialSharingTwitter" */
        /*webpackPreload: true */
        "./WilSocialSharingTwitter.vue"
      ),
    WilSocialSharingTumblr: () =>
      import(
        /*webpackChunkName: "WilSocialSharingTumblr" */
        /*webpackPreload: true */
        "./WilSocialSharingTumblr.vue"
      ),
    WilSocialSharingStumbleupon: () =>
      import(
        /*webpackChunkName: "WilSocialSharingStumbleupon" */
        /*webpackPreload: true */
        "./WilSocialSharingStumbleupon.vue"
      ),
    WilSocialSharingReddit: () =>
      import(
        /*webpackChunkName: "WilSocialSharingReddit" */
        /*webpackPreload: true */
        "./WilSocialSharingReddit.vue"
      ),
    WilSocialSharingPinterest: () =>
      import(
        /*webpackChunkName: "WilSocialSharingPinterest" */
        /*webpackPreload: true */
        "./WilSocialSharingPinterest.vue"
      ),
    WilSocialSharingLinkedIn: () =>
      import(
        /*webpackChunkName: "WilSocialSharingLinkedIn" */
        /*webpackPreload: true */
        "./WilSocialSharingLinkedIn.vue"
      ),
    WilSocialSharingFacebook: () =>
      import(
        /*webpackChunkName: "WilSocialSharingFacebook" */
        /*webpackPreload: true */
        "./WilSocialSharingFacebook.vue"
      ),
    WilSocialSharingEmail: () =>
      import(
        /*webpackChunkName: "WilSocialSharingEmail" */
        /*webpackPreload: true */
        "./WilSocialSharingEmail.vue"
      ),
    WilSocialSharingDigg: () =>
      import(
        /*webpackChunkName: "WilSocialSharingDigg" */
        /*webpackPreload: true */
        "./WilSocialSharingDigg.vue"
      )
  },
  methods: {
    handleShared() {
      this.$emit("shared");
    },
    determineComponent(social) {
      if (social === "linkedin") {
        return "wil-social-sharing-linked-in";
      }

      return `wil-social-sharing-${social}`;
    },
    handleClick() {
      this.$emit("click");
    }
  },
  props: {
    type: {
      type: String,
      default: "list"
    },
    socials: {
      type: Array,
      default: () => []
    },
    settings: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default:
        "list_module__1eis9 list-none list_social__31Q0V list_medium__1aT2c list_abs__OP7Og arrow--top-right"
    },
    socialClasses: {
      type: String,
      default: "list_link__2rDA1 text-ellipsis color-primary--hover"
    },
    innerClasses: {
      type: String,
      default: "list_item__3YghP"
    }
  }
};
</script>
