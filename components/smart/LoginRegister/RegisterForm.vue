<template>
  <div>
    <wil-alert
      v-if="msg.length"
      style="margin-bottom: 20px;"
      :msg="msg"
      :type="msgType"
    />

    <div
      v-for="field in formFields"
      :key="`register-form-field-${uquid}-${field.name}`"
    >
      <component
        :is="field.type"
        :label="getFieldLabel(field)"
        :is-required="field.isRequired === 'yes'"
        :options="field.options"
        :value="data[field.name]"
        :input-type="field.inputType ? field.inputType : 'text'"
        v-on="{ change: handleFieldChange(field.name) }"
      ></component>
    </div>

    <div
      v-if="enableGoogleReCaptcha"
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
      :wrapper-classes="submitBtnClasses"
      :btn-name="submitBtnName"
    />
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";

export default {
  name: "register-form",
  data() {
    return {
      isLoading: false,
      recaptchaToken: "",
      isDisable: false,
      verifiedReCaptcha: false,
      data: {},
      msg: "",
      msgType: ""
    };
  },
  props: {
    formFields: {
      type: [Object, Array],
      required: true
    },
    googleReCaptcha: {
      type: [Object, Array],
      default: () => {}
    }
  },
  components: {
    VueRecaptcha
  },
  computed: {
    uquid() {
      return new Date().getTime();
    },
    submitBtnName() {
      return this.$options.filters.filterTranslation("Register", "register");
    },
    submitBtnClasses() {
      let classes =
        "wil-btn wil-btn--primary wil-btn--block wil-btn--md wil-btn--round";
      return this.isLoading ? `${classes} wil-btn--loading` : classes;
    },
    enableGoogleReCaptcha() {
      return this.googleReCaptcha && this.googleReCaptcha.siteKey;
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
    getFieldLabel(field) {
      let label = "";
      if (field.translation) {
        label = this.$options.filters.filterTranslation(
          field.label,
          field.translation
        );
      }

      if (!label.length) {
        return field.label;
      }

      return label;
    },
    onVerify(recaptchaToken) {
      this.verifiedReCaptcha = true;
      this.recaptchaToken = recaptchaToken;
    },
    onExpired() {
      this.verifiedReCaptcha = false;
    },
    switchMode() {
      this.$emit("switch-mode", "login");
    },
    handleSubmitForm(event) {
      event.preventDefault();

      this.isDisable = true;
      this.isLoading = true;

      let formData = new FormData();
      for (let key in this.data) {
        formData.append(key, this.data[key]);
      }
      this.msg = "";
      formData.append("g-recaptcha-response", this.recaptchaToken);
      formData.append("security", WILOKE_INLINE_GLOBAL.security);
      formData.append("action", "wilcity_register");

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData,
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(response => {
          if (response.data.success) {
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
                window.location.reload();
              }
            }, redirectTimeout);
          } else {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          }
        })
        .finally(() => {
          this.isDisable = false;
          this.isLoading = false;
        });
    },
    onKeyUp({ type, target }) {
      let name = target.name;
      this[name] = target.value;
    }
  }
};
</script>
