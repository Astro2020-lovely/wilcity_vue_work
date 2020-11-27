<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    :href="parseHref"
    @click="handleClick"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-envelope"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseHref"
    @click="handleClick"
    style="background-color: #410093"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-email",
  props: {
    btnName: {
      type: String,
      default: "Email"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "email");
    }
  },
  computed: {
    body() {
      if (this.settings.body) {
        return this.settings.body;
      }

      return "";
    },
    parseHref() {
      let email = `mailto:?Subject=${this.title.replace(" ", "%20")}`;
      if (this.body.length) {
        email = `${email}&Body=${this.body}`;
      } else {
        email = `${email}&Body=${this.href}`;
      }

      return email;
    }
  }
};
</script>
