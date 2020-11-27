import Ads from "vue-google-adsense";
import VS2 from "vue-script2";
import { WilQueryHelper } from "./ultils/WilQueryHelper";
import Reviews from "./plugins/Reviews";
import WilScrollHelper from "./mixins/ScrollHelper";
import WilReportBtn from "./components/smart/Report/WilReportBtn.vue";
// import WilMessageBtn from "./components/smart/Message/WilMessageBtn.vue";
// import WilFavoriteBtn from "./components/smart/Favorite/WilFavoriteBtn.vue";
import WilSwitchTabBtn from "./components/smart/SingleNav/WilSwitchTabBtn.vue";
import WilVideoGallery from "./components/smart/Video/WilVideoGallery.vue";
import WilBoxesIconItems from "./components/smart/BoxesIcon/WilBoxesIconItems.vue";
import WilReviewDetail from "./components/dumbs/review/WilReviewDetail.vue";
import ModuleSingleListing from "./store/modules/ModuleSingleListing.js";
WILCITY_VUEX.registerModule("ModuleSingleListing", ModuleSingleListing);

Vue.component(WilReviewDetail.name, WilReviewDetail);
Vue.component(WilVideoGallery.name, WilVideoGallery);
Vue.component(WilReportBtn.name, WilReportBtn);
// Vue.component(WilMessageBtn.name, WilMessageBtn);
// Vue.component(WilFavoriteBtn.name, WilFavoriteBtn);
Vue.component(WilSwitchTabBtn.name, WilSwitchTabBtn);
Vue.component(WilBoxesIconItems.name, WilBoxesIconItems);

window.WilQueryHelper = WilQueryHelper;
Vue.use(VS2);
Vue.use(Ads.Adsense);
Vue.use(Ads.InArticleAdsense);
Vue.use(Ads.InFeedAdsense);
Vue.use(Reviews);

// import SingleHeader from './shortcodes/WilokeSingleHeader.vue';
import { mapState, mapGetters } from "vuex";

if (document.getElementById(WHITE_LABEL + "-single-listing-content")) {
  const oComponents = {
    WilReviewAverageRating: () =>
      import(
        /*webpackChunkName: "WilReviewAverageRating"*/
        /*webpackPreload: true*/
        "./components/dumbs/review/WilReviewAverageRating.vue"
      ),
    WilMapbox: () =>
      import(
        /*webpackChunkName: "WilMapbox"*/
        /*webpackPreload: true*/
        "./components/dumbs/map/WilMapbox.vue"
      ),
    WilGoogleMap: () =>
      import(
        /*webpackChunkName: "WilGoogleMap"*/
        /*webpackPreload: true*/
        "./components/dumbs/map/WilGoogleMap.vue"
      ),
    WilBoxesColorItems: () =>
      import(
        /*webpackChunkName: "WilBoxesColorItems"*/
        /*webpackPreload: true*/
        "./components/smart/BoxesColor/WilBoxesColorItems.vue"
      ),
    WilBoxesColorItem: () =>
      import(
        /*webpackChunkName: "WilBoxesColorItems"*/
        /*webpackPreload: true*/
        "./components/smart/BoxesColor/WilBoxesColorItem.vue"
      ),
    WilMessageBtn: () =>
      import(
        /*webpackChunkName: "WilMessageBtn"*/
        /*webpackPreload: true*/
        "./components/smart/Message/WilMessageBtn.vue"
      ),
    WilFavoriteBtn: () =>
      import(
        /*webpackChunkName: "WilFavoriteBtn"*/
        /*webpackPreload: true*/
        "./components/smart/Favorite/WilFavoriteBtn.vue"
      ),
    WilSingleNavWrapper: () =>
      import(
        /*webpackChunkName: "WilSingleNavWrapper" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavWrapper.vue"
      ),
    WilSingleNavTerm: () =>
      import(
        /*webpackChunkName: "WilSingleNavTerm" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavTerm.vue"
      ),
    WilSingleNavContent: () =>
      import(
        /*webpackChunkName: "WilSingleNavContent" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavContent.vue"
      ),
    WilSingleNavCustomContent: () =>
      import(
        /*webpackChunkName: "WilSingleNavCustomContent" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavCustomContent.vue"
      ),
    WilSingleNavPhotos: () =>
      import(
        /*webpackChunkName: "WilSingleNavPhotos" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavPhotos.vue"
      ),
    WilSingleNavMyProducts: () =>
      import(
        /*webpackChunkName: "WilSingleNavMyProducts" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavMyProducts.vue"
      ),
    WilSingleNavPosts: () =>
      import(
        /*webpackChunkName: "WilSingleNavPosts" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavPosts.vue"
      ),
    WilSingleNavVideos: () =>
      import(
        /*webpackChunkName: "WilSingleNavVideos" */
        /*webpackPreload: true */
        /*webpackPrefetch: true */
        "./components/smart/SingleNav/WilSingleNavVideos.vue"
      ),
    // WilokeEventPopup: () => import ( /* webpackPreload: true */
    //         './single-listing/EventPopup.vue'),
    WilSingleNavRestaurantMenu: () =>
      import("./components/smart/SingleNav/WilSingleNavRestaurantMenu.vue"),
    // MultipleProducts: () => import('./../../../../../plugins/wilcity-advanced-woocommerce/static/js/MultipleProducts.vue'),
    WilPromotionListingStatistic: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilPromotionListingStatistic" */
        "./components/smart/Promotion/WilPromotionListingStatistic.vue"
      ),
    WilCouponListing: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilCouponListing" */
        "./components/smart/Coupon/WilCouponListing.vue"
      ),
    WilListingSettings: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilListingSettings" */
        "./components/smart/ListingSettings/WilListingSettings.vue"
      ),
    WilSingleListProducts: () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: "WilSingleListProducts" */
        "./components/smart/WooCommerce/WilSingleListProducts.vue"
      )
  };

  WILOKE_GLOBAL.vmSingleListingSetings = new Vue({
    el: "#" + WHITE_LABEL + "-single-listing-content",
    mixins: [WilScrollHelper],
    data: {
      tabKey: "",
      msg: "",
      msgStatus: "",
      msgIcon: "",
      componentLoading: "",
      msgTimeout: null,
      data: {},
      reviewConfiguration: {},
      navSettings: {}
    },
    store: WILCITY_VUEX,
    components: oComponents,
    mounted() {},
    created() {
      this.reviewConfiguration = {
        ...WIL_REVIEW_CONFIGURATION
      };
      this.data = {
        ...WIL_SINGLE_LISTING
      };

      if (!this.data || !this.data.listingSettings.editNavigation) {
        this.navSettings = {};
      } else {
        if (this.data.listingSettings.editNavigation.settings.draggable) {
          this.navSettings = {
            ...this.data.listingSettings.editNavigation.settings.fixed,
            ...this.data.listingSettings.editNavigation.settings.draggable
          };
        } else {
          this.navSettings = {
            ...this.data.listingSettings.editNavigation.settings.fixed
          };
        }
      }
    },
    computed: {
      ...mapGetters({ currentTab: "ModuleSingleListing/getCurrentTab" }),
      myReview() {
        return !_.isEmpty(this.reviewConfiguration.reviews.myReview)
          ? this.reviewConfiguration.reviews.myReview
          : {};
      },
      usingCustomListingSettingsWarning() {
        if (!this.data.listingSettings) {
          return "";
        }

        if (
          this.data.listingSettings.editNavigation &&
          this.data.listingSettings.editNavigation.isUsingDefaultNav === "no"
        ) {
          return "usingCustomNavigation";
        }

        if (
          this.data.listingSettings.editSidebar &&
          this.data.listingSettings.editSidebar.isUsingDefaultSidebar === "no"
        ) {
          return "usingCustomSidebar";
        }

        return "";
      }
    },
    watch: {
      currentTab(tab) {
        const $homeWrapper = document.getElementById(
          "wil-home-section-wrapper"
        );
        if (tab.length && tab !== "home" && tab !== "listing-settings") {
          this.scrollTop($homeWrapper.offsetTop - 100);
        }
      }
    },
    methods: {
      getNavigation(navKey) {
        return Object.values(this.navSettings).find(item => {
          return (
            item.key === navKey ||
            item.key === `wilcity_single_navigation_${navKey}`
          );
        });
      },
      getNavigationInfo(navKey, param, std) {
        const info = this.getNavigation(navKey);
        if (info && info.param) {
          return info.param;
        }

        return std;
      }
    }
  });
}

jQuery(document).ready(function($) {
  $(".wilcity-copy").on("click", event => {
    event.preventDefault();
    const target = $(event.target).data("target");
    const copyText = document.getElementById(target);
    if (copyText) {
      /* Select the text field */
      copyText.select();
      // copyText.setSelectionRange(0, 99999);
      /*For mobile devices*/

      /* Copy the text inside the text field */
      document.execCommand("copy");
      $(event.target).html("Copied");
    }
  });
});
