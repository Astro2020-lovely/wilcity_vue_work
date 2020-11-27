<template>
  <div :class="wrapperClasses">
    <date-picker
      v-model="model"
      :value-type="valueType"
      :show-time-panel="parseTimePanel"
      :format="parseFormat"
      :placeholder="label"
      :type="type"
      v-validate="isRequired ? 'required' : ''"
      :name="generateName"
      :input-class="inputClasses"
      :confirm="isConfirm"
      :confirm-text="'Set date' | filterTranslation('setDate')"
      :data-vv-as="label"
      :editable="false"
    >
      <template v-if="hasTimePanel" v-slot:footer>
        <button class="mx-btn mx-btn-text" @click.prevent="toggleTimePanel">
          {{
            toggleTimePanelText
              | filterTranslation(toggleTimePanelTranslationKey)
          }}
        </button>
      </template>
    </date-picker>
    <wil-field-error-msg
      v-show="vErrors.has(generateName)"
      :msg="vErrors.first(generateName)"
    />
  </div>
</template>
<script>
import { FieldHelper } from "./../../mixins/FieldHelper";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { TimeHelper } from "./../../mixins/TimeHelper";

export default {
  name: "wil-datepicker",
  mixins: [FieldHelper, TimeHelper],
  components: {
    DatePicker
  },
  data() {
    return {
      showTimePanel: false
    };
  },
  props: {
    type: {
      type: String,
      default: "datetime"
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    inputClasses: {
      type: String,
      default: "field_field__3U_Rt wilcity_datepicker"
    },
    label: {
      type: String,
      default: ""
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String]
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    valueType: {
      type: String,
      // default: "timestamp" // date,timestamp, format, token
      default: "timestamp" // date,timestamp, format, token
    },
    disabledDate: {
      type: Boolean,
      default: false
    },
    disabledTime: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => {}
    },
    selectDateText: {
      type: String,
      default: "Select Date"
    },
    selectTimeText: {
      type: String,
      default: "Select Time"
    },
    isConfirm: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    toggleTimePanelText() {
      return this.showTimePanel ? this.selectDateText : this.selectTimeText;
    },
    toggleTimePanelTranslationKey() {
      return this.showTimePanel ? "selectDateText" : "selectTimeText";
    },
    hasTimePanel() {
      const format = this.parseFormat.toLowerCase();
      return format.includes("h:m");
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val); // js timestamp always bigger 1000 times PHP timestamp
      }
    },
    parseFormat() {
      if (this.settings && this.settings.format) {
        return this.parseDateFormat(this.settings.format);
      }

      return this.parseDateFormat(this.format);
    },
    parseTimePanel() {
      if (this.settings && this.settings.showTimePanel) {
        return this.settings.showTimePanel;
      }

      return this.showTimePanel;
    }
  },
  methods: {
    updatedDateTime(val) {
      this.model = val;
    },
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    }
  },
  mounted() {}
};
</script>
