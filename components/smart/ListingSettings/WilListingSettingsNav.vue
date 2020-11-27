<template>
  <wil-lists
    :items="items"
    wrapper-classes="list_module__1eis9 list-none md-hide"
    inner-classes="list_item__3YghP"
    :active="active"
  >
    <template v-slot:list-item="{item}">
      <wil-link
        @click="navigateNewTab(item)"
        wrapper-classes="list_link__2rDA1 text-ellipsis color-primary--hover"
        has-wrapper-for-icon="yes"
        :icon="item.icon"
        :btn-name="item.name"
      />
    </template>
  </wil-lists>
  <!-- End /  list_module__1eis9 list-none -->
</template>
<script>
export default {
  name: "wil-listing-settings-nav",
  data() {
    return {
      active: "general"
    };
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    navigateNewTab(item) {
      this.active = item.id;
      this.$emit("navigateTo", this.active);
    }
  }
};
</script>
