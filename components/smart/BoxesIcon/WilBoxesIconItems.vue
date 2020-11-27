<template>
  <div v-if="items.length" :class="wrapperClasses">
    <div
      v-for="(item, index) in items"
      :key="`${id}-box-icon-item-${index}`"
      :class="innerClasses"
    >
      <slot :item="item">
        <wil-boxes-icon-item :item="item" />
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-boxes-icon-items",
  components: {
    WilBoxesIconItem: () =>
      import(
        /*webpackChunkName: "WilBoxesIconItem" */
        /*webpackPreload: true */
        "./WilBoxesIconItem.vue"
      )
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "row"
    },
    innerClasses: {
      type: String,
      default: "col-sm-4"
    },
    items: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      required: true
    }
  }
};
</script>
