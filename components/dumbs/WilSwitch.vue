<template>
  <div :class="[wrapperClasses, mainWrapperClasses, marginClasses]">
    <label :class="labelClasses">
      <input
        class="checkbox_inputcheck__1_X9Z"
        type="checkbox"
        v-model="model"
        :true-value="trueValue"
        :false-value="falseValue"
      />
      <span v-if="label" class="checkbox_text__3Go1u text-ellipsis">
        <span :class="spanClasses" v-html="label"></span>
        <span class="checkbox-border"></span>
      </span>
      <span
        class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
      >
        <i class="la la-check"></i>
        <span class="checkbox-iconBg"></span>
      </span>
    </label>
  </div>
</template>
<script>
export default {
  name: "wil-switch",
  props: {
    wrapperClasses: {
      type: String,
      default: ""
    },
    marginClasses: {
      type: String,
      default: ""
    },
    settings: {
      type: Object,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      default: "style1"
    },
    spanClasses: {
      type: String,
      default: ""
    },
    labelClasses: {
      type: String,
      default: "checkbox_label__3cO9k"
    },
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number, Boolean],
      default: ""
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: "yes"
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: "no"
    }
  },
  created() {
    console.log(this.falseValue);
  },
  computed: {
    parseType() {
      if (this.settings.switchType) {
        return this.settings.switchType;
      }

      return this.type;
    },
    mainWrapperClasses() {
      if (this.parseType === "style1" || this.parseType === "fullwidth") {
        return "checkbox_module__1K5IS checkbox_toggle__vd6vd checkbox_full__jTSmg";
      }

      return "checkbox_module__1K5IS checkbox_toggle__vd6vd";
    },
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
