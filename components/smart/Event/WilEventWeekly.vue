<template>
  <div :class="wrapperClasses">
    <wil-radio
      v-for="day in dayOfWeek"
      :key="`wil-day-of-week-${day.value}`"
      :true-value="day.value"
      :value="model"
      @change="handleFieldChange"
      :label="day.label"
    />
  </div>
</template>
<script>
export default {
  name: "wil-event-weekly",
  data() {
    return {
      dayOfWeek: []
    };
  },
  created() {
    this.dayOfWeek = this.$options.filters.filterTranslation("", "oDaysOfWeek");
  },
  methods: {
    handleFieldChange(day) {
      this.model = day;
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(day) {
        this.$emit("change", day);
      }
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    }
  }
};
</script>
