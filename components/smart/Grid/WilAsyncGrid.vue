<template>
  <div :class="[wrapperClasses]">
    <slot
      name="before-grid"
      :is-loading="isLoading"
      :is-loaded="isLoaded"
      :max-pages="maxPages"
    ></slot>
    <wil-alert
      v-if="focusErrorMsg.length"
      :msg="focusErrorMsg"
      type="danger"
      style="margin-bottom: 20px"
    />
    <slot v-if="hasPrev" name="prev-grid">
      <div class="wil-load__btn prev">
        <a href="#" class="color-primary" @click.prevent="goToPrevPage">
          <i class="fa fa-angle-left"></i>
        </a>
      </div>
    </slot>

    <wil-grid-skeleton
      v-if="isLoading"
      :type="type"
      :column-classes="columnClasses"
      :items-per-row="skeletonItems"
    />

    <slot v-if="hasNext" name="next-grid">
      <div class="wil-load__btn next">
        <a href="#" class="color-primary" @click.prevent="goToNextPage">
          <i class="fa fa-angle-right"></i>
        </a>
      </div>
    </slot>
    <wil-alert v-if="errMsg.length" :msg="errMsg" />
    <wil-grid
      v-else-if="!isLoading && items.length"
      :items="items"
      :column-classes="parseColumnClasses"
      :type="type"
      wrapper-classes="wil-grid-wrapper"
      row-classes="wil-flex-wrap"
    >
      <template v-slot:griditem="{ item, isLoading, index, type }">
        <component
          :is="determineItemComponent(item.postType)"
          :item="item"
          v-on:mouseover.native="handleMouseOn(item)"
          v-on:mouseleave.native="handleMouseLeave(item)"
          :type="type"
          v-on="{ change: handleItemChange(index) }"
          :mygeocoder="queryArgs.oAddress"
        ></component>
      </template>
    </wil-grid>
    <slot
      name="after-grid"
      :max-pages="maxPages"
      :query="queryArgs"
      :page="currentPage"
      :is-loading="isLoading"
      :posts-per-page="postsPerPage"
    ></slot>
  </div>
</template>
<style scoped>
.btn-navigation-listing_module__1udLA {
  left: -35px;
}

.btn-navigation-listing_reverse__POUCY {
  right: -35px;
  left: auto;
}
</style>
<script lang="javascript">
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
export default {
  name: "wil-async-grid",
  data() {
    return {
      items: [],
      isLoaded: false,
      isLoading: false,
      isWaiting: true,
      // parsedQueryArgs: {},
      errMsg: "",
      maxPages: 0,
      maxPosts: 0,
      xhr: null,
      postsPerPage: 0,
      CancelToken: null,
      cancelToken: null,
      canNotRandomOrderby: ["best_rated", "best_viewed"]
    };
  },
  mounted() {
    // console.log(this.queryArgs);
  },
  components: {
    WilGrid: () =>
      import(
        /*webpackChunkName: "WilGrid" */
        /*webpackPreload: true */
        "./WilGrid.vue"
      ),
    WilGridItem: () =>
      import(
        /*webpackChunkName: "WilGridItem" */
        /*webpackPreload: true */
        "./WilGridItem.vue"
      ),
    WilGridSkeleton: () =>
      import(
        /*webpackChunkName: "WilGridSkeleton" */
        /*webpackPreload: true */
        "./../../dumbs/loading/GridSkeleton.vue"
      )
  },
  computed: {
    currentPage() {
      let page = 1;
      if (!_.isUndefined(this.queryArgs.offset) ) {
        page = this.queryArgs.offset;
      } else if (!_.isUndefined(this.queryArgs.page)) {
        page = this.queryArgs.page;
      }

      return parseInt(page, 10);
    },
    parseIsAutoPostsPerPage() {
      if (this.isAutoPostsPerPage) {
        return true;
      }

      return (
        _.isUndefined(this.queryArgs.postsPerPage) ||
        Number.isNaN(this.queryArgs.postsPerPage) ||
        this.queryArgs.postsPerPage === 0
      );
    },
    parseColumnClasses() {
      if (this.type === "grid") {
        return this.columnClasses;
      }

      return "col-xs-12 col-sm-12 col-md-12 col-lg-12";
    },
    hasRandomPremium() {
      if (!this.isRandomPremium) {
        return "no";
      }

      const hasDisableRandomOrderby = this.canNotRandomOrderby.some(item => {
        return this.queryArgs[item] && this.queryArgs[item] === "yes";
      });

      if (hasDisableRandomOrderby) {
        return "no";
      }

      return this.queryArgs.orderby &&
        this.canNotRandomOrderby.includes(this.queryArgs.orderby)
        ? "no"
        : "yes";
    },
    skeletonItems() {
      const total = this.items.length;
      if (total > this.itemsPerRow) {
        return total;
      }

      return this.itemsPerRow;
    },
    itemsPerRow() {
      return wilGridHelper.findItemsPerRow(this.columnClasses);
    },
    hasPrev() {
      return this.isNavigation === "yes" && this.currentPage > 1;
    },
    hasNext() {
      return (
        this.isNavigation === "yes" &&
        this.maxPages > 0 &&
        this.currentPage < this.maxPages
      );
    }
  },
  created() {
    this.CancelToken = Vue.axios.CancelToken;
    this.cancelToken = this.CancelToken.source();

    if (this.parseIsAutoPostsPerPage) {
      this.postsPerPage = this.itemsPerRow;
    } else {
      this.postsPerPage = this.queryArgs.postsPerPage;
    }
    this.fetchListings();
  },
  methods: {
    determineItemComponent(postType) {
      if (postType === "event") {
        return "wil-event-item";
      }

      return "wil-grid-item";
    },
    handleMouseOn(item) {
      this.$emit("mouse-on", item);
    },
    handleMouseLeave(item) {
      this.$emit("mouse-leave", item);
    },
    parseRandomPremiumItems(items) {
      const rawItems = items.reduce((accomulator, item) => {
        let group = accomulator[item.menuOrder]
          ? accomulator[item.menuOrder]
          : [];
        group = [...group, item];
        accomulator = {
          ...accomulator,
          [item.menuOrder]: group
        };
        return accomulator;
      }, {});

      let groupItems = [];
      let groupOrder = Object.keys(rawItems);
      // There is no menu order different from 0
      if (groupOrder.length === 1) {
        return items;
      }
      groupOrder = groupOrder.sort((first, second) => second - first);

      for (let order in groupOrder) {
        groupItems = [...groupItems, [...rawItems[groupOrder[order]]]];
      }

      groupItems = groupItems.map(group => {
        if (group.menuOrder === 0) {
          return group;
        }
        return this.shuffle(group);
      });

      return groupItems.reduce((accomulator, group) => {
        return [...accomulator, ...group];
      }, []);
    },
    goToPrevPage() {
      const page = this.currentPage - 1;
      this.$emit("page-paged", page);
    },
    goToNextPage() {
      const page = this.currentPage+ 1;
      this.$emit("page-paged", page);
    },
    handleItemChange(order) {
      return items => {
        this.items = this.updateItemValueInArray(order, items, this.items);
      };
    },
    fetchListings(that) {
      if (this.focusErrorMsg.length) {
        return false;
      }

      this.errMsg = "";
      // this.items = [];
      const parsedEndpoint = `${this.endpoint}?${WilQueryHelper.buildQuery({
        ...this.queryArgs,
        postsPerPage: this.postsPerPage,
        pageNow: this.pageNow,
        userID: WILOKE_INLINE_GLOBAL.userID
      })}`;
      this.isLoading = true;
      if (this.xhr !== null) {
        this.cancelToken.cancel();
        this.cancelToken = this.CancelToken.source();
      }
      this.xhr = Vue.axios(parsedEndpoint, {
        cancelToken: this.cancelToken.token
      })
        .then(response => {
          if (response.data.status === "error") {
            this.errMsg = response.data.msg;
            this.maxPages = 0;
            this.maxPosts = 0;
          } else {
            if (this.hasRandomPremium === "no") {
              this.items = [...response.data.listings];
            } else {
              this.items = this.parseRandomPremiumItems(response.data.listings);
            }
            this.maxPages = parseInt(response.data.maxPages, 10);
            this.maxPosts = parseInt(response.data.maxPosts, 10);
          }
          this.$emit("max-pages", this.maxPages);
          this.$emit("max-posts", this.maxPosts);
        })
        .finally(() => {
          this.isLoading = false;
          this.xhr = null;
          this.$emit('loaded');
        });
    }
  },
  watch: {
    queryArgs: {
      handler() {
        this.fetchListings();
      },
      deep: true
    },
    focusErrorMsg: {
      handler() {
        this.errMsg = this.focusErrorMsg;
      },
      immediate: true
    },
    items: {
      handler(items) {
        this.$emit("change", items);
      },
      deep: true
    }
  },
  props: {
    pageNow: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "grid" // grid or list
    },
    isAutoPostsPerPage: {
      type: Boolean,
      default: false
    },
    initItems: {
      type: Array,
      default: () => []
    },
    focusErrorMsg: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "w-100",
      required: false
    },
    columnClasses: {
      type: String,
      default: "col-lg-3 col-md-3 col-sm-6 mb-30",
      required: false
    },
    queryArgs: {
      type: [Object, String], // string means json
      default: () => {},
      required: false
    },
    endpoint: {
      type: String,
      default: ""
    },
    isNavigation: {
      type: String,
      default: "no"
    },
    isRandomPremium: {
      type: Boolean,
      default: false
    }
  }
};
</script>
