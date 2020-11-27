<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    target="_blank"
    :href="parseSandleSharing"
    @click="handleClick"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-vk"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    target="_blank"
    @click="handleClick"
    :href="parseSandleSharing"
    style="background-color: #4c75a3"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-vk",
  props: {
    btnName: {
      type: String,
      default: "Vk"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "vk");
    }
  },
  computed: {
    parseSandleSharing() {
      let url = `//vk.com/share.php?url=${encodeURI(this.href)}`;
      if (this.title.length) {
        url = `${url}&description=${encodeURI(this.title)}`;
      }
      url = `${url}&source=webclient`;
    }
  }
};
</script>
