<template>
  <div v-show="isLoading=='yes' || isLoading" :class="wrapperClasses" :style="{height: minHeight}">
    <slot name="blockloading">
      <div :class="innerClasses">
        <div class="pill-loading_loader__3LOnT"></div>
      </div>
    </slot>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-block-loading",
  computed: {
    innerClasses() {
      return `pill-loading_module__3LZ6v ${this.position}`;
    }
  },
  props: {
    position: {
      type: String,
      default: "pos-a-center"
    },
    isLoading: {
      type: [String, Boolean],
      default: false
    },
    wrapperClasses: {
      type: String,
      default: "full-load"
    },
    minHeight: {
      type: String,
      default: "auto"
    }
  }
};
</script>
