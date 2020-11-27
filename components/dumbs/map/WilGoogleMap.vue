<template>
  <div
    :id="googleMapID"
    v-show="isOpenMap"
    ref="googleMap"
    :class="parseWrapperClasses"
  ></div>
</template>
<style>
.wil-full-width {
  overflow: hidden;
}
</style>
<script>
import loadGoogleMapsApi from "load-google-maps-api";
import MapHelpers from "./MapHelpers";
import { CreateHTMLMapMarker } from "./CreateHTMLMapMarker";
import { CustomToggleFreshMapButton } from "./CustomToggleFreshMapButton.js";
import { PopupTemplate } from "./PopupTemplate";
import { GoogleMapStyle } from "./GoogleMapStyle";
import "snazzy-info-window/dist/snazzy-info-window.min.css";

export default {
  name: "wil-google-map",
  props: {
    mapStyle: {
      type: String,
      default: ""
    }
  },
  mixins: [MapHelpers, PopupTemplate, GoogleMapStyle],
  data() {
    return {
      SnazzyInfoWindow: {}
    };
  },
  computed: {
    googleMapID() {
      let timestamp = new Date().getTime();
      return `wil-googlemap-${timestamp}`;
    },
    queryArgs() {
      let args = `access_token=${this.parseAccessToken}&limit=1`;
      if (this.language.length) {
        args = `${args}&language=${this.language}`;
      }
      return args;
    }
  },
  methods: {
    getStyles() {
      if (this.mapStyle === "custom") {
        return WILCITY_CUSTOM_MAP;
      }

      return this.mapStyles[this.mapStyle]
        ? this.mapStyles[this.mapStyle]
        : this.mapStyles.blurWater;
    },
    addMarker(item) {
      let markerInfo = {
        position: this.correctLatLng(item.oAddress),
        map: this.instance,
        title: item.title
      };
      if (item.logo.length) {
        markerInfo.icon = item.logo;
      }
      // console.log(google);
      const instLatLng = new google.maps.LatLng(
        this.correctLatLng(item.oAddress)
      );
      const logoUrl = item.logo.length ? item.logo : item.featuredImage;
      const marker = new CreateHTMLMapMarker({
        latLng: instLatLng,
        map: this.instance,
        marker_id: item.markerID,
        logoUrl: logoUrl,
        item,
        markerSvg: this.markerSvg
      });

      // Add a Snazzy Info Window to the marker
      const infowindow = new this.SnazzyInfoWindow({
        position: instLatLng,
        marker,
        placement: "right",
        panOnOpen: false,
        offset: {
          left: "23px",
          top: "-35px"
        },
        content: this.buildPopupTemplate(item),
        showCloseButton: true,
        closeOnMapClick: true,
        padding: "0px",
        border: false,
        borderRadius: "0px",
        shadow: false,
        callbacks: {
          afterClose: () => {
            marker.setMap(this.instance);
          },
          afterOpen: () => {
            marker.setMap(null);
          }
        }
      });

      marker.addListener("click", event => {
        infowindow.open();
        this.isShowingPopupID = item.postID;
      });

      this.markersCollection = {
        ...this.markersCollection,
        [item.postID]: {
          postID: item.postID,
          marker: marker,
          infowindow
        }
      };
    },
    togglePopup(postID) {
      if (this.isMarkerAdded(postID)) {
        if (postID === this.isShowingPopupID) {
          this.markersCollection[postID].infowindow.close();
        } else {
          this.markersCollection[postID].infowindow.open();
        }
        this.isShowingPopupID = postID;
      }
    },
    addLayers(items) {
      return new Promise((resolve, reject) => {
        items.map(item => {
          if (!this.isMarkerAdded[item.postID]) {
            const markerId = parseInt(item.postID, 10) + 10000;
            item = {
              ...item,
              markerID: `wilcity-${markerId}`
            };
            this.addMarker(item);
          }
          return item;
        });
        resolve(items);
      });
    },
    buildMapLayers() {
      if (!this.items.length) {
        this.notifyMsg({
          type: "info",
          msg:
            "There is no item or the item does not have Latitude and Longitude"
        });
        return false;
      }
      this.addLayers(this.items).then(items => {
        const firstItem = this.correctLatLng(items[0].oAddress);
        this.flyTo(firstItem);
      });
    },
    getAddress(latLng) {
      return new Promise((resolve, reject) => {
        this.instGeocode.geocode({ latLng }, (response, status) => {
          let address = {};
          if (status === "OK") {
            if (!_.isEmpty(response)) {
              if (!_.isUndefined(response[1])) {
                address = {
                  ...latLng,
                  address: response[1].formatted_address
                };
              } else {
                address = {
                  ...latLng,
                  address: response[0].formatted_address
                };
              }
            }
            resolve(address);
          } else {
            reject("nofound");
          }
        });
      });
    },
    addMoveMapWhenHoveringControl() {
      const centerControlDiv = document.createElement("div");
      const centerControl = new CustomToggleFreshMapButton(
        centerControlDiv,
        WILCITY_I18.searchAsIMoveTheMap
      );

      centerControlDiv.className = "wilcity-wrapper-search-as-move-map";
      centerControlDiv.index = 1;

      this.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(
        centerControlDiv
      );
      let self = this;
      centerControl.handling = function(isChecked) {
        self.isSearchAsIMoveTheMap = isChecked;
      };
    },
    decimalAdjust(value, exp) {
      exp = exp ? exp : -4;
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
    searchOnMapMove() {
      let handleGetBound = null;
      this.instance.addListener("dragend", () => {
        if (!this.isSearchAsIMoveTheMap) {
          return false;
        }

        if (handleGetBound !== null) {
          clearTimeout(handleGetBound);
        }

        handleGetBound = setTimeout(() => {
          const bounds = this.instance.getBounds();
          const boundValue = {
            aFLatLng: {
              lat: bounds.getSouthWest().lat(),
              lng: bounds.getSouthWest().lng()
            },
            aSLatLng: {
              lat: bounds.getNorthEast().lat(),
              lng: bounds.getNorthEast().lng()
            }
          };
          this.$emit("dragend", { bound: boundValue });
          clearTimeout(handleGetBound);
        }, 1000);
      });
    },
    addGetDirectionControl() {
      if (!this.listingGgmapUrl.length) {
        return false;
      }

      const controlUI = document.createElement("div");
      controlUI.className = "wil-get-direction-button-wrapper";
      controlUI.style.top = "10px";
      controlUI.style.left = "10px";

      const icon = document.createElement("i");
      icon.className = "fa fa-map wil-get-direction-icon";

      const linkEl = document.createElement("a");
      linkEl.innerHTML = WILCITY_I18.getDirection;

      linkEl.href = this.listingGgmapUrl;
      linkEl.target = "_blank";
      linkEl.style.color = "#fff";

      controlUI.appendChild(icon);
      controlUI.appendChild(linkEl);

      this.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(
        controlUI
      );
    },

    flyTo(lngLat) {
      if (this.instance) {
        const center = {
          lat: this.decimalAdjust(lngLat.lat),
          lng: this.decimalAdjust(lngLat.lng)
        };
        this.instance.panTo(center);
        if (!!this.marker) {
          this.marker.setPosition(center);
        }
      }
    },
    addSingleMarker() {
      this.marker = new google.maps.Marker({
        map: this.instance,
        position: {
          lat: this.decimalAdjust(this.parseCenter.lat),
          lng: this.decimalAdjust(this.parseCenter.lng)
        },
        optimized: false,
        draggable: typeof WILCITY_ADDLISTING_INLINE != "undefined",
        icon: !this.parseMarkerUrl.length
          ? ""
          : {
              url: this.parseMarkerUrl,
              size: new google.maps.Size(36, 36),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(18, 18),
              scaledSize: new google.maps.Size(36, 36)
            }
      });

      this.instGeocode = new google.maps.Geocoder();
      google.maps.event.addListener(this.marker, "dragend", async e => {
        const latLng = {
          lat: this.decimalAdjust(e.latLng.lat()),
          lng: this.decimalAdjust(e.latLng.lng())
        };
        const address = await this.getAddress(latLng);

        if (address !== null) {
          this.model = {
            ...address
          };
        }
      });

      this.addGetDirectionControl();
    },
    init() {
      if (!_.isEmpty(this.instance)) {
        return false;
      }

      loadGoogleMapsApi({
        key: this.parseAccessToken,
        language: this.parseLanguage
      })
        .then(googleMaps => {
          const center = {
            lat: this.decimalAdjust(this.parseCenter.lat),
            lng: this.decimalAdjust(this.parseCenter.lng)
          };
          const config = {
            zoom: this.parseDefaultZoom,
            center,
            key: this.parseAccessToken,
            language: this.parseLanguage,
            styles: this.getStyles()
          };

          this.instance = new google.maps.Map(this.$refs.googleMap, config);
          // console.log(this.isMultiple);
          if (this.isMultiple) {
            this.SnazzyInfoWindow = require("snazzy-info-window");
            this.buildMapLayers();
            this.addMoveMapWhenHoveringControl();
            this.searchOnMapMove();
          } else {
            this.addSingleMarker();
          }
        })
        .catch(e => {
          alert(e);
        });
    }
  }
};
</script>
