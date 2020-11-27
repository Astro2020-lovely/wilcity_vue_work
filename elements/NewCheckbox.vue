<template>
    <div :class="wrapperClass">
        <label class="checkbox_label__3cO9k">
            <input class="checkbox_inputcheck__1_X9Z"
                   type="checkbox"
                   v-model="picked"
                   :true-value="trueValue"
                   :false-value="falseValue"
                   v-on:change="updatedValue">
            <span class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked">
                <i class="la la-check"></i>
                <span class="checkbox-iconBg"></span>
            </span>
            <span class="checkbox_text__3Go1u text-ellipsis" v-if="label">
                <span v-html="label"></span>
                <span class="checkbox-border"></span>
            </span>
        </label>
    </div>
</template>
<script>
export default {
  data() {
    return {
      defaultWrapperClass: "checkbox_module__1K5IS mb-20 js-checkbox",
      picked: this.value
    };
  },
  methods: {
    updatedValue() {
      this.$emit('input', this.picked, this.trueValue);
    }
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    customWrapperClass: {
      type: String,
      default: ""
    },
    trueValue: {
      type: String | Number,
      default: "yes"
    },
    falseValue: {
      type: String | Number,
      default: "no"
    },
    value: {
      type: String | Number,
      default: "no"
    }
  },
  computed: {
    innerClass() {
      if (this.customInnerClass) {
        return this.customInnerClass;
      }

      return this.defaultInnerClass;
    },
    wrapperClass() {
      if (this.customWrapperClass) {
        return this.customWrapperClass;
      }

      return this.defaultWrapperClass;
    }
  }
};
</script>
