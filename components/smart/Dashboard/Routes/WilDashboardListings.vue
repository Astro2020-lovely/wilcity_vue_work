<template>
  <div class="mt-15">
    <div class="content-box_module__333d9">
      <div class="content-box_body__3tSRB">
        <div class="row">
          <div class="col-md-6 col-lg-6">
            <wil-input
              :label="'Search for listing ...' | filterTranslation('search')"
              :value="queryArgs.s"
              v-on="{ change: handleChangeFilterArgs('s') }"
            />
          </div>
          <div class="col-md-6 col-lg-6">
            <wil-select-tree
              v-if="postStatuses.length"
              :value="queryArgs.postStatus"
              :options="postStatuses"
              v-on="{ change: handleChangeFilterArgs('postStatus') }"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="listing-table_module__2vE05 table-module pos-r">
      <content-placeholders v-if="isLoading">
        <content-placeholders-text :lines="4" />
      </content-placeholders>
      <wil-table v-show="!isLoading">
        <template v-slot:thead>
          <wil-t-head
            icon="la la-share-alt-square"
            :title="'title' | filterTranslation('title')"
          />
          <wil-t-head
            :title="'Average Rating' | filterTranslation('averageRating')"
          />
          <wil-t-head
            :title="'Plan' | filterTranslation('plan')"
            class="wilcity-listing-plan-column"
          />
          <wil-t-head :title="'Views' | filterTranslation('views')" />
          <wil-t-head :title="'Favorites' | filterTranslation('favorites')" />
          <wil-t-head :title="'Shares' | filterTranslation('shares')" />
          <wil-t-head :title="'Promotions' | filterTranslation('promotions')" />
          <wil-t-head
            class="wil-text-right"
            :title="'More' | filterTranslation('more')"
          />
        </template>
        <template v-slot:tbody>
          <tr v-if="errorMsg.length">
            <td colspan="8" style="text-align:center">
              <wil-alert :msg="errorMsg" />
            </td>
          </tr>
          <wil-dashboard-listing
            v-else
            @openPromotion="togglePromotionPopup"
            v-for="listing in oListings"
            :post-filter-status="
              queryArgs.postStatus ? queryArgs.postStatus : 'any'
            "
            :key="renderListingID(listing.postID)"
            :item="listing"
          />
        </template>
      </wil-table>
    </div>
    <wil-pagination
      @change="switchedPage"
      v-if="maxPages > 1"
      :current-page="currentPage"
      :max-pages="maxPages"
    />

    <portal to="wil-modal" v-if="isOpenPromotionPopup">
      <wil-promotion-popup
        @close="togglePromotionPopup"
        :is-open="isOpenPromotionPopup"
        :post-id="currentListingIDPromotion"
      />
    </portal>
  </div>
</template>
<script>
import WilDashboardListing from "./WilDashboardListing.vue";
import WilPromotionPopup from "./../../Promotion/WilPromotionPopup.vue";
import WilPagination from "./../../../dumbs/WilPagination.vue";
export default {
  name: "wil-dashboard-listings",
  components: { WilDashboardListing, WilPromotionPopup, WilPagination },
  data() {
    return {
      xhr: null,
      cancelToken: null,
      sourceToken: null,
      postType: "",
      queryArgs: {},
      currentPage: 1,
      previousPage: 1,
      maxPages: 1,
      oListings: {},
      postStatuses: [...WIL_DASHBOARD.postStatuses],
      aCountPosts: [],
      errorMsg: "",
      latestPostStatus: null,
      isLoading: true,
      currentListingIDPromotion: 0,
      isOpenPromotionPopup: false
    };
  },
  created() {
    this.cancelToken = Vue.axios.CancelToken;
    this.sourceToken = this.cancelToken.source();

    this.queryArgs = {
      action: "fetch_listings_statistics",
      page: this.currentPage,
      postType: this.postType,
      postStatus: "any"
    };
  },
  watch: {
    queryArgs: {
      handler() {
        if (this.xhr !== null) {
          this.sourceToken.cancel();
          this.sourceToken = this.cancelToken.source();
        }
        this.fetchListings();
      },
      deep: true
    },
    $route: {
      handler(route) {
        let query = {};
        if (route.query.s) {
          query = {
            ...query,
            s: route.query.s
          };
        }
        if (route.params.postType) {
          this.postType = route.params.postType;
          query = {
            ...query,
            postType: route.params.postType
          };
        }

        this.queryArgs = {
          ...this.queryArgs,
          ...query
        };
      },
      immediate: true
    },
    currentPage(page) {
      this.queryArgs = {
        ...this.queryArgs,
        page: page
      };
    }
  },
  methods: {
    togglePromotionPopup(listingID) {
      this.currentListingIDPromotion = listingID;
      this.isOpenPromotionPopup = !this.isOpenPromotionPopup;
    },
    switchedPage(page) {
      this.currentPage = page;
    },
    postStatusHref(postStatus) {
      return "#" + postStatus;
    },
    postStatusClass(postStatus) {
      return postStatus == "publish"
        ? "list_item__3YghP active"
        : "list_item__3YghP";
    },
    handleChangeFilterArgs(key) {
      return newVal => {
        if (key === "s") {
          Vue.delete(this.queryArgs, "s");
        }
        this.queryArgs = {
          ...this.queryArgs,
          [key]: newVal
        };
      };
    },
    fetchListings() {
      this.isLoading = true;
      this.maxPages = 0;
      this.errorMsg = "";
      this.xhr = Vue.axios
        .get(WilQueryHelper.buildQueryUrl(this.queryArgs), {
          cancelToken: this.sourceToken.token
        })
        .then(response => {
          if (!response.data.success) {
            this.errorMsg = response.data.data.msg;
            return true;
          }

          this.oListings = response.data.data.listings;
          this.maxPages = parseInt(response.data.data.maxPages, 10);
          this.previousPage = this.currentPage;
        })
        .finally(() => {
          this.isLoading = false;
          this.xhr = null;
        });
    },
    renderListingID(listingID) {
      return "listing-item-" + listingID;
    }
  }
};
</script>
