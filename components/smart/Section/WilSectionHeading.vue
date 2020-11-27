<template>
  <div :class="parseWrapperClasses">
    <slot name="before-heading"></slot>
    <wil-heading-mark
      v-if="parseSettings.heading"
      :heading="parseSettings.mark"
      :style="parseMarkStyle"
    ></wil-heading-mark>
    <wil-heading-title
      v-if="parseSettings.heading"
      :heading="parseSettings.heading"
      :style="parseHeadingStyle"
    ></wil-heading-title>
    <wil-description v-if="parseSettings.desc" :desc="parseSettings.desc" :style="parseDescColor"></wil-description>
    <slot name="after-heading"></slot>
  </div>
</template>
<script>
import WilHeadingTitle from "./../../dumbs/WilHeadingTitle.vue";
import WilDescription from "./../../dumbs/WilDescription.vue";
import WilHeadingMark from "./../../dumbs/WilHeadingMark.vue";
export default {
  name: "wil-section-heading",
  data() {
    return {
      parseSettings: {}
    };
  },
  props: {
    settings: {
      type: [Object, String],
      default: () => {}
    }
  },
  created() {
    this.parseSettings = this.parseData(this.settings);
  },
  computed: {
    parseWrapperClasses() {
      if (this.parseSettings.wrapper_classes) {
        return this.parseSettings.wrapper_classes;
      }

      if (this.parseSettings.wrapperClasses) {
        return this.parseSettings.wrapperClasses;
      }

      return "heading_module__156eJ wil-text-center";
    },
    parseMarkStyle() {
      if (this.parseSettings.mark_color) {
        return {
          color: this.parseSettings.mark_color
        };
      }
      if (this.parseSettings.markColor) {
        return this.parseSettings.markColor;
      }
      return "";
    },
    parseHeadingStyle() {
      if (this.parseSettings.heading_color) {
        return {
          color: this.parseSettings.heading_color
        };
      }
      if (this.parseSettings.headingColor) {
        return {
          color: this.parseSettings.headingColor
        };
      }
      return "";
    },
    parseDescColor() {
      if (this.parseSettings.descColor) {
        return {
          color: this.parseSettings.descColor
        };
      }

      if (this.parseSettings.desc_color) {
        return {
          color: this.parseSettings.desc_color
        };
      }

      return "";
    }
  },
  components: {
    WilHeadingTitle,
    WilDescription,
    WilHeadingMark
  }
};
</script>
