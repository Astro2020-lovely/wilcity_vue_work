<template>
  <div :class="wrapperClasses">
    <div class="col-md-4 col-lg-4">
      <template v-for="hourOption in oHourOptions">
        <wil-radio
          :key="`business-hour-option-${hourOption.id}`"
          :label="hourOption.label"
          :true-value="hourOption.id"
          :value="getValue('hourMode')"
          v-on="{ change: handleFieldChange('hourMode') }"
        />
      </template>
    </div>
    <div v-if="isShowForm" class="col-xs-12">
      <wil-select-tree
        :placeholder="settings.timeFormatLabel"
        :options="timeFormat"
        :value="getValue('timeFormat')"
        v-on="{ change: handleFieldChange('timeFormat') }"
      />

      <div class="list-hours_module__CE4hn js-list-hours">
        <business-hours
          :days="parseDays"
          :days-translation="daysTranslation"
          v-on="{ change: handleFieldChange('operating_times') }"
          :closes-text="'Closes' | filterTranslation('closes')"
          :open-text="'Open' | filterTranslation('open')"
          :closed-text="'Closed' | filterTranslation('closed')"
          :add-hours-text="'Add hour' | filterTranslation('addHours')"
          :time-format="model.timeFormat"
          :time-increment="timeIncrement"
          :default-open="stdOpenTime"
          :default-closed="stdCloseTime"
          type="select"
        />
      </div>
    </div>
  </div>
</template>
<script lang="javascript">
import BusinessHours from "vue-business-hours-wilcity-exnteded";

export default {
  name: "wil-business-hour",
  components: {
    BusinessHours
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "row",
      required: false
    },
    hourMode: {
      type: String,
      default: "open_for_selected_hours",
      required: false
    },
    value: {
      type: Object, // {timeFormat: 12, hourMode: '', operating_times: [{sunday: {open: '', close: '', id: '', isOpen: false}}]}
      default: () => {},
      required: false
    },
    settings: {
      type: Object,
      default: () => {},
      required: false
    },
    timeIncrement: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {
      timeFormat: WILCITY_ADDLISTING_INLINE.timeFormat,
      days: WILCITY_ADDLISTING_INLINE.businessHours
    };
  },
  computed: {
    daysTranslation() {
      return this.$options.filters.filterTranslation('daysWeek');
    },
    uquidId() {
      return new Date().getTime();
    },
    stdOpenTime() {
      if (!!this.settings.stdOpeningTime) {
        const parsed = this.settings.stdOpeningTime.split(":");
        return `${parsed[0]}${parsed[1]}`;
      }
      return "0800";
    },
    stdCloseTime() {
      if (!!this.settings.stdClosedTime) {
        const parsed = this.settings.stdClosedTime.split(":");
        return `${parsed[0]}${parsed[1]}`;
      }

      return "1700";
    },
    parseDays() {
      let parseDays = {};

      for (let [key, day] of Object.entries(this.days)) {
        parseDays = {
          ...parseDays,
          [key]: [
            {
              id: `${this.uquidId}-${key}`,
              isOpen: false,
              open: this.stdOpenTime,
              close: this.stdCloseTime
            }
          ]
        };
      }

      if (_.isEmpty(this.value) || _.isEmpty(this.value.operating_times)) {
        return parseDays;
      }

      const operatingTimes = this.value.operating_times;
      for (let [key, day] of Object.entries(parseDays)) {
        parseDays = {
          ...parseDays,
          [key]: operatingTimes[key] ? operatingTimes[key] : day
        };
      }

      return parseDays;
    },
    model: {
      get() {
        return this.value ? this.value : {};
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    isShowForm() {
      return (
        this.model.hourMode && this.model.hourMode === "open_for_selected_hours"
      );
    },
    oHourOptions() {
      return [
        {
          id: "open_for_selected_hours",
          label: this.$options.filters.filterTranslation(
            "",
            "openForSelectedHours"
          )
        },
        {
          id: "always_open",
          label: this.$options.filters.filterTranslation("", "alwaysOpen")
        },
        {
          id: "no_hours_available",
          label: this.$options.filters.filterTranslation("", "noHoursAvailable")
        }
      ];
    }
  },
  methods: {
    getValue(key) {
      return this.model[key] ? this.model[key] : "";
    },
    handleFieldChange(key) {
      return val => {
        this.model = {
          ...this.model,
          [key]: val
        };
      };
    }
  },
  mounted() {
    // console.log(this.settings);
  }
};
</script>
