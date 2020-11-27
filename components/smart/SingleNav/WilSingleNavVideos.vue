<template>
  <div class="content-box_body__3tSRB">
    <wil-block-loading :is-loading="isLoading" />
    <wil-alert v-if="errMsg.length" :msg="errMsg" type="danger" />
    <wil-video-gallery :items="items" />
  </div>
</template>
<script>
export default {
  name: "wil-single-nav-videos",
  props: {
    isHome: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      required: false
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      errMsg: "",
      isLoading: false
    };
  }
};
</script>
