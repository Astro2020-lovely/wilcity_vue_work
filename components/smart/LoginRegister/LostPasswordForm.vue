<template>
  <div id="wilcity-lost-password-form">
    <wil-alert v-if="msg.length" style="margin-bottom: 20px" :msg="msg" :type="msgType" />
    <wil-input
      :label="'Username or Email'|filterTranslation('usernameOrEmail')"
      :is-required="true"
      :value="username"
      @change="handleFieldChange"
    />
    <wil-link
      @click="handleSubmitForm"
      :is-loading="isLoading"
      :wrapper-classes="btnClasses"
      :btn-name="submitBtnName"
    />
  </div>
</template>

<script>
export default {
  name: "lost-password-form",
  data() {
    return {
      isDisable: false,
      isLoading: false,
      username: "",
      msg: "",
      msgType: ""
    };
  },
  computed: {
    submitBtnName() {
      return this.$options.filters.filterTranslation(
        "Reset Password",
        "resetPassword"
      );
    },
    btnClasses() {
      let classes =
        "wil-btn wil-btn--primary wil-btn--block wil-btn--md wil-btn--round";
      if (!this.username.length) {
        classes = `${classes} disable`;
      }
      return classes;
    }
  },
  methods: {
    handleFieldChange(username) {
      this.username = username;
    },
    handleSubmitForm() {
      this.isDisable = true;
      this.isLoading = true;
      this.msg = "";

      let formData = new FormData();
      formData.append("username", this.username);
      formData.append("action", "wilcity_reset_password");
      formData.append("security", WILOKE_INLINE_GLOBAL.security);

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData,
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(response => {
          this.msg = response.data.data.msg;
          if (response.data.success) {
            this.msgType = "success";
          } else {
            this.msgType = "danger";
          }
        })
        .finally(() => {
          this.isDisable = false;
          this.isLoading = false;
        });
    }
  }
};
</script>
