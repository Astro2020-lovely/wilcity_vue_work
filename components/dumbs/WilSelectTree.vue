<template>
  <div :class="parseWrapperClasses">
    <div :class="innerClasses" style="z-index:auto">
      <div>
        <treeselect
          v-if="parseMode === 'ajax'"
          :options="parseOptions"
          :load-options="asyncLoadOptions"
          v-validate="`${validationRules}`"
          :data-vv-as="label"
          :name="generateName"
          :searchable="true"
          :multiple="isMultiple"
          :flat="isMultiple"
          :default-expand-level="0"
          :placeholder="placeholder"
          :auto-load-root-options="false"
          :async="true"
          :loading-text="'Loading' | filterTranslation('loadingText')"
          :auto-deselect-descendants="autoDeselectDescendants"
          :auto-select-descendants="autoSelectDescendants"
          :auto-select-acenstors="autoSelectAncestors"
          :value-format="parseValueFormat"
          @open="isFocusing = true"
          v-model="model"
          :rtl="isRtl"
          search-nested
          :before-clear-all="handleCloseSelection"
        >
          <wil-select-tree-options
            slot="option-label"
            slot-scope="props"
            :props="props"
            :settings="settings"
            :default-options="parseDefaultOptions"
          />
          <wil-select-tree-options
            slot="value-label"
            slot-scope="props"
            :props="props"
            :settings="settings"
            :default-options="parseDefaultOptions"
          />
        </treeselect>
        <treeselect
          v-else-if="parseMode === 'ajaxloadroot'"
          :default-options="defaultOptions"
          :options="parseOptions"
          :load-options="loadRootOptions"
          v-validate="`${validationRules}`"
          :data-vv-as="label"
          :name="generateName"
          :searchable="true"
          :multiple="isMultiple"
          :flat="isMultiple"
          :default-expand-level="0"
          :placeholder="placeholder"
          :auto-load-root-options="false"
          :loading-text="'Loading' | filterTranslation('loadingText')"
          :auto-deselect-descendants="autoDeselectDescendants"
          :auto-select-descendants="autoSelectDescendants"
          :auto-select-acenstors="autoSelectAncestors"
          :value-format="parseValueFormat"
          v-model="model"
          @open="isFocusing = true"
          :rtl="isRtl"
          search-nested
          :before-clear-all="handleCloseSelection"
        >
          <wil-select-tree-options
            slot="option-label"
            slot-scope="props"
            :props="props"
            :settings="settings"
            :default-options="parseDefaultOptions"
          />
          <wil-select-tree-options
            slot="value-label"
            slot-scope="props"
            :props="props"
            :settings="settings"
            :default-options="parseDefaultOptions"
          />
        </treeselect>
        <treeselect
          v-else
          :options="parseOptions"
          v-validate="`${validationRules}`"
          :data-vv-as="label"
          :name="generateName"
          :searchable="true"
          :multiple="isMultiple"
          :flatten-search-results="true"
          :default-expand-level="0"
          :placeholder="placeholder"
          :auto-deselect-descendants="autoDeselectDescendants"
          :auto-select-descendants="autoSelectDescendants"
          :auto-select-acenstors="autoSelectAncestors"
          :value-format="parseValueFormat"
          v-model="model"
          @open="isFocusing = true"
          :before-clear-all="handleCloseSelection"
          :rtl="isRtl"
          search-nested
        >
          <wil-select-tree-options
            slot="option-label"
            slot-scope="props"
            :props="props"
            :settings="settings"
            :default-options="parseDefaultOptions"
          />
          <wil-select-tree-options
            slot="value-label"
            slot-scope="props"
            :props="props"
            :settings="settings"
            :default-options="parseDefaultOptions"
          />
        </treeselect>
      </div>
      <slot name="label" :label="label" :is-required="isRequired">
        <span
          :class="[
            'field_label__2eCP7 text-ellipsis',
            isRequired ? 'required' : ''
          ]"
          v-html="label"
          style="z-index:1"
        ></span>
        <span class="bg-color-primary"></span>
      </slot>
      <p v-if="parseDescription.length" v-html="parseDescription"></p>
    </div>
    <wil-field-error-msg
      v-show="vErrors.has(generateName)"
      :msg="vErrors.first(generateName)"
    />
  </div>
</template>
<script lang="javascript">
import Treeselect from "@riophae/vue-treeselect";
import WilSelectTreeOptions from "./WilSelectTreeOption.vue";
import { FieldHelper } from "./../../mixins/FieldHelper";
import {
  LOAD_ROOT_OPTIONS,
  LOAD_CHILDREN_OPTIONS,
  ASYNC_SEARCH
} from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import "./../../../css/wil-vue-treeselect.css";

export default {
  name: "wil-select-tree",
  mixins: [FieldHelper],
  valueConsistsOf: "BRANCH_PRIORITY",
  components: {
    Treeselect,
    WilSelectTreeOptions
  },
  data() {
    return {
      parseOptions: null,
      model: null,
      isFocusing: false,
      isAsync: false,
      alwaysOpen: true,
      lastReset: 0
    };
  },
  props: {
    settings: {
      type: Object,
      default() {
        return {};
      }
    },
    isRtl: {
      type: Boolean,
      default: false
    },
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15",
      required: false
    },
    innerClasses: {
      type: String,
      default: "field_wrap__Gv92k"
    },
    autoSelectAncestors: {
      type: Boolean,
      default: true
    },
    autoDeselectDescendants: {
      type: Boolean,
      default: false
    },
    autoSelectDescendants: {
      type: Boolean,
      default: false
    },
    selectClasses: {
      type: String,
      default: "js-select-2",
      required: false
    },
    label: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: "",
      required: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    maximumItems: {
      type: Number,
      default: 1
    },
    value: {
      type: [String, Array, Object, Number],
      description: "Select value",
      default: "",
      required: false
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    mode: {
      type: String, // ajax, ajaxloadroot, default
      required: false,
      default: "default"
    },
    minimumInputLength: {
      // the searchable must be set to true
      type: Number,
      default: 1
    },
    queryArgs: {
      // the searchable must be set to true
      type: Object,
      default() {
        return {};
      },
      required: false
    },
    errorMsg: {
      type: String,
      default: "",
      required: false
    },
    searchUrl: {
      type: String,
      default: "",
      required: false
    },
    autoloadRootOptions: {
      type: Boolean,
      default: true,
      required: false
    },
    valueFormat: {
      type: String,
      default: "id", // Format of value prop. There are 2 type of format: id and object
      required: false
    }
  },
  watch: {
    settings: {
      handler(settings) {
        if (!!settings.lastReset && this.lastReset !== settings.lastReset) {
          this.parseOptions = null;
          this.lastReset = settings.lastReset;
          if (_.isArray(this.value)) {
            this.model = [...this.value];
          } else if (_.isObject(this.value)) {
            this.model = {...this.value};
          } else {
            this.model = this.value;
          }
        }
      },
      deep: true
    },
    model: {
      handler(value) {
        if (this.isMultiple) {
          if (value.length > this.parseMaximumItems) {
            this.model = [...value.slice(0, this.parseMaximumItems)];
          }
        }
        this.$emit("change", this.model);
      }
    }
  },
  computed: {
    parseDefaultOptions() {
      if (_.isArray(this.settings.defaultOptions)) {
        return this.settings.defaultOptions;
      }

      return this.defaultOptions;
    },
    parseQueryArgs() {
      if (!_.isEmpty(this.settings.queryArgs)) {
        return this.settings.queryArgs;
      }

      return this.queryArgs;
    },
    parseMaximumItems() {
      if (_.isNumber(this.settings.maximumItems)) {
        return this.settings.maximumItems;
      }

      return this.maximumItems;
    },
    isMultiple() {
      if (_.isNumber(this.settings.maximumItems)) {
        return this.settings.maximumItems > 1;
      }

      return this.maximumItems > 1;
    },
    parseIsRTL() {
      if (this.isRtl) {
        return true;
      }

      return (
        typeof WILOKE_INLINE_GLOBAL && WILOKE_INLINE_GLOBAL.isRTL === "yes"
      );
    },
    parseMode() {
      if (this.settings.loadOptionMode) {
        return this.settings.loadOptionMode;
      }

      return this.mode;
    },
    validationRules() {
      let rules = [];
      if (this.isRequired) {
        rules = ["required"];
      }
      return rules.join("|");
    },
    hasValue() {
      if (!this.model) {
        return false;
      }

      if (this.isMultiple) {
        return this.model.length;
      }

      if (this.parseValueFormat !== "id") {
        return this.model.id.toString().length;
      }

      return this.model.toString().length;
    },
    parseErrorMsg() {
      return this.errorMsg.replace("%maximum%", this.parseMaximumItems);
    },
    parseWrapperClasses() {
      return [
        this.wrapperClasses,
        this.hasValue || this.isFocusing ? "active" : ""
      ];
    },
    parseValueFormat() {
      if (this.settings && this.settings.selectValueFormat) {
        return this.settings.selectValueFormat;
      }

      return this.valueFormat;
    },
    slotOption() {
      return {
        ...this.settings,
        isMultiple: this.isMultiple,
        value: this.model
      };
    },
    parseSearchUrl() {
      if (this.settings.searchUrl) {
        return this.settings.searchUrl;
      }

      return this.searchUrl;
    },
    parseDescription() {
      if (_.isUndefined(this.description)) {
        return "";
      }

      return this.description.replace("%maximum%", this.parseMaximumItems);
    }
  },
  created() {
    const options =
      !_.isUndefined(this.settings.options) && !_.isEmpty(this.settings.options)
        ? this.settings.options
        : this.options;

    if (options.length) {
      this.parseOptions = _.isArray(options) ? [...options] : options;
    }
  },
  mounted() {
    if (this.value) {
      if (this.isMultiple) {
        this.model = _.isArray(this.value) ? [...this.value] : [];
      } else {
        if (this.parseValueFormat === "id") {
          this.model = this.value;
        } else {
          if (this.value.id) {
            this.model = { ...this.value };
          }
        }
      }
    }
  },
  methods: {
    handleCloseSelection() {
     this.isFocusing = false;
     return true;
    },
    async fetchOptions(queryArgs) {
      let results;
      delete queryArgs.desc;
      delete queryArgs.title;
      delete queryArgs.loadOptionMode;
      delete queryArgs.overMaximumTagsWarning;

      await Vue.axios({
        method: "GET",
        url: this.parseSearchUrl,
        params: {
          ...queryArgs,
          mode: "select"
        }
      }).then(response => {
        const isRest = response.data.status;
        if (isRest) {
          if (response.data.status === "success") {
            results = [...response.data.results];
          } else {
            throw new Error(response.data.msg);
          }
        } else {
          if (response.data.success) {
            results = [...response.data.data.results];
          } else {
            throw new Error(response.data.data.msg);
          }
        }
      });

      if (!_.isEmpty(results)) {
        this.$emit("option-loaded", results, this.settings);
      }
      return results;
    },
    async loadRootOptions({ action, searchQuery, parentNode, callback }) {
      if (action === LOAD_ROOT_OPTIONS) {
        this.parseOptions = await this.fetchOptions(this.parseQueryArgs);
      } else if (action === LOAD_CHILDREN_OPTIONS) {
        let queryArgs = { ...this.parseQueryArgs };
        queryArgs = {
          ...queryArgs,
          parent: parentNode.id,
          mode: "select"
        };

        parentNode.children = await this.fetchOptions(queryArgs);
        callback();
      }
    },
    async asyncLoadOptions({ action, searchQuery, callback }) {
      if (action === ASYNC_SEARCH) {
        let queryArgs = { ...this.parseQueryArgs };
        queryArgs = {
          ...queryArgs,
          mode: "select",
          search: searchQuery
        };

        const options = await this.fetchOptions(queryArgs);
        callback(null, options);
      }
    }
  }
};
</script>
