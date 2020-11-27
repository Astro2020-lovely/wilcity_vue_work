<template>
  <div ref="photos" class="content-box_body__3tSRB">
    <wil-block-loading :is-loading="isLoading" />
    <wil-alert v-if="errMsg.length" :msg="errMsg" type="white" />
    <wil-gallery
      v-else
      row-classes="row"
      column-classes="col-xs-6 col-sm-3"
      :items="gallery"
      :maximum-preview-items="parseMaximumItems"
    />
  </div>
</template>
<script lang="javascript">
import { mapGetters, mapActions } from "vuex";

export default {
  name: "wil-single-nav-photos",
  data() {
    return {
      errMsg: "",
      isLoading: true,
      tabKey: "photos"
    };
  },
  computed: {
    gallery() {
      return this.$store.getters["ModuleSingleListing/getTabContent"](
        this.tabKey,
        []
      );
    },
    parseMaximumItems() {
      if (!this.isHome) {
        return 200;
      }

      return this.settings.maximumItemsOnHome
        ? parseInt(this.settings.maximumItemsOnHome, 10)
        : 4;
    }
  },
  props: {
    isHome: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      required: true
    }
  },
  created() {
    if (!this.gallery.length) {
      this.fetchContent();
    } else {
      this.isLoading = false;
    }
  },
  methods: {
    ...mapActions("ModuleSingleListing", ["updateTabContent"]),
    fetchContent() {
      this.isLoading = true;
      Vue.axios({
        type: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_fetch_single_gallery",
          postID: this.postId
        })
      })
        .then(response => {
          if (response.data.success) {
            this.updateTabContent({
              content: response.data.data.gallery,
              tabKey: this.tabKey
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
