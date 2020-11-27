<template>
  <div class="content-box_body__3tSRB">
    <div class="gallery_module__2AbLA">
      <div class="row" :data-col-xs-gap="xsGap" :data-col-sm-gap="smGap">
        <div v-show="aVideos.length" v-for="oItem in aVideos" :class="itemClass">
          <div class="gallery-item_module__1wn6T">
            <!-- video-popup_module__2P6ZG -->
            <div class="video-popup_module__2P6ZG video-popup_sm__11-9c">
              <div class="video-popup_media__dEwwq">
                <div class="video-popup_overlay__2lJoC"></div>
                <div
                  class="video-popup_img__3zV5d bg-cover"
                  :style="{ 'background-image': 'url(' + oItem.thumbnail + ')' }"
                ></div>
                <a class="video-popup_popup__17b-F js-video-popup" :href="parseVideo(oItem.src)">
                  <i class="la la-play"></i>
                </a>
              </div>
            </div>
            <!-- End / video-popup_module__2P6ZG -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      xsGap: 5,
      fullVideos: {},
      aFullVideos: [],
      aVideos: [],
      smGap: 10
    };
  },
  props: ["itemClass", "numberOfItems", "rawVideos", "aRealVideoGallery"],
  watch: {
    aRealVideoGallery: function(oNewVideoGallery) {
      this.aVideos = this.aVideos.concat(oNewVideoGallery);
      this.aFullVideos = this.aVideos;
      this.destroyMagnific();
      this.magnific();
    }
  },
  methods: {
    parseVideo(src) {
      if (src.indexOf("facebook.com") !== -1) {
        let aParse = src.split("/");
        let count = aParse.length;
        let getID = aParse[count - 1].length
          ? aParse[count - 1]
          : aParse[count - 2];

        return (
          "https://www.facebook.com/v2.5/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvideo.php%3Fv%3D" +
          getID
        );
      } else {
        return src;
      }
    },
    setup() {
      if (!this.itemClass) {
        this.itemClass = "col-xs-12 col-sm-4";
      }

      if (!this.numberOfItems) {
        this.numberOfItems = 0;
      }

      let numberOfItems = this.numberOfItems;

      try {
        if (this.aRealVideoGallery.length) {
          this.fullVideos = this.aRealVideoGallery;
        } else if (this.rawVideos.length) {
          this.fullVideos = JSON.parse(this.rawVideos);
        }
        if (this.fullVideos.length) {
          if (this.fullVideos.length < this.numberOfItems) {
            numberOfItems = this.fullVideos.length;
          }

          for (let order in this.fullVideos) {
            if (order < numberOfItems) {
              this.aVideos.push(this.fullVideos[order]);
            }

            this.aFullVideos.push(this.fullVideos[order]);
          }
        }
      } catch (err) {}
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
    },
    destroyMagnific() {
      jQuery(this.$el).removeData("magnificPopup");
    }
  },
  beforeMount() {
    this.setup();
  },
  mounted() {
    this.magnific();
  }
};
</script>
