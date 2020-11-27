<template>
  <div :class="wrapperClasses">
    <div v-if="hasItems">
      <div
        :class="rowClasses"
        :data-col-xs-gap="xsGap"
        :data-col-sm-gap="smGap"
      >
        <div
          v-for="(item, i) in parseVideos"
          :key="`wil-video-item-${uquidId}-${i}`"
          :class="columnClasses"
        >
          <div class="gallery-item_module__1wn6T">
            <div class="video-popup_module__2P6ZG video-popup_sm__11-9c">
              <div class="video-popup_media__dEwwq">
                <div class="video-popup_overlay__2lJoC"></div>
                <div
                  class="video-popup_img__3zV5d bg-cover"
                  :style="`background-image: url(${item.thumbnail})`"
                ></div>
                <a
                  class="video-popup_popup__17b-F js-video-popup"
                  :href="parseVideo(item.src)"
                >
                  <i class="la la-play"></i>
                </a>
              </div>
            </div>
            <!-- End / video-popup_module__2P6ZG -->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p v-text="noVideoText"></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-video-gallery",
  props: {
    wrapperClasses: {
      type: String,
      default: "gallery_module__2AbLA"
    },
    rowClasses: {
      type: String,
      default: "row"
    },
    maximumPreviewItems: {
      type: Number,
      default: 100
    },
    columnClasses: {
      type: String,
      default: "col-xs-12 col-sm-4"
    },
    imgClasses: {
      type: String,
      default: "cursor-pointer"
    },
    items: {
      type: Array,
      default: () => []
    },
    xsGap: {
      type: Number,
      default: 5
    },
    smGap: {
      type: Number,
      default: 10
    },
    isOnHome: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    noVideoText() {
      return this.$options.filters.filterTranslation(
        "Oops! There is no video yet",
        "noVideo"
      );
    },
    uquidId() {
      return new Date().getTime();
    },
    hasItems() {
      return this.items && this.items.length;
    },
    parseVideos() {
      if (this.items.length > this.maximumPreviewItems) {
        return this.items.slice(0, this.maximumPreviewItems);
      }

      return this.items;
    }
  },
  methods: {
    parseVideo(src) {
      try {
        let parsedSrc;
        if (src.indexOf("facebook.com") !== -1) {
          parsedSrc = src.split("/");
          const count = parsedSrc.length;
          const getID = parsedSrc[count - 1].length
            ? parsedSrc[count - 1]
            : parsedSrc[count - 2];

          return (
            "https://www.facebook.com/v2.5/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D" +
            getID
          );
        } else {
          parsedSrc = src.split("?v=");
          if (parsedSrc[1]) {
            const parseQueryString = parsedSrc[1].split("&");
            return `${parsedSrc[0]}?v=${parseQueryString[0]}`;
          }

          return src;
        }
      } catch (e) {
        console.log(e);
      }
    },
    magnific() {
      jQuery(this.$el).magnificPopup({
        fixedContentPos: true,
        delegate: "a", // the selector for gallery item
        gallery: {
          enabled: true
        },
        type: "iframe" // this is default type
      });
    }
  },
  mounted() {
    if (this.isOnHome) {
      jQuery(document).ready(() => this.magnific());
    } else {
      this.magnific();
    }
  }
};
</script>
