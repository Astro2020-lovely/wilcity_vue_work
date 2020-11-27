<template>
  <div :class="wrapperClasses" v-if="parseOptions.length">
    <slot name="wil-before" :settings="settings"></slot>
    <wil-search-form-list
      component="wil-radio"
      :options="parseOptions"
      :value="parseVal"
      @change="handleSuggestionChange"
      name="wil-search-form-price-range-item"
    />
    <hr />
    <div class="price-change">
      <div class="price-change-input">
        <strong class="text-upercase">{{'Min'|filterTranslation('min')}}</strong>
        <span>{{currency}}</span>
        <input :label="'Min'|filterTranslation('min')" @change="handleMinChange" />
      </div>
      <span class="line"></span>
      <div class="price-change-input">
        <strong class="text-upercase">{{'Max'|filterTranslation('max')}}</strong>
        <span>{{currency}}</span>
        <input :label="'Min'|filterTranslation('max')" @change="handleMaxChange" />
      </div>
    </div>
    <slot name="wil-after" :settings="settings"></slot>
  </div>
</template>
<style scoped>
.price-change {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-uppercase {
  text-transform: uppercase;
}
.price-change span.line {
  width: calc(100% - 200px);
  display: block;
  border-bottom: thin dashed #d8d8d8;
  margin-bottom: -20px;
}
.price-change-input {
  position: relative;
}
.price-change-input strong {
  position: absolute;
  padding: 0 5px;
  bottom: 2px;
  left: 0;
}
.price-change-input input {
  border-radius: 3px;
  border: 1px solid #ced0d3;
  background-color: #fff;
  height: 25px;
  font-size: 14px;
  text-align: right;
  padding-right: 5px;
}
</style>
<script>
import WilSearchFormList from "./../SearchForm/WilSearchFormList.vue";
export default {
  name: "wil-search-form-price-range",
  components: {
    WilSearchFormList
  },
  methods: {
    handleSuggestionChange(val) {
      const parse = val.split("-");
      this.model = {
        min: parse[0],
        max: parse[1]
      };
    },
    handleMaxChange(event) {
      this.model = {
        ...this.model,
        max: event.target.value
      };
    },
    handleMinChange(event) {
      this.model = {
        ...this.model,
        min: event.target.value
      };
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    parseVal() {
      return `${this.value.min}-${this.value.max}`;
    },
    parseOptions() {
      let options = this.settings.options
        ? this.settings.options
        : this.options;
      if (!options.length) {
        return [];
      }

      return options.map(item => {
        return {
          label: `${this.currency} ${item.min} - ${item.max}`,
          id: `${item.min}-${item.max}`
        };
      });
    }
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {
        return {
          min: 0,
          max: 0
        };
      }
    },
    currency: {
      type: String,
      default: WILOKE_INLINE_GLOBAL.currency
    }
  }
};
</script>
