<template>
  <wil-lists
    v-if="postTypes.length"
    :items="postTypes"
    wrapper-classes="wil-tab-filters list-utility_module__32oNg list-none list-utility_style2__3Gfxe"
  >
    <template v-slot:list-item="{ item }">
      <wil-link
        :btn-name="item.singular_name"
        :extra-btn-class="extraBtnClasses(item)"
        :icon="item.icon"
        :style="`background-color: ${item.bgColor}`"
        @click="handleClick(item.postType)"
      />
    </template>
  </wil-lists>
</template>

<style lang="scss"></style>
<script>
export default {
  name: "wil-search-form-post-types",
  props: {
    postTypes: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: ""
    }
  },
  methods: {
    extraBtnClasses(item) {
      let classes = `wil-switch-post-type-${item.postType}`;
      if (item.postType === this.active) {
        classes = `${classes} disable`;
      }
      return classes;
    },
    handleClick(postType) {
      this.$emit("change", postType);
    }
  }
};
</script>
