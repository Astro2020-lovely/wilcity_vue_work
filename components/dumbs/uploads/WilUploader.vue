<template>
  <div>
    <wil-wp-uploader
      v-if="mode === 'wp'"
      :value="model"
      :field="field"
      :label="label"
      :is-required="isRequired"
      :maximum-items="maximumItems"
      @change="handleFieldChange"
      :wrapper-classes="wrapperClasses"
    />
    <wil-default-uploader
      v-else
      :value="model"
      :field="field"
      :label="label"
      :is-required="isRequired"
      :maximum-items="maximumItems"
      @change="handleFieldChange"
      :wrapper-classes="wrapperClasses"
    />
    <wil-field-error-msg
      v-show="vErrors.has(generateName)"
      :msg="vErrors.first(generateName)"
    />
    <div v-if="parseDesc" class="mt-20 wil-field-desc">
      <p>{{ parseDesc }}</p>
    </div>
  </div>
</template>
<script lang="javascript">
import WilWPUploader from "./WilWPUploader.vue";
import WilDefaultUploader from "./WilDefaultUploader.vue";
import { FieldHelper } from "./../../../mixins/FieldHelper";
export default {
  name: "wil-uploader",
  mixins: [FieldHelper],
  data() {
    return {
      mode: WILOKE_GLOBAL.uploadType
    };
  },
  props: {
    value: {
      type: [Array, Object],
      default: () => []
    },
    field: {
      type: Object,
      default: () => {}
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    maximumItems: {
      type: Number,
      default: 1,
      required: false
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  computed: {
    parseDesc() {
      if (_.isEmpty(this.description)) {
        return "";
      }

      return this.description.replace('%maximum%', this.maximumItems);
    },
    validationRules() {
      let rules = [];
      if (this.isRequired) {
        rules = ["required"];
      }

      if (this.maximumItems > 1) {
        rules = [...rules, `length:${this.maximumItems}`];
      }
      return rules.join("|");
    },
    model() {
      if (this.value === "") {
        if (this.maximumItems === 1) {
          return {};
        }

        return [];
      }
      return this.value;
    }
  },
  components: {
    "wil-wp-uploader": WilWPUploader,
    WilDefaultUploader
  },
  mounted() {
    // console.log("Uploader", this.value);
  },
  methods: {
    handleFieldChange(val) {
      this.$emit("change", val);
    }
  }
};
</script>
