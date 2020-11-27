<template>
  <div :class="wrapperClass">
    <div class="row">
      <div v-if="!isMapbox" class="col-md-4 col-lg-4">
        <div class="field_wrap__Gv92k">
          <input
            v-if="settings.isRequired=='yes'"
            v-model="address"
            id="wilcity-address-field"
            class="field_field__3U_Rt"
            type="text"
            @keyup="findGeocode"
            required
          />
          <input
            v-else
            id="wilcity-address-field"
            v-model="address"
            class="field_field__3U_Rt"
            type="text"
            @keyup="findGeocode"
          />
          <span :class="labelClass">{{settings.label}}</span>
          <span class="bg-color-primary"></span>
          <div class="field_right__2qM90 pos-a-center-right">
            <span class="field_icon__1_sOi">
              <i class="la la-map-marker"></i>
            </span>
          </div>
        </div>
      </div>
      <wiloke-auto-complete
        v-else
        wrapper-class="col-md-4 col-lg-4"
        :settings="{value:address, isRequired:settings.isRequired=='yes', placeholder:settings.label}"
        v-on:geocode-changed="onAddressChanged"
      ></wiloke-auto-complete>
      <div class="col-md-4 col-lg-4">
        <wiloke-input :settings="oLatitude" v-on:inputChanged="updateLat"></wiloke-input>
      </div>
      <div class="col-md-4 col-lg-4">
        <wiloke-input :settings="oLongitude" v-on:inputChanged="updateLng"></wiloke-input>
      </div>
    </div>
    <div v-if="hasGoogleAPI" id="wilcity-show-map" class="field_map__2UiNc"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import WilokeInput from "./WilokeInput.vue";
import WilokeAutoComplete from "./WilokeAutoComplete.vue";

export default {
  data() {
    return {
      oLatLng: {
        lat: this.settings.lat,
        lng: this.settings.lng
      },
      address: "",
      oMap: null,
      instMarker: null,
      instGeocode: null,
      defaultClass: "field_module__1H6kT field_style2__2Znhe mb-15"
    };
  },
  components: {
    WilokeInput,
    WilokeAutoComplete
  },
  computed: {
    wrapperClass() {
      return this.address.length ||
        this.oLatLng.lat !== null ||
        this.oLatLng.lng !== null
        ? this.defaultClass + " active"
        : this.defaultClass;
    },
    labelClass() {
      return this.settings.isRequired == "yes"
        ? "field_label__2eCP7 text-ellipsis required"
        : "field_label__2eCP7 text-ellipsis";
    },
    oLatitude() {
      return {
        value: this.oLatLng.lat,
        label: WILCITY_I18.lat,
        isRequired: this.settings.isRequired
      };
    },
    oLongitude() {
      return {
        value: this.oLatLng.lng,
        label: WILCITY_I18.lng,
        isRequired: this.settings.isRequired
      };
    },
    hasGoogleAPI() {
      return typeof WILOKE_GLOBAL.hasGoogleAPI === "undefined" ||
        WILOKE_GLOBAL.hasGoogleAPI == "no" ||
        WILOKE_GLOBAL.mapType == "mapbox"
        ? false
        : true;
    },
    isMapbox() {
      return (
        typeof WILOKE_GLOBAL.mapType !== "undefined" &&
        WILOKE_GLOBAL.mapType == "mapbox"
      );
    }
  },
  watch: {
    oLatLng: {
      handler(oNewVal) {
        this.settings.value.latLng = oNewVal.lat + "," + oNewVal.lng;
      },
      deep: true
    },
    address: function(newVal) {
      this.settings.value.address = newVal;
    }
  },
  props: ["settings", "isShowingMap"],
  methods: {
    findAddress() {
      if (!this.isMapbox) {
        this.address = document.getElementById("wilcity-address-field").value;
      }
    },
    setLatLng(oLatLng) {
      if (typeof oLatLng.lat != "undefined") {
        this.$set(this.oLatLng, "lat", oLatLng.lat);
      }
      if (typeof oLatLng.lng != "undefined") {
        this.$set(this.oLatLng, "lng", oLatLng.lng);
      }

      this.findAddress();
    },
    onAddressChanged(oNewVal) {
      if (oNewVal !== "") {
        let oLatLng = {};

        this.address = oNewVal.address;

        if (typeof oNewVal.lat != "undefined") {
          oLatLng.lat = oNewVal.lat;
        }

        if (typeof oNewVal.lng != "undefined") {
          oLatLng.lng = oNewVal.lng;
        }

        this.setLatLng(oLatLng);
      } else {
        this.address = "";
      }
    },
    updateLat(lat) {
      this.$set(this.oLatLng, "lat", lat);
    },
    updateLng(lng) {
      this.$set(this.oLatLng, "lng", lng);
    },
    decimalAdjust(value, exp) {
      exp = typeof exp !== "undefined" ? exp : -4;
      // If the exp is undefined or zero...
      if (typeof exp === "undefined" || +exp === 0) {
        return Math.round(value);
      }
      value = +value;
      exp = +exp;
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split("e");
      value = Math.round(
        +(value[0] + "e" + (value[1] ? +value[1] - exp : -exp))
      );
      // Shift back
      value = value.toString().split("e");
      return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
    },
    setDefault() {
      if (
        this.settings.value == "" ||
        typeof this.settings.value == "undefined"
      ) {
        this.settings.value = {};
        this.settings.value.address = "";

        if (
          typeof this.settings.defaultLocation != "undefined" &&
          this.settings.defaultLocation != ""
        ) {
          this.settings.value.latLng = this.settings.defaultLocation;
        } else {
          this.settings.value.latLng = "21.027764,105.834160";
        }
      }

      let oParse = this.settings.value.latLng.split(",");
      this.oLatLng.lat = parseFloat(oParse[0].trim());
      this.oLatLng.lng = parseFloat(oParse[1].trim());

      this.address = this.settings.value.address;
      if (typeof this.settings.defaultZoom == "undefined") {
        this.settings.defaultZoom = 8;
      }

      this.settings.defaultZoom = parseInt(this.settings.defaultZoom);
    },
    geocodePosition(pos) {
      this.instGeocode.geocode(
        {
          latLng: pos
        },
        responses => {
          if (responses && responses.length > 0) {
            if (typeof responses[1] !== "undefined") {
              this.address = responses[1].formatted_address;
            } else {
              this.address = responses[0].formatted_address;
            }
          }
        }
      );
    },
    googleMap() {
      if (!this.hasGoogleAPI) {
        return false;
      }

      new Promise((resolve, reject) => {
        if (typeof google !== "undefined") {
          resolve("loaded");
        }
      }).then(msg => {
        this.oMap = new google.maps.Map(
          document.getElementById("wilcity-show-map"),
          {
            zoom: this.settings.defaultZoom,
            center: {
              lat: this.oLatLng.lat,
              lng: this.oLatLng.lng
            }
          }
        );

        this.instMarker = new google.maps.Marker({
          map: this.oMap,
          position: {
            lat: this.oLatLng.lat,
            lng: this.oLatLng.lng
          },
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29)
        });

        this.instGeocode = new google.maps.Geocoder();

        google.maps.event.addListener(this.instMarker, "dragend", oMarker => {
          let oLatLng = oMarker.latLng;
          this.setLatLng({
            lat: this.decimalAdjust(oLatLng.lat()),
            lng: this.decimalAdjust(oLatLng.lng())
          });

          this.geocodePosition(this.oLatLng);
        });
      });
    },
    init() {
      this.googleMap();
    },
    findGeocode() {
      if (this.oMap === null) {
        return false;
      }

      let $addressField = document.getElementById("wilcity-address-field"),
        instAutocomplete = null;

      if (typeof WILOKE_GLOBAL.countryRestriction !== "undefined") {
        instAutocomplete = google.maps.places.Autocomplete($addressField, {
          componentRestrictions: { country: WILOKE_GLOBAL.countryRestriction }
        });
      } else {
        instAutocomplete = new google.maps.places.Autocomplete($addressField);
      }
      instAutocomplete.bindTo("bounds", this.oMap);

      instAutocomplete.addListener("place_changed", () => {
        let oPlace = instAutocomplete.getPlace();

        if (typeof oPlace.formatted_phone_number !== "undefined") {
          this.$parent.$emit("update_phone", oPlace.formatted_phone_number);
        }

        if (typeof oPlace.website !== "undefined") {
          this.$parent.$emit("update_website", oPlace.website);
        }

        if (!oPlace.geometry) {
          return false;
        }

        if (oPlace.geometry.viewport) {
          this.oMap.fitBounds(oPlace.geometry.viewport);
        } else {
          this.oMap.setCenter(oPlace.geometry.location);
          this.oMap.setZoom(17); // Why 17? Because it looks good.
        }

        this.instMarker.setPosition(oPlace.geometry.location);
        this.instMarker.setVisible(true);

        this.setLatLng({
          lat: this.decimalAdjust(oPlace.geometry.location.lat()),
          lng: this.decimalAdjust(oPlace.geometry.location.lng())
        });
      });
    }
  },
  beforeMount() {
    this.setDefault();
  },
  mounted() {
    this.init();
  }
};
</script>
