<template>
  <div :class="wrapperClasses">
    <div :class="innerClasses">
      <date-picker
        v-model="model"
        :value-type="valueType"
        :show-time-panel="parseTimePanel"
        :format="parseFormat"
        :placeholder="label"
        :type="type"
        range
        v-validate="isRequired ? 'required' : ''"
        :name="generateName"
        :input-class="inputClasses"
        :data-vv-as="label"
        @confirm="closeEventCalendar"
        @change="updatedDateTime"
        :use12h="isUsed12h"
        :open.sync="isOpen"
        :inline="parseIsInline"
        :clearable="true"
        :confirm="parseIsConfirm"
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
  </div>
</template>
<script>
import { FieldHelper } from "./../../mixins/FieldHelper";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { TimeHelper } from "./../../mixins/TimeHelper";

export default {
  name: "wil-date-range",
  mixins: [FieldHelper, TimeHelper],
  components: {
    DatePicker
  },
  data() {
    return {
      showTimePanel: false,
      isOpen: false
    };
  },
  watch: {
    parseIsInitialOpen: {
      handler() {
        this.isOpen = this.parseIsInitialOpen;
      },
      immediate: true
    }
  },
  props: {
    type: {
      type: String,
      default: "date" // date or datetime
    },
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe"
    },
    innerClasses: {
      type: String,
      default: "field_wrap__Gv92k"
    },
    isConfirm: {
      type: Boolean,
      default: false
    },
    isInline: {
      type: Boolean,
      default: false
    },
    inputClasses: {
      type: String,
      default: "field_field__3U_Rt wilcity_datepicker hasDatepicker"
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
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    valueType: {
      type: String,
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
      default() {
        return {};
      }
    },
    selectDateText: {
      type: String,
      default: "Select Date"
    },
    selectTimeText: {
      type: String,
      default: "Select Time"
    },
    isInitialOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    parseIsConfirm() {
      if (this.settings.isConfirm) {
        return this.settings.isConfirm === "yes" ? true : false;
      }

      return this.isConfirm;
    },
    parseIsInitialOpen() {
      if (this.settings.isInitialOpen) {
        return this.settings.isInitialOpen === "yes" ? true : false;
      }

      return this.isInitialOpen;
    },
    parseIsInline() {
      if (this.settings.isInline) {
        return this.settings.isInline === "yes" ? true : false;
      }

      return this.isInline;
    },
    isUsed12h() {
      return this.timeFormat === 12;
    },
    toggleTimePanelText() {
      return this.showTimePanel ? this.selectDateText : this.selectTimeText;
    },
    toggleTimePanelTranslationKey() {
      return this.showTimePanel ? "selectDateText" : "selectTimeText";
    },
    hasTimePanel() {
      if (this.settings && this.settings.format) {
        return this.parseDateFormat(this.settings.format);
      }

      const format = this.format.toLowerCase();
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
    closeEventCalendar() {
      this.isOpen = false;
      this.$emit("close");
    },
    updatedDateTime(val) {
      this.model = val;
    },
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    }
  }
};
</script>
