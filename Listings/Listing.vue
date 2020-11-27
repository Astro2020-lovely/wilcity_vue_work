<template>
  <article :class="articleClass">
    <div class="listing_firstWrap__36UOZ">
      <div style="position: absolute;top:10px;left:10px;z-index:99">
        <a
          class="utility-meta_module__mfOnV utility-meta_primary__2xTvX utility-meta_border__3O9g6 mb-10 mr-5 is-event"
          :class="generateFavoriteClass"
          :data-post-id="oListing.postID"
          :href="oListing.permalink"
          :data-tooltip="oTranslation.favoriteTooltip"
          data-tooltip-placement="top"
        >
          <i :class="renderFavorites2"></i>
        </a>
        <a
          v-if="renderTopSecondButtonLink"
          class="utility-meta_module__mfOnV utility-meta_light__2EzdO utility-meta_border__3O9g6 mb-10 mr-5"
          :href="renderTopSecondButtonLink"
        >
          <i :class="renderTopSecondIcon"></i>
          <span v-html="renderTopSecondName"></span>
        </a>
      </div>

      <header class="listing_header__2pt4D">
        <span v-if="oListing.isAds=='yes'" class="wil-ads" v-html="oTranslation.ads"></span>
        <a :href="oListing.permalink">
          <div
            v-if="oListing.featuredImage"
            class="listing_img__3pwlB pos-a-full bg-cover"
            :style="{'background-image':'url('+oListing.featuredImage+')'}"
          >
            <img :src="oListing.featuredImage" :alt="oListing.postTitle" />
          </div>
          <div
            v-if="oListing.oReviews && oListing.oReviews.average > 0"
            class="listing_rated__1y7qV"
          >
            <div class="rated-small_module__1vw2B rated-small_style-2__3lb7d">
              <div
                class="rated-small_wrap__2Eetz"
                :data-rated="detailDataRated(oListing.oReviews.average)"
              >
                <div class="rated-small_overallRating__oFmKR" v-text="oListing.oReviews.average"></div>
                <div class="rated-small_ratingWrap__3lzhB">
                  <div class="rated-small_maxRating__2D9mI">{{oListing.oReviews.mode}}</div>
                  <div class="rated-small_ratingOverview__2kCI_">{{oListing.oReviews.quality}}</div>
                </div>
              </div>
            </div>
          </div>
        </a>
        <span v-if="oListing.isClaimed=='yes'" class="wil-verified" v-html="oTranslation.verfied"></span>
      </header>
      <div class="js-grid-item-body listing_body__31ndf">
        <a v-if="oListing.logo" class="listing_goo__3r7Tj" :href="oListing.permalink">
          <div
            class="listing_logo__PIZwf bg-cover"
            :style="{'background-image': 'url('+oListing.logo+')'}"
          ></div>
        </a>
        <h2 class="listing_title__2920A text-ellipsis">
          <a :href="oListing.permalink" v-html="oListing.postTitle"></a>
        </h2>
        <div class="listing_tagline__1cOB3 text-ellipsis">{{oListing.excerpt}}</div>
        <div class="listing_meta__6BbCG vertical">
          <template v-for="(oItem, itemType) in oListing.oBody">
            <a class="text-ellipsis" v-if="itemType=='phone'" :href="renderPhone(oItem)">
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              {{oItem.value}}
            </a>
            <a class="text-ellipsis" v-else-if="itemType=='email'" :href="renderMail(oItem)">
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              {{oItem.value}}
            </a>
            <a
              class="text-ellipsis"
              v-else-if="itemType=='website'"
              :href="renderWebsite(oItem)"
              target="_blank"
            >
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              {{oItem.value}}
            </a>
            <a class="text-ellipsis" v-else-if="itemType=='single_price'" href="#">
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              {{oItem.value}}
            </a>
            <a class="text-ellipsis" v-else-if="itemType=='price_range'" href="#">
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              <span v-html="oItem.value.minimumPrice"></span> -
              <span v-html="oItem.value.maximumPrice"></span>
            </a>
            <a class="text-ellipsis" v-if="itemType=='event_starts_on'" :href="oListing.permalink">
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              <span>{{oItem.value.day}} {{oItem.value.hour}}</span>
            </a>
            <a
              :class="generateAddressClass"
              style="position: relative; padding-right: 61px"
              v-else-if="itemType=='google_address'"
              target="_blank"
              :href="oItem.value.googleMapAddress"
            >
              <span>
                <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
                <span v-html="oItem.value.address"></span>
              </span>
              <span v-if="isSearchNearByMe" class="pos-a-right" v-html="distanceText"></span>
            </a>
            <a class="text-ellipsis" v-else-if="itemType=='interested_people'" :href="oItem.value">
              <i v-show="oItem.icon" :class="oItem.icon" class="color-primary"></i>
              <span v-html="oItem.value"></span>
            </a>
            <div v-else-if="isTaxonomy(itemType)">
              <div class="icon-box-1_module__uyg5F mb-10">
                <div class="icon-box-1_block1__bJ25J" v-for="oTerm in oItem" v-if="oTerm.oIcon">
                  <a class="text-ellipsis" v-if="oTerm.oIcon" :href="oTerm.link">
                    <div
                      v-if="typeof oTerm.oIcon.color === 'undefined'"
                      class="icon-box-1_icon__3V5c0 rounded-circle"
                    >
                      <img :src="oTerm.oIcon.url" />
                    </div>
                    <div
                      v-else-if="oTerm.oIcon.color"
                      class="icon-box-1_icon__3V5c0 rounded-circle"
                      :style="{'background-color': oTerm.oIcon.color}"
                    >
                      <i :class="oTerm.oIcon.icon"></i>
                    </div>
                    <div v-else="oTerm.oIcon.icon" class="icon-box-1_icon__3V5c0 rounded-circle">
                      <i :class="oTerm.oIcon.icon"></i>
                    </div>
                    <div class="icon-box-1_text__3R39g" v-html="oTerm.name"></div>
                  </a>
                </div>
              </div>
            </div>
            <div v-else-if="itemType == 'custom_field'">
              <div v-for="childItem in oItem" v-html="childItem"></div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <footer class="listing_footer__1PzMC js-grid-item-footer">
      <div class="text-ellipsis">
        <div class="icon-box-1_module__uyg5F text-ellipsis icon-box-1_style2__1EMOP">
          <div v-if="oListing.oTermFooter" class="icon-box-1_block1__bJ25J">
            <a class="text-ellipsis" :href="oListing.oTermFooter.link">
              <div
                v-if="oListing.oTermFooter.oIcon.type=='icon'"
                class="icon-box-1_icon__3V5c0 rounded-circle"
                :style="{'background-color': oListing.oTermFooter.oIcon.color}"
              >
                <i :class="oListing.oTermFooter.oIcon.icon"></i>
              </div>
              <div v-else class="bg-trasparent icon-box-1_icon__3V5c0">
                <img :src="oListing.oTermFooter.oIcon.url" />
              </div>
              <div class="icon-box-1_text__3R39g" v-html="oListing.oTermFooter.name"></div>
            </a>
          </div>
          <div v-if="oListing.oBusinessHours" class="icon-box-1_block2__1y3h0">
            <span :class="oListing.oBusinessHours.class">{{oListing.oBusinessHours.text}}</span>
          </div>
        </div>
      </div>
      <div class="listing_footerRight__2398w">
        <a
          :class="generatePreviewGalleryClass"
          v-if="oListing.gallery"
          href="#"
          :data-tooltip="oTranslation.gallery"
          data-tooltip-placement="top"
          :data-gallery="oListing.gallery"
        >
          <i class="la la-search-plus"></i>
        </a>
        <a
          :class="generateFavoriteClass"
          :data-post-id="oListing.postID"
          href="#"
          :data-tooltip="oTranslation.favoriteTooltip"
          data-tooltip-placement="top"
        >
          <i :class="favoriteClass"></i>
        </a>
      </div>
    </footer>
  </article>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      oTranslation: WILCITY_I18,
      defaultArticleClass:
        "listing_module__2EnGq wil-shadow mb-30 mb-sm-20 js-listing-module js-grid-item"
    };
  },
  props: {
    oListing: {
      type: Object,
      default: {}
    },
    layout: {
      type: String,
      default: "grid"
    },
    borderClass: {
      type: String,
      default: ""
    }
  },
  computed: {
    generateAddressClass() {
      return this.isSearchNearByMe
        ? "text-ellipsis wil-distance"
        : "text-ellipsis";
    },
    generateFavoriteClass() {
      return WHITE_LABEL + "-js-favorite";
    },
    generatePreviewGalleryClass() {
      return WHITE_LABEL + "-preview-gallery";
    },
    articleClass() {
      if (
        typeof this.$store !== "undefined" &&
        this.$store.getters.getTemplateStyle == "list"
      ) {
        return this.defaultArticleClass + " js-listing-list";
      }
      return this.defaultArticleClass + " " + this.borderClass;
    },
    renderTopSecondButtonLink() {
      const { headerCard } = this.oListing;

      if (
        (typeof headerCard.headerCardAction === "string" &&
          !headerCard.headerCardAction.length) ||
        headerCard.headerCardAction == 0
      ) {
        return "";
      }

      switch (headerCard.headerCardType) {
        case "email_us":
        case "call_us":
          return `mailto: ${headerCard.headerCardAction}`;
          break;
        default:
          return this.oListing.permalink;
          break;
      }
    },
    renderTopSecondIcon() {
      const { headerCard } = this.oListing;
      let icon;
      switch (headerCard.headerCardType) {
        case "email_us":
          icon = "la la-envelope";
          break;
        case "call_us":
          icon = "la la-phone";
          break;
        default:
          icon = "la la-eye";
          break;
      }

      return icon;
    },
    renderTopSecondName() {
      const { headerCard } = this.oListing;
      switch (headerCard.headerCardType) {
        case "email_us":
          return this.oTranslation.emailUs;
          break;
        case "call_us":
          return this.oTranslation.callUs;
          break;
        default:
          return headerCard.headerCardAction > 1
            ? headerCard.headerCardAction + " " + this.oTranslation.views
            : headerCard.headerCardAction + " " + this.oTranslation.view;
          break;
      }
    },
    renderFavorites2() {
      return this.oListing.isMyFavorite == "yes"
        ? "la la-star color-primary"
        : "la la-star-o";
    },
    favoriteClass() {
      return this.oListing.isMyFavorite == "yes"
        ? "la la-heart color-primary"
        : "la la-heart-o";
    }
  },
  methods: {
    isTaxonomy(itemType) {
      return itemType.indexOf("taxonomy_") !== -1;
    },
    detailDataRated(average) {
      if (this.mode == 5) {
        return parseFloat(average) * 2;
      }
      return average;
    },
    renderMail(oItem) {
      return "mailto:" + oItem.value;
    },
    renderPhone(oItem) {
      return "tel:" + oItem.value;
    },
    renderWebsite(oItem) {
      return oItem.value;
    }
  },
  mounted() {
    this.renderDistanceFromListingToMe();
    this.$nextTick(() => {
      const $grid = jQuery(this.$el);

      $grid.find("." + WHITE_LABEL + "-preview-gallery").each(function() {
        jQuery(this).wilcityMagnificGalleryPopup();
      });

      $grid.find("." + WHITE_LABEL + "-js-favorite").each(function() {
        jQuery(this).wilcityFavoriteStatistic();
      });
    });
  }
};
</script>
