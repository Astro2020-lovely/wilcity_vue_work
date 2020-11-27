<template>
  <div :class="wrapperClasses">
    <label :class="innerClasses">
      <input
        class="checkbox_inputcheck__1_X9Z"
        type="radio"
        v-model="picked"
        :name="name"
        :value="trueValue"
      />
      <span
        class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
      >
        <i class="la la-check"></i>
        <span class="checkbox-iconBg"></span>
      </span>
      <span class="checkbox_text__3Go1u text-ellipsis">
        <span v-if="label" v-html="label"></span>
        <span class="checkbox-border"></span>
      </span>
    </label>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-radio",
  computed: {
    picked: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    }
  },

  methods: {
    handleFieldChange(event) {
      this.picked = event.target.value;
    }
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "checkbox_module__1K5IS checkbox_radio__1pYzR mb-15"
    },
    innerClasses: {
      type: String,
      default: "checkbox_label__3cO9k"
    },
    trueValue: {
      type: [String, Number],
      default: "yes"
    },
    falseValue: {
      type: [String, Number],
      default: "no"
    },
    value: {
      type: String | Number,
      default: "no"
    },
    name: {
      // this helps to use more than 2 radio types on a form
      type: String,
      default: "radio",
      required: false
    }
  }
};
</script>
