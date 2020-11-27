<template>
  <div class="header_btnGroup__3L61P">
    <wil-link
      :btn-name="'Login' | filterTranslation('login')"
      wrapper-classes="wil-btn no-text-sm wil-btn--primary2 wil-btn--round wil-btn--xs"
      icon="la la-unlock-alt"
      @click="handleLogin"
    />
    <wil-link
      v-if="configs.allowRegister === 'yes'"
      :btn-name="'Register' | filterTranslation('register')"
      wrapper-classes="wil-btn no-text-sm wil-btn--secondary wil-btn--round wil-btn--xs"
      icon="la la-user-plus"
      @click="handleRegister"
    />

    <portal to="wil-modal" v-if="isOpenPopup">
      <login-register-popup
        :form-type="formType"
        :allow-register="configs.allowRegister === 'yes'"
        :register-form-fields="configs.registerFormFields"
        :google-re-captcha="configs.googleReCaptcha"
        :socials-login="configs.socialsLogin"
        v-on:change-form-type="handleChangeFormType"
        @close="togglePopup"
      />
    </portal>
  </div>
</template>
<script>
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
export default {
  name: "register-login",
  components: {
    LoginRegisterPopup: () =>
      import(
        /*webpackChunkName: "LoginRegisterPopup" */
        /*webpackPrefetch: true */
        "./LoginRegisterPopup.vue"
      )
  },
  data() {
    return {
      configs: { ...WIL_REGISTER_LOGIN }, // {@see: WilokeListingToos -> UserController -> printLoginConfiguration}
      isOpenPopup: false,
      formType: "login-form"
    };
  },
  mounted() {
    this.listenjQuery();
    // this.handleShowPopupWithExternalButton();
  },
  methods: {
    handleShowPopupWithExternalButton() {
      jQuery(".wilcity-trigger-login-button").on("click", function() {
        jQuery("body").trigger("onOpenLoginRegisterPopup", ["login-form"]);
      });

      jQuery(".wilcity-trigger-register-button").on("click", function() {
        jQuery("body").trigger("onOpenLoginRegisterPopup", ["register-form"]);
      });
    },
    listenjQuery() {
      jQuery("body").on("onOpenLoginRegisterPopup", (event, formType) => {
        if (formType === "login-form" || formType === "login") {
          this.handleLogin(event, true);
        } else {
          this.handleRegister(event, true);
        }
      });
    },
    handleChangeFormType(formType) {
      this.formType = formType;
    },
    redirectToLoginPage(action) {
      var url = decodeURIComponent(this.configs.customLoginPageUrl);
      if (url.indexOf("redirect_to") > -1) {
        window.location.href = `${url}&action=${action}`;
      } else {
        window.location.href = `${url}?action=${action}`;
      }
    },
    togglePopup() {
      this.isOpenPopup = !this.isOpenPopup;
    },
    handleLogin(event, isFocusPopup) {
      event.preventDefault();
      this.formType = "login-form";
      if (this.configs.mode === "custom" && !!isFocusPopup === false) {
        this.redirectToLoginPage("login");
        return true;
      }

      this.togglePopup();
    },
    handleRegister(event) {
      event.preventDefault();
      this.formType = "register-form";
      if (this.configs.mode === "custom") {
        this.redirectToLoginPage("register");
        return true;
      }

      this.togglePopup();
    },
    fetchRegisterLoginConfiguration() {
      Vue.axios
        .get(`${WILOKE_GLOBAL.restAPI}/users/login-register-config`)
        .then(response => {
          this.configuration = { ...response.data };
        });
    }
  }
};
</script>
