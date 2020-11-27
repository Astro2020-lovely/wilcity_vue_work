<template>
  <div :class="parseWrapperClasses">
    <vue-autosuggest
      :suggestions="options"
      :input-props="{
        id: generateId,
        class: fieldClasses,
        placeholder: parsePlaceholder
      }"
      @input="handleInputChange"
      @selected="selectHandler"
      @focus="handleFocusSearchField"
      :value="defaultSearch"
      style="parseStyles"
    >
      <template v-slot:after-input>
        <span
          v-if="label.length"
          :class="[
            'field_label__2eCP7 text-ellipsis',
            isRequired ? 'required' : ''
          ]"
          v-html="label"
        ></span>
        <i v-show="isSearching" class="fa fa-spinner fa-spin"></i>
      </template>
      <template slot-scope="{ suggestion }">
        <a :href="suggestion.item.link">
          <img
            v-if="suggestion.item.featuredImage"
            class="featured-image small"
            :src="suggestion.item.featuredImage"
            :alt="getName(suggestion)"
          />
          <i
            v-else-if="suggestion.item.icon && suggestion.item.iconColor"
            :class="suggestion.item.icon"
            :style="{ color: suggestion.item.iconColor }"
          ></i>
          <i v-else-if="suggestion.item.icon" :class="suggestion.item.icon"></i>
          <span class="my-suggestion-item" v-html="getName(suggestion)"></span>
        </a>
      </template>
      <template v-slot:after-suggestions v-if="errMsg.length">
        <wil-field-error-msg :msg="errMsg" />
      </template>
    </vue-autosuggest>
  </div>
</template>
<style lang="scss" scope>
/deep/ .wil-has-loading {
  width: 96%;
}
</style>
<script lang="javascript">
import { VueAutosuggest } from "vue-autosuggest";

export default {
  name: "wil-auto-complete",
  data() {
    return {
      options: [],
      CancelToken: null,
      isSearching: false,
      cancelSource: null,
      handleSearch: null,
      selectedKeyword: null,
      keyword: null,
      previousSelected: {}
    };
  },
  props: {
    module: {
      type: String,
      default: ""
    },
    hasLoadingIcon: {
      type: Boolean,
      default: false
    },
    defaultSearch: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe"
    },
    placeholder: {
      type: String,
      default: "",
      required: false
    },
    endpoint: {
      type: String,
      default: "autocomplete",
      required: false
    },
    label: {
      type: String,
      default: "",
      required: false
    },
    externalParams: {
      // EG: If this field is a part of a Search form, The results may depend on other fields
      type: Object,
      default: () => {},
      required: false
    },
    redirectTarget: {
      type: String,
      default: "_blank",
      required: false
    },
    focusSearchByMap: {
      type: Boolean,
      default: false
    },
    errMsg: {
      type: String,
      default: ""
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    postType: {
      type: String,
      default: ""
    },
    searchTarget: {
      type: Array,
      default: () => ["listing_location", "listing", "geocoder"] // listing_location,listing,geocoder
    },
    settings: {
      type: Object,
      default() {
        return {};
      }
    },
    pluck: {
      type: [String, Array],
      default: () => []
    },
    queryArgs: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.CancelToken = Vue.axios.CancelToken;
  },
  computed: {
    parsePlaceholder() {
      if (this.settings.placeholder) {
        return this.settings.placeholder;
      }

      return this.placeholder;
    },
    generateId() {
      const id = new Date().getTime();
      return `autosuggest__input-${id}`;
    },
    parsePluck() {
      if (this.settings && this.settings.pluck) {
        return this.settings.pluck;
      }

      return this.pluck;
    },
    parseQueryArgs() {
      if (this.settings && this.settings.queryArgs) {
        return this.settings.queryArgs;
      }

      return this.queryArgs;
    },
    parseEndpoint() {
      if (this.settings && this.settings.endpoint) {
        return this.settings.endpoint;
      }

      return this.endpoint;
    },
    parseSearchTarget() {
      if (this.settings && this.settings.searchTarget) {
        return this.settings.searchTarget;
      }

      return this.searchTarget;
    },
    parseWrapperClasses() {
      return this.keyword || this.parsePlaceholder.length
        ? `${this.wrapperClasses} active`
        : this.wrapperClasses;
    },
    fieldClasses() {
      return this.hasLoadingIcon
        ? "field_field__3U_Rt wil-has-loading"
        : "field_field__3U_Rt";
    }
  },
  watch: {
    keyword() {
      this.$emit("keyword-change", this.keyword);
    }
  },
  methods: {
    getName(suggestion) {
      return suggestion.item.name
        ? suggestion.item.name
        : suggestion.item.title;
    },
    handleFocusSearchField(event) {
      // When redirecting from another page to search page, We will search value when focusing
      if (!_.isEmpty(event.target.value) && _.isEmpty(this.options)) {
        this.handleInputChange(event.target.value);
      }
    },
    handleInputChange(keyword) {
      this.keyword = keyword;
      if (this.selectedKeyword === keyword.trim()) {
        return false;
      }

      if (!this.keyword.length) {
        this.$emit("change", "");
        if (this.handleSearch !== null) {
          clearTimeout(this.handleSearch);
        }
      }

      let params = {
        ...this.externalParams,
        s: keyword,
        focusSearchByMap: this.focusSearchByMap,
        searchTarget: this.parseSearchTarget
      };

      if (this.postType.length) {
        params = {
          ...params,
          postType: this.postType
        };
      }

      if (!_.isEmpty(this.parseQueryArgs)) {
        params = {
          ...params,
          ...this.parseQueryArgs
        };

        if (!!this.module) {
          params = {
            ...params,
            module: this.module
          }
        }
      }

      if (!_.isEmpty(this.parsePluck)) {
        params = {
          ...params,
          pluck: this.parsePluck
        };
      }

      if (this.handleSearch !== null) {
        clearTimeout(this.handleSearch);
      }

      this.isSearching = true;
      this.handleSearch = setTimeout(() => {
        Vue.axios
          .get(`${WILOKE_GLOBAL.restAPI}${this.parseEndpoint}`, {
            params: params,
            cancelToken: new this.CancelToken(c => {
              if (this.cancelSource) {
                this.cancelSource();
              }
              this.cancelSource = c;
            })
          })
          .then(response => {
            if (response.data.status === "success") {
              this.options = [
                {
                  data: [...response.data.items]
                }
              ];
            } else {
              this.options = [];
            }
            this.isSearching = false;
          })
          .catch(error => {
            this.isSearching = false;
          })
          .finally(() => {
            this.cancelSource = null;
            clearTimeout(this.handleSearch);
          });
      }, 1000);
    },
    selectHandler(suggestion) {
      if (suggestion.item.type === "post") {
        window.open(suggestion.item.link, this.redirectTarget);
      } else {
        if (this.selectedKeyword !== this.getName(suggestion)) {
          this.$emit("change", suggestion, this.previousSelected);
          this.previousSelected = { ...suggestion };
        }
      }

      this.selectedKeyword = this.getName(suggestion);
    },
    clickHandler() {}
  },
  components: {
    VueAutosuggest
  }
};
</script>
