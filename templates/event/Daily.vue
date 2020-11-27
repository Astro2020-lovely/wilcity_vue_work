<template>
  <div class="bg-color-gray-3 bd-color-gray-1 pd-15 mb-20">
    <div class="row">
      <div class="col-md-2 col-lg-2">
        <div class="mt-25">{{oTranslation.starts}}</div>
      </div>
      <div class="col-md-10 col-lg-10">
        <wiloke-datepicker
          @datepickerChanged="startsChanged"
          :settings="{value: oDailySettings.starts, isRequired: 'yes'}"
        ></wiloke-datepicker>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2 col-lg-2">
        <div class="mt-25">{{oTranslation.endson}}</div>
      </div>
      <div class="col-md-10 col-lg-10">
        <wiloke-datepicker
          @datepickerChanged="endsOnChanged"
          :settings="{value: oDailySettings.endsOn, isRequired: 'yes'}"
        ></wiloke-datepicker>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2 col-lg-2">
        <div class="mt-25">{{oTranslation.time}}</div>
      </div>
      <div class="col-md-5 col-lg-5">
        <wiloke-time
          @timeChanged="openingAtChanged"
          :settings="{value: oDailySettings.openingAt, isRequired: 'yes'}"
        ></wiloke-time>
      </div>
      <div class="col-md-5 col-lg-5">
        <wiloke-time
          @timeChanged="closedAtChanged"
          :settings="{value: oDailySettings.closedAt, isRequired: 'yes'}"
        ></wiloke-time>
      </div>
    </div>
  </div>
</template>
<script>
import WilokeTime from "./../../templates/WilokeTime.vue";
import WilokeDatepicker from "./../../templates/WilokeDatepicker.vue";

export default {
  data() {
    return {
      oTranslation: WILCITY_I18,
      oDailySettings: {
        starts: "",
        endsOn: "",
        openingAt: "",
        closedAt: ""
      }
    };
  },
  props: ["oData"],
  watch: {
    oData: {
      handler: function(oNewValue) {
        this.oDailySettings = this.oData;
      },
      deep: true
    }
  },
  methods: {
    startsChanged(newVal) {
      this.$set(this.oDailySettings, "starts", newVal);
      this.emitUpdate(newVal, "starts");
    },
    endsOnChanged(newVal) {
      this.$set(this.oDailySettings, "endsOn", newVal);
      this.emitUpdate(newVal, "endsOn");
    },
    openingAtChanged(newVal) {
      this.$set(this.oDailySettings, "openingAt", newVal);
      this.emitUpdate(newVal, "openingAt");
    },
    closedAtChanged(newVal) {
      this.$set(this.oDailySettings, "closedAt", newVal);
      this.emitUpdate(newVal, "closedAt");
    },
    emitUpdate(newVal, key) {
      this.$emit("dailyChanged", newVal, key);
    }
  },
  components: {
    WilokeTime,
    WilokeDatepicker
  },
  beforeMount() {
    this.oDailySettings = this.oData;
  }
};
</script>
