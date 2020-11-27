<template>
  <!-- rated-info-group_module__20kAf -->
  <div v-if="details.length">
    <div :class="wrapperClasses">
      <wil-heading
        wrapper-classes="content-box_header__xPnGx clearfix"
        inner-classes="wil-float-left"
        icon="la la-star-o"
        :heading="postTitle"
      >
        <template v-slot:heading>
          <h4 class="content-box_title__1gBHS">
            <i class="la la-star-o"></i>
            <span>
              <span v-if="averageRating > 0" class="color-primary">{{averageRatingBasedOnTotal}}</span>
              <span v-html="postTitle"></span>
            </span>
          </h4>
        </template>
      </wil-heading>
      <div class="content-box_body__3tSRB">
        <div class="rated-info-group_module__20kAf">
          <div class="rated-info-group_body__2yvB5">
            <!-- rated-info_module__KsMQP -->
            <div
              v-for="detail in details"
              :key="`wil-review-detail-statistic-${detail.key}`"
              class="rated-info_module__KsMQP"
            >
              <div class="rated-info_title__2Oido">{{detail.name}}</div>
              <div class="rated-info_wrap__AI5nf">
                <div class="rated-info_progressBar__1pCWE">
                  <div class="rated-info_bar__1T7U7" :style="{left: printPercentage(detail)}"></div>
                </div>
              </div>
              <div class="rated-info_overallRating__1Js4A">{{detail.average}}</div>
            </div>
            <!-- End / rated-info_module__KsMQP -->
          </div>
          <div v-if="averageRating>0" class="rated-info-group_footer__2mcef">
            <h3>{{''|filterTranslation('averageRating')}}</h3>
            <!-- rated-small_module__1vw2B -->
            <wil-review-average-rating
              wrapper-classes="rated-small_module__1vw2B rated-info-group_rated__29vEF pos-a-center-right"
              :average-rating="averageRating"
              :mode="mode"
              :quality="quality"
            />
            <!-- End / rated-small_module__1vw2B -->
          </div>
        </div>
      </div>
    </div>
    <wil-review-btn
      :post-id="postId"
      wrapper-classes="wil-btn wil-btn--primary wil-btn--round wil-btn--md wil-btn--block"
      :review="myReview"
      :btn-name="parseBtnName"
    ></wil-review-btn>
  </div>
  <!-- End / rated-info-group_module__20kAf -->
</template>
<script>
import WilReviewAverageRating from "./../../dumbs/review/WilReviewAverageRating.vue";
import { mapGetters } from "vuex";

export default {
  name: "wil-review-details-statistic",
  components: {
    WilReviewAverageRating
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "rated-info-group_module__20kAf"
    },
    postTitle: {
      type: String,
      default: ""
    },
    myUserId: {
      type: Number,
      default: 0
    },
    postId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({
      details: "ModuleReviews/getReviewCategoriesStatistic",
      averageRating: "ModuleReviews/getAverageRating",
      mode: "ModuleReviews/getModeRating",
      quality: "ModuleReviews/getQualityRating",
      total: "ModuleReviews/countTotal"
    }),
    isUserReviewed() {
      return this.$store.getters["ModuleReviews/isUserLeftReview"](
        this.myUserId
      );
    },
    parseBtnName() {
      return this.isUserReviewed
        ? this.$options.filters.filterTranslation("", "editReview")
        : this.$options.filters.filterTranslation("", "addReview");
    },
    myReview() {
      if (!this.isUserReviewed) {
        return {};
      }
      return this.$store.getters["ModuleReviews/getUserReviews"](
        this.myUserId,
        true
      );
    },
    detailDataRated() {
      if (this.mode == 5) {
        return parseFloat(item.average) * 2;
      }
      return this.item.average;
    },
    averageRatingBasedOnTotal() {
      let translation = this.$options.filters.filterTranslation('averageRatingBasedOnTotal');
      return translation.replace('%average%', this.averageRating).replace('%total%', this.total).replace('%postTitle%', this.postTitle);
    }
  },
  methods: {
    printPercentage(item) {
      return Math.round((item.average / this.mode) * 100) + "%";
    }
  }
};
</script>
