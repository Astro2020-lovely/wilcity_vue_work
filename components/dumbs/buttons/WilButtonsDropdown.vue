<template>
  <div :class="wrapperClasses">
    <div class="dropdown_threeDots__3fa2o" @click="handleDropdownController">
      <span class="dropdown_dot__3I1Rn"></span>
      <span class="dropdown_dot__3I1Rn"></span>
      <span class="dropdown_dot__3I1Rn"></span>
    </div>
    <div :class="parseDropdownClasses">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-buttons-dropdown",
  data() {
    return {
      isOpen: false
    };
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "dropdown_module__J_Zpj ml-20"
    },
    isActive: {
      type: Boolean,
      default: false
    },
    dropdownClasses: {
      type: String,
      default: "dropdown_itemsWrap__2fuze"
    }
  },
  watch: {
    isOpen(status) {
      if (status) {
        this.$emit("change", status);
      }
    },
    isActive: {
      handler(status) {
        this.isOpen = status;
      },
      immediate: true
    }
  },
  computed: {
    parseDropdownClasses() {
      if (this.isOpen) {
        return `${this.dropdownClasses} active`;
      }
      return this.dropdownClasses;
    }
  },
  methods: {
    handleDropdownController() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>
