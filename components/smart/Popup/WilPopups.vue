<template>
  <component
    v-if="popup.length"
    :is="popup"
    :post-id="postId"
    @close="handleClosePopup"
  ></component>
</template>
<script>
export default {
  name: "wil-popups",
  props: {
    popup: {
      type: String,
      default: ""
    },
    settings: {
      type: Object,
      default: {}
    },
    postId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClosePopup() {
      this.$emit("close");
    }
  },
  components: {
    WilReportPopup: () =>
      import(
        /*webpackPrefetch: true */
        /*webpackChunckName:  "WilReportPopup"*/
        "./../Report/WilReportPopup.vue"
      ),
    WilMessagePopup: () =>
      import(
        /*webpackPretch: true */
        /*webpackChunckName:  "WilMessagePopup"*/
        "./../Message/WilMessagePopup.vue"
      ),
    WilAddPhotosVideosPopup: () =>
      import(
        /*webpackPretch: true */
        /*webpackChunckName:  "WilAddPhotosVideosPopup"*/
        "./../PhotosVideosPopup/WilAddPhotosVideosPopup.vue"
      )
  }
};
</script>
