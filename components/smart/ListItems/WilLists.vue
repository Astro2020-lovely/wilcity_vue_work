<template>
  <ul v-if="hasItem" :class="wrapperClasses">
    <li
      v-for="(item, order) in items"
      :key="`${uquid}-${order}`"
      :class="[
        innerClasses,
        active.length && (active === item.key || active === item.id)
          ? 'active'
          : ''
      ]"
    >
      <slot name="list-item" :item="item" :order="order"></slot>
    </li>
  </ul>
</template>
<script>
export default {
  name: "wil-lists",
  computed: {
    hasItem() {
      if (Array.isArray(this.items)) {
        return this.items.length;
      }

      return Object.values(this.items).length;
    },
    uquid() {
      return `${new Date().getTime()}_`;
    }
  },
  props: {
    items: {
      type: [Array, Object],
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: "list-utility_module__32oNg list-none list-utility_style2__3Gfxe"
    },
    innerClasses: {
      type: String,
      default: "list-utility_list__1DzGk"
    },
    active: {
      type: String,
      default: ""
    }
  }
};
</script>
