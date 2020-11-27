<template>
  <div :class="wrapperClasses">
    <label :class="innerClasses">
      <input
        class="checkbox_inputcheck__1_X9Z"
        type="checkbox"
        v-model="picked"
        :true-value="trueValue"
        :false-value="falseValue"
      />
      <span
        class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
      >
        <i class="la la-check"></i>
        <span class="checkbox-iconBg"></span>
      </span>
      <span class="checkbox_text__3Go1u text-ellipsis">
        <span v-html="label"></span>
        <span class="checkbox-border"></span>
      </span>
    </label>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-checkbox",
  computed: {
    picked: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal, this.trueValue);
      }
    }
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    trueValue: {
      type: [String, Number],
      default: "yes"
    },
    falseValue: {
      type: [String, Number],
      default: "no"
    },
    value: {
      type: [String, Number],
      default: "no"
    },
    wrapperClasses: {
      type: String,
      default: "checkbox_module__1K5IS mb-20 js-checkbox"
    },
    innerClasses: {
      type: String,
      default: "checkbox_label__3cO9k",
      required: false
    }
  }
};
</script>
