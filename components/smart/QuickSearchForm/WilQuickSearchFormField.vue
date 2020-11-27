<template>
  <div :class="wrapperClasses">
    <div class="header_search__3IFfo active" @click="isOpen=true">
      <div class="header_searchText__10VVZ">{{''|filterTranslation('whatAreULookingFor')}}</div>
      <i class="la la-search"></i>
    </div>
    <portal to="wil-modal" v-if="isOpen">
      <wil-quick-search-form-popup :is-open="isOpen" @close="isOpen=false" :post-types="postTypes" />
    </portal>
  </div>
</template>
<script>
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
export default {
  name: "wil-quick-search-form-field",
  data() {
    return {
      isOpen: false,
      postTypes: []
    };
  },
  created() {
    this.postTypes = [...WILOKE_GLOBAL.postTypes];
  },
  components: {
    WilQuickSearchFormPopup: () =>
      import(
        /*webpackChunkName: "WilQuickSearchFormPopup" */
        /*webpackPrefetch: true */
        "./WilQuickSearchFormPopup.vue"
      )
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe"
    }
  }
};
</script>
