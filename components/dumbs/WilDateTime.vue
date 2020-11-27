<template>
  <wil-input
    :label="label"
    :is-required="isRequired"
    :value="model"
    input-type="datetime-local"
    :ignore-validation="true"
    name="date_format_field"
    validation-rules="date_format:yyyy-MM-ddTHH:mm"
    @change="updatedDateTime"
  />
</template>
<script>
export default {
  name: "wil-date-time",
  props: {
    label: {
      type: String,
      default: ""
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  methods: {
    updatedDateTime(val) {
      this.model = val;
    }
  }
};
</script>
