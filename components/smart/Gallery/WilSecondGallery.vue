<template>
  <div v-if="hasItems" :class="wrapperClasses">
    <img
      class="display-block cursor-pointer"
      :key="`wil-thumbnail-${parsePreviewItem.id}`"
      :src="parsePreviewItem.preview"
      @click="index = 0"
    />
    <vue-gallery-slideshow :images="parseItems" :index="index" @close="handleClosePopup" />
  </div>
</template>
<style scoped>
.display-block {
  display: block !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
<script lang="javascript">
export default {
  name: "wil-second-gallery",
  data() {
    return {
      index: null
    };
  },
  components: {
    VueGallerySlideshow: () =>
      import(
        /*webpackChunkName: "VueGallerySlideshow" */
        /*webpackPreload: true */
        "vue-gallery-slideshow"
      )
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "utility-box-1_avatar__DB9c_ rounded-circle"
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    uquidId() {
      return new Date().getTime();
    },
    hasItems() {
      return this.items.length;
    },
    parsePreviewItem() {
      if (!this.hasItems) {
        return [];
      }
      return this.items[0];
    },
    parseItems() {
      if (!this.hasItems) {
        return [];
      }

      return this.items.map(item => (item.full ? item.full : item.src));
    }
  },
  methods: {
    handleClosePopup() {
      this.index = null;
    }
  }
};
</script>
