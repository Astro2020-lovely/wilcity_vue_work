<template>
  <div :class="wrapperClasses">
    <div class="row">
      <div class="col-md-12 col-lg-12">
        <wil-input
          :label="settings.priceDescLabel"
          :value="model.price_range_desc"
        />
      </div>
      <div class="col-md-4 col-lg-4">
        <wil-select-tree
          :options="settings.rangeOptions"
          :value="model.price_range"
          :placeholder="settings.rangeLabel"
        />
      </div>
      <div class="col-md-4 col-lg-4">
        <wil-input
          :label="settings.minimumPriceLabel"
          :value="model.minimum_price"
        />
      </div>
      <div class="col-md-4 col-lg-4">
        <wil-input
          :label="settings.maximumPriceLabel"
          :value="model.maximum_price"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-price-range",
  data() {
    return {};
  },
  methods: {},
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15"
    },
    settings: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
