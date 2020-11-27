<template>
  <div class="listing-table_module__2vE05 table-module pos-r">
    <block-loading position="pos-a-center" :is-loading="isLoading"></block-loading>
    <table class="listing-table_table__2Cfzq wil-table-responsive-lg table-module__table">
      <thead>
        <tr>
          <th>
            <span>
              <i class="la la-archive"></i>
              {{WILCITY_I18.position}}
            </span>
          </th>
          <th>
            <span>{{WILCITY_I18.expiryOn}}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="oDetail in oDetails">
          <td class="before-hide" :data-th="WILCITY_I18.date">{{oDetail.position}}</td>
          <td class="before-hide" :data-th="WILCITY_I18.gateway">{{oDetail.expiryOn}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import BlockLoading from "./../../shortcodes/BlockLoading.vue";

export default {
  data() {
    return {
      errorMsg: "",
      isLoading: "yes",
      oDetails: []
    };
  },
  components: {
    BlockLoading
  },
  methods: {
    fetchPromotionDetails() {
      this.isLoading = "yes";
      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_fetch_listing_promotions",
          postID: this.$route.params.id
        },
        success: response => {
          this.isLoading = "no";
          if (response.success) {
            this.oDetails = response.data;
          } else {
            this.oDetails = [];
          }
        }
      });
    }
  },
  mounted() {
    this.fetchPromotionDetails();
  }
};
</script>
