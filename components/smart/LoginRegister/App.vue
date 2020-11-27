<template>
  <div id="wil-login-register-controller" class="header_login__1sQ6w">
    <register-login v-if="!isLoggedIn" />
    <user-profile v-else :user-id="userId" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoggedIn: WILOKE_INLINE_GLOBAL.isUserLoggedIn === "yes",
      userId: parseInt(WILOKE_INLINE_GLOBAL.userID, 10)
    };
  },
  components: {
    RegisterLogin: () =>
      import(
        /* webpackChunkName: "RegisterLogin" */
        /* webpackPrefetch: true */
        "./RegisterLogin.vue"
      ),
    UserProfile: () =>
      import(
        /* webpackChunkName: "UserProfile" */
        /* webpackPrefetch: true */
        "./UserProfile.vue"
      )
  }
};
</script>
