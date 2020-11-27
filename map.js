// if (WILOKE_GLOBAL.DEBUG_SCRIPT && WILOKE_GLOBAL.DEBUG_SCRIPT == "yes") {
//   Vue.config.devtools = true;
// } else {
// Vue.config.silent = true;
// Vue.config.devtools = false;
Vue.config.devtools = true;
// }
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;

Vue.use(Vuex);

// import SearchForm from './search-form/SearchForm.vue'
import Mapbox from "./map/Mapbox.vue";
import Listings from "./map/Listings.vue";

window.WilcityMap = new Vue({
  el: "#" + WHITE_LABEL + "-map-wrapper",
  store: WILCITY_VUEX,
  components: {
    Listings,
    Mapbox
    // SearchForm
  },
  data() {
    return { foundPosts: 0, isInitialized: false, oTranslation: WILCITY_I18 };
  },
  computed: {
    isMobile() {
      return WilCityHelpers.isMobile("Any", 769);
    },
    additionalPreloaderClass() {
      return "focus-hidden";
    },
    searchResultAdditionalClass() {
      return "focus-visible-showing";
    },
    showingListingDesc() {
      let postsPerPage = this.$store.getters.getPostsPerPage,
        currentPage = this.$store.getters.getCurrentPage,
        maxPages = this.$store.getters.getMaxPages;

      if (this.foundPosts === 0) {
        return "";
      }

      if (currentPage === maxPages) {
        return (
          '<span class="color-primary">' +
          (currentPage - 1) * postsPerPage +
          "-" +
          this.foundPosts +
          "</span> " +
          this.oTranslation.of +
          " " +
          '<span class="color-primary">' +
          this.foundPosts +
          "</span>"
        );
      }

      return (
        '<span class="color-primary">' +
        (currentPage - 1) * postsPerPage +
        "-" +
        currentPage * postsPerPage +
        " </span>" +
        this.oTranslation.of +
        " " +
        '<span class="color-primary">' +
        this.foundPosts +
        "</span>"
      );
    }
  },
  methods: {
    toggleSearchFormPopup() {
      this.$store.commit("updatePopupStatus", {
        id: "search-form-popup",
        status:
          this.$store.getters.getPopupStatus("search-form-popup") === "open"
            ? "close"
            : "open"
      });
    },
    togglePreloader(status) {
      if (status) {
        jQuery(this.$el)
          .find(".full-load")
          .removeClass("focus-hidden");
      } else {
        jQuery(this.$el)
          .find(".full-load")
          .addClass("focus-hidden");
      }
    },
    updateFoundPosts() {
      this.foundPosts = this.$store.getters.getTotalListings;
    },
    resetSearchForm() {
      if (this.isMobile) {
        jQuery("body").trigger("resetSearchOnMobile");
      } else {
        this.$emit("resetSearchForm", true);
      }
    },
    switchLayoutTo(layout) {
      this.$store.commit("updateTemplateStyle", layout);
    },
    mapLoaded() {
      setTimeout(() => {
        this.isInitialized = true;
      }, 800);
    },
    triggerFetchListing(isReset, resetPage) {
      this.$emit("fetchListings", isReset, resetPage);
    }
  },
  mounted() {
    this.$on("onUpdate", () => this.updateFoundPosts());
    this.mapLoaded();
  }
});
