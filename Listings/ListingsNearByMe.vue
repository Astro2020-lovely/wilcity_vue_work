<template>
  <div class="pos-r" style="min-height: 100px;">
    <wil-loading :is-loading="isLoading" />
    <wil-message v-if="errorMsg.length" :msg="errorMsg" />
    <div :id="tabId" class="row js-listing-grid" v-show="!errorMsg.length">
      <div
        v-for="oListing in aListings"
        :class="gridClass"
        :style="styleObject"
        :key="`${tabId}-wil-near-by-me-${oListing.ID}`"
      >
        <listing
          :o-listing="oListing"
          :layout="style"
          :border-class="borderClass"
          :is-search-near-by-me="true"
        ></listing>
      </div>
    </div>
  </div>
</template>
<script>
import Listing from "./Listing.vue";
import BlockLoading from "./../shortcodes/BlockLoading.vue";
import Message from "./../shortcodes/WilokeMessage.vue";
import equalHeight from "./../equalHeight.js";

export default {
  data() {
    return {
      isLoading: false,
      errorMsg: "",
      style: "grid",
      aListings: []
    };
  },
  props: [
    "postType",
    "gridClass",
    "postsPerPage",
    "unit",
    "radius",
    "oAjaxData",
    "tabId",
    "borderClass"
  ],
  computed: {
    styleObject() {
      if (this.style == "grid") {
        return {};
      }

      return {
        width: "100%",
        opacity: 1
      };
    }
  },
  components: {
    Listing
  },
  updated() {
    this.equalHeight();
  },
  mounted() {
    if (this.tabId.length) {
      let $el = jQuery("#" + this.tabId);

      let $tabParent = $el.closest(".wil-tab__panel");

      let $navItem = jQuery('a[href="#' + $tabParent.attr("id") + '"]');

      if ($tabParent.prev().length) {
        $navItem.on("click", event => {
          let $target = jQuery(event.currentTarget);

          if (!$target.data("clicked")) {
            $navItem.data("clicked", true);
            this.fetchGeocode();
          }
        });
      } else {
        this.fetchGeocode();
      }
    } else {
      this.fetchGeocode();
    }

    this.equalHeight();
  },
  methods: {
    equalHeight() {
      let $gridID = this.tabId.length
        ? jQuery("#" + this.tabId)
        : jQuery(".wilcity-grid-nearbyme");

      if ($gridID.length && $gridID.find(".js-grid-item").length) {
        let $tabWrapper = $gridID.closest(".wil-tab__panel");
        if ($tabWrapper.length && !$tabWrapper.hasClass("active")) {
          return false;
        }

        if (!$gridID.data("calculatedHeight")) {
          equalHeight($gridID);
          $gridID.data("calculatedHeight", true);
        }
      }
    },
    async fetchGeocode() {
      const oGeoCode = await this.getGeoLocationLatLng({ notification: true });
      if (oGeoCode) {
        this.fetchListings();
      } else {
        if (this.errCode == 1) {
          this.errorMsg = this.oTranslation.geolocationError;
        }
      }
    },
    fetchListings() {
      this.isLoading = true;
      jQuery.ajax({
        type: "POST",
        data: {
          action: "wilcity_get_listings_nearbyme",
          data: this.oAjaxData,
          postType: this.postType,
          postsPerPage: this.postsPerPage,
          oAddress: {
            lat: this.oGeoLocation.lat,
            lng: this.oGeoLocation.lng,
            unit: this.unit,
            radius: this.radius
          }
        },
        url: WILOKE_GLOBAL.ajaxurl,
        success: response => {
          if (response.success) {
            this.aListings = response.data.aResults;
          } else {
            this.errorMsg = response.data.msg;
          }
          this.isLoading = false;
          setTimeout(() => {
            jQuery(this.$el)
              .find("." + WHITE_LABEL + "-js-favorite")
              .each(function() {
                jQuery(this).wilcityFavoriteStatistic();
              });
            jQuery(this.$el)
              .find("." + WHITE_LABEL + "-preview-gallery")
              .each(function() {
                jQuery(this).wilcityMagnificGalleryPopup();
              });
            //this.equalHeight();
          }, 3000);
        }
      });
    }
  }
};
</script>
