<template>
  <div>
    <wil-heading
      :heading="
        'Latest Notifications' | filterTranslation('latestNotifications')
      "
      icon="la la-bell"
      v-if="!isLoading"
    />
    <div class="content-box_body__3tSRB pos-r">
      <wil-alert v-if="errorMsg.length" :msg="errorMsg" icon="la la-frown-o" />
      <content-placeholders v-if="isLoading">
        <content-placeholders-text :lines="4" />
      </content-placeholders>
      <wil-lists :items="notifications">
        <template v-slot:list-item="{ item, order }">
          <wil-list-item :item="item" @remove="handleRemoveItem(item, order)" />
        </template>
      </wil-lists>
    </div>
    <wil-pagination
      v-if="hasPagination && maxPages > 1"
      :current-page="currentPage"
      :max-pages="maxPages"
      @change="onSwitchPage"
    />
    <footer v-if="hasFooter && !isLoading" class="content-box_footer__kswf3">
      <router-link
        class="content-box_link__2K0Ib wil-text-center"
        to="notifications"
        >{{ "See all" | filterTranslation("seeAll") }}</router-link
      >
    </footer>
  </div>
</template>
<script>
export default {
  name: "wil-notifications",
  data() {
    return {
      notifications: [],
      errorMsg: "",
      currentPage: 1,
      isLoading: false,
      cacheNotifications: {},
      maxPages: 0
    };
  },
  props: {
    hasFilter: {
      type: Boolean,
      default: false
    },
    hasFooter: {
      type: Boolean,
      default: true
    },
    hasPagination: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    fetchNotifications() {
      this.isLoading = true;
      if (typeof this.cacheNotifications[this.currentPage] !== "undefined") {
        this.notifications = this.cacheNotifications[this.currentPage];
        this.isLoading = false;
        return false;
      }

      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_notifications&paged=${this.currentPage}`
      })
        .then(response => {
          if (response.data.success) {
            if (response.data.data.oInfo) {
              this.notifications = response.data.data.oInfo;
              this.cacheNotifications[this.currentPage] = [
                ...this.notifications
              ];
            }

            this.maxPages = parseInt(response.data.maxPages, 10);
          } else {
            this.errorMsg = response.data.data.msg;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    onSwitchPage(paged) {
      this.currentPage = parseInt(paged, 10);
      this.fetchNotifications();
    },
    handleRemoveItem(item, order) {
      const formData = new FormData();
      formData.append("action", "wilcity_delete_notification");
      formData.append("ID", item.ID);

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData
      }).then(response => {
        if (response.data.success) {
          this.notifications = this.arrDeleteItem(order, this.notifications);
        } else {
          this.errorMsg = response.data.data.msg;
        }
      });
    }
  },
  created() {
    this.fetchNotifications();
  }
};
</script>
