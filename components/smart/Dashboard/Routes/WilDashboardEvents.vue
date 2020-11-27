<template>
  <div>
    <div class="content-box_module__333d9">
      <div class="content-box_body__3tSRB">
        <div class="row">
          <div class="col-md-6 col-lg-6">
            <wil-input
              :label="'Search'|filterTranslation('search')"
              @change="handleChangeFilterArgs('search')"
            />
          </div>
          <div class="col-md-6 col-lg-6">
            <wil-select-tree
              v-if="postStatuses.length"
              :value="postStatus"
              :options="postStatuses"
              v-on="{change: handleChangeFilterArgs('postStatus')}"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="detail-navtop_module__zo_OS detail-navtop_forListing__3UBok mb-10 js-detail-navtop">
      <div class="container">
        <nav class="detail-navtop_nav__1j1Ti">
          <wil-lists
            :items="orderByOptions"
            wrapper-classes="list_module__1eis9 list-none list_horizontal__7fIr5"
            inner-classes="list_item__3YghP"
            :active="orderby"
          >
            <template v-slot:list-item="{item}">
              <wil-link
                wrapper-classes="list_link__2rDA1 text-ellipsis color-primary--hover"
                @click="handleOrderbyChange(item.id)"
                span-classes="list_text__35R07"
                :btn-name="item.name|filterTranslation(item.translation)"
              />
            </template>
          </wil-lists>
        </nav>
      </div>
    </div>

    <div class="event-table_module__3Dspr table-module pos-r">
      <content-placeholders v-if="isLoading">
        <content-placeholders-text :lines="4" />
      </content-placeholders>
      <wil-alert v-if="errMsg.length" :msg="errMsg" alignment="center" />
      <wil-table
        v-if="!isLoading && !errMsg.length"
        wrapper-classes="event-table_table__3eOyz wil-table-responsive-lg table-module__table"
      >
        <template v-slot:thead>
          <wil-t-head icon="la la-bookmark" :title="'Title'|filterTranslation('eventName')" />
          <wil-t-head :title="'People Interested'|filterTranslation('peopleInterested')" />
          <wil-t-head :title="'Views'|filterTranslation('views')" />
          <wil-t-head :title="'Shares'|filterTranslation('shares')" />
          <wil-t-head :title="'Promotion'|filterTranslation('promote')" />
        </template>
        <template v-slot:tbody>
          <wil-dashboard-event
            v-for="item in items"
            :key="`event-item-${item.postID}`"
            @openPromotion="togglePromotionPopup"
            :item="item"
          />
        </template>
      </wil-table>
    </div>
    <wil-pagination
      v-on="{change:handleChangeFilterArgs('paged')}"
      v-show="maxPages > 1"
      :current-page="currentPage"
      :max-pages="maxPages"
    />

    <portal v-if="isOpenPromotionPopup" to="wil-modal">
      <wil-promotion-popup @close="togglePromotionPopup"
      :is-open="isOpenPromotionPopup"
      :post-id="currentListingIDPromotion" />
    </portal>
  </div>
</template>
<script>
import WilDashboardEvent from "./WilDashboardEvent.vue";
import WilPromotionPopup from "./../../Promotion/WilPromotionPopup.vue";
import WilPagination from "./../../../dumbs/WilPagination.vue";

export default {
  name: "wil-dashboard-events",
  components: { WilDashboardEvent, WilPromotionPopup, WilPagination },
  data() {
    return {
      searchEvent: "",
      postStatus: "any",
      postStatuses: [...WIL_DASHBOARD.postStatuses],
      orderby: "upcoming_event",
      items: [],
      maxPages: 1,
      currentPage: 1,
      errMsg: "",
      isLoading: false,
      currentListingIDPromotion: 0,
      isOpenPromotionPopup: false,
      orderByOptions: [
        {
          name: "Upcoming",
          translation: "upcoming",
          id: "upcoming_event"
        },
        {
          name: "Expired Event",
          translation: "expired",
          id: "expired_event"
        },
        {
          name: "Ongoing Event",
          translation: "ongoing",
          id: "ongoing_event"
        }
      ]
    };
  },
  created() {
    this.fetchEvents();
  },
  methods: {
    togglePromotionPopup(listingID) {
      this.currentListingIDPromotion = listingID;
      this.isOpenPromotionPopup = !this.isOpenPromotionPopup;
    },
    handleOrderbyChange(orderby) {
      this.handleChangeFilterArgs("orderby")(orderby);
    },
    handleChangeFilterArgs(key) {
      return newVal => {
        console.log(key);
        switch (key) {
          case "paged":
            this.currentPage = newVal;
            break;
          case "search":
            this.searchEvent = newVal;
            this.currentPage = 1;
            break;
          case "postStatus":
            this.postStatus = newVal;
            break;
          case "orderby":
            this.orderby = newVal;
            break;
        }

        this.fetchEvents();
      };
    },
    fetchEvents() {
      let ajaxUrl = `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_events_json&order=DESC&orderby=${this.orderby}&postType=event&postStatus=${this.postStatus}&page=${this.currentPage}`;
      if (this.searchEvent.length) {
        ajaxUrl = `${ajaxUrl}&s=${this.searchEvent}`;
      }
      this.isLoading = true;
      this.errMsg = "";
      Vue.axios({
        method: "GET",
        url: ajaxUrl
      })
        .then(response => {
          if (response.data.success) {
            this.items = response.data.data.info;
            this.maxPages = response.data.data.maxPages;
          } else {
            this.errMsg = response.data.data.msg;
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
