<template>
  <div>
    <div class="divider-text_module__3vqhE divider-text_center__299NM mt-15 mb-15">
      <span class="divider-text_text__2OtOt" v-html="connectWithSocialNetworks"></span>
    </div>
    <component
      margin="mt-10"
      v-for="social in socialsLogin"
      :key="`social-login-${social.social}`"
      :configs="social.configs"
      :is="social.social"
    ></component>
  </div>
</template>
<script>
export default {
  name: "socials-login",
  components: {
    AppleLogin: () =>
      import(
        /*webpackChunkName: 'AppleLogin' */
        "./AppleLogin.vue"
      )
  },
  computed: {
    connectWithSocialNetworks() {
      return this.$options.filters.filterTranslation(
        "Connect with Facebook",
        "connectWithSocialNetworks"
      );
    }
  },
  props: {
    socialsLogin: {
      type: Array,
      default: () => []
    }
  }
};
</script>
