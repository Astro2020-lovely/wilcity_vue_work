<template>
  <div class="content-box_body__3tSRB">
    <wil-block-loading :is-loading="isLoading" />
    <wil-alert v-if="errMsg.length" :msg="errMsg" />
    <div v-if="content.length" v-html="content"></div>
  </div>
</template>
<script lang="javascript">
import { mapGetters, mapActions } from "vuex";
export default {
  name: "wil-single-nav-custom-content",
  data() {
    return {
      errMsg: "",
      isLoading: false
    };
  },
  props: {
    postId: {
      type: Number,
      required: true
    },
    tabKey: {
      type: String,
      required: true
    }
  },
  watch: {
    currentTab: {
      handler(tab) {
        if (tab === this.tabKey) {
          if (!this.content.length) {
            this.fetchContent();
          } else {
            this.isLoading = false;
          }
        }
      },
      immediate: true
    }
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
  methods: {
    ...mapActions("ModuleSingleListing", ["updateTabContent"]),
    fetchContent() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_fetch_custom_content",
          postID: this.postId,
          mode: "custom",
          tabKey: this.tabKey
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

          this.$nextTick(function() {
            jQuery("body").trigger("wilcity/single/loaded/" + this.tabKey);
          });
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
