<template>
  <component :is="tag" v-if="heading.length" class="wrapperClasses">
    <span v-html="heading"></span>
  </component>
</template>
<script>
export default {
  name: "wil-heading-mark",
  props: {
    wrapperClasses: {
      type: String,
      default: "heading_mask__pcO5T"
    },
    heading: {
      type: String,
      default: ""
    },
    tag: {
      type: String,
      default: "h3"
    }
  }
};
</script>
