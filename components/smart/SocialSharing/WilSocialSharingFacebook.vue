<template>
  <a
    v-if="type === 'list'"
    :class="wrapperClasses"
    href="#"
    target="_blank"
    @click.prevent="handleSharing"
  >
    <span class="list_icon__2YpTp">
      <i class="fa fa-facebook"></i>
    </span>
    <span class="list_text__35R07" v-text="btnName"></span>
  </a>
  <a
    v-else
    :class="wrapperClasses"
    href="#"
    @click.prevent="handleSharing"
    style="background-color: #3B5998"
    >{{ btnName }}</a
  >
</template>
<script>
import SocialSharingHelper from "./../../../mixins/SocialSharingHelper";

export default {
  mixins: [SocialSharingHelper],
  name: "wil-social-sharing-facebook",
  props: {
    btnName: {
      type: String,
      default: "Facebook"
    }
  },
  methods: {
    handleSharing() {
      if (typeof FB === "object") {
        FB.ui({
          method: "share",
          title: this.titleOg,
          href: this.href,
          picture: this.picture,
          quote: this.quote
        });
      } else {
        window.open(
          `//facebook.com/sharer.php?u=${encodeURI(this.href)}&t=${encodeURI(
            this.title
          )}&&summary=dadad&thumbnail=${encodeURI(this.picture)}`,
          "_blank"
        );
      }
      this.$emit("click", "facebook");
    }
  }
};
</script>
