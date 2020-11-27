<template>
  <div :class="wrapperClasses">
    <slot name="wil-before" :settings="settings"></slot>

    <div v-if="isSearchField" :class="searchFieldWrapper">
      <div class="field_wrap__Gv92k">
        <input
          class="field_field__3U_Rt"
          type="text"
          v-model="search"
          @focus="isFocusingSearchField = true"
          @blur="isFocusingSearchField = false"
        />
        <span class="field_label__2eCP7 text-ellipsis">{{
          "Search" | filterTranslation("search")
        }}</span>
        <span class="bg-color-primary"></span>
      </div>
    </div>

    <ul v-if="!isHide" class="list-none">
      <li
        v-for="(option, index) in filteredOptions"
        :key="`${option.id}-${index}`"
      >
        <div class="filterType3_item__2FH4G">
          <component
            :is="parseComponent"
            :label="option.label"
            :true-value="option.id"
            :false-value="''"
            :name="name"
            v-on="{ change: handleFieldChange(option.id) }"
            :value="getValue(option.id)"
          />
        </div>
      </li>
    </ul>
    <p v-if="showAllText.length">
      <a @click.prevent="toggleShowAll" href="#">{{ showAllText }}</a>
    </p>
    <wil-alert v-else-if="errMsg.length" :msg="errMsg" />
    <slot name="wil-after" :settings="settings"></slot>
  </div>
</template>
<script>
export default {
  name: "wil-search-form-list",
  data() {
    return {
      search: "",
      isHide: true,
      clickedOnToggleShow: false,
      filteredOptions: [],
      isFocusingSearchField: false
    };
  },
  methods: {
    getValue(trueVal) {
      if (this.model === trueVal) {
        return trueVal;
      }

      return Array.isArray(this.model) && this.model.includes(trueVal)
        ? trueVal
        : "";
    },
    handleFieldChange(trueVal) {
      return val => {
        if (this.parseComponent === "wil-radio") {
          this.model = val;
        } else {
          if (val) {
            this.model = [...this.model, val];
          } else {
            if (this.model.length) {
              this.model = this.model.filter(item => {
                return item != trueVal;
              });
            }
          }
        }
      };
    },
    toggleShowAll() {
      this.isHide = !this.isHide;
    }
  },
  watch: {
    search() {
      if (!this.search.length) {
        this.filteredOptions = [...this.parseOptions];
      } else {
        this.search = this.search.toLowerCase();
        this.filteredOptions = this.parseOptions.filter(item => {
          return (
            item.label.toLowerCase().includes(this.search) ||
            item.id.toString().includes(this.search)
          );
        });
      }
    },
    parseOptions: {
      handler(options) {
        const total = options.length;
        this.filteredOptions = _.isArray(options) ? [...options] : [];

        if (!this.isMobile && total > 0) {
          this.isHide = false;
          return true;
        }

        if (!this.clickedOnToggleShow) {
          this.isHide = total > 5;
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    searchFieldWrapper() {
      return this.isFocusingSearchField || this.search.length
        ? "field_module__1H6kT field_style5__3OR3T mb-20 active"
        : "field_module__1H6kT field_style5__3OR3T mb-20";
    },
    isMobile() {
      return mobileHelper.isMobile();
    },
    showAllText() {
      if (this.totalOptions <= 5 || !this.isMobile) {
        return "";
      }

      if (this.isHide) {
        let btnName = this.$options.filters.filterTranslation(
          "",
          "showAllXItems"
        );
        return btnName.replace("%total%", this.totalOptions);
      } else {
        return this.$options.filters.filterTranslation("hide");
      }
    },
    totalOptions() {
      return this.parseOptions.length;
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    parseComponent() {
      if (this.settings.childType) {
        return this.settings.childType;
      }

      return this.component;
    },
    parseOptions() {
      if (this.settings.options) {
        return this.settings.options;
      }

      return this.options;
    }
  },
  props: {
    errMsg: {
      type: String,
      default: ""
    },
    settings: {
      type: Object,
      default() {
        return {};
      },
      required: false
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Array, Number],
      default() {
        return [];
      }
    },
    component: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    isSearchField: {
      type: Boolean,
      default: false
    }
  }
};
</script>
