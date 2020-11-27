<template>
  <div v-show="isLoading=='yes'" :class="wrapperClass">
    <slot name="blockloading">
      <div :class="innerClass">
        <div class="pill-loading_loader__3LOnT"></div>
      </div>
    </slot>
  </div>
</template>
<script lang="javascript">
  export default {
    computed: {
      innerClass() {
        return 'pill-loading_module__3LZ6v ' + this.position;
      }
    },
    props: {
      position: {
        type: String,
        default: 'pos-a-center'
      },
      isLoading: {
        type: String,
        default: 'no'
      },
      wrapperClass: {
        type: String,
        default: 'full-load'
      }
    }
  }
</script>
