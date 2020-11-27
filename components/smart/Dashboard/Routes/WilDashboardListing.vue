<template>
  <tr v-if="!isRemoveListing">
    <td class="before-hide" :data-th="'Publish' | filterTranslation('publish')">
      <wil-td-item :item="item">
        <template v-slot:after-title="{ item }">
          <span v-if="item.listingExpiry" v-html="listingExpiryOn"></span>
          <div
            class="listing_tagline__1cOB3 text-ellipsis"
            v-if="item.tagLine"
            v-html="item.tagLine"
          ></div>
          <router-link
            :to="{
              name: 'reviews',
              query: { listingId: item.postID, postType: item.postType }
            }"
            class="wil-review-route color-primary"
            >{{ "" | filterTranslation("reviews") }}</router-link
          >
        </template>
      </wil-td-item>
    </td>
    <td :data-th="'Average Rating' | filterTranslation('averageRating')">
      <wil-review-average-rating
        wrapper-classes="rated-small_module__1vw2B rated-small_style-3__1c0gb"
        :mode="item.oReview.mode"
        :average-rating="item.oReview.average"
      />
      <!-- End / rated-small_module__1vw2B -->
    </td>
    <td :data-th="'Plan' | filterTranslation('plan')">
      <span v-if="item.belongsToPlan" v-html="item.belongsToPlan"></span>
      <span v-else class="color-quaternary">
        <i class="la la-times"></i>
      </span>
    </td>
    <td :data-th="'Views' | filterTranslation('views')">
      <span>{{ item.views }}</span>
    </td>
    <td :data-th="'Favorites' | filterTranslation('favorites')">
      <span>{{ item.favorites }}</span>
    </td>
    <td :data-th="'Shares' | filterTranslation('shares')">
      <span>{{ item.shares }}</span>
    </td>
    <td :data-th="'Promotions' | filterTranslation('promotions')">
      <span v-if="!item.aPromotions" class="color-quaternary">
        <i class="la la-times"></i>
      </span>
      <span v-else class="color-secondary">
        <router-link
          :to="{
            name: 'promotiondetails',
            params: { id: item.postID },
            query: { postType: item.postType }
          }"
          >{{ "View details" | filterTranslation("viewDetails") }}</router-link
        >
      </span>
    </td>
    <td
      class="before-hide wil-text-right"
      :data-th="'More' | filterTranslation('more')"
    >
      <a
        v-if="item.isEnabledPromotion == 'yes' && item.postStatus == 'publish'"
        class="wil-btn wil-btn--primary wil-btn--sm wil-btn--round wilcity-boost-sale"
        href="#"
        @click.prevent="openPromotionPopup"
        >{{ "Boost Post" | filterTranslation("boostPost") }}</a
      >
      <span
        v-if="item.postStatus == 'publish'"
        class="list_item__3YghP wilcity-dasboard-upgrade-listing"
      >
        <wil-link
          v-if="!item.paymentID"
          wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--success wil-change-plan wil-btn--round"
          @click="changePlan(item)"
          :is-loading="isChaningPlan"
        >
          <template>
            <span class="list_text__35R07">{{
              "Change Plan" | filterTranslation("changePlan")
            }}</span>
          </template>
        </wil-link>
        <router-link
          class="wil-btn wil-btn--primary wil-btn--sm wil-btn--success wil-change-plan wil-btn--round"
          v-else
          :to="toChangePlan"
        >
          <span class="list_text__35R07">{{
            "Change Plan" | filterTranslation("changePlan")
          }}</span>
        </router-link>
      </span>
      <wil-dashboard-dropdown-controller
        v-on:removed-listing="onRemovedListing"
        :item="item"
        :post-filter-status="postFilterStatus"
        v-on:published="onRemovedListing"
      />
    </td>
  </tr>
</template>

<script>
import WilTdItem from "./../../../dumbs/table/WilTdItem.vue";
import WilDashboardDropdownController from "./WilDashboardDropdownController.vue";
import WilReviewAverageRating from "./../../../dumbs/review/WilReviewAverageRating.vue";

export default {
  name: "wil-dashboard-listing",
  data() {
    return {
      errorLink: "",
      isRemoveListing: false,
      changePlanXhr: null,
      isChaningPlan: false
    };
  },
  props: {
    item: {
      type: Object,
      default: {}
    },
    postFilterStatus: {
      type: String,
      default: "any"
    }
  },
  components: {
    WilDashboardDropdownController,
    WilReviewAverageRating,
    WilTdItem
  },
  computed: {
    listingExpiryOn() {
      if (
        this.item.listingExpiry !== "undefined" &&
        this.item.listingExpiry.length
      ) {
        return `${this.$options.filters.filterTranslation(
          "Expiry On",
          "expiryOn"
        )} ${this.item.listingExpiry}`;
      } else {
        return "";
      }
    },
    toChangePlan() {
      return {
        name: "pricings",
        params: {
          type: this.item.postType
        },
        query: {
          planID: this.item.planID,
          paymentID: this.item.paymentID,
          gateway: this.item.gateway,
          postID: this.item.postID
        }
      };
    }
  },
  methods: {
    openPromotionPopup() {
      this.$emit("openPromotion", this.item.postID);
    },
    onRemovedListing() {
      this.isRemoveListing = true;
    },
    changePlan() {
      if (this.changePlanXhr !== null) {
        return false;
      }
      this.isChaningPlan = true;
      this.changePlanXhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_change_plan_for_post",
          postID: this.item.postID
        },
        success: response => {
          if (response.success) {
            window.location.href = response.data.url;
          } else {
            alert(response.data.msg);
          }
        }
      });
    }
  }
};
</script>
