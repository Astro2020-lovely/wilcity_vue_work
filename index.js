import Vue from "vue/dist/vue.esm.js";
import { mapState } from "vuex";
import { ClickOutside } from "./directives/ClickOutside.js";
import { WilFocus } from "./directives/WilFocus.js";
import { MyFavorite } from "./directives/MyFavorite.js";
import { WatchingComponent } from "./directives/WatchingComponent.js";
import { store } from "./store/store.js";
import Helpers from "./helpers.js";
import PayAndPublish from "./PayAndPublish.js";
import { WilQueryHelper } from "./ultils/WilQueryHelper";
import { WilClickHelper } from "./ultils/WilClickHelper";
import GlobalComponents from "./plugins/GlobalComponents";
import DistanceFromListingToMe from "./mixins/DistanceFromListingToMe";
import { wilModifyObject } from "./ultils/ModifyObject";
import { wilGridHelper } from "./ultils/wilGridHelper";
import { formData } from "./mixins/FormHelper";
import ModifyArray from "./mixins/ModifyArray";
import { ParseData } from "./mixins/ParseData";
import VueLocalStorage from "vue-localstorage";
import Notifications from "vue-notification";
import axios from "axios";
import VueAxios from "vue-axios";
import FilterWithExcludes from "./filters/FilterWithExclude";
import FilterTranslation from "./filters/FilterTranslation";
import { ReverseGeoCoding } from "./ReverseGeoCoding.js";
import PortalVue from "portal-vue";
import VeeValidate from "vee-validate";
import { wilUltilsFirebase } from "./ultils/firebase.js";
import { wilValueFormat } from "./ultils/WilValueFormat.js";
import { WilCacheKeyHelper } from "./ultils/WilCacheKeyHelper.js";
import { wilTextClean } from "./ultils/WilTextClean.js";
import { mobileHelper } from "./ultils/MobileHelper.js";
import QuickNotifications from "./shortcodes/QuickNotifications.vue";
import Follow from "./Follow.js";
new Follow();

import VueContentPlaceholders from "vue-content-placeholders";
import moment from "moment";

Vue.use(VueContentPlaceholders);
window.Vue = Vue;
window.moment = moment;
// if (WILOKE_GLOBAL.DEBUG_SCRIPT && WILOKE_GLOBAL.DEBUG_SCRIPT == "yes") {
//   Vue.config.devtools = true;
// } else {
Vue.config.silent = true;
Vue.config.devtools = false;
// Vue.config.devtools = true;
// }

window.wilUltilsFirebase = wilUltilsFirebase;
window.wilModifyObject = wilModifyObject;
window.WilCacheKeyHelper = WilCacheKeyHelper;
window.WilClickHelper = wilModifyObject;
window.wilGridHelper = wilGridHelper;
window.wilTextClean = wilTextClean;
window.wilValueFormat = wilValueFormat;
window.mobileHelper = mobileHelper;
window.WILCITY_VUEX = store;
window.WilCityHelpers = Helpers;
window.WilQueryHelper = WilQueryHelper;
window.WILCITY_I18 = JSON.parse(window.atob(wilI18));

Vue.use(Notifications);
Vue.use(GlobalComponents);
Vue.use(VueAxios, axios);
// Vue.axios.defaults.headers.post.security = WILOKE_INLINE_GLOBAL.security;
const vueInstance = axios.create({
  baseURL: WILOKE_GLOBAL.ajaxurl
});
vueInstance.defaults.headers.post = {
  security: WILOKE_INLINE_GLOBAL.security,
  "Content-Type": "application/x-www-form-urlencoded"
};

Vue.use(PortalVue);
Vue.use(VeeValidate, { errorBagName: "vErrors" });

Vue.filter("filterWithExcludes", FilterWithExcludes);
Vue.filter("filterTranslation", FilterTranslation);

Vue.use(VueLocalStorage, {
  name: "localStorage",
  bind: true // created computed members from your variable declarations
});
// directives
Vue.directive("wil-focus", WilFocus);
Vue.directive("click-outside", ClickOutside);
Vue.directive("my-favorite", MyFavorite);
Vue.directive("watching-component", WatchingComponent);

// Global mixin
Vue.mixin(DistanceFromListingToMe);
Vue.mixin(ModifyArray);
Vue.mixin(ParseData);
Vue.mixin(formData);

const $body = jQuery("body");
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;

jQuery.fn.setCursorPosition = function(pos) {
  const elem = jQuery(this)[0];

  if (typeof elem.setSelectionRange !== "undefined") {
    elem.setSelectionRange(pos, pos);
  } else if (this.createTextRange) {
    const range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
  return this;
};

// Shortcodes
import NearByMe from "./Listings/ListingsNearByMe.vue";
import WilokeGeneral from "./general.js";

if (document.getElementById(WHITE_LABEL + "-wrapper-all-popup")) {
  // Quick Search Form Popup
  WILOKE_GLOBAL.vmWrapperAllPopup = new Vue({
    el: "#" + WHITE_LABEL + "-wrapper-all-popup",
    store: WILCITY_VUEX,
    components: {
      // SearchFormPopup: () => import ( /* webpackPreload: true */
      //         './search-form/SearchFormPopup.vue')
    },
    data() {
      return {
        ajaxSearch: null,
        s: "",
        aTemporaryCache: [],
        aResults: [],
        oListings: {},
        isSearching: "no",
        aTerms: [],
        isNotFound: false
      };
    },
    methods: {
      closeGallery() {
        // this.$store.dispatch('ModuleGallerySlideShow/closeGallery');
      }
    },
    computed: {
      ...mapState({
        // showSearchFormPopup: state => state.oPopupStatus['search-form-popup'] === 'open'
      })
    }
  });
}

import MessageNotifications from "./shortcodes/MessageNotifications.vue";
if (document.getElementById(WHITE_LABEL + "-message-notifications")) {
  WILOKE_GLOBAL.vmWrapperAllPopup = new Vue({
    el: "#" + WHITE_LABEL + "-message-notifications",
    store: WILCITY_VUEX,
    components: {
      MessageNotifications
    }
  });
}

const $termTabs = document.querySelectorAll(".wilcity-listings-tabs");
import WilTabs from "./components/smart/Tabs/WilTabs.vue";
import WilTab from "./components/smart/Tabs/WilTab.vue";
import WilAsyncGrid from "./components/smart/Grid/WilAsyncGrid.vue";

if ($termTabs) {
  [].forEach.call($termTabs, function(div) {
    new Vue({
      el: `#${div.id}`,
      store: WILCITY_VUEX,
      components: {
        WilTabs,
        WilTab,
        WilSelectTree: () =>
          import(
            /*webpackChunkName: "WilSelectTree"*/
            "./components/dumbs/WilSelectTree.vue"
          ),
        WilAsyncGrid
      },
      mixins: [ReverseGeoCoding],
      data() {
        return {
          // postType: div.dataset.posttype,
          termSlug: "",
          oAddress: {},
          viewMoreURL: "",
          searchURL: div.getAttribute("data-searchurl"),
          taxonomy: div.getAttribute("data-taxonomy"),
          fakeOrderBy: div.getAttribute("data-orderby"),
          order: div.getAttribute("data-order"),
          queryArgs: div.getAttribute("data-queryargs"),
          unit: div.getAttribute("data-unit"),
          radius: div.getAttribute("data-radius"),
          focusErrorMsg: "",
          orderby: [
            "open_now",
            "newest",
            "post_date",
            "oAddress",
            "best_viewed",
            "best_rated",
            "recommended",
            "discount",
            "claimed"
          ]
        };
      },
      created() {
        this.queryArgs = JSON.parse(this.queryArgs);
        if (this.fakeOrderBy === "nearbyme") {
          this.handleOrderByChange(this.fakeOrderBy);
        }
      },
      watch: {
        queryArgs: {
          handler: function(queryArgs) {
            // this.generateViewMoreURL();
            this.viewMoreURL = `${this.searchURL}?${WilQueryHelper.buildQuery(
              queryArgs
            )}`;
          },
          deep: true
        }
      },
      methods: {
        resetOrderBy() {
          let query = {};
          for (let [key, val] of Object.entries(this.queryArgs)) {
            if (!this.orderby.includes(key)) {
              query = {
                ...query,
                [key]: val
              };
            }
          }
          this.queryArgs = {
            ...query
          };
        },
        handlePageChanged(page) {
          this.focusErrorMsg = "";
          this.queryArgs = {
            ...this.queryArgs,
            page
          };
        },
        async handleOrderByChange(orderby) {
          this.focusErrorMsg = "";
          this.fakeOrderBy = orderby;
          this.resetOrderBy();

          switch (orderby) {
            case "open_now":
            case "discount":
            case "claimed":
              this.queryArgs = {
                ...this.queryArgs,
                [orderby]: "yes",
                page: 1
              };
              break;
            case "nearbyme":
              const canGetGeocoder = await this.getGeoLocationLatLng({
                notification: true
              });
              if (canGetGeocoder) {
                this.oAddress = {
                  latLng: `${this.oGeoLocation.lat},${this.oGeoLocation.lng}`,
                  unit: this.unit,
                  radius: this.radius,
                  lat: this.oGeoLocation.lat,
                  lng: this.oGeoLocation.lng
                };

                this.queryArgs = {
                  ...this.queryArgs,
                  page: 1,
                  oAddress: this.oAddress
                };
              } else {
                this.focusErrorMsg = this.$options.filters.filterTranslation(
                  "It seems like Geolocation, which is required for this page, is not enabled in your browser.",
                  "youAreBlockingLocation"
                );
              }
              break;
            default:
              this.queryArgs = {
                ...this.queryArgs,
                orderby,
                page: 1
              };
              break;
          }
        },
        handleQueryChange(param) {
          return val => {
            this.focusErrorMsg = "";
            if (val.includes("term_tab")) {
              val = val.replace("term_tab", "");
            }
            this.queryArgs = {
              ...this.queryArgs,
              [param]: val
            };
          };
        },
        async generateViewMoreURL() {
          this.viewMoreURL = `${this.searchURL}?${WilQueryHelper.buildQuery(
            this.queryArgs
          )}`;
        }
      }
    });
  });
}

const $newGrids = document.querySelectorAll(".wil-new-grid-wrapper");
if ($newGrids) {
  [].forEach.call($newGrids, function(div) {
    new Vue({
      el: `#${div.id}`,
      store: WILCITY_VUEX,
      components: {
        WilAsyncGrid
      },
      mixins: [ReverseGeoCoding],
      data() {
        return {
          // postType: div.dataset.posttype,
          termSlug: "",
          oAddress: {},
          viewMoreURL: "",
          focusErrorMsg: "",
          queryArgs: {},
          orderby: ""
        };
      },
      created() {
        this.orderby = div.getAttribute("data-orderby");

        const queryArgs = div.getAttribute("data-raw-query-args");

        this.queryArgs = {
          ...this.parseData(queryArgs)
        };

        if (this.orderby === "nearbyme") {
          this.findMyLocation();
        }
      },
      watch: {
        queryArgs: {
          handler: function(queryArgs) {
            // this.generateViewMoreURL();
            this.viewMoreURL = `${this.searchURL}?${WilQueryHelper.buildQuery(
              queryArgs
            )}`;
          },
          deep: true
        }
      },
      methods: {
        async findMyLocation() {
          const canGetGeocoder = await this.getGeoLocationLatLng({
            notification: true
          });
          if (canGetGeocoder) {
            this.oAddress = {
              latLng: `${this.oGeoLocation.lat},${this.oGeoLocation.lng}`,
              unit: this.unit,
              radius: this.radius,
              lat: this.oGeoLocation.lat,
              lng: this.oGeoLocation.lng
            };

            this.queryArgs = {
              ...this.queryArgs,
              page: 1,
              oAddress: this.oAddress
            };
          } else {
            this.focusErrorMsg = this.$options.filters.filterTranslation(
              "It seems like Geolocation, which is required for this page, is not enabled in your browser.",
              "youAreBlockingLocation"
            );
          }
        }
      }
    });
  });
}

import WilSlider from "./components/smart/Slider/WilSlider.vue";
const $wilSlider = document.querySelectorAll(".wil-slider");
if ($wilSlider) {
  [].forEach.call($wilSlider, function(div) {
    new Vue({
      el: `#${div.id}`,
      data() {
        return { items: [], columnClasses: "", itemsPerRow: {} };
      },
      components: {
        WilSlider
      },
      created() {
        let items = div.getAttribute("data-items");
        if (items.length) {
          this.items = JSON.parse(window.atob(items));
        }
        let itemsPerRow = div.getAttribute("data-items-per-row");
        if (itemsPerRow.length) {
          this.itemsPerRow = JSON.parse(window.atob(itemsPerRow));
        }
      }
    });
  });
}

const $nearBy = document.querySelectorAll(".wilcity-grid-nearbyme");
if ($nearBy) {
  if (typeof WILOKE_GLOBAL.vmNearByMe === "undefined") {
    WILOKE_GLOBAL.vmNearByMe = {};
  }
  [].forEach.call($nearBy, function(div) {
    WILOKE_GLOBAL.vmNearByMe.listing = new Vue({
      el: "#" + div.id,
      store: WILCITY_VUEX,
      components: {
        NearByMe
      }
    });
  });
}

function countViews() {
  if (typeof WILCITY_GLOBAL === "undefined") {
    return false;
  }

  setTimeout(() => {
    if (!jQuery("body.single").length) {
      return false;
    }
    jQuery.ajax({
      type: "POST",
      url: WILOKE_GLOBAL.ajaxurl,
      data: {
        action: "wilcity_count_views",
        postID: WILOKE_INLINE_GLOBAL.postID
      }
    });
  }, 2000);
}

function payAndPublish() {
  const $btn = jQuery("#wilcity-submit");
  $btn.removeClass("disable");
  $btn.on("click", event => {
    event.preventDefault();
    const $this = jQuery(event.currentTarget);

    $this.addClass("wil-btn--loading disable");
    $this.find(".pill-loading_module__3LZ6v").removeClass("hidden");

    let ajaxAct = "wilcity_handle_submit_listing";

    const form = WilQueryHelper.buildFormData({ action: ajaxAct });
    Vue.axios({ method: "POST", url: WILOKE_GLOBAL.ajaxurl, data: form })
      .then(response => {
        if (response.data.success) {
          window.location.href = response.data.data.redirectTo;
        } else {
          alert(response.data.data.msg);
        }
      })
      .catch(e =>
        alert(
          "Oops! We found some error while adding Listing, please contact Administrator to report it."
        )
      )
      .finally(() => {
        $this.removeClass("wil-btn--loading disable");
        $this.find(".pill-loading_module__3LZ6v").addClass("hidden");
      });
  });
}

function removeIfNoChild() {
  const $targets = jQuery(".wilcity-remove-if-no-child");
  if ($targets.length) {
    $targets.each(function() {
      if (!jQuery(this).children().length) {
        jQuery(this).remove();
      }
    });
  }
}

function addListingUpdateBlockRequired() {
  const $addListingWrapper = jQuery("#" + WHITE_LABEL + "-addlisting-form");
  $addListingWrapper.find(".content-box_module__333d9").each(function() {
    if (jQuery(this).find(".group-required").length === 1) {
      jQuery(this)
        .find(".content-box_title__1gBHS")
        .addClass("required");
    }
  });
}

function wilcityRemoveCommentReplyIfEmpty() {
  const $replyWrapper = jQuery(".comment-review_btn__32CMP");
  $replyWrapper.each(function() {
    if (!jQuery(this).children().length) {
      jQuery(this)
        .closest("footer.comment-review_footer__3XR0_")
        .remove();
    }
  });
}

function afterRemovingItemFromCart() {
  jQuery(document.body).on(
    "removed_from_cart",
    (event, idontcare1, idontcare2, $thisbutton) => {
      const $totalCart = jQuery("." + WHITE_LABEL + "-total-cart-item");
      let total = $totalCart.html();
      total = parseInt(total);
      const quantity = $thisbutton.data("quantity");

      $totalCart.html(total - quantity);
    }
  );
}

window.lazyLoad = function($lazyLoad) {
  if ($lazyLoad.length) {
    $lazyLoad.lazy({ visibleOnly: true, effect: "fadeIn" });
  }
};

jQuery(document).ready(function($) {
  new WilokeGeneral();
  wilcityRemoveCommentReplyIfEmpty();
  removeIfNoChild();
  addListingUpdateBlockRequired();
  afterRemovingItemFromCart();
  lazyLoad(jQuery("." + WHITE_LABEL + "-lazyload"));

  $body.on("listingLoaded", (event, gridWrapperID) => {
    lazyLoad($("#" + gridWrapperID).find("." + WHITE_LABEL + "-lazyload"));
  });

  jQuery(document).on("wilTabClicked", (event, $gridWrapper, isSlider) => {
    lazyLoad($gridWrapper.find("." + WHITE_LABEL + "-lazyload"));
  });

  const $checkoutErrMsg = $("#wilcity-print-msg");
  $checkoutErrMsg.on("printErrMsg", function(event, msg) {
    $checkoutErrMsg.find(".alert_content__1ntU3").html(msg);
    $checkoutErrMsg.removeClass("hidden");
  });

  new PayAndPublish($("#wilcity-pay-and-publish"));
  payAndPublish();

  $(".wil-js-send-confirmation-code").on("click", event => {
    event.preventDefault();
    const $target = $(event.target);
    const $parent = $target.parent();
    $target.html(WILCITY_I18.sending);

    jQuery.ajax({
      type: "POST",
      url: WILOKE_GLOBAL.ajaxurl,
      data: {
        action: "wilcity_send_confirmation_code"
      },
      success: response => {
        $parent.html(response.data.msg);
      }
    });
  });

  function removeVCEmptyElements() {
    const $elementItems = jQuery(".wpb_wrapper");
    if ($elementItems.length) {
      $elementItems.each(function() {
        if (!$(this).children().length) {
          $(this)
            .closest(".vc_row")
            .remove();
        }
      });
    }
  }

  removeVCEmptyElements();
});

jQuery(window).load(function() {
  countViews();

  if (document.getElementById(WHITE_LABEL + "-quick-notifications")) {
    WILOKE_GLOBAL.vmWrapperAllPopup = new Vue({
      el: "#" + WHITE_LABEL + "-quick-notifications",
      store: WILCITY_VUEX,
      components: {
        QuickNotifications
      }
    });
  }
});
