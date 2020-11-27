<template>
  <div id="single-events" class="single-tab-content">
    <div class="content-box_module__333d9">
      <header-component :settings="oHeaderSettings"></header-component>
      <div class="content-box_body__3tSRB pos-r">
        <div class="row" v-show="content!==''" data-col-xs-gap="10" v-html="content"></div>
        <div v-show="noEventMsg.length" class="text-center mt-20">
          <i style="font-size: 40px;" class="la la-frown-o"></i>
          <p v-html="noEventMsg"></p>
        </div>
        <div :id="generateInfiniteEventID"></div>
        <block-loading :is-loading="isFetching" position="pos-a-center"></block-loading>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderComponent from "./header.vue";
import Message from "./../shortcodes/WilokeMessage.vue";
import { mapState } from "vuex";
import BlockLoading from "../shortcodes/BlockLoading.vue";

export default {
  data() {
    return {
      oHeaderSettings:
        WILCITY_SINGLE_LISTING_SETTINGS.navigation.items.draggable.events,
      key: "events",
      isLoaded: false,
      isFetching: "no",
      content: "",
      oWaypoint: null,
      noEventMsg: "",
      aPostIDs: []
    };
  },
  computed: {
    generateInfiniteEventID() {
      return WHITE_LABEL + "-infinite-events";
    }
  },
  components: {
    HeaderComponent,
    BlockLoading,
    Message
  },
  methods: {
    fetchContent() {
      if (this.isLoaded) {
        return true;
      }
      this.$root.componentLoading = this.key;
      this.isFetching = "yes";
      this.$root.ajaxFetching = jQuery.ajax({
        type: "GET",
        url:
          WILOKE_GLOBAL.ajaxurl +
          "?action=wilcity_fetch_events&parentID=" +
          WILOKE_INLINE_GLOBAL.postID +
          "&postNotIn=" +
          this.aPostIDs,
        success: response => {
          if (response.success) {
            this.content += response.data.content;
            this.$root.componentLoading = "";
            this.aPostIDs = this.aPostIDs.concat(response.data.postIDs);
            this.infiniteEvents();
            this.$nextTick(() => {
              lazyLoad(
                jQuery("#single-events").find("." + WHITE_LABEL + "-lazyload")
              );
            });
          } else {
            if (
              typeof response.data.isLoaded !== "undefined" &&
              response.data.isLoaded == "yes"
            ) {
              this.isLoaded = true;
            } else {
              this.noEventMsg = response.data.msg;
            }

            if (this.oWaypoint !== null) {
              this.oWaypoint.destroy();
            }

            if (WilCityHelpers.isMobile()) {
              WilCityHelpers.scrollTop(
                "html, body",
                jQuery("#single-events").offset().top
              );
            }
          }
          this.isFetching = "no";
        }
      });
    },
    infiniteEvents() {
      let self = this;
      this.oWaypoint = new Waypoint({
        element: document.getElementById(this.generateInfiniteEventID),
        handler: direction => {
          if (direction == "down") {
            self.fetchContent();
          }
        },
        offset: 20
      });
    }
  }
};
</script>
