<template>
  <div :class="wrapperClasses" v-if="items.length">
    <swiper :options="parseSwiperOptions" ref="mySwiper" @someSwiperEvent="handleCallBack">
      <div v-if="isNav" class="swiper-button-prev" slot="button-prev"></div>
      <div v-if="isNav" class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-scrollbar" v-if="isScrollbar" slot="scrollbar"></div>
      <swiper-slide
        v-for="(item, index) in items"
        :class="slideClasses"
        :key="`swiper-item-item-${uquidId}-${index}`"
      >
        <wil-box-icon-item5 :item="item"></wil-box-icon-item5>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import WilBoxIconItem5 from "./../../dumbs/box-icon/WilBoxIconItem5.vue";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "wil-slider",
  components: {
    WilBoxIconItem5,
    swiper,
    swiperSlide
  },
  computed: {
    uquidId() {
      return new Date().getTime();
    },
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    parseItemPerRow() {
      const windowWidth = window.outerWidth;
      if (windowWidth > 1200) {
        return this.itemsPerRow.lg;
      }

      if (windowWidth > 960) {
        return this.itemsPerRow.md;
      }

      if (windowWidth > 720) {
        return this.itemsPerRow.sm;
      }

      return this.itemsPerRow.xs;
    },
    parseSwiperOptions() {
      let options = this.swiperOption;
      if (this.isNav) {
        options = {
          ...options,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          }
        };
      }
      if (this.isPagination) {
        options = {
          ...options,
          pagination: {
            el: ".swiper-pagination",
            clickable: true
          }
        };
      }

      options = {
        ...options,
        slidesPerView: this.parseItemPerRow
      };

      return options;
    }
  },
  methods: {
    handleCallBack() {}
  },
  props: {
    itemsPerRow: {
      type: Object,
      default: () => {
        return {
          lg: 4,
          md: 4,
          sm: 2,
          xs: 1
        };
      }
    },
    swiperOption: {
      type: Object,
      default: () => {
        return {
          slidesPerView: 4
        };
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    wrapperClasses: {
      type: String,
      default: "pos-r"
    },
    slideClasses: {
      type: String,
      default: "col-xs-12 col-sm-12 col-md-3 col-lg-3 "
    },
    sliderClasses: {
      type: String,
      default: "row"
    },
    isNav: {
      type: Boolean,
      default: true
    },
    isScrollbar: {
      type: Boolean,
      default: false
    }
  }
};
</script>
