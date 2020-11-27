<template>
  <div :class="wrapperClasses">
    <div class="rated-slider_item__3pr-4 d-table-row">
      <div
        v-if="label.length"
        class="rated-slider_text__RSWfi d-table-cell"
        v-html="label"
      ></div>
      <div class="rated-slider_slider__ncPAq d-table-cell">
        <vue-slider
          v-model="model"
          :process="isProcess"
          :min="minimum"
          :max="maximum"
          :tooltip="tooltipMode"
        />
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import VueSlider from "vue-slider-component";
export default {
  name: "wil-slider-range",
  components: {
    VueSlider
  },
  props: {
    isProcess: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "rated-slider_module__s79oc d-table"
    },
    maximum: {
      type: Number,
      default: 100
    },
    minimum: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: 0
    },
    tooltipMode: {
      type: String,
      default: "always" // always, none, active - means tooltip shows up when sliding
    },
    color: {
      type: String,
      default: "#f06292"
    },
    direction: {
      type: String,
      default: "ltr"
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
    }
  }
};
</script>
