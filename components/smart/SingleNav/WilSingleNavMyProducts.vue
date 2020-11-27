<template>
  <div class="content-box_body__3tSRB" style="min-height: 200px;">
    <wil-block-loading :is-loading="isLoading" />
    <wil-alert v-if="errMsg.length" :msg="errMsg" type="danger"></wil-alert>
    <div class="row" v-if="content.length" data-col-xs-gap="10" v-html="content"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "wil-single-nav-my-products",
  data() {
    return {
      isLoading: true,
      errMsg: "",
      tabKey: "products"
    };
  },
  computed: {
    content() {
      return this.$store.getters["ModuleSingleListing/getTabContent"](
        this.tabKey,
        ""
      );
    },
    ...mapGetters({
      currentTab: "ModuleSingleListing/getCurrentTab"
    })
  },
  watch: {
    currentTab(tab) {
      if (tab === this.tabKey) {
        if (!this.content.length) {
          this.fetchContent();
        } else {
          this.isLoading = false;
        }
      }
    },
    immediate: true
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapActions("ModuleSingleListing", ["updateTabContent"]),
    fetchContent() {
      this.isLoaded = true;
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_get_my_products",
          postID: this.postId
        })
      })
        .then(response => {
          if (response.data.success) {
            this.updateTabContent({
              tabKey: this.tabKey,
              content: response.data.data.content
            });
          } else {
            this.errMsg = response.data.data.msg;
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
