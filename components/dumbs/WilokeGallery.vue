<template v-cloak>
  <div :class="cssClass">
    <div class="row" :data-col-xs-gap="xsGap" data-col-sm-gap="10">
      <div v-for="(oItem, i) in aGallery" :key="i" :class="wrapperImgClass(i)">
        <div class="gallery-item_module__1wn6T">
          <div class="imageCover_module__1VM4k">
            <div class="imageCover_img__3pxw7" :style="{backgroundImage: 'url('+oItem[size]+')'}">
              <img :class="thumbnailClass(i)" :src="oItem[size]" :key="i" @click="index = i" />
            </div>
            <div v-if="isPrintNumberOfPhotos(i)" class="gallery-item_more__1nWfn pos-a-full">
              <div class="gallery-item_wrap__1olrT">
                <div class="gallery-item_number__vrRlG">{{aGallery.length}}</div>
                <h4 class="gallery-item_title__2yStU">{{photoText}}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vue-gallery-slideshow :images="aImages" :index="index" @close="onClosedEvent" />
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
import VueGallerySlideshow from "vue-gallery-slideshow";

export default {
  data() {
    return {
      xsGap: 5,
      isLoading: false,
      maxPhotos: 0,
      index: null,
      photoText: WILCITY_I18.photos
    };
  },
  components: {
    VueGallerySlideshow
  },
  props: {
    size: {
      type: String,
      default: "thumbnail"
    },
    itemClass: {
      type: String,
      default: ""
    },
    numberOfItems: {
      type: Number,
      default: 4
    },
    isShowOnHome: {
      type: String,
      default: "no"
    },
    rawGallery: {
      type: String,
      default: "no"
    },
    images: {
      type: Array,
      default: () => [],
      required: false
    }
  },
  computed: {
    cssClass() {
      return "gallery_module__2AbLA " + this.additionalClass;
    },
    aGallery() {
      try {
        return JSON.parse(this.rawGallery);
      } catch (msg) {
        return [];
      }
    },
    aImages() {
      if (this.aGallery.length) {
        return this.aGallery.map(oImg => {
          return oImg.full;
        });
      }

      return [];
    }
  },
  methods: {
    wrapperImgClass(order) {
      if (this.numberOfItems !== 0 && this.numberOfItems !== null) {
        if (order >= this.numberOfItems) {
          return this.itemClass + " hidden";
        }
      }
      return this.itemClass;
    },
    onClosedEvent() {
      this.index = null;
    },
    thumbnailClass(order) {
      let imgClass = "cursor-pointer";
      if (order >= this.numberOfItems) {
        imgClass += " hidden";
      }
      return imgClass;
    },
    isPrintNumberOfPhotos(order) {
      if (this.isShowOnHome === "no") {
        return false;
      }

      return (
        order + 1 === this.numberOfItems && this.numberOfItems <= order + 1
      );
    }
  }
};
</script>
