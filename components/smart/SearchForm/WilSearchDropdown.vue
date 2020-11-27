<template>
  <div :class="wrapperClasses" v-click-outside="closeEvent">
    <wil-link
      :wrapper-classes="parseDropdownBtnClasses"
      @click.prevent="toggleDropdownStatus"
      :btn-name="btnName"
    ></wil-link>
    <transition name="fade">
      <div
        v-show="dropdownStatus"
        :class="['filter_dropdown__1POEj', dropdownWrapperClasses]"
      >
        <div class="filter_close__7B_wq">
          <button @click.prevent="toggleDropdownStatus">
            <i class="la la-close"></i>
          </button>
        </div>
        <div class="filter_header__1t3yA" v-if="hasSearchField">
          <wil-input :label="searchFieldLabel" :value="keyword" />
        </div>
        <div class="filter_body__3Kyah">
          <div class="filterType3_module__2x4yA">
            <slot
              :is-loading="isLoading"
              :settings="settings"
              :dropdown-status="dropdownStatus"
              :value="value"
            ></slot>
          </div>
        </div>
        <slot name="buttom" v-if="hasFooterController">
          <div class="filter_footer__104sU clearfix">
            <div class="wil-float-left">
              <wil-link
                wrapper-classes="wil-btn wil-btn--primary wil-btn--round wil-btn--sm"
                @click="handleClear"
                :btn-name="clearBtnName"
              />
            </div>
            <div class="wil-float-right">
              <wil-link
                wrapper-classes="wil-btn wil-btn--secondary wil-btn--round wil-btn--sm"
                @click="handleApply"
                :btn-name="applyBtnName"
              />
            </div>
          </div>
        </slot>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.filterType3_module__2x4yA {
  min-height: 100px;
}
</style>
<script>
export default {
  name: "wil-search-dropdown",
  data() {
    return {
      dropdownStatus: false,
      selectedName: "",
      lastFocusActiveCache: 0
    };
  },
  created() {
    this.dropdownStatus = this.isActivate;
  },
  computed: {
    clearBtnName() {
      return this.$options.filters.filterTranslation("Clear", "clear");
    },
    applyBtnName() {
      return this.$options.filters.filterTranslation("Apply", "apply");
    },
    parseDropdownBtnClasses() {
      return this.dropdownStatus
        ? `${this.dropdownBtnClasses} active`
        : this.dropdownBtnClasses;
    }
  },
  watch: {
    settings: {
      handler(settings) {
        if (settings.lastFocusActive > this.lastFocusActiveCache) {
          this.dropdownStatus = true;
        }
      },
      deep: true
    }
  },
  methods: {
    handleClear() {
      this.dropdownStatus = false;
      this.$emit("clear");
    },
    handleApply() {
      this.dropdownStatus = false;
      this.$emit("applied");
    },
    toggleDropdownStatus() {
      this.dropdownStatus = !this.dropdownStatus;
      this.$emit("click", this.dropdownStatus, this.settings);
    },
    closeEvent() {
      this.dropdownStatus = false;
    }
  },
  props: {
    settings: {
      // clear and apply button
      type: Object,
      default() {
        return {};
      },
      required: false
    },
    dropdownWrapperClasses: {
      type: String,
      default: ""
    },
    hasFooterController: {
      // clear and apply button
      type: Boolean,
      default: true
    },
    btnName: {
      type: String,
      default: "Dropdown",
      required: false
    },
    hasSearchField: {
      type: Boolean,
      default: false,
      required: false
    },
    searchFieldLabel: {
      type: String,
      default: "Enter in your keyword",
      required: false
    },
    // options: {
    //   type: Array | Object,
    //   default: () => {},
    //   required: true
    // },
    value: {
      type: Object | Array | String | Number,
      default: () => [],
      required: false
    },
    keyword: {
      type: String,
      default: "",
      required: false
    },
    // childType: {
    //   type: String,
    //   default: "wil-radio", // Defines the type of children. There are 2 options: wil-radio / wil-checkbox
    //   required: false
    // },
    isActivate: {
      type: Boolean,
      default: false,
      required: false
    },
    isLoading: {
      type: Boolean,
      default: false,
      required: false
    },
    dropdownBtnClasses: {
      type: String,
      default: "filter_button__lo852",
      required: false
    },
    name: {
      type: String,
      default: "" // it's needed for Vee Validation
    },
    wrapperClasses: {
      type: String,
      default: "filter_item__tjou1"
    }
  }
};
</script>
