import { mapActions, mapGetters } from "vuex";
import WilSearchFormList from "./../components/smart/SearchForm/WilSearchFormList.vue";
import WilSearchDropdown from "./../components/smart/SearchForm/WilSearchDropdown.vue";
import { TimeHelper } from "./TimeHelper";
import Vue from "vue/dist/vue.esm";

export const SearchFieldHelper = {
  mixins: [TimeHelper],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(query) {
        this.$emit("change", query);
      }
    },
    moreFilterFields() {
      if (!this.isMobile) {
        return [];
      }
      if (this.searchFields.length <= 2) {
        return [];
      }
      return [...this.searchFields.slice(2)];
    },
    parseSearchFields() {
      if (!this.moreFilterFields.length) {
        return this.searchFields;
      }
      const twoFirstSearchFields = [...this.searchFields.slice(0, 2)];
      const moreFieldOptions = {
        adminCategory: "wil-search-dropdown",
        childType: "wil-sub-search-fields",
        label: this.$options.filters.filterTranslation("Filter", "filter"),
        type: "wil-search-dropdown",
        key: "more_filters",
        settings: {
          options: [...this.moreFilterFields]
        }
      };

      return [...twoFirstSearchFields, moreFieldOptions];
    },
    ...mapGetters({
      getTermFromStore: "ModuleTerms/getTerm"
    })
  },
  watch: {
    value: {
      handler(queryArgs) {
        if (queryArgs.isReset) {
          delete queryArgs.isReset;
          this.modelCaching = {
            ...queryArgs
          };
        }
      },
      deep: true
    },
    searchFields: {
      handler(searchFields) {
        const fieldsChanged = searchFields.filter((item, index) => {
          if (!!item.lastReset) {
            if (
              !!this.cacheSearchFields[index].lastReset === false ||
              item.lastReset > this.cacheSearchFields[index].lastReset
            ) {
              return true;
            }
            return false;
          }
        });

        this.cacheSearchFields = [...searchFields];
      },
      deep: true
    }
  },
  data() {
    return {
      fieldsChanged: [],
      moreFilterValues: {},
      searchVersion: "v2",
      changedKey: null,
      firstSearchFormLoaded: [],
      excludeFields: ["autocomplete", "wp_search"],
      orderbyCat: ["recommended", "best_viewed", "best_rated"],
      requiresOrderDescCat: ["recommended", "best_viewed", "best_rated"],
      immediateSearch: ["wil-date-range"],
      modelCaching: {},
      lastFieldChanged: {},
      timeout: 500,
      debounce: null,
      cacheSearchFields: [],
      cacheRevelationTags: {},
      latestEventRange: null
    };
  },
  methods: {
    isTagBelongsToCat(tagOption, catIds) {
      return (
        _.isEmpty(tagOption.belongsTo) ||
        tagOption.belongsTo.some(catId => catIds.includes(catId))
      );
    },
    getFieldByKey(key) {
      return this.searchFields.find(item => {
        return item.key === key;
      });
    },
    getFieldOptionsDetail(optionId, key) {
      const field = this.getFieldByKey(key);
      if (!!field.options === false) {
        return false;
      }

      return field.options.find(option => {
        return optionId === option.id;
      });
    },
    removeTagsNotInRelevation() {
      if (
        _.isUndefined(this.modelCaching.listing_tag) ||
        !_.isArray(this.modelCaching.listing_tag)
      ) {
        return false;
      }

      const listingCats = _.isArray(this.modelCaching.listing_cat)
        ? this.modelCaching.listing_cat
        : [this.modelCaching.listing_cat];

      if (_.isEmpty(listingCats)) {
        return false;
      }

      const listingTags = this.modelCaching.listing_tag.filter(tagId => {
        return this.isTagBelongsToCat(
          this.getTermFromStore(tagId),
          listingCats
        );
      });
      if (_.isEmpty(listingTags)) {
        Vue.delete(this.modelCaching, "listing_tag");
      } else {
        this.modelCaching = {
          ...this.modelCaching,
          listing_tag: listingTags
        };
      }
    },
    getTagRevelationCacheKey() {
      if (!!this.modelCaching.listing_cat) {
        return WilCacheKeyHelper.generateCacheKey(
          this.modelCaching.listing_cat
        );
      }

      return false;
    },
    autoSwitchRelevationTags(cacheKey) {
      cacheKey = _.isUndefined(cacheKey)
        ? this.getTagRevelationCacheKey()
        : cacheKey;
      if (!cacheKey) {
        return false;
      }
      if (!!this.cacheRevelationTags[cacheKey]) {
        this.modelCaching = {
          ...this.modelCaching,
          listing_tag: this.cacheRevelationTags[cacheKey]
        };
      } else {
        if (cacheKey !== "all") {
          Vue.delete(this.modelCaching, "listing_tag");
        }
      }
    },
    handleCacheRevelationTags(tags) {
      const cacheKey = this.getTagRevelationCacheKey();
      if (cacheKey) {
        this.cacheRevelationTags = {
          ...this.cacheRevelationTags,
          [cacheKey]: _.isArray(tags) ? [...tags] : tags
        };
      }
    },
    isInMoreField(fieldKey) {
      return this.moreFilterFields.some(item => {
        return item.key === fieldKey;
      });
    },
    handleFieldChange(key, fieldType, field) {
      return async val => {
        val = wilValueFormat.correct(this.determineValueFormat(field), val);
        this.lastFieldChanged = {
          ...field
        };
        let newModel = {
          ...this.modelCaching
        };

        if (!!val === false) {
          if (key === "nearbyme" || key === "google_place") {
            Vue.delete(newModel, "oAddress");
          } else {
            Vue.delete(newModel, key);
            if (this.orderbyCat.includes(key)) {
              Vue.delete(newModel, "orderby");
            }
          }
          this.modelCaching = {
            ...newModel
          };
          this.startSearch();
          return true;
        }
        switch (key) {
          case "orderby":
            newModel = this.disableItemInOrderCat(val);
            if (val === "newest") {
              this.modelCaching = {
                ...this.modelCaching,
                orderby: val,
                order: "DESC"
              };
            } else if (this.requiresOrderDescCat.includes(val)) {
              this.modelCaching = {
                ...newModel,
                orderby: val,
                order: "DESC"
              };
            } else {
              this.modelCaching = {
                ...newModel,
                orderby: val
              };
            }
            break;
          case "newest":
          case "recommended":
          case "best_viewed":
          case "best_rated":
            newModel = this.disableItemInOrderCat(key);
            if (this.modelCaching.orderby) {
              newModel = {
                ...newModel,
                orderby: key
              };
            }
            this.modelCaching = {
              ...newModel,
              [key]: val,
              orderby: key,
              order: "DESC"
            };
            break;
          case "google_place":
            this.modelCaching = {
              ...this.modelCaching,
              oAddress: {
                ...val.item.coordinate
              }
            };
            break;
          case "nearbyme":
            const oGeoCode = await this.getGeoLocationLatLng({
              notification: true
            });
            if (oGeoCode) {
              Vue.delete(newModel, "listing_location");
              this.modelCaching = {
                ...newModel,
                oAddress: {
                  lat: this.oGeoLocation.lat,
                  lng: this.oGeoLocation.lng,
                  unit: WILOKE_GLOBAL.unit,
                  radius: WILOKE_GLOBAL.radius,
                  nearbyme: "yes"
                }
              };
            }
            break;
          default:
            this.modelCaching = {
              ...newModel,
              [key]: val
            };
            break;
        }
        let catField = {};
        switch (key) {
          case "listing_cat":
            // There are 2 cases of this action: 1. If it's multiple cat filter, We will check the current tags value and remove all tags that won't belongs to new update
            // If it's single filter, We will cache selected tags by category
            catField = this.getFieldByKey(key);
            if (catField.isMultiple === "no") {
              this.autoSwitchRelevationTags(val);
            } else {
              this.removeTagsNotInRelevation();
            }
            break;
          case "event_filter":
            const eventDateOrder = this.findItemIndexInArray(
              "key",
              "date_range",
              this.searchFields
            );
            if (eventDateOrder === -1) {
              return false;
            }

            if (val === "pick_a_date_event") {
              if (this.latestEventRange !== null) {
                this.modelCaching = {
                  ...this.modelCaching,
                  date_range: [...this.latestEventRange]
                };
              }
              this.handleFocusCloseSearchField();
              let dateRangeField = { ...this.searchFields[eventDateOrder] };
              dateRangeField = {
                ...dateRangeField,
                lastFocusActive: new Date().getTime()
              };
              this.searchFields = this.updateItemValueInArray(
                eventDateOrder,
                dateRangeField,
                this.searchFields
              );
            } else {
              if (!_.isUndefined(this.modelCaching.date_range)) {
                this.latestEventRange = [...this.modelCaching.date_range];
                Vue.delete(this.modelCaching, "date_range");
              }
            }
            break;
          case "listing_tag":
            catField = this.getFieldByKey("listing_cat");
            if (!!catField && catField.isMultiple === "no") {
              this.handleCacheRevelationTags(val);
            }
            break;
        }

        // the last argument is previous value
        this.$emit("field-change", key, val, this.modelCaching[key]);
        this.startSearch();
      };
    },
    generateFieldKey(field) {
      let key = `wil-search-field-${field.key}-${this.cacheTimestamp}`;
      if (field.originalKey) {
        key = `${key}-${field.originalKey}`;
      }
      return key;
    },
    disableItemInOrderCat(selectedKey) {
      let removedItems;
      if (!this.orderbyCat.includes(selectedKey)) {
        removedItems = this.orderbyCat.filter(item => item !== selectedKey);
      } else {
        removedItems = [...this.orderbyCat];
      }

      let model = {
        ...this.modelCaching
      };
      removedItems.map(item => {
        if (item !== "orderby") {
          this.$delete(model, item);
        }
      });
      return model;
    },
    startSearch(focusSearch) {
      if (!focusSearch && this.isInMoreField(this.lastFieldChanged.key)) {
        return false;
      }

      if (
        focusSearch ||
        this.searchVersion === "v1" ||
        this.immediateSearch.includes(this.lastFieldChanged.childType) ||
        this.lastFieldChanged.type !== "wil-search-dropdown"
      ) {
        if (this.debounce) {
          clearTimeout(this.debounce);
        }
        this.debounce = setTimeout(() => {
          this.model = {
            ...this.modelCaching
          };
          clearTimeout(this.debounce);
        }, this.timeout);
      }
    },
    getFieldValue(item) {
      if (item.key === "more_filters") {
        if (!this.moreFilterFields.length) {
          return {};
        }

        return this.moreFilterFields.reduce((carry, item) => {
          const key = item.key === "nearbyme" ? "oAddress" : item.key;
          const val = !!this.modelCaching[item.key]
            ? {
                [item.key]: this.modelCaching[item.key]
              }
            : {};

          return {
            ...carry,
            ...val
          };
        }, {});
      }

      if (item.key === "nearbyme") {
        return !_.isEmpty(this.modelCaching.oAddress) &&
          this.modelCaching.oAddress.nearbyme === "yes"
          ? "yes"
          : "no";
      }
      let val = "";
      if (this.modelCaching && this.modelCaching[item.key]) {
        val = this.modelCaching[item.key];
      } else if (
        !this.firstSearchFormLoaded.includes(this.modelCaching.postType)
      ) {
        // Only set default at the first time rendered
        val = item.std ? item.std : item.value;
      }

      if (!!val) {
        switch (item.childType) {
          case "wil-radio":
            val = Array.isArray(val) ? val[0] : val;
            break;
          case "wil-checkbox":
            val = !Array.isArray(val) ? [val] : val;
            break;
        }
        return val;
      }

      return item.valueFormat
        ? wilValueFormat.correct(this.determineValueFormat(item), val)
        : val;
    },
    hasValue(field) {
      const value = this.getFieldValue(field);
      return !_.isEmpty(value) || _.isNumber(value);
    },
    determineValueFormat(field) {
      let format;
      switch (field.childType) {
        case "wil-radio":
          if (field.group === "term") {
            format = "int";
          } else {
            format = "string";
          }
          break;
        case "wil-checkbox":
          format = "array";
          break;
        case "wil-date-range":
          format = "array";
          break;
        case "wil-price-range":
          if (field.originalKey === "new_price_range") {
            format = "object";
          } else {
            format = "string";
          }
          break;
        default:
          format = field.valueFormat ? field.valueFormat : "string";
          break;
      }

      return format;
    }
  },
  created() {
    this.modelCaching = {
      ...this.value
    };
  },
  mounted() {
    this.cacheSearchFields = [...this.searchFields];
    this.firstSearchFormLoaded = [
      ...this.firstSearchFormLoaded,
      this.value.postType
    ];
  }
};

export const SearchFieldV2Helper = {
  data() {
    return { dropdownWideGroup: ["date_range"], isDropdownActive: false };
  },
  components: {
    WilSearchFormList,
    WilSearchDropdown,
    WilDateRange: () =>
      import(
        /*webpackChunkName: "WilDateRange"*/
        /*webpackPreload: true*/
        "./../components/dumbs/WilDateRange.vue"
      ),
    WilSearchFormPriceRange: () =>
      import(
        /*webpackChunkName: "WilSearchFormPriceRange"*/
        /*webpackPreload: true*/
        "./../components/smart/SearchForm/WilSearchFormPriceRange.vue"
      )
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    },
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
      required: false,
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
    }
  },
  watch: {
    postType() {
      this.modelCaching = {
        ...this.value
      };
    }
  },
  methods: {
    determineChildSearchDropdownComponent(field) {
      if (
        field.childType === "wil-radio" ||
        field.childType === "wil-checkbox"
      ) {
        return "wil-search-form-list";
      }

      return this.determineFieldComponent(field.childType);
    },
    dropdownWrapperClasses(fieldKey) {
      if (this.dropdownWideGroup.includes(fieldKey)) {
        return "wide";
      }
      return "";
    },
    dropdownClasses(field) {
      let classes = "filter_button__lo852";
      if (this.hasValue(field)) {
        return `${classes} wil-btn--primary`;
      }
      return classes;
    },
    searchBtnClasses(field) {
      return "filter_item__tjou1 mt-10";
    },
    getSearchDropdownBtnName(field) {
      const label = field.label ? field.label : "Undefined";
      let parseValue;
      if (this.hasValue(field)) {
        let value = this.getFieldValue(field);
        if (field.originalKey === "new_price_range") {
          if (value.min.toString().length && value.max.toString().length) {
            return `${label}: ${this.currency} ${value.min}-${value.max}`;
          }
          return label;
        }

        if (field.key === "date_range") {
          parseValue = value.map(timestamp => {
            return moment(parseInt(timestamp)).format(this.dateFormat);
          });

          return `${label}: ${parseValue.join(" ")}`;
        }

        if (field.key === "more_filters") {
          value = Object.values(value).length;
        } else {
          if (!_.isArray(value)) {
            parseValue = [value.toString()];
          } else {
            parseValue = value.map(item => item.toString());
          }
          let selected = [];
          if (!_.isEmpty(field.options)) {
            selected = field.options.filter(item => {
              const itemVal = _.isObject(item)
                ? item.id.toString()
                : item.toString();
              return parseValue.includes(itemVal);
            });
            if (selected.length) {
              selected = selected.map(item => {
                return item.label;
              });
              return `${label}: ${selected.join(",")}`;
            }
          } else {
            if (field.group && field.group === "term") {
              selected = parseValue.reduce((labels, termId) => {
                const term = this.getTermFromStore(termId);
                if (term) {
                  labels = [...labels, term.name];
                }
                return labels;
              }, []);

              if (selected.length) {
                return `${label}: ${selected.join(",")}`;
              }
            }
          }
        }
        return `${label}: ${value}`;
      }

      return label;
    },
    handleFocusCloseSearchField() {
      document.body.click();
    },
    isValidComponent(type) {
      return !this.excludeFields.includes(type);
    },
    handleDropdownClick(index) {
      return (status, field) => {
        this.isDropdownActive = status;
        this.$emit("dropdown-click", status, index, field);
      };
    },
    determineComponent(component) {
      return component.indexOf("wil") !== 0 ? "wil-" + component : component;
    },
    handleAppliedFilter() {
      this.model = {
        ...this.modelCaching
      };
    },
    handleClearValue(key) {
      if (key === "more_filters") {
        console.log(this.moreFilterValues);
        Object.keys(this.moreFilterValues).map(itemKey => {
          Vue.delete(this.modelCaching, itemKey);
        });
        console.log(this.modelCaching);
      } else {
        Vue.delete(this.modelCaching, key);
      }

      this.$emit("clear");

      this.startSearch(true);
    }
  }
};
