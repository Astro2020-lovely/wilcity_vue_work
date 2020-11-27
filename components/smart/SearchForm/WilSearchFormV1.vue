<template>
  <form :class="wrapperClasses">
    <slot name="beforeformfields" :is-loading="isLoading"></slot>
    <div :class="innerClasses">
      <template v-for="field in searchFields">
        <div :key="generateFieldKey(field)" :class="fieldWrapperClasses">
          <component
            :is="determineComponent(field)"
            :settings="parseSettings(field)"
            margin-classes="mb-15"
            :value="getFieldValue(field)"
            v-on="{
              change: handleFieldChange(field.key, field.childType, field),
              'option-loaded': updateTermToStore(field)
            }"
            :label="field.label"
          ></component>
        </div>
      </template>
    </div>
    <slot name="afterformfields" :is-loading="isLoading"></slot>
  </form>
</template>
<script lang="javascript">
import { DetermineFieldComponent } from "./../../../mixins/DetermineFieldComponent";
import { SearchFieldHelper } from "./../../../mixins/SearchFieldHelper";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "wil-search-form-v1",
  data() {
    return {
      filteredTagIds: []
    }
  },
  mixins: [DetermineFieldComponent, SearchFieldHelper],
  props: {
    currency: {
      type: String,
      default: WILOKE_INLINE_GLOBAL.currency
    },
    searchFields: {
      type: [Object, Array],
      required: true,
      default: () => []
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    innerClasses: {
      type: String,
      default: ""
    },
    fieldWrapperClasses: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => {},
      required: false
    },
    cacheTimestamp: {
      type: Number,
      default: 0,
      required: false
    },
    postType: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.searchVersion = "v1";
  },
  computed: {
    ...mapGetters({
      getTermFromStore: "ModuleTerms/getTerm"
    })
  },
  methods: {
    ...mapActions({
      updateTermsToStore: "ModuleTerms/updateTerms"
    }),
    hasChangedTagRevelation(catIds) {
      if (!!catIds) {
        const catField = this.getFieldByKey("listing_cat");
        if (catField.isMultiple === "yes") {
          if (
            !_.isUndefined(this.modelCaching.listing_tag) &&
            !_.isEmpty(this.modelCaching.listing_tag)
          ) {
            const tagIds = this.modelCaching.listing_tag;
            this.filteredTagIds = tagIds.reduce((carry, tagId) => {
              const tagOption = this.getTermFromStore(tagId);
              catIds = _.isArray(catIds) ? [...catIds] : [catIds];
              if (this.isTagBelongsToCat(tagOption, catIds)) {
                carry = carry.concat(tagOption.ID);
              } else {
                carry = carry.concat([]);
              }
              return carry;
            }, []);

            return this.filteredTagIds.length !== tagIds.length;
          }

          return false;
        }

        return true;
      }

      return false;
    },
    updateTermToStore(field) {
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
    parseCacheTermOption(termCache) {
      return {
        ...termCache,
        id: termCache.term_id,
        label: termCache.name,
        belongsTo: !!termCache.belongsTo ? termCache.belongsTo : false
      };
    },
    parseSettings(field) {
      switch (field.oldType) {
        case "wil-auto-complete":
          if (field.key === "google_place") {
            if (
              !_.isEmpty(this.value) &&
              !_.isEmpty(this.value.oAddress) &&
              this.value.oAddress.address
            ) {
              return {
                ...field,
                placeholder: this.value.oAddress.address
              };
            }
          }
          break;
        case "wil-date-range":
          field = {
            ...field,
            isInitialOpen: "no",
            isInline: "no"
          };
          break;
        case "wil-switch":
          field = {
            ...field,
            switchType: "fullwidth"
          };
          break;
        case "wil-select-tree":
          if (field.group === "term") {
            let queryArgs = {
              postType: this.postType,
              order: field.order,
              orderby: field.orderBy,
              isShowParentOnly: field.isShowParentOnly,
              isHideEmpty: field.isHideEmpty
            };
            if (!!this.modelCaching.listing_cat) {
              queryArgs = {
                ...queryArgs,
                listing_cat: this.modelCaching.listing_cat
              };
            }

            field = {
              ...field,
              queryArgs,
              maximumItems: field.isMultiple === "yes" ? 10 : 1,
              searchUrl: `${WILOKE_GLOBAL.restAPI}taxonomy/${field.key}`,
              loadOptionMode: field.isAjax === "no" ? "ajaxloadroot" : "ajax"
            };

            let termSelected = this.getFieldValue(field);

            if (_.isNumber(termSelected)) {
              termSelected = [termSelected];
            }

            if (!_.isEmpty(termSelected)) {
              const defaultOptions = termSelected.map(term => {
                const termId = term.id ? term.id : term;
                const termCache = this.getTermFromStore(termId);
                if (termCache) {
                  return this.parseCacheTermOption(termCache);
                } else {
                  return {
                    id: termId,
                    label: termId,
                    belongsTo: !!term.belongsTo ? term.belongsTo : false
                  };
                }
              });

              field = {
                ...field,
                defaultOptions
              };

              delete field.options;
            }
          }
          break;
      }

      return field;
    },
    determineComponent(field) {
      return field.oldType ? field.oldType : field.type;
    }
  },
  components: {
    WilSearchDropdown: () =>
      import(
        /*webpackChunkName: "WilSearchDropdown"*/
        /*webpackPreload: true*/
        "./WilSearchDropdown.vue"
      ),
    WilSearchFormPriceRange: () =>
      import(
        /*webpackChunkName: "WilSearchFormPriceRange"*/
        /*webpackPreload: true*/
        "./../SearchForm/WilSearchFormPriceRange.vue"
      ),
    WilSearchFormList: () =>
      import(
        /*webpackChunkName: "WilSearchFormList"*/
        /*webpackPreload: true*/
        "./WilSearchFormList.vue"
      ),
    WilAutoComplete: () =>
      import(
        /*webpackChunkName: "WilSearchFormList"*/
        /*webpackPreload: true*/
        "./../../dumbs/WilAutoComplete.vue"
      ),
    WilDateRange: () =>
      import(
        /*webpackChunkName: "WilDateRange"*/
        /*webpackPreload: true*/
        "./../../dumbs/WilDateRange.vue"
      )
  }
};
</script>
