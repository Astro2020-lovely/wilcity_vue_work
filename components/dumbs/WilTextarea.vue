<template>
  <div :class="parseWrapperClasses">
    <div :class="innerClasses">
      <textarea
        class="field_field__3U_Rt"
        :type="inputType"
        v-model="model"
        v-validate="isRequired ? 'required' : ''"
        :name="generateName"
        :data-vv-as="label"
      ></textarea>
      <slot name="beforelabel"></slot>
      <span :class="labelClasses" v-html="label"></span>
      <span class="bg-color-primary"></span>
      <slot name="afterlabel"></slot>

      <p v-if="description.length" v-html="description"></p>
    </div>
    <wil-field-error-msg
      v-show="vErrors.has(generateName)"
      :msg="vErrors.first(generateName)"
    />
  </div>
</template>
<script lang="javascript">
import { FieldHelper } from "./../../mixins/FieldHelper";
export default {
  name: "wil-textarea",
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
    labelClasses() {
      return this.isRequired
        ? "field_label__2eCP7 text-ellipsis required"
        : "field_label__2eCP7 text-ellipsis";
    },
    parseWrapperClasses() {
      if (this.model.length) {
        return `${this.wrapperClasses} active`;
      }

      return this.wrapperClasses;
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      required: false,
      default: "field_module__1H6kT field_style2__2Znhe mb-15 js-field"
    },
    innerClasses: {
      type: String,
      required: false,
      default: "field_wrap__Gv92k"
    },
    label: {
      type: String,
      required: false,
      default: "Input"
    },
    description: {
      type: String,
      default: ""
    },
    value: {
      type: String,
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
      default: "text",
      required: false
    }
  }
};
</script>
