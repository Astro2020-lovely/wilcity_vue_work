<template>
  <div class="content-box_body__3tSRB">
    <wil-alert
      v-if="errMsg.length && !content.length"
      :msg="errMsg"
      type="white"
    />
    <wil-block-loading :is-loading="isLoading" />
    <div
      class="row"
      v-if="content.length"
      data-col-xs-gap="10"
      v-html="content"
    ></div>
    <div :id="infiniteScrollId"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "wil-single-nav-posts",
  data() {
    return {
      isLoading: false,
      errMsg: "",
      oWaypoint: null,
      maxPages: 1
    };
  },
  computed: {
    infiniteScrollId() {
      return `${this.tabKey}-infinite-posts`;
    },
    content() {
      return this.$store.getters["ModuleSingleListing/getTabContent"](
        this.tabKey,
        ""
      );
    },
    page() {
      return this.$store.getters["ModuleSingleListing/getTabValue"](
        this.tabKey,
        "page",
        1
      );
    },
    ...mapGetters({
      currentTab: "ModuleSingleListing/getCurrentTab"
    })
  },
  watch: {
    currentTab: {
      handler(tab) {
        if (tab === this.tabKey) {
          if (!this.content.length) {
            this.fetchContent();
          } else {
            this.isLoading = false;
          }
        }
      },
      immediate: true
    }
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    settings: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      required: false
    },
    ajaxAction: {
      type: String,
      default: "wilcity_fetch_events"
    },
    tabKey: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions("ModuleSingleListing", [
      "updateTabContent",
      "updateTabValue"
    ]),
    fetchContent() {
      this.isLoading = true;
      let args = {
        action: this.ajaxAction,
        parentID: this.postId,
        page: this.page
      };
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl(args)
      })
        .then(response => {
          if (response.data.success) {
            this.maxPages = response.data.data.maxPages;
            this.updateTabContent({
              content: `${this.content} ${response.data.data.content}`,
              tabKey: this.tabKey
            });

            this.updateTabValue({
              key: "page",
              value: this.page + 1,
              tabKey: this.tabKey
            });

            if (this.maxPages > this.page) {
              this.infinitePosts();
            }

            this.$nextTick(function() {
              lazyLoad(jQuery(this.$el).find("." + WHITE_LABEL + "-lazyload"));
            });
          } else {
            if (response.data.data.msg) {
              this.errMsg = response.data.data.msg;
            }
            if (this.oWaypoint !== null) {
              this.oWaypoint.destroy();
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    infinitePosts() {
      let self = this;
      this.oWaypoint = new Waypoint({
        element: document.getElementById(this.infiniteScrollId),
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
