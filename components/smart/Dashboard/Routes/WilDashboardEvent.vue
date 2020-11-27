<template>
  <tr v-if="!isRemoved">
    <td class="before-hide">
      <wil-td-item :item="item">
        <template v-slot:after-title>
          <ul class="event_meta__CFFPg list-none">
            <li v-if="item.frequency" class="event_metaList__1bEBH text-ellipsis">
              <span>{{item.frequency}}</span>
            </li>
            <li class="event_metaList__1bEBH text-ellipsis">
              <span style="display: inline-block">{{item.starts}}</span>
              <span style="display: inline-block">{{item.ends}}</span>
            </li>
          </ul>
        </template>
      </wil-td-item>
    </td>
    <td :data-th="'People Interested'|filterTranslation('peopleInterested')">
      <span>{{item.favorites}}</span>
    </td>
    <td :data-th="'Views'|filterTranslation('views')">
      <span>{{item.views}}</span>
    </td>
    <td :data-th="'Shares'|filterTranslation('shares')">
      <span>{{item.shares}}</span>
    </td>
    <td class="before-hide wil-text-right" :data-th="'Promotions'|filterTranslation('promotions')">
      <wil-link
        v-if="item.isEnabledPromotion=='yes' && item.postStatus=='publish'"
        wrapper-classes="wil-btn wil-btn--xs wil-btn--primary wil-btn--round"
        @click="openPromotionPopup"
        :btn-name="'Boost Event'|filterTranslation('boostEvent')"
      />
      <wil-dashboard-dropdown-controller
        v-on:removed-listing="handleRemovedItem"
        :item="item"
        v-on:published="handleRemovedItem"
      />
    </td>
  </tr>
</template>
<style scoped>
.event_metaList__1bEBH {
  max-width: 100%;
}
</style>
<script>
import WilDashboardDropdownController from "./WilDashboardDropdownController.vue";
import WilTdItem from "./../../../dumbs/table/WilTdItem.vue";
export default {
  name: "wil-dashboard-event",
  data() {
    return {
      isRemoved: false
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    WilDashboardDropdownController,
    WilTdItem
  },
  methods: {
    openPromotionPopup() {
      this.$emit("openPromotion", this.item.postID);
    },
    handleRemovedItem() {
      this.isRemoved = true;
    }
  }
};
</script>
