<template>
  <div :class="wrapperClass">
    <div class="row">
      <div class="col-md-12 col-lg-12">
        <wiloke-input :settings="oPriceDesc" v-on:inputChanged="updatePriceRangeDesc"></wiloke-input>
      </div>
      <div class="col-md-4 col-lg-4">
        <wiloke-select-two v-on:selectTwoChanged="updatePriceRange" :settings="oPriceRange"></wiloke-select-two>
      </div>
      <div class="col-md-4 col-lg-4">
        <wiloke-input v-on:inputChanged="updateMinimumPrice" :settings="oMinimumPrice"></wiloke-input>
      </div>
      <div class="col-md-4 col-lg-4">
        <wiloke-input v-on:inputChanged="updateMaximumPrice" :settings="oMaximumPrice"></wiloke-input>
      </div>
    </div>
  </div>
</template>
<script>
import WilokeSelectTwo from './WilokeSelectTwo.vue';
import WilokeInput from './WilokeInput.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'wiloke-price-range',
  props: ['settings'],
  data() {
    return {
      oPlanSettings:
        typeof this.$store !== 'undefined' && typeof this.$store.getters.getPlanSettings !== 'undefined'
          ? this.$store.getters.getPlanSettings
          : {},
      oPriceRange: {
        value: this.settings.value.price_range,
        options: WILCITY_ADDLISTING.aPriceRange,
        label: this.settings.rangeLabel,
      },
      oMinimumPrice: {
        value: this.settings.value.minimum_price,
        label: this.settings.minimumPriceLabel,
      },
      oMaximumPrice: {
        value: this.settings.value.maximum_price,
        label: this.settings.maximumPriceLabel,
      },
      oPriceDesc: {
        value: this.settings.value.price_range_desc,
        label: this.settings.priceDescLabel,
      },
      oValues:
        typeof this.settings.value !== 'undefined' && this.settings.value !== ''
          ? this.settings.value
          : {
              price_range: '',
              price_range_desc: '',
              minimum_price: '',
              maximum_price: '',
            },
    };
  },
  components: {
    WilokeSelectTwo,
    WilokeInput,
  },
  methods: {
    updatePriceRangeDesc(val) {
      this.oPriceDesc.value = val;
      this.settings.value.price_range_desc = val;
    },
    updatePriceRange(val) {
      this.oPriceRange.value = val;
      this.settings.value.price_range = val;
    },
    updateMinimumPrice(val) {
      this.oMinimumPrice.value = val;
      this.settings.value.minimum_price = val;
    },
    updateMaximumPrice(val) {
      this.oMaximumPrice.value = val;
      this.settings.value.maximum_price = val;
    },
    parsePriceDesc() {
      this.oPriceDesc.value = this.settings.value.price_desc;
      this.oPriceDesc.label = this.settings.priceDescLabel;
    },
  },
  computed: {
    wrapperClass() {
      return {
        'field_module__1H6kT field_style2__2Znhe mb-15': 1 == 1,
        disable:
          typeof this.oPlanSettings['toggle_' + this.settings.key] !== 'undefined' &&
          this.oPlanSettings['toggle_' + this.settings.key] == 'disable',
      };
    },
  },
};
</script>
