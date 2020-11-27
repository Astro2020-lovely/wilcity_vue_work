<template>
  <a :class="wrapperClass" href="#" @click.prevent="switchPostType">
    <i :class="iconClass"></i>
    {{ tabName }}
  </a>
</template>
<script>
export default {
  data() {
    return {
      wrapperClass: this.isDefaultActive == "yes" ? "active" : "wait-for-click"
    };
  },
  props: ["isDefaultActive", "postType", "iconClass", "tabName"],
  methods: {
    switchPostType() {
      this.$emit("on-switch-post-type", this.postType);
    }
  }
};
</script>
