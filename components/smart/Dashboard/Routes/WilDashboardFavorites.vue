<template>
  <div class="listing-table_module__2vE05 table-module pos-r">
    <content-placeholders v-if="isLoading">
      <content-placeholders-text :lines="4" />
    </content-placeholders>
    <wil-table
      v-if="!isLoading && !errMsg.length"
      wrapper-classes="event-table_table__3eOyz wil-table-responsive-lg table-module__table"
    >
      <template v-slot:thead>
        <wil-t-head icon="la la-heart-o" :title="'Favorites'|filterTranslation('favorites')" />
        <wil-t-head :title="'Categories'|filterTranslation('categories')" />
        <wil-t-head :title="'Address'|filterTranslation('address')" />
        <wil-t-head class="wil-text-right" :title="'Remove'|filterTranslation('remove')" />
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, order) in aFavorites" :key="`favorite-item-${item.postID}`">
          <td class="before-hide" :data-th="'Publish'|filterTranslation('publish')">
            <wil-td-item :item="item">
              <template v-slot:after-title="{item}">
                <span v-if="item.listingExpiry" v-html="listingExpiryOn"></span>
                <div
                  class="listing_tagline__1cOB3 text-ellipsis"
                  v-if="item.tagLine"
                  v-html="item.tagLine"
                ></div>
              </template>
            </wil-td-item>
          </td>
          <td v-if="item.oCategory!=='no'" :data-th="'Categories'|filterTranslation('categories')">
            <a
              v-if="item.oCategory.oIcon=='no'"
              :href="item.oCategory.link"
              :target="determineTarget"
            >
              <span v-html="item.oCategory.name"></span>
            </a>
            <a
              :href="item.oCategory.link"
              v-else-if="item.oCategory.oIcon.type=='icon'"
              :target="determineTarget"
            >
              <i :class="item.oCategory.oIcon.icon" :style="{color: item.oCategory.oIcon.color}"></i>
              <span v-html="item.oCategory.name"></span>
            </a>
            <a :href="item.oCategory.link" v-else :target="determineTarget">
              <div class="icon-box-1_icon__3V5c0 bg-transparent">
                <img :src="item.oCategory.oIcon.url" :alt="item.oCategory.name" />
              </div>
              <div class="icon-box-1_text__3R39g" v-html="item.oCategory.name"></div>
            </a>
          </td>
          <td v-else :data-th="'Categories'|filterTranslation('categories')">
            <span class="color-quaternary">
              <i class="la la-times"></i>
            </span>
          </td>
          <td :data-th="'Address'|filterTranslation('address')">
            <a :href="item.mapPage" v-if="item.address" :target="determineTarget">
              <i class="la la-map-marker color-primary"></i>
              <span v-html="item.address"></span>
            </a>
            <a href="#" v-else>
              <span class="color-quaternary">
                <i class="la la-times"></i>
              </span>
            </a>
          </td>
          <td class="wil-text-right">
            <div class="dropdown_module__J_Zpj">
              <wil-link
                wrapper-classes="wil-btn wil-btn--xs wil-btn--gray wil-btn--round"
                :is-loading="isDeleting"
                @click="removeFavorite(item, order)"
                :btn-name="'Remove'|filterTranslation('remove')"
              />
            </div>
          </td>
        </tr>
      </template>
    </wil-table>
    <wil-alert v-if="errMsg.length" :msg="errMsg" alignment="align-center pt-20" />
    <wil-pagination
      v-on:change="onSwitchPage"
      v-if="maxPages>1"
      :current-page="page"
      :max-pages="maxPages"
    />
  </div>
</template>

<script>
import WilTdItem from "./../../../dumbs/table/WilTdItem.vue";
export default {
  name: "wil-dashboard-favorites",
  components: {
    WilTdItem
  },
  data() {
    return {
      aFavorites: [],
      isDeleting: false,
      aCacheFavorites: [],
      page: 1,
      maxPages: 1,
      errMsg: "",
      isLoading: false
    };
  },
  computed: {
    determineTarget() {
      return WilCityHelpers.isMobile() ? "_self" : "_blank";
    }
  },
  methods: {
    onSwitchPage(page) {
      this.page = page;
      this.fetchFavorites();
    },
    fetchFavorites() {
      if (typeof this.aCacheFavorites[this.page] !== "undefined") {
        this.aFavorites = this.aCacheFavorites[this.page];
        return true;
      }
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_my_favorites&page=${this.page}`
      })
        .then(response => {
          if (response.data.success) {
            this.aFavorites = response.data.data.aInfo;
            this.maxPages = response.data.data.maxPages;
            this.aCacheFavorites[this.page] = this.aFavorites;
          } else {
            if (!response.data.reachedMaximum) {
              this.errMsg = response.data.data.msg;
            }
          }
        })
        .finally(() => (this.isLoading = false));
    },
    removeFavorite(oFavorite, order) {
      this.isDeleting = true;
      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_remove_favorite_from_my_list",
          id: oFavorite.order
        },
        success: response => {
          this.aFavorites.splice(order, 1);
          this.isDeleting = false;
        }
      });
    }
  },
  created() {
    this.fetchFavorites();
  }
};
</script>
