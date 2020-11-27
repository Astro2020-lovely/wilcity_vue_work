<template>
  <div
    v-if="post.featuredImage"
    :class="wrapperClasses"
    :style="{'background-image':'url('+post.featuredImage+')'}"
  >
    <img :src="post.featuredImage" :alt="post.title" />
  </div>
</template>
<script>
export default {
  name: "wil-grid-featured-image",
  props: {
    post: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: "listing_img__3pwlB pos-a-full bg-cover"
    }
  }
};
</script>
