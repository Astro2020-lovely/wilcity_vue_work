<template>
  <article
    :class="[
      wrapperClasses,
      parseGridStyle,
      'wil-shadow wil-flex-column-between'
    ]"
  >
    <slot name="beforemaincontent"></slot>
    <div :class="innerClasses">
      <wil-grid-coupon :post="parsedPost"></wil-grid-coupon>
      <slot name="header"></slot>
      <slot name="header" :post="parsedPost" :items="parsedPost.headerCard">
        <wil-grid-header
          :post="parsedPost"
          :items="parsedPost.headerCard"
          v-on="{ change: handleChange('headerCard') }"
        />
      </slot>

      <slot name="general" :post="parsedPost" :settings="settings">
        <wil-grid-general :post="parsedPost" :settings="settings" />
      </slot>

      <slot
        name="body"
        :post="parsedPost"
        :mygeocoder="mygeocoder"
        :settings="settings"
      >
        <wil-grid-body
          :type="type"
          :post="parsedPost"
          :items="parsedPost.bodyCard"
          :mygeocoder="mygeocoder"
          :settings="settings"
          @rendered="notify"
        />
      </slot>
      <slot name="afterbody"></slot>
    </div>
    <slot name="aftermaincontent"></slot>
    <slot name="footer">
      <wil-grid-footer
        :post="parsedPost"
        :items="parsedPost.footerCard"
        v-on="{ change: handleChange('footerCard') }"
      />
    </slot>
  </article>
</template>
<script lang="javascript">
import WilGridHeader from "./../../dumbs/grid/WilGridHeader.vue";
import WilGridGeneral from "./../../dumbs/grid/WilGridGeneral.vue";
import WilGridBody from "./../../dumbs/grid/WilGridBody.vue";
import WilGridFooter from "./../../dumbs/grid/WilGridFooter.vue";
import WilGridCoupon from "./../../dumbs/grid/WilGridCoupon.vue";

export default {
  name: "wil-grid-item",
  components: {
    WilGridHeader,
    WilGridGeneral,
    WilGridBody,
    WilGridFooter,
    WilGridCoupon
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "listing_module__2EnGq wil-shadow js-listing-module",
      required: false
    },
    innerClasses: {
      type: String,
      default: "listing_firstWrap__36UOZ",
      required: false
    },
    item: {
      type: Object,
      default: () => {},
      required: true
    },
    type: {
      type: String,
      default: "grid"
    },
    mygeocoder: {
      type: Object,
      default: () => {},
      required: false
    },
    settings: {
      type: Object,
      default: () => {
        return {
          favoriteIconType: "love"
        };
      }
    }
  },
  computed: {
    parseGridStyle() {
      if (this.type === "grid") {
        return "";
      }

      return `js-listing-${this.type}`;
    },
    parsedPost: {
      get() {
        return this.item;
      },
      set(item) {
        this.$emit("change", item);
      }
    }
  },
  methods: {
    handleChange(cardPosition) {
      return items => {
        this.parsedPost = { ...this.parsedPost, [cardPosition]: items };
      };
    },
    notify() {
      this.$emit("rendered");
    }
  }
};
</script>
