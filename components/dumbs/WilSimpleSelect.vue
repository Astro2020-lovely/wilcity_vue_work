<template>
  <div :class="[wrapperClasses, 'my-select_module__21-KJ']">
    <div :class="[innerClasses, 'my-select_wilSelect__1Glxd']">
      <select v-if="isMultiple" v-model="model" multiple>
        <option
          v-for="option in options"
          :value="option.id"
          v-html="option.label"
          :key="`${uquid}-${option.id}`"
        ></option>
      </select>
      <select v-else v-model="model">
        <option
          v-for="option in options"
          :value="option.id"
          v-html="option.label"
          :key="`${uquid}-${option.id}`"
        ></option>
      </select>
      <slot name="label" :label="label" :is-required="isRequired">
        <span
          :class="['field_label__2eCP7 text-ellipsis', isRequired ? 'required' : '']"
          v-html="label"
        ></span>
        <span class="bg-color-primary"></span>
      </slot>
    </div>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-simple-select",
  props: {
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15",
      required: false
    },
    innerClasses: {
      type: String,
      default: "field_wrap__Gv92k"
    },
    label: {
      type: String,
      default: ""
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    maximumItems: {
      type: Number,
      default: 1
    },
    value: {
      type: [String, Array, Object],
      description: "Select value",
      default: "",
      required: false
    },
    options: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    errorMsg: {
      type: String,
      default: "",
      required: false
    }
  },
  computed: {
    uquid() {
      return new Date().getTime();
    },
    model: {
      get() {
        if (!this.value) {
          return this.isMultiple ? [] : "";
        }
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      }
    },
    isMultiple() {
      return this.maximumItems > 1;
    }
  }
};
</script>
