<template>
  <component :is="tag" :class="wrapperClasses" v-html="heading"></component>
</template>
<script>
export default {
  name: "wil-heading-title",
  props: {
    tag: {
      type: String,
      default: "h2"
    },
    wrapperClasses: {
      type: String,
      default: "heading_title__1bzno"
    },
    heading: {
      type: String,
      default: ""
    }
  }
};
</script>
