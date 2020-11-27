<template>
  <div :id="id" class="single-tab-content">
    <div class="content-box_module__333d9 pos-r">
      <wil-single-nav-heading :settings="settings" />
      <slot :settings="settings"></slot>
    </div>
  </div>
</template>
<script>
import WilSingleNavHeading from "./WilSingleNavHeading.vue";
export default {
  name: "wil-single-nav-wrapper",
  components: {
    WilSingleNavHeading
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    settings: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
