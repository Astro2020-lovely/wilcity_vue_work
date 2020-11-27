<template>
  <div :id="tabId" :class="wrapperClasses">
    <slot v-if="selected === tabId" :settings="settings" :tab-id="tabId"></slot>
  </div>
</template>
<script>
export default {
  name: "wil-tab",
  props: {
    tabId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    settings: {
      type: Object,
      default: () => {},
      required: false
    },
    selected: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: [String, Array],
      required: false
    }
  }
};
</script>
