<template>
  <div v-if="items.length" :class="[rowClasses, 'wil-flex-wrap']" :data-col-xs-gap="xsGap">
    <div v-for="(item, index) in items" :class="columnClasses" :key="`${index}-menu-item-${index}`">
      <wil-restaurant-menu-item :item="item" />
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-restaurant-menu-items",
  components: {
    WilRestaurantMenuItem: () =>
      import(
        /*webpackChunkName: "WilRestaurantMenuItem" */
        /*webpackPreload: true */
        "./WilRestaurantMenuItem.vue"
      )
  },
  props: {
    xsGap: {
      type: Number,
      default: 10
    },
    rowClasses: {
      type: String,
      default: "row"
    },
    columnClasses: {
      type: String,
      default: "col-md-12 col-lg-12"
    },
    items: {
      type: Array,
      default: () => []
    }
  }
};
</script>
