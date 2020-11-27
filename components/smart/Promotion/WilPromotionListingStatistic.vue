<template>
  <div :class="wrapperClasses">
    <wil-heading v-if="heading.length" :heading="heading" :icon="icon" />
    <div class="content-box_body__3tSRB">
      <div class="row">
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
          <wil-review-average-rating
            wrapper-classes="rated-small_module__1vw2B rated-small_style-3__1c0gb mb-15"
            :average-rating="reviews.average"
            :mode="reviews.mode"
            :quality="reviews.quality"
          />
        </div>

        <template v-if="hasCompares">
          <div
            v-for="(compare, key) in compares"
            :key="`listing-compare-${key}`"
            class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          >
            <div :class="`stats-nuggets_module__2P_dg stats-nuggets_${compare.status}`">
              <div class="stats-nuggets_icon__3r4oz">
                <i :class="`la la-arrow-${compare.status}`"></i>
              </div>
              <span class="stats-nuggets_total__33yvd">{{compare.diff}}</span>
              <span class="stats-nuggets_text__1bYqn">{{key|filterTranslation(key)}}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="wil-divider wil-divider--forBox mb-15"></div>
      <div class="promo-item-2_module__2mwrO">
        <div class="promo-item-2_icon__2EU_c">
          <i class="la la-user la1"></i>
          <i class="la la-user la2"></i>
          <i class="la la-user la3"></i>
          <i class="color-primary la la-thumbs-o-up la4"></i>
        </div>
        <div
          class="promo-item-2_group__KUQtl"
          v-if="boostListingTitle.length | boostListingDesc.length"
        >
          <h3
            class="promo-item-2_title__Ghd11"
            v-if="boostListingTitle.length"
            v-html="boostListingTitle"
          ></h3>
          <p
            class="promo-item-2_description__1KXY2"
            v-if="boostListingDesc.length"
            v-html="boostListingDesc"
          ></p>
        </div>
        <div class="promo-item-2_action__Gnojf">
          <wil-promotion-btn
            :btn-name="btnName"
            :post-id="postId"
            wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
          />
        </div>
      </div>
    </div>
    <!-- End / promo-item-2_module__2mwrO -->
  </div>
</template>

<script>
export default {
  name: "wil-promotion-listing-statistic",
  components: {
    WilPromotionBtn: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilPromotionBtn" */
        "./WilPromotionBtn.vue"
      ),
    WilReviewAverageRating: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilReviewAverageRating" */
        "./../../dumbs/review/WilReviewAverageRating.vue"
      )
  },
  computed: {
    hasCompares() {
      return Object.values(this.compares).length;
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "content-box_module__333d9"
    },
    heading: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    boostListingTitle: {
      type: String,
      default: ""
    },
    boostListingDesc: {
      type: String,
      default: ""
    },
    btnName: {
      type: String,
      default: ""
    },
    postId: {
      type: Number,
      required: true
    },
    reviews: {
      type: Object,
      default: () => {}
    },
    compares: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
