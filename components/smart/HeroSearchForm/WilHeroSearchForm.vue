<template>
  <div id="wilcity-hero-search-form" class="tab_module__3fEXT wil-tab">
    <form :action="searchUrl">
      <wil-tabs
        :is-hide-if-has-one="true"
        :selected="selected"
        tab-alignment="wil-text-left"
        tab-key="wil-hero-tabs"
        inner-classes="tab_nav__3YJph wil-tab__nav"
        wrapper-classes="wil-hero-form-wrapper"
        v-on:switch-tab="handleSwitchTab"
        tab-content-classes="tab_content__ndczY wil-tab__content"
      >
        <template>
          <div class="hero_form__1ewus">
            <wil-tab
              v-for="(tab, index) in tabs"
              :key="`wil-hero-search-form-${index}`"
              :selected="selected"
              :tab-id="`hero-tab-${tab.post_type}`"
              :name="tab.name"
              :icon="tab.icon"
              :class="[
                'wil-tab__panel',
                postType === tab.post_type ? 'active' : ''
              ]"
            >
              <div class="row">
                <div class="col-md-9">
                  <div class="row">
                    <div
                      v-for="(field, index) in searchFields"
                      :class="fieldWrapperClasses(field.key)"
                      :key="generateFieldKey(field, index)"
                    >
                      <v-component
                        :is="determineHeroComponent(field)"
                        :name="`hero-search-form-field-${field.key}`"
                        :label="field.label"
                        :settings="parseSettings(field)"
                        :query-args="parseFieldQueryArgs(field)"
                        :module="field.module"
                        redirect-target="_self"
                        v-on="{
                          change: handleFieldChange(field.key, field.type),
                          'option-loaded': handleTermChange(field),
                          'keyword-change': updateKeyWord(field.key)
                        }"
                        :value="getFieldValue(field)"
                        :is-loading="field.isLoading"
                        :is-hidden="field.isHidden"
                      ></v-component>
                    </div>
                  </div>
                </div>
                <div :class="searchClasses">
                  <button
                    class="wil-btn wil-btn--primary wil-btn--md wil-btn--round"
                    @click.prevent="handleSearchForm"
                  >
                    <i class="la la-search"></i>
                    {{ "Search now" | filterTranslation("searchNow") }}
                  </button>
                </div>
              </div>
            </wil-tab>
          </div>
        </template>
      </wil-tabs>
    </form>
  </div>
</template>
<script>
import WilTabs from "./../Tabs/WilTabs.vue";
import WilTab from "./../Tabs/WilTab.vue";
import WilDateRange from "./../../dumbs/WilDateRange.vue";
import WilAutoComplete from "./../../dumbs/WilAutoComplete.vue";
import { DetermineFieldComponent } from "./../../../mixins/DetermineFieldComponent";
import { mapActions, mapGetters } from "vuex";
import typeHinting from "./../../../mixins/TypeHinting";

export default {
  name: "wil-hero-search-form",
  mixins: [DetermineFieldComponent, typeHinting],
  data() {
    return {
      tabs: null,
      settings: null,
      selected: null,
      postType: null,
      searchFieldCacheAt: 0,
      searchFields: [],
      totalFields: 0,
      model: {},
      cancelToken: null,
      sourceToken: null
    };
  },
  computed: {
    ...mapGetters({
      getSearchFields: "ModuleHeroSearchForm/getSearchFields",
      getTerm: "ModuleTerms/getTerm"
    }),
    searchClasses() {
      return "col-md-3";
    },
    termFields() {
      const termFields = this.searchFields.filter(
        item => item.group && item.group === "term"
      );
    }
  },
  components: {
    WilTabs,
    WilTab,
    WilDateRange,
    WilAutoComplete
  },
  created() {
    this.tabs = JSON.parse(window.atob(this.rawTabs));
    this.selected = this.defaultSelected;
    this.cancelToken = Vue.axios.CancelToken;
    this.parsePostType();
    this.getFields();
  },
  watch: {
    searchFields: {
      handler(fields) {
        this.totalFields = fields.length;
      },
      deep: true,
      immediate: true
    },
    selected: {
      handler() {
        this.parsePostType();
        this.getFields();
      },
      immediate: false
    }
  },
  methods: {
    ...mapActions({
      updateTermsToStore: "ModuleTerms/updateTerms",
      updateTermToStore: "ModuleTerms/updateTerm"
    }),
    determineHeroComponent(field) {
      if (field.group === "term") {
        return "wil-select-tree";
      }

      return this.determineFieldComponent(field.type);
    },
    handleSwitchTab(tab) {
      this.selected = tab;
    },
    parsePostType() {
      this.postType = this.selected.replace("hero-tab-", "");
    },
    parseSettings(field) {
      let searchTarget = "",
        endpoint = "",
        pluck;
      switch (field.key) {
        case "google_place":
          searchTarget = ["geocoder"];
          break;
        case "wp_search":
          searchTarget = ["listing"];
          pluck = ["title", "ID", "postID", "featuredImage", "googleAddress"];
          break;
        case "complex":
          if (_.isArray(field.searchTarget)) {
            searchTarget = [...field.searchTarget];
          }
          break;
      }
      if (field.group && field.group == "term") {
        if (!!this.model[field.key]) {
          let defaultOptions = [];
          if (_.isArray(this.model[field.key])) {
            defaultOptions = this.model[field.key].reduce((carry, item) => {
              const term = this.getTerm(this.model[field.key]);
              if (!_.isEmpty(term)) {
                carry = [...carry, term];
              }

              return carry;
            }, []);
          } else {
            const term = this.getTerm(this.model[field.key]);
            if (!_.isEmpty(term)) {
              defaultOptions = [term];
            }
          }

          field = {
            ...field,
            defaultOptions
          };
        }
      }

      return {
        ...field,
        searchTarget,
        endpoint
      };
    },
    fieldWrapperClasses(fieldKey) {
      let classes = "";
      const totalFields = this.searchFields.length;
      return "col-md-" + Math.ceil(12 / totalFields);
    },
    parseFieldSettings(field) {
      return {
        ...field
      };
    },
    parseFieldQueryArgs(field) {
      if (field.group === "term") {
        return {
          ...field,
          postType: this.postType
        };
      } else {
        return {
          ...this.model,
          postType: this.postType
        };
      }
    },
    handleSearchForm() {
      const queryArgs = {
        ...this.model,
        post_type: this.postType
      };
      window.location.href = `${this.searchUrl}?${WilQueryHelper.buildQuery(
        queryArgs
      )}`;
    },
    updateKeyWord(key) {
      return val => {
        if (val.length) {
          this.model = {
            ...this.model,
            keyword: val
          };
        } else {
          Vue.delete(this.model, "keyword");
        }
      };
    },
    handleTermChange(field) {
      return results => {
        if (field.group === "term") {
          const terms = results.reduce((carry, item) => {
            const termId = item.term_id.toString();
            return {
              ...carry,
              [termId]: item
            };
          }, {});

          this.updateTermsToStore({ terms });
        }
      };
    },
    handleFieldChange(key, fieldType) {
      return async (val, prev) => {
        let parsedVal = val;
        let prasedKey = key;
        if (key === "complex" || key === "google_place") {
          this.$delete(this.model, "oAddress");
          this.$delete(this.model, "keyword");

          if (_.isObject(prev) && !!prev.item) {
            this.$delete(this.model, prev.item.taxonomy);
          }

          if (!_.isEmpty(val)) {
            switch (val.item.type) {
              case "geocoder":
                const {
                  item: { coordinate, name },
                  keyword
                } = val;
                parsedVal = {
                  ...coordinate,
                  address: name
                };
                prasedKey = "oAddress";
                break;
              case "term":
                prasedKey = val.item.taxonomy;
                parsedVal = val.item.term_id;
                this.updateTermToStore({
                  term_id: val.item.term_id,
                  term: val.item
                });
                break;
            }
          } else {
            return false;
          }
        }
        this.model = {
          ...this.model,
          [prasedKey]: parsedVal
        };
      };
    },
    getFieldValue(item) {
      if (item.key === "nearbyme") {
        return this.model.oAddress ? "yes" : "no";
      }

      let val = "";

      if (this.model && this.model[item.key]) {
        val = this.model[item.key];
      } else if (item.value) {
        val = item.value;
      }

      if (_.isEmpty(val) && item.valueFormat) {
        return this.typeHinting(val, item.valueFormat);
      }
      return val;
    },
    ...mapActions({
      updateSearchFields: "ModuleHeroSearchForm/updateSearchFields"
    }),
    getFields() {
      const searchFields = this.getSearchFields(this.postType);
      if (searchFields.fields) {
        this.searchFields = [...searchFields.fields];
        this.searchFieldCacheAt = searchFields.savedAt;
      }
      this.fetchSearchFields();
    },
    async fetchSearchFields() {
      if (this.sourceToken !== null) {
        this.sourceToken.cancel("Avoid duplicating request");
      }
      this.sourceToken = this.cancelToken.source();

      await Vue.axios
        .get(`${WILOKE_GLOBAL.restAPI}hero-search/fields`, {
          cancelToken: this.sourceToken.token,
          params: {
            cacheAt: this.searchFieldCacheAt,
            postType: this.postType
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            if (response.data.action === "update_search_fields") {
              this.searchFields = response.data.fields.map(field => {
                if (["select2"].includes(field.type)) {
                  let childType = "wil-radio";
                  if (field.isMultiple === "yes") {
                    childType = "wil-checkbox";
                  }
                  field = {
                    ...field,
                    childType: childType,
                    type: "dropdown"
                  };
                } else if (["checkbox2"].includes(field.type)) {
                  field = {
                    ...field,
                    childType: "wil-checkbox",
                    type: "dropdown"
                  };
                } else if (field.type === "checkbox") {
                  field = {
                    ...field,
                    type: "wil-toggle-btn"
                  };
                }
                return field;
              });
              this.updateSearchFields({
                fields: this.searchFields,
                postType: this.postType
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => (this.sourceToken = null));
    },
    generateFieldKey(field, index) {
      let key = `wil-hero-search-field-${field.key}-${index}`;
      if (field.originalKey) {
        key = `${key}-${field.originalKey}`;
      }
      return key;
    }
  },
  props: {
    rawTabs: {
      type: String,
      default: ""
    },
    defaultSelected: {
      type: String,
      default: ""
    },
    searchUrl: {
      type: String,
      default: ""
    }
  }
};
</script>
