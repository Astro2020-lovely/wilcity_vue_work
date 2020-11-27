<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    :href="parseHandleSharing"
    @click="handleClick"
    target="_blank"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-digg"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseHandleSharing"
    @click="handleClick"
    target="_blank"
    style="background-color: #005BE2"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  name: "wil-social-sharing-digg",
  mixins: [SocialSharingHelper],
  props: {
    btnName: {
      type: String,
      default: "Digg"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "digg");
    }
  },
  computed: {
    parseHandleSharing() {
      let url = `//digg.com/submit?url=${encodeURI(this.href)}`;
      if (this.title.length) {
        url = `${url}&title=${encodeURI(this.title)}`;
      }
      url = `${url}&source=webclient`;
      return url;
    }
  }
};
</script>
