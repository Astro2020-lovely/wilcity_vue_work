<template>
  <div :class="wrapperClasses">
    <wil-link
      :wrapper-classes="['listing-bar_item__266Xo js-grid-button', 'grid' === model ? 'color-primary' : '']"
      icon="la la-th-large"
      @click="handleClick('grid')"
    />
    <wil-link 
      :wrapper-classes="['listing-bar_item__266Xo js-list-button', 'list' === model ? 'color-primary' : '']" 
      icon="la la-list" 
      @click="handleClick('list')" 
    />
  </div>
</template>
<script>
export default {
  name: "wil-layout-switch",
  props: {
    layout: {
      type: String,
      default: "grid"
    },
    wrapperClasses: {
      type: String,
      default: ""
    }
  },
  computed: {
    model: {
      get() {
        return this.layout;
      },
      set(layout) {
        this.$emit('change', layout);
      }
    }
  },
  methods: {
    handleClick(layout) {
      this.model = layout;
    }
  }
};
</script>
