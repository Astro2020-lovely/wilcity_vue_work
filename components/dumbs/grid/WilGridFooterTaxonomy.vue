<template>
  <div class="icon-box-1_block1__bJ25J">
    <wil-grid-term v-if="item.value" :item="item.value" />
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-grid-footer-taxonomy",
  components: {
    WilGridTerm: () =>
      import(
        /* webpackChunkName: "WilGridTerm" */
        /* webpackPreload: true */
        "./WilGridTerm.vue"
      )
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
