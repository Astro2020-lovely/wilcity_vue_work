<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    :href="parseSharingUrl"
    target="_blank"
    @click="handleClick"
    data-action="share/whatsapp/share"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-whatsapp"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    :href="parseSharingUrl"
    data-action="share/whatsapp/share"
    target="_blank"
    @click="handleClick"
    style="background-color: #25D366"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-whatsapp",
  props: {
    btnName: {
      type: String,
      default: "Whatsapp"
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", "vk");
    }
  },
  computed: {
    parseSharingUrl() {
      return `//wa.me?text=${encodeURI(
        this.code.length ? this.code : this.href
      )}`;
    }
  }
};
</script>
