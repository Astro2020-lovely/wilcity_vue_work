<template>
  <div class="content-box_body__3tSRB">
    <wil-alert v-if="msg.length" :msg="msg" :msg-type="msgType" />
    <wil-block-loading :is-loading="isLoading" />
    <div v-html="content"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "wil-single-nav-content",
  data() {
    return {
      isLoading: true,
      msg: "",
      msgType: "",
      tabKey: "content"
    };
  },
  computed: {
    content() {
      return this.$store.getters["ModuleSingleListing/getTabContent"](
        this.tabKey,
        ""
      );
    }
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
  created() {
    if (this.content.length) {
      this.isLoading = false;
    } else {
      this.fetchContent();
    }
  },
  methods: {
    ...mapActions("ModuleSingleListing", ["updateTabContent"]),
    fetchContent() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_fetch_content",
          postID: this.postId
        })
      })
        .then(response => {
          if (response.data.success) {
            this.updateTabContent({
              content: response.data.data.content,
              tabKey: this.tabKey
            });
          } else {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
