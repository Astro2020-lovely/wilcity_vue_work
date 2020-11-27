<template>
  <wil-popup
    id="signin-popup"
    wrapper-class="popup_module__3M-0- pos-f-full popup_sm__Rc24D popup_mobile-full__1hyc4"
    :is-open="true"
    :title="popupTitle"
    :icon="popupIcon"
    has-submit-btn="no"
    @close="handleClosePopup"
  >
    <div slot="body">
      <wil-alert v-show="msg.length" :msg="msg" />
      <keep-alive>
        <login-form
          v-if="formType === 'login-form'"
          v-on:switch-form-type="handleChangeFormType('lost-password-form')"
          :google-re-captcha="googleReCaptcha"
        />
        <register-form
          v-else-if="formType === 'register-form'"
          :form-fields="registerFormFields"
          :google-re-captcha="googleReCaptcha"
        />
        <lost-password-form
          v-else-if="formType === 'lost-password-form'"
          :form-fields="registerFormFields"
        />
      </keep-alive>

      <template v-if="formType !== 'register-form'">
        <div v-if="allowRegister" class="mt-15">
          <span v-html="donthaveanaccount"></span>
          <wil-link
            wrapper-classes="wil-float-right td-underline"
            href="#"
            @click="handleChangeFormType('register-form')"
            v-html="registerBtnName"
          />
        </div>
      </template>
      <div v-else-if="formType !== 'login-form'" class="mt-15">
        <span v-html="ihaveanaccount"></span>
        <wil-link
          wrapper-classes="wil-float-right td-underline"
          href="#"
          @click="handleChangeFormType('login-form')"
          v-html="loginBtnName"
        />
      </div>

      <socials-login v-if="socialsLogin.length" :socials-login="socialsLogin" />
    </div>
  </wil-popup>
</template>
<script lang="javascript">
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
export default {
  name: "login-register-popup",
  data() {
    return {
      msg: ""
    };
  },
  computed: {
    donthaveanaccount() {
      return this.$options.filters.filterTranslation('Don\'t have an account', 'donthaveanaccount');
    },
    ihaveanaccount() {
      return this.$options.filters.filterTranslation('Already have an account?', 'ihaveanaccount');
    },
    registerBtnName() {
      return this.$options.filters.filterTranslation("Register", "register");
    },
    loginBtnName() {
      return this.$options.filters.filterTranslation("Login", "login");
    },
    popupTitle() {
      let popupTitle;
      switch (this.formType) {
        case "login-form":
          popupTitle = this.$options.filters.filterTranslation(
            "Login",
            "login"
          );
          break;
        case "reset-password-form":
          popupTitle = this.$options.filters.filterTranslation(
            "reset-password"
          );
          break;
        default:
          popupTitle = this.$options.filters.filterTranslation(
            "Register",
            "register"
          );
          break;
      }

      return popupTitle;
    },
    popupIcon() {
      let popupIcon;
      switch (this.formType) {
        case "login-form":
          popupIcon = "la la la-unlock";
          break;
        case "reset-password-form":
          popupIcon = "la la la-refresh";
          break;
        default:
          popupIcon = "la la la-user-plus";
          break;
      }

      return popupIcon;
    }
  },
  components: {
    LoginForm: () =>
      import(
        /*webpackChunkName: "LoginForm" */
        /*webpackPrefetch: true */
        "./LoginForm.vue"
      ),
    RegisterForm: () =>
      import(
        /*webpackChunkName: "RegisterForm" */
        /*webpackPrefetch: true */
        "./RegisterForm.vue"
      ),
    LostPasswordForm: () =>
      import(
        /*webpackChunkName: "LostPasswordForm" */
        /*webpackPrefetch: true */
        "./LostPasswordForm.vue"
      ),
    SocialsLogin: () =>
      import(
        /*webpackChunkName: "SocialsLogin" */
        /*webpackPrefetch: true */
        "./SocialsLogin.vue"
      )
  },
  methods: {
    handleChangeFormType(formType) {
      this.$emit("change-form-type", formType);
    },
    handleClosePopup() {
      this.$emit("close");
    }
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: "login-form"
    },
    allowRegister: {
      type: Boolean,
      default: true
    },
    registerFormFields: {
      type: [Array, Object],
      default: () => []
    },
    googleReCaptcha: {
      type: [Object, Array],
      default: () => {}
    },
    socialsLogin: {
      type: Array,
      default: () => {}
    }
  }
};
</script>
