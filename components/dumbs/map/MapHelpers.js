export default {
  data() {
    return {
      isOpenMap: false,
      instance: null,
      marker: null,
      iconSize: {},
      isShowingPopupID: null,
      markersCollection: {},
      markers: {},
      isSearchAsIMoveTheMap: true,
      items: [],
      instGeocode: {},
      isWaitingForInstance: false
    };
  },
  watch: {
    // isOpenMap: {
    //     handler(status) {
    //         console.log(status);
    //         if (status) {
    //             this.init();
    //             // if (this.isWaitingForInstance) {
    //             //     this.isWaitingForInstance = false;
    //             //     this.buildMapLayers();
    //             // }
    //         }
    //     },
    //     immediate: true
    // },
    items: {
      handler(items) {
        if (items !== null) {
          if (this.instance === null) {
            this.init();
          } else {
            this.buildMapLayers();
          }
        }
      },
      deep: true
    },
    mouseOnItem: {
      handler(item) {
        if (_.isEmpty(item)) {
          if (this.isShowingPopupID !== null) {
            this.togglePopup(this.isShowingPopupID);
          }
          return false;
        }
        // when hovering a post, the map popup of this post will be shown
        this.togglePopup(item.postID);
      }
    },
    rawItems: {
      handler(rawItems) {
        this.items = this.rawItems.filter(item => {
          if (
            _.isEmpty(item.oAddress) ||
            _.isEmpty(item.oAddress.lat) ||
            _.isEmpty(item.oAddress.lng)
          ) {
            return false;
          }
          return true;
        });
      },
      immediate: true,
      deep: true
    },
    latLng: {
      handler(latLng) {
        if (
          !_.isUndefined(latLng.lat) &&
          !_.isUndefined(latLng.lng) &&
          latLng.lat !== "" &&
          latLng.lng !== ""
        ) {
          this.flyTo(latLng);
        }
      }
    }
  },
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    mouseOnItem: {
      type: Object,
      default: () => {}
    },
    mouseLeaveItem: {
      type: Object,
      default: () => {}
    },
    panTo: {
      type: Object,
      default: () => {}
    },
    maxZoom: {
      type: Number,
      default: 24
    },
    minZoom: {
      type: Number,
      default: 0
    },
    defaultZoom: {
      type: Number,
      default: 10
    },
    markerUrl: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "wil-map-container"
    },
    mapStyle: {
      type: String,
      default: "mapbox://styles/mapbox/streets-v11"
    },
    markerSvg: {
      type: String,
      default: ""
    },
    accessToken: {
      type: String,
      required: true
    },
    restrict: {
      type: String,
      default: ""
    },
    settings: {
      type: Object,
      default: () => {}
    },
    isAutoOpenMap: {
      type: Boolean,
      default: true
    },
    rawItems: {
      type: Array,
      default: () => []
    },
    latLng: {
      type: Object,
      default: () => {
        return { lat: "", lng: "" };
      }
    },
    isFullWidth: {
      type: Boolean,
      default: true
    },
    waitBeforeExecuting: {
      type: Number, // milliseconds
      default: 0
    },
    language: {
      type: String,
      default: "en"
    },
    listingGgmapUrl: {
      type: String,
      default: ""
    }
  },
  computed: {
    model: {
      get() {
        return this.latLng;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    parseWrapperClasses() {
      let classes = this.wrapperClasses;
      if (this.isFullWidth) {
        classes = `wil-full-width ${classes}`;
      }
      return classes;
    },
    parseCenter() {
      if (
        !_.isEmpty(this.latLng) &&
        this.latLng.lat.length &&
        this.latLng.lng.length
      ) {
        return this.latLng;
      }

      if (!_.isEmpty(WILOKE_GLOBAL.defaultMapCenter)) {
        return WILOKE_GLOBAL.defaultMapCenter;
      }
      return { lat: 21.027763, lng: 105.83416 };
    },
    parseStyle() {
      if (
        this.settings &&
        this.settings.mapStyle &&
        this.settings.mapStyle.length
      ) {
        return this.settings.mapStyle;
      }

      return _.isUndefined(this.mapStyle) || !this.mapStyle.length
        ? "mapbox://styles/mapbox/streets-v11"
        : this.mapStyle;
    },
    parseAccessToken() {
      if (this.settings && this.settings.accessToken) {
        return this.settings.accessToken;
      }

      return this.accessToken;
    },
    parseMinZoom() {
      if (this.settings && this.settings.minZoom) {
        return parseInt(this.settings.minZoom, 10);
      }
      return this.minZoom;
    },
    parseMaxZoom() {
      if (this.settings && this.settings.maxZoom) {
        return parseInt(this.settings.maxZoom, 10);
      }
      return this.maxZoom;
    },
    parseDefaultZoom() {
      if (this.settings && this.settings.defaultZoom) {
        return parseInt(this.settings.defaultZoom, 10);
      }
      return this.defaultZoom;
    },
    parseMarkerUrl() {
      if (this.settings && this.settings.markerUrl) {
        return this.settings.markerUrl;
      }
      return this.markerUrl;
    },
    parseLanguage() {
      if (this.settings && this.settings.language) {
        return this.settings.language;
      }
      return this.language;
    },
    parseToken() {
      if (this.settings && this.settings.accessToken) {
        return this.settings.accessToken;
      }
      return this.accessToken;
    },
    parseRestrict() {
      if (this.settings && this.settings.restrict) {
        return this.settings.restrict;
      }
      return this.restrict;
    }
  },
  methods: {
    isMarkerAdded(postID) {
      return this.markersCollection[postID];
    },
    correctLatLng(latLng) {
      return {
        lat: parseFloat(latLng.lat, 10),
        lng: !!latLng.lon
          ? parseFloat(latLng.lon, 10)
          : parseFloat(latLng.lng, 10)
      };
    }
  },
  created() {
    this.isOpenMap = this.isAutoOpenMap;
  }
};
