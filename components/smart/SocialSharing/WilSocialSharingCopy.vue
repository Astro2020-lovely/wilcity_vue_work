<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    :href="href"
    @click.prevent="handleCopyLink"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-share"></i>
    </span>
    <span class="list_text__35R07" v-text="copyText"></span>
    <input id="wil-share-post-link" type="hidden" :value="href" />
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="href"
    target="_blank"
    style="background-color: #00aced"
    @click.prevent="handleCopyLink"
    >{{ copyText }}
    <input id="wil-share-post-link" type="hidden" :value="href" />
  </a>
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-copy",
  data() {
    return {
      isCopied: false
    };
  },
  props: {
    btnName: {
      type: String,
      default: "Copy"
    }
  },
  computed: {
    copyText() {
      return this.isCopied
        ? this.$options.filters.filterTranslation("Copied")
        : this.$options.filters.filterTranslation("Copy");
    }
  },
  methods: {
    handleCopyLink() {
      const copyCode = document.getElementById("wil-share-post-link");
      copyCode.setAttribute("type", "text");
      copyCode.select();
      document.execCommand("copy");
      this.isCopied = true;
      copyCode.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();

      this.$emit("click", "copy");
    }
  }
};
</script>
