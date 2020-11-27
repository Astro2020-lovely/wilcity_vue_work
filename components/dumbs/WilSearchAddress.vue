<template>
  <div :class="wrapperClasses">
    <div class="row mb-30">
      <div class="col-md-12 wil-google-address-wrapper">
        <wil-auto-complete
          wrapper-classes="field_module__1H6kT field_style2__2Znhe mb-15 wil-auto-complete-on-addlisting"
          :settings="settings"
          :placeholder="parseAddress"
          :focus-search-by-map="true"
          :has-loading-icon="true"
          :is-required="isRequired"
          :value="defaultSearch"
          @change="handleAutoCompleteChange"
        />
      </div>
    </div>

    <div class="row mb-30 wil-lat-lng-wrapper">
      <div class="col-md-6 col-lg-6">
        <wil-input
          :label="latLabel | filterTranslation('lat')"
          :value="parseLat"
          v-on="{ change: handleFieldChange('lat') }"
          :is-required="isRequired"
        />
      </div>
      <div class="col-md-6 col-lg-6">
        <wil-input
          :label="lngLabel | filterTranslation('lng')"
          :value="parseLng"
          v-on="{ change: handleFieldChange('lng') }"
          :is-required="isRequired"
        />
      </div>
      <div v-if="parseRequired" class="col-md-12">
        <wil-field-error-msg
          v-show="errMsg.length"
          :msg="errMsg | filterTranslation('addLatLngRequiredText')"
        />
      </div>
    </div>
    <div v-if="parseMapSuggestion" class="row">
      <div class="col-md-12 wil-map-wrapper">
        <wil-mapbox
          v-if="parseMapType === 'mapbox'"
          :access-token="accessToken"
          :lat-lng="parseLatLng"
          :settings="settings"
          :wait-before-executing="5000"
          :pan-to="mapPanTo"
          @change="handleDragEnd"
        />
        <wil-google-map
          v-else-if="parseMapType === 'google_map'"
          :access-token="accessToken"
          :lat-lng="parseLatLng"
          :settings="settings"
          :wait-before-executing="5000"
          :pan-to="mapPanTo"
          @change="handleDragEnd"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
/deep/ .wil-full-width {
  width: 100% !important;
  height: 250px;
}

/deep/ .marker img {
  max-width: 25px;
}
</style>
<script>
import WilAutoComplete from "./WilAutoComplete.vue";
export default {
  name: "wil-search-address",
  data() {
    return {
      mapPanTo: {}
    };
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    accessToken: {
      type: String,
      default: ""
    },
    hasMap: {
      // Search Map Drag & Drop or not
      type: Boolean,
      default: true
    },
    mapType: {
      // Google Map or Mapbox
      type: String,
      default: ""
    },
    isMapSuggestion: {
      type: Boolean,
      default: false
    },
    wrapperClasses: {
      type: String,
      default: "wil-search-address"
    },
    label: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => {
        return {
          lat: "",
          lng: "",
          address: ""
        };
      }
    },
    defaultSearch: {
      type: String,
      default: ""
    },
    latLabel: {
      type: String,
      default: "Latitude"
    },
    lngLabel: {
      type: String,
      default: "Longitude"
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  components: {
    WilMapbox: () =>
      import(/* webpackChunkName: "WilMapbox" */ "./map/WilMapbox.vue"),
    WilAutoComplete,
    WilGoogleMap: () =>
      import(/* webpackChunkName: "WilGoogleMap" */ "./map/WilGoogleMap.vue")
  },
  computed: {
    errMsg() {
      const msg = "The address, latitude and longitude are required";
      if (!this.model.lat || !this.model.lng || !this.model.address) {
        return msg;
      }

      if (
        !this.model.lat.toString().length ||
        !this.model.lng.toString().length ||
        !this.model.address.length
      ) {
        return msg;
      }

      return "";
    },
    parseRequired() {
      if (this.settings && this.settings.isRequired) {
        return this.settings.isRequired;
      }

      return this.isRequired;
    },
    parseAddress() {
      return this.model && !_.isEmpty(this.model.address)
        ? this.model.address
        : this.label;
    },
    parseLat() {
      return this.model ? this.model.lat : "";
    },
    parseLng() {
      return this.model ? this.model.lng : "";
    },
    parseMapType() {
      if (this.settings && this.settings.mapType) {
        return this.settings.mapType;
      }

      return this.mapType;
    },
    parseMapSuggestion() {
      if (this.settings && this.settings.isMapSuggestion) {
        return this.settings.isMapSuggestion === "yes";
      }

      return this.isMapSuggestion;
    },
    parseLatLng() {
      if (!!this.model.lat) {
        return { lat: this.model.lat, lng: this.model.lng };
      }

      if (!_.isEmpty(this.settings.defaultLocation)) {
        const parseLatLng = this.settings.defaultLocation.split(",");
        return {
          lat: parseLatLng[0],
          lng: parseLatLng[1]
        };
      }
      return { lat: "21.027763", lng: "105.834160" };
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  methods: {
    handleDragEnd(val) {
      this.model = {
        ...this.model,
        ...val
      };
    },
    handleFieldChange(key) {
      return val => {
        this.model = {
          ...this.model,
          [key]: val
        };
      };
    },
    handleAutoCompleteChange(val) {
      if (val.item) {
        const {
          item: {
            name,
            coordinate: { lat, lng }
          }
        } = val;

        this.model = {
          address: name,
          lat,
          lng
        };

        this.mapPanTo = {
          lat,
          lng
        };
      }
    }
  },
  mounted() {}
};
</script>
