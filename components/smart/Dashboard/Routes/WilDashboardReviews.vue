<template>
  <div class="mt-15">
    <div class="content-box_module__333d9 mb-20">
      <div class="content-box_body__3tSRB">
        <div class="row">
          <div class="col-md-12 col-lg-12">
            <wil-select-tree
              :value="orderby"
              :options="orderByOptions"
              v-on="{change: handleChangeFilterArgs('orderby')}"
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
          <wil-t-head icon="la la-share-alt-square" :title="'title'|filterTranslation('title')" />
          <wil-t-head :title="'Details'|filterTranslation('details')" />
          <wil-t-head :title="'Content'|filterTranslation('content')" />
          <wil-t-head :title="'Listing title'|filterTranslation('listingTitle')" />
          <wil-t-head class="wil-text-right" :title="'More'|filterTranslation('more')" />
        </template>
        <template v-slot:tbody>
          <tr v-if="errorMsg.length">
            <td colspan="5">
              <wil-alert :msg="errorMsg" alignment="center" />
            </td>
          </tr>
          <wil-reviews-item
            v-for="review in reviews"
            :key="`review-item-${review.postID}`"
            :item="review"
          />
        </template>

        <template v-slot:tfoot>
          <tfoot class="wil-text-right">
            <tr>
              <td colspan="5">
                <router-link
                  :to="{name: 'listings', params: {postType: postType}}"
                  class="wil-btn wil-btn--primary wil-btn--sm"
                >{{'Back'|filterTranslation('back')}}</router-link>
              </td>
            </tr>
          </tfoot>
        </template>
      </wil-table>
      <wil-pagination
        v-on="{change: handleChangeFilterArgs('page')}"
        v-if="maxPages > 1"
        :current-page="page"
        :max-pages="maxPages"
      />
    </div>
  </div>
</template>
<script>
import WilReviewsItem from "./Reviews/WilReviewsItem.vue";
export default {
  name: "wil-dashboard-reviews",
  data() {
    return {
      reviews: [],
      errorMsg: "",
      isLoading: false,
      maxPages: 0,
      page: 1,
      listingId: 0,
      latestListingId: 0,
      postType: "",
      queryArgs: {},
      orderby: "post_date",
      orderByOptions: [
        {
          id: "post_date",
          label: this.$options.filters.filterTranslation("", "newestRating")
        },
        {
          id: "highest_rating",
          label: this.$options.filters.filterTranslation("", "highestRating")
        },
        {
          id: "lowest_rating",
          label: this.$options.filters.filterTranslation("", "lowestRating")
        }
      ]
    };
  },
  components: {
    WilReviewsItem
  },
  watch: {
    $route(to, from, next) {
      this.listingId = this.$route.query.listingId;
      this.postType = this.$route.query.postType;
      if (this.listingId && this.listingId != this.latestListingId) {
        this.handleChangeFilterArgs("parentID")(this.listingId);
        this.fetchReviews();
      }
    }
  },
  created() {
    this.listingId = this.$route.query.listingId;
    this.postType = this.$route.query.postType;
    this.queryArgs = {
      action: "wil_reviews_statistic",
      page: this.page,
      postType: "review"
    };
    if (this.listingId && this.listingId !== 0) {
      this.queryArgs = { ...this.queryArgs, parentID: this.listingId };
    }
    this.fetchReviews();
  },
  methods: {
    handleChangeFilterArgs(param) {
      return val => {
        this.queryArgs = {
          ...this.queryArgs,
          [param]: val
        };
        this.fetchReviews();
      };
    },
    createAjaxUrl() {
      this.latestListingId = this.queryArgs.parentID;
      const args = Object.keys(this.queryArgs)
        .map(key => `${key}=${this.queryArgs[key]}`)
        .join("&");

      return `${WILOKE_GLOBAL.ajaxurl}?${args}`;
    },
    fetchReviews() {
      this.isLoading = true;
      this.errorMsg = "";
      this.reviews = [];
      this.maxPages = 0;
      const ajaxUrl = Vue.axios({
        method: "GET",
        url: this.createAjaxUrl()
      })
        .then(response => {
          if (response.data.success) {
            this.reviews = response.data.data.reviews;
            this.maxPages = response.data.data.maxPages;
          } else {
            this.errorMsg = response.data.data.msg;
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
