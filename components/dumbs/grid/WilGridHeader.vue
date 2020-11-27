<template>
  <div class="wil-grid-header-wrapper">
    <slot name="beforegridmeta" :item="items"></slot>
    <template v-for="(item, index) in items">
      <wil-favorite
        v-if="item.type==='favorite'"
        :key="`${itemKeyPrefix}${item.type}`"
        :post="post"
        :icon-type="item.iconType"
        :saved="item.saved"
        v-on="{change: handleFavoriteChange(index, 'saved')}"
      />
      <wil-link
        v-else
        :key="`${itemKeyPrefix}${item.type}`"
        :wrapper-classes="btnClasses"
        :link="item.value"
        :icon="item.icon"
        :btn-name="linkBtnText(item)"
      />
    </template>
    <slot name="aftergridmeta" :item="items"></slot>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-grid-header",
  components: {
    WilFavorite: () =>
      import(
        /* webpackChunkName: "WilFavorite" */
        /* webpackPreload: true */
        "./WilFavorite.vue"
      )
  },
  computed: {
    itemKeyPrefix() {
      return `wil-grid-meta-${this.post.postID}-`;
    }
  },
  props: {
    btnClasses: {
      type: String,
      default:
        "utility-meta_module__mfOnV utility-meta_light__2EzdO utility-meta_border__3O9g6  mb-10 mr-5",
      required: false
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    post: {
      type: Object,
      required: true,
      default: () => []
    }
  },
  methods: {
    linkBtnText(item) {
      const btnName = item.name ? item.name : item.value;

      return this.$options.filters.filterTranslation(btnName);
    },
    btnName(item) {
      let btnName = "";
      if (item.i18) {
        btnName = this.$options.filters.filterTranslation(item.name, item.i18);
      } else if (item.name) {
        btnName = item.name;
      }
      return btnName;
    },
    handleFavoriteChange(index, changed) {
      return val => {
        let item = { ...this.items[index] };
        item = {
          ...item,
          [changed]: val
        };
        this.$emit(
          "change",
          this.updateItemValueInArray(index, item, this.items)
        );
      };
    }
  }
};
</script>
