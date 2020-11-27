<template>
  <div id="wilcity-login-form">
    <wil-alert
      v-if="msg.length"
      style="margin-bottom: 20px;"
      :msg="msg"
      :type="msgType"
    />

    <div style="margin-bottom: 20px;">
      <wil-input
        :wrapper-classes="usernameClasses"
        :label="'Username or Email' | filterTranslation('usernameOrEmail')"
        :is-required="true"
        :value="data.username"
        v-on="{ change: handleFieldChange('username') }"
      />

      <wil-input
        :wrapper-classes="passwordClasses"
        :label="'Password' | filterTranslation('password')"
        v-on="{ change: handleFieldChange('password') }"
        input-type="password"
        :value="data.password"
        :is-required="true"
      />
    </div>

    <div class="o-hidden ws-nowrap">
      <!-- checkbox_module__1K5IS -->
      <wil-checkbox
        wrapper-classes="checkbox_module__1K5IS mb-15 d-inline-block"
        :label="'Remember me?' | filterTranslation('rememberMe')"
        v-on="{ change: handleFieldChange('isRemember') }"
      />

      <!-- End / checkbox_module__1K5IS -->
      <wil-link
        wrapper-classes="wil-float-right td-underline"
        @click="lostPassword"
        :btn-name="'Lost password' | filterTranslation('lostPassword')"
      />
    </div>

    <div
      v-if="isEnableReCaptcha"
      class="wilcity-google-recaptcha-wrapper mt-20 mb-20"
    >
      <hr />
      <vue-recaptcha
        @verify="onVerify"
        @expired="onExpired"
        :sitekey="googleReCaptcha.siteKey"
      ></vue-recaptcha>
    </div>

    <wil-link
      @click="handleSubmitForm"
      :is-loading="isLoading"
      :wrapper-classes="btnClasses"
      :btn-name="submitBtnName"
    />
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";

export default {
  name: "login-form",
  data() {
    return {
      data: {},
      isDisable: false,
      recaptchaToken: "",
      data: {
        username: "",
        password: ""
      },
      verifiedReCaptcha: false,
      isLoading: false,
      msg: "",
      msgType: ""
    };
  },
  props: {
    googleReCaptcha: {
      type: [Object, Array],
      default: () => {}
    }
  },
  mounted() {
    //console.log(this.oGoogleReCaptcha)
  },
  components: {
    VueRecaptcha
  },
  computed: {
    isEnableReCaptcha() {
      return (
        this.googleReCaptcha &&
        this.googleReCaptcha.on == "both" &&
        this.googleReCaptcha.siteKey
      );
    },
    submitBtnName() {
      return this.$options.filters.filterTranslation("Login", "login");
    },
    btnClasses() {
      let classes =
        "wil-btn wil-btn--primary wil-btn--block wil-btn--md wil-btn--round";
      if (
        !this.data.username.length ||
        !this.data.password.length ||
        (this.isEnableReCaptcha && !this.verifiedReCaptcha)
      ) {
        classes = `${classes} disable`;
      }
      return classes;
    },
    usernameClasses() {
      let classes = "field_module__1H6kT field_style2__2Znhe mb-15";
      if (this.data.username.length) {
        classes = `${classes} active`;
      }
      return classes;
    },
    passwordClasses() {
      let classes = "field_module__1H6kT field_style2__2Znhe mb-15";
      if (this.data.password.length) {
        classes = `${classes} active`;
      }
      return classes;
    }
  },
  methods: {
    handleFieldChange(key) {
      return val => {
        this.data = {
          ...this.data,
          [key]: val
        };
      };
    },
    onVerify(recaptchaToken) {
      this.verifiedReCaptcha = true;
      this.recaptchaToken = recaptchaToken;
    },
    onExpired() {
      this.verifiedReCaptcha = false;
    },
    lostPassword() {
      this.$emit("switch-form-type", "lost-password-form");
    },
    handleSubmitForm(event) {
      event.preventDefault();
      this.isDisable = true;
      this.isLoading = true;

      let formData = new FormData();
      formData.append("username", this.data.username);
      formData.append("password", this.data.password);
      formData.append("isRemember", this.data.isRemember);
      formData.append("action", "wilcity_login");
      formData.append("g-recaptcha-response", this.recaptchaToken);
      formData.append("security", WILOKE_INLINE_GLOBAL.security);

      this.msg = "";
      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData,
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(response => {
          if (!response.data.success) {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          } else {
            let redirectTimeout = 0;
            if (response.data.data.msg) {
              this.msg = response.data.data.msg;
              this.msgType = "success";
              redirectTimeout = 2000;
            }

            setTimeout(() => {
              if (
                response.data.data.redirectTo &&
                response.data.data.redirectTo !== "self"
              ) {
                window.location.href = decodeURIComponent(
                  response.data.data.redirectTo
                );
              } else {
                window.location.reload(false);
              }
            }, redirectTimeout);
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isDisable = true;
        });
    },
    onKeyUp({ type, target }) {
      let name = target.name;
      this[name] = target.value;
    }
  }
};
</script>
