<template>
  <div :class="parseWrapperClasses">
    <div :class="innerClasses">
      <div>
        <select v-if="isMultiple" v-model="model" :class="selectClasses" multiple>
          <slot name="option" v-bind="slotOption">
            <option
              v-for="option in options"
              :value="option.value"
              v-html="option.name"
              :key="option"
            ></option>
          </slot>
        </select>
        <select v-else v-model="model" :class="selectClasses">
          <slot name="option" v-bind="slotOption">
            <option
              v-for="option in options"
              :value="option.value"
              v-html="option.name"
              :key="option"
            ></option>
          </slot>
        </select>
      </div>
      <slot name="label" :label="label" :is-required="isRequired">
        <span
          :class="['field_label__2eCP7 text-ellipsis', isRequired ? 'required' : '']"
          v-html="label"
        ></span>
        <span class="bg-color-primary"></span>
      </slot>
    </div>
    <span class="field_message__3Z6FX color-quaternary" v-if="errorMsg.length" v-html="errorMsg"></span>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-select-two",
  data() {
    return {
      $select2: null,
      parseOptions: []
    };
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15",
      required: false
    },
    innerClasses: {
      type: String,
      default: "field_wrap__Gv92k"
    },
    selectClasses: {
      type: String,
      default: "js-select-2",
      required: false
    },
    label: {
      type: String,
      default: false
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
      type: [String, Array, Object],
      description: "Select value",
      default: "",
      required: false
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    searchable: {
      type: Boolean,
      required: false,
      default: false
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
    }
  },
  computed: {
    model: {
      get() {
        if (!this.value) {
          return this.isMultiple ? [] : "";
        }
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      }
    },
    isMultiple() {
      return this.maximumItems > 1;
    },
    parseWrapperClasses() {
      return [this.wrapperClasses, this.selected ? "active" : ""];
    },
    slotOption() {
      return {
        ...this.settings,
        isMultiple: this.isMultiple,
        value: this.model
      };
    }
  },
  mounted() {
    this.selectTwo();
    this.parseOptions = this.options ? { ...this.options } : [];
  },
  methods: {
    buildAjaxUrl() {
      if (!this.queryArgs) {
        return WILOKE_GLOBAL.ajaxurl;
      }

      const { ajaxAction } = this.queryArgs;
      delete this.queryArgs.ajaxAction;

      const aArgs = Object.keys(this.queryArgs)
        .map(key => `${key}=${this.queryArgs[key]}`)
        .join("&");
      return `${WILOKE_GLOBAL.ajaxurl}?${aArgs}&action=${ajaxAction}`;
    },
    handleChange($event) {
      console.log($event);
    },
    selectTwo() {
      if (this.$select2) {
        this.$select2.select2("destroy");
      }

      this.$select2 = jQuery(this.$el).find(".js-select-2");

      let oConfiguration = {
        templateResult: state => {
          if (!state.id) {
            return state.text;
          }

          return jQuery("<span>" + state.text + "</span>");
        },
        templateSelection: repo => {
          return repo.text.replace("&amp;", "&");
        },
        allowClear: true,
        placeholder: ""
      };

      if (this.isMultiple) {
        oConfiguration.maximumSelectionLength = this.maximumItems;
      }

      if (this.searchable) {
        oConfiguration.ajax = {
          url: WILOKE_GLOBAL.ajaxurl,
          data: params => {
            return {
              ...this.queryArgs,
              search: params.term
            };
          },
          processResults: response => {
            if (response.success) {
              return { ...response.data };
            }
          },
          cache: true
        };
        oConfiguration.minimumInputLength = this.minimumInputLength;
      }

      if (typeof WILCITY_SELECT2_LENG !== "undefined") {
        oConfiguration.language = WILCITY_SELECT2_LENG;
      }

      this.$select2.select2(oConfiguration).on("change", event => {
        if (this.isMultiple) {
          this.model = [...this.model, event.target.value];
        } else {
          this.model = event.target.value;
        }
        console.log(event.params);
      });
    }
  }
};
</script>
