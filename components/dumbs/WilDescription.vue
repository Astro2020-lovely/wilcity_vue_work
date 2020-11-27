<template>
  <component :is="tag" :class="wrapperClasses" v-html="desc"></component>
</template>
<script>
export default {
  name: "wil-heading-title",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    wrapperClasses: {
      type: String,
      default: "heading_content__2mtYE"
    },
    desc: {
      type: String,
      default: ""
    }
  }
};
</script>
