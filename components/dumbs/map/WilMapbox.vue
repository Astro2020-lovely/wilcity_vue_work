<template>
  <div :id="mapboxID" v-show="isOpenMap" :class="parseWrapperClasses"></div>
</template>
<style>
.wil-full-width {
  overflow: hidden;
}

@media (min-width: 1200px) {
  .wil-box01 {
    position: relative;
    max-width: 820px;
    width: auto;
    z-index: 10;
  }
}

@media (min-width: 1200px) {
  .wil-box02 {
    width: calc(100% - 820px);
    height: 100vh;
  }
}

.wil-show-map {
  position: static;
}

.wil-mapbox-popup {
  left: 50px;
}
</style>
<script>
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import "mapbox-gl/dist/mapbox-gl.css";
import MapHelpers from "./MapHelpers";
import { PopupTemplate } from "./PopupTemplate.js";
import { CustomToggleFreshMapButton } from "./CustomToggleFreshMapButton.js";

export default {
  name: "wil-mapbox",
  mixins: [MapHelpers, PopupTemplate],
  computed: {
    mapboxID() {
      let timestamp = new Date().getTime();
      return `wil-mapbox-${timestamp}`;
    },
    queryArgs() {
      let args = `access_token=${this.parseAccessToken}&limit=1`;
      if (this.parseLanguage.length) {
        args = `${args}&language=${this.parseLanguage}`;
      }
      return args;
    }
  },
  created() {
    this.getMapSizeIcon();
  },
  methods: {
    addMoveMapWhenHoveringControl() {
      let self = this;
      this.instance.addControl(
        {
          onAdd($map) {
            self.moveOnMapControl = document.createElement("div");
            self.moveOnMapControl.className =
              "wilcity-wrapper-search-as-move-map mapboxgl-ctrl";
            let centerControl = new CustomToggleFreshMapButton(
              self.moveOnMapControl,
              WILCITY_I18.searchAsIMoveTheMap
            );

            centerControl.handling = isChecked => {
              self.isSearchAsIMoveTheMap = isChecked;
            };

            return self.moveOnMapControl;
          },
          onRemove() {
            self.moveOnMapControl.parentNode.removeChild(self.moveOnMapControl);
            self.instance = undefined;
          }
        },
        "top-left"
      );
    },
    prepareNewLayers(newItems) {
      let markers = {
        type: "FeatureCollection",
        features: []
      };

      newItems.map(item => {
        markers = {
          ...markers,
          features: [...markers.features, this.addLayer(item)]
        };
      });

      return markers;
    },
    searchOnMapMove() {
      let handleGetBound = {};
      this.instance.on("dragend", event => {
        if (!this.isSearchAsIMoveTheMap) {
          return false;
        }

        if (!_.isEmpty(handleGetBound)) {
          clearTimeout(handleGetBound);
        }
        handleGetBound = setTimeout(() => {
          this.isDropping = true;
          const bounds = this.instance.getBounds();
          const southWest = bounds.getSouthWest();
          const northEst = bounds.getNorthEast();

          const boundValue = {
            aFLatLng: {
              lat: southWest.lat,
              lng: southWest.lng
            },
            aSLatLng: {
              lat: northEst.lat,
              lng: northEst.lng
            }
          };
          this.$emit("dragend", { bound: boundValue });
          clearTimeout(handleGetBound);
        });
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
      // Getting listings on the page 1
      const markers = this.prepareNewLayers(this.items);
      const latLng = this.addMarkers(markers);
      this.flyTo(latLng);
    },
    addLayer(item) {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: {
            lat: parseFloat(item.oAddress.lat),
            lon: parseFloat(item.oAddress.lng)
          }
        },
        properties: {
          iconSize: [50, 50],
          marker: item.oAddress.marker,
          item: item
        }
      };
    },
    getMapSizeIcon() {
      if (
        typeof WILOKE_GLOBAL === undefined ||
        _.isEmpty(WILOKE_GLOBAL.mapSizeIcon)
      ) {
        this.iconSize = {
          width: "100px",
          height: "100px"
        };
      } else {
        const parseIconSize = WILOKE_GLOBAL.mapSizeIcon.split("x");
        this.iconSize = {
          width: parseIconSize[0] + "px",
          height: parseIconSize[1] + "px"
        };
      }
    },
    createPopup(marker) {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(" + marker.properties.marker + ")";
      el.style.backgroundRepeat = "no-repeat";
      el.style.width = this.iconSize.width;
      el.style.height = this.iconSize.height;

      const $markerPopup = new mapboxgl.Popup({
        offset: 10,
        postID: marker.properties.item.postID,
        anchor: "bottom",
        closeButton: false,
        className: "wil-mapbox-popup"
      })
        .setLngLat([
          marker.geometry.coordinates.lon,
          marker.geometry.coordinates.lat
        ])
        .setHTML(this.buildPopupTemplate(marker.properties.item));

      $markerPopup.on("open", e => {
        this.isShowingPopupID = e.target.options.postID;
      });

      return { el, marker: $markerPopup };
    },
    togglePopup(postID) {
      if (this.isMarkerAdded(postID)) {
        this.markersCollection[postID].togglePopup();
        this.isShowingPopupID = postID;
      }
    },
    addGetDirectionButton() {
      if (!this.listingGgmapUrl.length) {
        return false;
      }

      this.instance.addControl(
        {
          onAdd: $map => {
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

            return controlUI;
          }
        },
        "top-left"
      );
    },

    addMarkers(markers) {
      markers.features.forEach(marker => {
        const postID = marker.properties.item.postID;
        if (!this.isMarkerAdded(postID)) {
          const popup = this.createPopup(marker);
          // add marker to map
          const myMarker = new mapboxgl.Marker(popup.el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(popup.marker)
            .addTo(this.instance);
          this.markersCollection = {
            ...this.markersCollection,
            [postID]: myMarker
          };
        }
      });

      return markers.features[0].geometry.coordinates;
    },
    async getAddress(lngLat) {
      const baseURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?${this.queryArgs}`;
      let address = null;
      await Vue.axios
        .get(baseURL)
        .then(response => {
          if (response.data.features.length) {
            const info = response.data.features[0];
            address = {
              lat: info.center[1],
              lng: info.center[0],
              address: info.place_name
            };
          }
        })
        .catch(function(error) {});
      return address;
    },
    async determineAddress(lngLat) {
      const address = await this.getAddress(lngLat);
      if (address === null) {
        this.model = {
          ...this.model,
          address: "",
          lng: lngLat.lng,
          lat: lngLat.lat
        };
      } else {
        this.model = {
          ...address
        };
      }
    },
    flyTo(lngLat) {
      // console.log(this.instance);
      if (this.instance !== null) {
        this.instance.flyTo({ center: lngLat });
        if (this.marker) {
          this.marker.setLngLat(lngLat);
        }
      }
    },
    addSingleMarker() {
      const markerParams = {
        draggable: true,
        anchor: "center"
      };
      if (this.parseMarkerUrl.length) {
        let el = document.createElement("div");
        el.className = "marker";
        let img = document.createElement("img");
        img.src = this.parseMarkerUrl;
        el.style.width = this.iconSize.width;
        el.style.height = this.iconSize.height;
        el.appendChild(img);
        markerParams.element = el;
      }
      this.marker = new mapboxgl.Marker(markerParams)
        .setLngLat([this.parseCenter.lng, this.parseCenter.lat])
        .addTo(this.instance);

      this.marker.on("dragend", () => {
        this.determineAddress(this.marker.getLngLat());
      });
    },
    init() {
      if (this.instance !== null) {
        return false;
      }
      // this.instance = "Running...";
      setTimeout(() => {
        mapboxgl.accessToken = this.parseAccessToken;
        this.instance = new mapboxgl.Map({
          container: this.mapboxID,
          style: this.parseStyle,
          center: [this.parseCenter.lng, this.parseCenter.lat],
          // hash: true,
          zoom: this.parseDefaultZoom,
          minZoom: this.parseMinZoom,
          maxZoom: this.parseMaxZoom
        });
        this.instance.addControl(new mapboxgl.NavigationControl());
        this.instance.addControl(new mapboxgl.FullscreenControl());

        this.instance.on("click", e => {
          if (this.marker) {
            this.flyTo(e.lngLat);
            this.marker.setLngLat([lngLat.lng, lngLat.lat]);
            this.determineAddress(e.lngLat);
          }
        });

        // Listings on Map
        if (this.isMultiple) {
          this.buildMapLayers();
          this.addMoveMapWhenHoveringControl();
          this.searchOnMapMove();

          setTimeout(() => {
            jQuery(window).trigger("resize");
          }, 1000);
        } else {
          // single map (Map on Listing Sidebar)
          this.addSingleMarker();
          this.addGetDirectionButton();
        }
      }, this.waitBeforeExecuting);
    }
  },
  mounted() {
    this.isOpenMap = this.isAutoOpenMap;
  }
};
</script>
