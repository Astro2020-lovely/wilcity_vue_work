<template>
  <div class="content-box_body__3tSRB">
    <wil-alert v-if="errMsg.length" :msg="errMsg" />
    <wil-restaurant-menu-items
      v-if="menus.length"
      :items="menus"
      :row-classes="rowClasses"
      :column-classes="columnClasses"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "wil-single-nav-restaurant-menu",
  data() {
    return {
      isLoading: false
    };
  },
  props: {
    errMsg: {
      type: String,
      default: ""
    },
    ajaxAction: {
      type: String,
      default: "wilcity_get_restaurant_menu"
    },
    settings: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      required: false
    },
    menus: {
      type: Array,
      default: () => []
    },
    rowClasses: {
      type: String,
      default: "row"
    },
    columnClasses: {
      type: String,
      default: "col-md-12 col-xs-12"
    },
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    iconClasses(icon) {
      return `fs-32 color-primary ${icon}`;
    },
    fetchContent() {
      this.isLoading = true;
      let args = {
        action: this.ajaxAction,
        postId: this.postId,
        page: this.page
      };
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl(args)
      })
        .then(response => {
          if (response.data.success) {
            this.updateTabContent({
              menus: `${response.data.data.menus}`,
              tabKey: this.tabKey
            });
          } else {
            if (this.page !== 1 && response.data.data.msg) {
              this.errMsg = response.data.data.msg;
            }
          }
        })
        .finally(() => (this.isLoading = false));
    }
  },
  watch: {
    // currentTab: {
    //   handler(tab) {
    //     if (tab === this.tabKey) {
    //       if (!this.menus.length) {
    //         this.fetchContent();
    //       } else {
    //         this.isLoading = false;
    //       }
    //     }
    //   },
    //   immediate: true
    // }
  },
  computed: {
    hasTitle() {
      return menu.group_title.length || item.group_description.length;
    }
  },
  mounted() {
    // console.log(this.menus);
  }
};
</script>
