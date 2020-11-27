<template>
  <div :class="parseWrapperClass">
    <wil-select-tree
      :value="model"
      :placeholder="label"
      v-validate="isRequired?'required':''"
      :data-vv-as="label"
      mode="ajaxloadroot"
      :name="generateName"
      :search-url="iconRoute"
      value-format="id"
      @change="handleFieldChange"
    />
    <div v-if="model" class="field__Icon bg-color-primary">
      <i :class="model"></i>
    </div>
    <wil-field-error-msg v-show="vErrors.has(generateName)" :msg="vErrors.first(generateName)" />
  </div>
</template>
<script>
import { FieldHelper } from "./../../mixins/FieldHelper";

export default {
  name: "wil-icon",
  mixins: [FieldHelper],
  data() {
    return {
      selectedIcon: this.value,
      aOptions: [],
      canRunSelect2: false,
      $select2: null
    };
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: "la la-edit"
    },
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15"
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    parseWrapperClass() {
      return this.model.length
        ? this.wrapperClass + " active"
        : this.wrapperClass;
    },
    iconRoute() {
      return `${WILOKE_GLOBAL.restAPI}icons?mode=select`;
    },
    model: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    }
  },
  methods: {
    handleFieldChange(val) {
      this.model = val;
    }
  }
};
</script>
