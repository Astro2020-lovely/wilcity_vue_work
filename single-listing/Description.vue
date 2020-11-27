<template>
  <div id="single-content" class="single-tab-content">
    <div class="listing-detail_row__2UU6R clearfix">
      <div class="content-box_module__333d9 pos-r">
        <header-component :settings="oHeaderSettings"></header-component>
        <div class="content-box_body__3tSRB">
          <div v-html="content"></div>
        </div>
        <block-loading :is-loading="isFetching" position="pos-a-center"></block-loading>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderComponent from "./header.vue";
import { mapState } from "vuex";
import BlockLoading from "../shortcodes/BlockLoading.vue";

export default {
  data() {
    return {
      key: "content",
      oHeaderSettings:
        WILCITY_SINGLE_LISTING_SETTINGS.navigation.items.draggable.content,
      key: WILCITY_SINGLE_LISTING.navigation.draggable.content.key,
      content: "",
      isFetching: "yes",
      isLoaded: false
    };
  },
  computed: {
    wrapperClass() {
      let cl = "single-tab-content";
    }
  },
  components: {
    BlockLoading,
    HeaderComponent
  },
  methods: {
    fetchContent() {
      if (this.isLoaded) {
        this.isFetching = "no";
        return true;
      }

      this.$root.componentLoading = this.key;
      this.$root.ajaxFetching = jQuery.ajax({
        type: "GET",
        url:
          WILOKE_GLOBAL.ajaxurl +
          "?action=wilcity_fetch_content&postID=" +
          WILOKE_INLINE_GLOBAL.postID,
        success: response => {
          if (response.success) {
            this.content = response.data;
          } else {
            this.content = response.data.msg;
          }
          this.isFetching = "no";
        }
      });
    }
  }
};
</script>
