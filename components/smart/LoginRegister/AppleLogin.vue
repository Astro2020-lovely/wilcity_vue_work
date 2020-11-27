<template>
  <div id="appleid-signin" data-color="black" data-border="true" data-type="sign in"></div>
</template>
<script>
export default {
  name: "apple-login",
  data() {
    return {
      isLoading: false
    };
  },
  props: {
    configs: {
      type: Object,
      required: true,
      default: () => {
        return {
          clientId: {
            type: String,
            required: true
          },
          redirectURI: {
            type: String,
            default: ""
          },
          state: {
            // optional, An unguessable random string. It is primarily used to protect against CSRF attacks.
            type: String,
            default: ""
          },
          scope: {
            type: String,
            default: "email" // optional, default value is "email".
          }
        };
      }
    }
  },
  mounted() {
    console.log(this.configs, 1);
    AppleID.auth.init(this.configs);
  }
};
</script>
