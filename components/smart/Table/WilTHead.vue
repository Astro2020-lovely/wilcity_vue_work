<template>
  <th :class="wrapperClasses">
    <span>
      <i v-if="icon.length" :class="icon"></i>
      <span v-if="title.length" v-html="title"></span>
    </span>
  </th>
</template>

<script>
export default {
  name: "wil-t-head",
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: ""
    }
  }
};
</script>
