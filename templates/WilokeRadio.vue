<template>
  <div :class="wrapperClass">
    <div v-if="settings.label">
      <wiloke-heading
        :title="settings.label"
        :desc="settings.desc"
      ></wiloke-heading>
    </div>
    <div v-for="oOption in settings.options">
      <div
        class="checkbox_module__1K5IS checkbox_radio__1pYzR mb-15 js-checkbox"
      >
        <label class="checkbox_label__3cO9k">
          <input
            @change="changed"
            class="checkbox_inputcheck__1_X9Z"
            type="radio"
            :value="printOptionValue(oOption)"
            v-model="selected"
          />
          <span
            class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
            ><i class="la la-check"></i>
            <span class="checkbox-iconBg"></span>
          </span>
          <span class="checkbox_text__3Go1u text-ellipsis"
            >{{ printOptionName(oOption) }}
            <span class="checkbox-border"></span>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
import WilokeHeading from "./WilokeHeading.vue";

export default {
  data() {
    return {
      selected: this.settings.value
    };
  },
  props: ["settings", "wrapperClass"],
  methods: {
    printOptionValue(oOption) {
      return typeof oOption.value !== "undefined" ? oOption.value : oOption;
    },
    printOptionName(oOption) {
      return typeof oOption.label !== "undefined" ? oOption.label : oOption;
    },
    changed() {
      this.settings.value = this.selected;
      this.$emit("radioChanged", this.selected, this.settings);
    }
  },
  computed: {
    getGridClass() {
      if (typeof this.gridClass === "undefined") {
        return "col-md-12";
      }

      return this.gridClass;
    }
  },
  components: {
    WilokeHeading
  },
  mounted() {}
};
</script>
