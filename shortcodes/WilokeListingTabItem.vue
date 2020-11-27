<template>
  <div v-if="selected==tabId">
    <slot name="loading" :is-loading="isLoading">
      <div class="pos-r" v-show="isLoading=='yes'" style="min-height: 100px;">
        <block-loading :is-loading="isLoading" position="pos-a-center"></block-loading>
      </div>
    </slot>
    <div class="row" v-if="errMsg.length">
      <div class="col-md-12 text-center" v-html="errMsg"></div>
    </div>
    <div v-else class="row js-listing-grid">
      <div v-for="oListing in aListings" :class="itemWrapperClass">
        <listing :o-listing="oListing" :is-search-near-by-me="hasAddress" :key="oListing.postID"></listing>
      </div>
    </div>
  </div>
</template>
<script>
import Message from "./WilokeMessage.vue";
import BlockLoading from "./BlockLoading.vue";

export default {
  data() {
    return {
      isFetched: false,
      errMsg: "",
      aListings: [],
      hasAddress: false,
      isLoading: "no",
      oAddress: {},
      oTranslation: WILCITY_I18
    };
  },
  watch: {
    selected: function(val) {
      if (val == this.tabId) {
        this.prepareFetchListings();
      }
    },
    postType: function(val) {
      if (this.selected == this.tabId) {
        this.prepareFetchListings();
      }
    }
  },
  methods: {
    async prepareFetchListings() {
      if (this.orderby == "nearbyme") {
        const oGeoCode = await this.getGeoLocationLatLng({
          notification: true
        });
        if (oGeoCode) {
          this.oAddress = {
            latLng: this.oGeoLocation.lat + "," + this.oGeoLocation.lng,
            unit: this.unit,
            radius: this.radius,
            lat: this.oGeoLocation.lat,
            lng: this.oGeoLocation.lng
          };

          this.$emit("my-address", this.oAddress);

          this.fetchListings();
        } else {
          if (this.errCode == 1) {
            this.errMsg = this.oTranslation.geolocationError;
          }
        }
      } else {
        this.fetchListings();
      }
    },
    fetchListings() {
      this.isLoading = "yes";
      this.isFetched = true;
      this.errMsg = "";
      this.aListings = [];

      fetch(this.buildRestEndpoint("terms"), {
        "Content-Type": "application/json",
        method: "POST",
        body: JSON.stringify({
          args: this.queryArgs,
          postType: this.postType,
          taxonomy: this.taxonomy,
          scSettings: this.scSettings,
          oAddress: this.oAddress
        })
      })
        .then(res => res.json())
        .then(response => {
          if (response.status == "error") {
            this.errMsg = response.msg;
          } else {
            this.errMsg = "";
            this.aListings = response.listings;
          }
          this.isLoading = "no";
        });
    }
  },
  props: {
    postType: {
      type: String,
      required: true
    },
    selected: {
      type: String,
      default: ""
    },
    orderby: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    taxonomy: {
      type: String,
      required: true
    },
    tabId: {
      type: String,
      required: true
    },
    queryArgs: {
      type: String,
      required: true
    },
    scSettings: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    itemWrapperClass: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: false
    },
    radius: {
      type: Number,
      required: false
    }
  },
  components: {
    Listing: () => import("./../Listings/Listing.vue"),
    BlockLoading,
    Message
  }
};
</script>
