<template>
  <div v-if="isLoading==='yes' || isLoading===true" class="line-loading_module__SUlA1 pos-a-top">
    <div class="line-loading_loader__FjIcM"></div>
  </div>
</template>
<script>
export default {
  name: "wil-line-loading",
  props: {
    isLoading: {
      type: [String, Boolean],
      default: false
    }
  }
};
</script>
