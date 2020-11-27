<template>
  <div v-if="hasItems" :class="wrapperClasses">
    <div :class="rowClasses" :data-col-xs-gap="xsGap" :data-col-sm-gap="smGap">
      <div
        v-for="(item, i) in parsePreviewItems"
        :key="`wil-gallery-item-${uquidId}-${i}`"
        :class="parseColumnClasses(i)"
      >
        <div class="gallery-item_module__1wn6T">
          <div class="imageCover_module__1VM4k">
            <div
              class="imageCover_img__3pxw7"
              :style="`background-image: url(${parsePreviewBg(i)})`"
            >
              <img
                :class="parseImgClasses(i)"
                :src="parsePreviewBg(i)"
                :key="i"
                @click="index = i"
                :alt="item.fileName"
              />
            </div>
            <div
              v-if="parseIsShowTotalItems(i)"
              class="gallery-item_more__1nWfn pos-a-full"
            >
              <div class="gallery-item_wrap__1olrT">
                <div class="gallery-item_number__vrRlG">{{ items.length }}</div>
                <h4 class="gallery-item_title__2yStU">
                  {{ "photos" | filterTranslation("photoText") }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vue-gallery-slideshow
        :images="parseItems"
        :index="index"
        @close="handleClosePopup"
      />
    </div>
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
  name: "wil-gallery",
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
      default: ""
    },
    rowClasses: {
      type: String,
      default: ""
    },
    columnClasses: {
      type: String,
      default: ""
    },
    imgClasses: {
      type: String,
      default: "cursor-pointer"
    },
    isShowTotal: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    maximumPreviewItems: {
      type: Number,
      default: 4
    },
    xsGap: {
      type: Number,
      default: 5
    },
    smGap: {
      type: Number,
      default: 10
    }
  },
  computed: {
    uquidId() {
      return new Date().getTime();
    },
    hasItems() {
      return this.items.length;
    },
    parsePreviewItems() {
      if (!this.hasItems) {
        return [];
      }
      const total = this.items.length;
      if (total <= this.maximumPreviewItems) {
        return this.items;
      }

      return this.items.slice(0, this.maximumPreviewItems);
    },
    parseItems() {
      if (!this.hasItems) {
        return [];
      }

      return this.items.map(item => (item.full ? item.full : item.src));
    }
  },
  methods: {
    parseColumnClasses(order) {
      if (this.numberOfItems !== 0 && this.numberOfItems !== null) {
        if (order >= this.numberOfItems) {
          return `${this.columnClasses} hidden`;
        }
      }
      return this.columnClasses;
    },
    parsePreviewBg(order) {
      return this.parsePreviewItems[order].preview
        ? this.parsePreviewItems[order].preview
        : this.parsePreviewItems[order].src;
    },
    parseImgClasses(order) {
      if (order >= this.numberOfItems) {
        return `${this.imgClasses} hidden`;
      }
      return this.imgClasses;
    },
    handleClosePopup() {
      this.index = null;
    },
    parseIsShowTotalItems(order) {
      if (!this.isShowTotal) {
        return false;
      }
      return order + 1 === this.maximumPreviewItems;
    }
  },
  mounted() {
  }
};
</script>
