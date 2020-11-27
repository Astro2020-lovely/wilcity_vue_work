<template>
  <div :class="wrapperClasses">
    <template v-if="items.length">
      <slot name="before-row"></slot>
      <div
        :class="[rowClasses, 'row js-listing-grid']"
        :data-col-xs-gap="colXsGap"
        :data-col-sm-gap="colSmGap"
        :data-col-md-gap="colMdGap"
      >
        <template v-if="items && items.length">
          <div
            v-for="(item, index) in items"
            :class="columnClasses"
            :key="generateKey(item, index)"
          >
            <slot name="griditem" :item="item" :index="index" :type="type"></slot>
          </div>
        </template>
      </div>
      <slot name="after-row"></slot>
      <template v-if="isPagination">
        <slot name="pagination" :item="items"></slot>
      </template>
    </template>
    <template v-else-if="errorMsg && errorMsg.length">
      <slot name="foundnolistings">
        <wil-alert :msg="errorMsg"></wil-alert>
      </slot>
    </template>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-grid",
  data() {
    return {
      rowsHeight: []
    };
  },
  methods: {
    generateKey(item, index) {
      const id = item.key ? item.key : index;
      return `grid-item-${id}`;
    }
  },
  props: {
    items: {
      type: [Object, Array],
      default: () => [],
      required: true
    },
    wrapperClasses: {
      type: String,
      default: "wil-page-content",
      required: false
    },
    rowClasses: {
      type: String,
      default: "js-listing-grid",
      required: false
    },
    type: {
      type: String,
      default: "grid"
    },
    colMdGap: {
      type: Number,
      default: 15,
      required: false
    },
    colSmGap: {
      type: Number,
      default: 10,
      required: false
    },
    colXsGap: {
      type: Number,
      default: 10,
      required: false
    },
    columnClasses: {
      type: String,
      default: "col-xs-12 col-sm-12 col-md-4 col-lg-3",
      required: false
    },
    isLoading: {
      type: [String, Boolean],
      default: false,
      required: false
    },
    errorMsg: {
      type: String,
      default: ""
    },
    isPagination: {
      type: Boolean,
      default: true
    }
  }
};
</script>
