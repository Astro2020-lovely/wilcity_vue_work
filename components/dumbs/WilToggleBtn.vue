<template>
  <div :class="wrapperClasses">
    <wil-link :wrapper-classes="parseBtnClasses" @click="handleClick" :btn-name="label" />
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-toggle-btn",
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    parseBtnClasses() {
      const activeClass =
        this.trueValue === this.model ? "wil-btn--primary" : "";
      return `${this.btnClasses} ${activeClass}`;
    }
  },
  methods: {
    handleClick() {
      if (this.model === this.trueValue) {
        this.model = "";
      } else {
        this.model = this.trueValue;
      }
    }
  },
  props: {
    label: {
      type: String,
      default: "Dropdown",
      required: false
    },
    wrapperClasses: {
      type: String,
      default: "filter_item__tjou1",
      required: false
    },
    btnClasses: {
      type: String,
      default: "filter_button__lo852",
      required: false
    },
    value: {
      type: [String, Number],
      default: ""
    },
    trueValue: {
      type: [String, Number],
      default: "yes"
    }
  }
};
</script>
