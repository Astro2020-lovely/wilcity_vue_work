<template>
  <div :class="parseWrapperClasses">
    <div :class="innerClasses">
      <input
        :class="fieldClasses"
        v-validate="parseValidationRules"
        :data-vv-as="label"
        :name="generateName"
        :type="determineInputType"
        v-model="model"
      />
      <slot name="beforelabel"></slot>
      <span :class="labelClasses" v-html="label"></span>
      <p v-if="description.length" v-html="description"></p>
      <span class="bg-color-primary"></span>
      <slot name="afterlabel"></slot>
    </div>
    <wil-field-error-msg
      v-if="!ignoreValidation && vErrors.has(generateName)"
      :msg="vErrors.first(generateName)"
    />
  </div>
</template>
<script lang="javascript">
import { FieldHelper } from "./../../mixins/FieldHelper";
export default {
  name: "wil-input",
  mixins: [FieldHelper],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    },
    parseValidationRules() {
      let rules = "";
      if (!this.ignoreValidation && this.isRequired) {
        rules = "required";
      }

      if (this.validationRules.length) {
        if (rules.length) {
          rules = `${rules}|${this.validationRules}`;
        } else {
          rules = this.validationRules;
        }
      }
      return rules;
    },
    determineInputType() {
      if (this.inputType.length) {
        return this.inputType;
      }
      if (this.settings && this.settings.inputType) {
        return this.settings.inputType;
      }

      return "text";
    },
    labelClasses() {
      return this.isRequired
        ? "field_label__2eCP7 text-ellipsis required"
        : "field_label__2eCP7 text-ellipsis";
    },
    parseWrapperClasses() {
      if (this.model.toString().length || this.inputType === "datetime-local") {
        return `${this.wrapperClasses} active`;
      }

      return this.wrapperClasses;
    }
  },
  props: {
    fieldClasses: {
      type: String,
      default: "field_field__3U_Rt"
    },
    validationRules: {
      type: String,
      default: ""
    },
    ignoreValidation: {
      type: Boolean,
      default: false
    },
    wrapperClasses: {
      type: String,
      required: false,
      default: "field_module__1H6kT field_style2__2Znhe mb-15"
    },
    innerClasses: {
      type: String,
      required: false,
      default: "field_wrap__Gv92k"
    },
    label: {
      type: String,
      required: false,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      required: false,
      default: ""
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: false
    },
    inputType: {
      type: String,
      default: "",
      required: false
    },
    settings: {
      type: Object,
      default() {
        return {};
      },
      required: false
    }
  }
};
</script>
