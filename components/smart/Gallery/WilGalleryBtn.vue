<template>
  <wil-link
    :wrapper-classes="wrapperClasses"
    :btn-name="btnName"
    :icon="icon"
    :has-wrapper-for-icon="hasWrapperForIcon"
    @click="handleViewGallery"
  >
    <template v-slot:after-link>
      <portal to="wil-modal">
        <vue-gallery-slideshow
          :images="parseItems"
          :index="index"
          @close="handleClosePopup"
        />
      </portal>
    </template>
  </wil-link>
</template>

<script>
export default {
  name: "wil-gallery-btn",
  components: {
    VueGallerySlideshow: () =>
      import(
        /*webpackChunkName: "VueGallerySlideshow" */
        /*webpackPreload: true */
        "vue-gallery-slideshow"
      )
  },
  data() {
    return {
      index: null
    };
  },
  methods: {
    handleClosePopup() {
      this.index = null;
    },
    handleViewGallery() {
      this.index = 0;
    }
  },
  computed: {
    parseItems() {
      const items = this.parseData(this.items);
      if (!items.length) {
        return [];
      }

      return items.map(item => (item.full ? item.full : item.src));
    }
  },
  props: {
    items: {
      // EG: You want to edit a review, We should show up the current review data
      type: [Array, String],
      default: () => []
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    btnName: {
      type: String,
      default: ""
    },
    hasWrapperForIcon: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  }
};
</script>
