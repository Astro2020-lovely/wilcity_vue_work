<template>
  <wil-link
    :wrapper-classes="wrapperClasses"
    @click="loginWithFacebook"
    icon="fa fa-facebook"
    btn-name="Login with Facebook"
    :is-loading="isLoading"
  />
</template>
<script>
export default {
  name: "facebook",
  data() {
    return {
      isLoading: false
    };
  },
  props: {
    margin: {
      type: String,
      default: ""
    },
    configs: {
      // {api: ""}
      type: Object,
      required: true
    }
  },
  computed: {
    wrapperClasses() {
      let css = `${this.margin} wil-btn wil-btn--facebook wil-btn--block wil-btn--md wil-btn--round`;
      if (this.isLoading) {
        css = `${css} wil-btn--loading`;
      }
      return css;
    },
    isChromeOniOS() {
      let navigatorUserAgent = navigator.userAgent;
      return (
        /CriOS/i.test(navigatorUserAgent) &&
        /iphone|ipod|ipad/i.test(navigatorUserAgent)
      );
    }
  },
  methods: {
    handleResponse(response) {
      if (response.status === "connected") {
        let formData = new FormData();
        formData.append("action", "wilcity_facebook_login");
        formData.append("fb_response", JSON.stringify(response));
        Vue.axios({
          data: formData,
          method: "POST",
          url: WILOKE_GLOBAL.ajaxurl
        })
          .then(response => {
            if (response.data.success) {
              if (response.data.data.redirectTo == "self") {
                location.reload();
              } else {
                window.location.href = decodeURIComponent(
                  response.data.data.redirectTo
                );
              }
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    loginWithFacebook(event) {
      event.preventDefault();
      this.isLoading = true;
      if (this.isChromeOniOS) {
        let url = `https://www.facebook.com/dialog/oauth?client_id=${this.configs.api}&redirect_uri=${this.configs.redirectTo}&scope=email,public_profile&state=${this.configs.fbState}`;
        window.open(url, "", null);

        //jQuery('<p class="fbl_error">'+fbl.l18n.chrome_ios_alert+'</p>').insertAfter(window.fbl_button);
        FB.getLoginStatus(response => {
          this.handleResponse(response);
        });
      } else {
        try {
          FB.login(
            response => {
              this.handleResponse(response);
            },
            {
              scope: "email,public_profile",
              return_scopes: true,
              auth_type: "rerequest"
            }
          );
        } catch (err) {
          this.isLoading = false;
          alert(
            this.$options.filters.filterTranslation(
              err.message,
              "fbLoginWarning"
            )
          );
        }
      }
    }
  }
};
</script>
