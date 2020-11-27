<template>
  <div class="pos-r">
    <wil-line-loading :is-loading="isLoading" />
    <div class="wil-colSmall">
      <wil-listing-settings-nav :items="listingSettings.router" @navigateTo="handleNavigateTo" />
    </div>
    <div class="wil-colLarge">
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" />
      <div class="content-box_module__333d9">
        <wil-listing-settings-general
          v-if="route==='general'"
          :button-settings="listingSettings.buttonSettings"
          :sidebar-position="listingSettings.generalSettings.sidebarPosition"
          @updateSidebarPosition="handleSaveGeneral"
          @updateButtonSettings="handleSaveButtonSettings"
          :translation="translation"
        />
        <wil-listing-settings-edit-navigation
          v-else-if="route==='edit-navigation'"
          :items="listingSettings.editNavigation.settings"
          v-on="{updateNavOrderItems: handleUpdateListingSettings('navigation'), updateMode: handleSaveListingSettingsMode('navigation')}"
          :is-using-default-nav="listingSettings.editNavigation.isUsingDefaultNav"
          :translation="translation"
        />
        <wil-listing-settings-sidebar
          v-else-if="route==='edit-sidebar'"
          :items="listingSettings.editSidebar.items"
          :is-using-default-sidebar="listingSettings.editSidebar.isUsingDefaultSidebar"
          :translation="translation"
          v-on="{updateSidebarOrder: handleUpdateListingSettings('sidebar'), updateMode: handleSaveListingSettingsMode('sidebar')}"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-listing-settings",
  data() {
    return {
      msg: "",
      msgType: "",
      timeoutControl: null,
      translation: {},
      route: "general",
      isLoading: false
    };
  },
  created() {
    this.translation = { ...WIL_SINGLE_LISTING.listingSettings.defines };
  },
  components: {
    WilListingSettingsNav: () =>
      import(
        /*webpackChunkName: "WilListingSettings"*/
        /*webpackPrefetch: true*/
        "./WilListingSettingsNav.vue"
      ),
    WilListingSettingsGeneral: () =>
      import(
        /*webpackChunkName: "WilListingSettingsGeneral"*/
        /*webpackPrefetch: true*/
        "./WilListingSettingsGeneral.vue"
      ),
    WilListingSettingsEditNavigation: () =>
      import(
        /*webpackChunkName: "WilListingSettingsEditNavigation"*/
        /*webpackPrefetch: true*/
        "./WilListingSettingsEditNavigation.vue"
      ),
    WilListingSettingsSidebar: () =>
      import(
        /*webpackChunkName: "WilListingSettingsSidebar"*/
        /*webpackPrefetch: true*/
        "./WilListingSettingsSidebar.vue"
      )
  },
  props: {
    listingSettings: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      required: true
    }
  },
  methods: {
    reset() {
      this.msg = "";
    },
    handleUpdateMessage(response) {
      this.isLoading = false;
      this.msg = response.data.data.msg;
      this.msgType = response.data.success ? "success" : "danger";
    },
    handleNavigateTo(route) {
      this.route = route;
    },
    handleUpdateListingSettings(mode) {
      return val => {
        this.isLoading = true;
        Vue.axios({
          method: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: this.createFormData({
            action: "wilcity_listing_settings",
            mode,
            value: JSON.stringify(val),
            postID: this.postId
          })
        }).then(response => this.handleUpdateMessage(response));
      };
    },
    handleSaveListingSettingsMode(mode) {
      return val => {
        this.isLoading = true;
        Vue.axios({
          method: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: this.createFormData({
            action: `wilcity_listing_settings_${mode}_mode`,
            mode: val,
            postID: this.postId
          })
        }).then(response => this.handleUpdateMessage(response));
      };
    },
    handleSaveButtonSettings(val) {
      if (this.timeoutControl !== null) {
        clearTimeout(this.timeoutControl);
      }
      this.timeoutControl = setTimeout(() => {
        this.isLoading = true;
        this.reset();
        Vue.axios({
          method: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: this.createFormData({
            action: "wilcity_save_page_button",
            value: JSON.stringify(val),
            postID: this.postId
          })
        }).then(response => this.handleUpdateMessage(response));
        clearTimeout(this.timeoutControl);
      }, 1000);
    },
    handleSaveGeneral(val) {
      this.reset();
      this.isLoading = true;
      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: this.createFormData({
          action: "wilcity_listing_settings",
          mode: "general",
          value: JSON.stringify({
            sidebarPosition: val
          }),
          postID: this.postId
        })
      }).then(response => this.handleUpdateMessage(response));
    }
  }
};
</script>
