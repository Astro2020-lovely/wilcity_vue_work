<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    :href="parseSharingUrl"
    target="_blank"
    @click="handleClick"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-twitter"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseSharingUrl"
    @click="handleClick"
    target="_blank"
    style="background-color: #00aced"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-twitter",
  props: {
    btnName: {
      type: String,
      default: "Twitter"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "twitter");
    }
  },
  computed: {
    parseSharingUrl() {
      let url = `//twitter.com/share?text=${this.title}&url=${this.href}`;
      if (this.hashtags.length) {
        url = `${url}&hashtags=${this.hashtags}`;
      }
      url = `${url}&source=webclient`;
      return url;
    }
  }
};
</script>
