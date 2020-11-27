<template>
  <div class="mb-20">
    <slot name="sub-fields" :settings="settings" :is-loading="isLoading" :sub-fields="subFields"></slot>
  </div>
</template>
<script>
export default {
  name: "wil-sub-search-fields",
  computed: {
    subFields() {
      return [...this.settings.options];
    }
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    dropdownStatus: {
      type: Boolean,
      default: false
    }
  }
};
</script>
