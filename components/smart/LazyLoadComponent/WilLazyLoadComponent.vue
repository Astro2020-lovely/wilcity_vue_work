<template>
  <div v-watching-component="parseWatchingComponentData" :style="{'min-height': height}">
    <slot :is-in-view="listViewed[id]"></slot>
  </div>
</template>
<script>
export default {
  name: "wil-lazy-load-component",
  data() {
    return {
      listViewed: {}
    };
  },
  props: {
    height: {
      type: String,
      default: "100px"
    },
    id: {
      type: String,
      default: ""
    },
    intersectionArgs: {
      type: Object,
      default: () => {}
    },
    isWaitForDomReady: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    parseWatchingComponentData() {
      return {
        setTo: "setInView",
        key: this.id,
        intersectionArgs: this.intersectionArgs
      };
    }
  },
  methods: {
    setInView(key) {
      this.listViewed = {
        ...this.listViewed,
        [key]: true
      };
    }
  }
};
</script>
