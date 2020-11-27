<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    :href="parseHandleSharing"
    @click="handleClick"
    target="_blank"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-reddit"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseHandleSharing"
    target="_blank"
    @click="handleClick"
    style="background-color: #0077b5"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-linked-in",
  props: {
    btnName: {
      type: String,
      default: "LinkedIn"
    }
  },
  computed: {
    parseHandleSharing() {
      let url = `//www.linkedin.com/shareArticle?url=${encodeURI(this.href)}`;
      if (this.title.length) {
        url = `${url}&title=${encodeURI(this.title)}`;
      }
      url = `${url}&source=webclient`;
      return url;
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "linkedin");
    }
  }
};
</script>
