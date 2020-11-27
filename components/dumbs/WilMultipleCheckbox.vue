<template>
  <div :class="wrapperClasses">
    <div
      v-for="(option, index) in options"
      :key="`${generateKey}${index}`"
      class="col-md-6 col-lg-4"
    >
      <wil-checkbox
        :label="option.label"
        :true-value="option.id"
        :value="getValue(option.id)"
        v-on="{ change: handleFieldChange(index) }"
        wrapper-classes="checkbox_module__1K5IS mb-20 js-checkbox"
        inner-classes="checkbox_label__3cO9k"
      />
    </div>
  </div>
</template>
<script lang="javascript">
import WilCheckbox from "./WilCheckbox.vue";
export default {
  name: "wil-multiple-checkbox",
  methods: {
    handleFieldChange(order) {
      return (val, trueValue) => {
        if (val === "no" || !val.length) {
          this.picked = this.picked.filter(itemVal => {
            return itemVal !== trueValue;
          });
        } else {
          this.picked = this.addItem(order, val, this.picked);
        }
      };
    },
    getValue(id) {
      if (!_.isArray(this.picked)) {
        return "";
      }

      const index = this.picked.findIndex(item => {
        return item == id;
      });

      if (index !== -1) {
        return id;
      }

      return "";
    }
  },
  computed: {
    picked: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    },
    generateKey() {
      if (this.settings && this.settings.key) {
        return `${this.settings.key}-`;
      }

      return new Date().getTime();
    }
  },
  props: {
    label: {
      type: String,
      default: ""
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
      type: Array,
      default: () => [] // ['value', 'value'] => They are ids of options
    },
    wrapperClasses: {
      type: String,
      default: "checkbox_module__1K5IS mb-20 js-checkbox"
    },
    innerClasses: {
      type: String,
      default: "checkbox_label__3cO9k",
      required: false
    },
    options: {
      type: Array,
      default: () => [] //it's the same select tree [{label: 'Oke', 'id': 'oke'}]
    }
  },
  components: {
    WilCheckbox
  },
  mounted() {
    // console.log(this.options);
    // console.log(this.options);
    // console.log(this.value, 1111);
  }
};
</script>
