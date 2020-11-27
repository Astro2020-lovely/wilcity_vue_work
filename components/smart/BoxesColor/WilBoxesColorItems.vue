<template>
  <div v-if="boxes.length" :class="wrapperClasses" :data-col-xs-gap="xsGap">
    <div
      v-for="(item, order) in boxes"
      :key="`wil-boxes-color-item-${order}`"
      :class="parseInnerClasses"
    >
      <slot :item="item">
        <wil-boxes-color-item :item="item" :post-id="postId" />
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-boxes-color-items",
  components: {
    WilBoxesColorItem: () =>
      import(
        /*webpackChunkName:  "WilBoxesColorItem"*/
        /*webpackPreload: true */
        "./WilBoxesColorItem.vue"
      )
  },
  props: {
    xsGap: {
      type: Number,
      default: 20
    },
    innerClasses: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    postId: {
      type: Number
    },
    boxes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    parseInnerClasses() {
      const totalItems = this.boxes.length;
      return `${this.innerClasses} col-xs-12 col-sm-12`;
    }
  }
};
</script>
