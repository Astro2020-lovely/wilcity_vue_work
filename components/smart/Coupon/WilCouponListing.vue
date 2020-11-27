<template>
  <div v-if="hasCoupon" :class="wrapperClasses">
    <div :class="innerClasses">
      <div v-if="hasHighlight" :class="parseHeadClasses">
        <wil-link
          wrapper-classes="wilcity-get-counpon"
          @click="handleGetCoupon"
        >
          <template v-slot:default>
            <h4 class="color-secondary mt-15 mb-0 text-center">
              <span v-html="settings.highlight"></span>
              <i :class="highlightIcon"></i>
            </h4>
          </template>
        </wil-link>
      </div>
      <div :class="parseBodyClasses">
        <wil-link
          wrapper-classes="wilcity-get-counpon"
          @click="handleGetCoupon"
        >
          <template v-slot:default>
            <h4
              v-if="settings.title && settings.title.length"
              class="color-quaternary mt-0 mb-0"
              v-html="settings.title"
            ></h4>
            <div
              v-if="settings.description && settings.description.length"
              v-html="settings.description"
            ></div>
            <div v-if="hasExpiredDate">
              <span>{{
                "Expiry date:" | filterTranslation("expiryDate")
              }}</span>
              <span v-html="parseExpiredDate"></span>
            </div>
          </template>
        </wil-link>
      </div>
      <portal to="wil-modal" v-if="isOpenPopup">
        <wil-coupon-popup
          :settings="settings"
          @close="isOpenPopup = false"
          :post-url="postUrl"
        />
      </portal>
    </div>
  </div>
</template>
<script>
import { TimeHelper } from "./../../../mixins/TimeHelper";
export default {
  name: "wil-coupon-listing",
  mixins: [TimeHelper],
  data() {
    return {
      isOpenPopup: false
    };
  },
  components: {
    WilCouponPopup: () =>
      import(
        /* webpackChunkName: "WilCouponPopup" */
        /* webpackPreload: true */
        "./WilCouponPopup.vue"
      )
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "content-box_module__333d9"
    },
    innerClasses: {
      type: String,
      default: "content-box_body__3tSRB"
    },
    settings: {
      type: [Object, Array],
      default: () => {}
    },
    highlightIcon: {
      type: String,
      default: "la la-angle-double-right"
    },
    postUrl: {
      type: String,
      default: ""
    }
  },
  created() {},
  methods: {
    handleGetCoupon() {
      if (this.hasCouponCode) {
        this.isOpenPopup = true;
      }

      if (this.hasRedirectTo) {
        setTimeout(() => {
          window.open(this.settings.redirectTo);
        }, 1000);
      }
    }
  },
  computed: {
    parseExpiredDate() {
      return moment
        .unix(`${this.settings.expiry_date}`)
        .format(`${this.dateFormat} ${this.timeFormat}`);
    },
    hasCoupon() {
      return Array.isArray(this.settings) && !this.settings.length
        ? false
        : true;
    },
    hasRedirectTo() {
      return (
        this.settings.redirectTo &&
        this.settings.redirectTo.indexOf("http") !== -1
      );
    },
    hasHighlight() {
      return this.settings.highlight && this.settings.highlight.length;
    },
    hasCouponCode() {
      return this.settings.code && this.settings.code.length;
    },
    hasExpiredDate() {
      return _.isNumber(this.settings.expiry_date);
    },
    parseHeadClasses() {
      if (this.hasHighlight) {
        return "col-md-4";
      }

      return "";
    },
    parseBodyClasses() {
      if (this.hasHighlight) {
        return "col-md-8";
      }

      return "col-md-12";
    }
  }
};
</script>
