import WilSearchFormV2 from "./components/smart/SearchForm/WilSearchFormV2.vue";
import WilSearchFormV2Mobile from "./components/smart/SearchForm/WilSearchFormV2Mobile.vue";
import WilSearchFormPostTypes from "./components/smart/SearchForm/WilSearchFormPostTypes.vue";
import WilAutoComplete from "./components/dumbs/WilAutoComplete.vue";
import WilAsyncGrid from "./components/smart/Grid/WilAsyncGrid.vue";
import WilPagination from "./components/dumbs/WilPagination.vue";
import { SearchFormTagRevelationHelper } from "./mixins/SearchFormTagRevelationHelper";
import { SearchFormHelper } from "./mixins/SearchFormHelper";

import { mapGetters, mapActions } from "vuex";
// if (WILOKE_GLOBAL.DEBUG_SCRIPT && WILOKE_GLOBAL.DEBUG_SCRIPT == "yes") {
//   Vue.config.devtools = true;
// } else {
Vue.config.silent = true;
Vue.config.devtools = false;
// Vue.config.devtools = true;
// }
if (document.getElementById("wil-search-v2")) {
  WILOKE_GLOBAL.vmNewSearchForm = new Vue({
    store: WILCITY_VUEX,
    el: "#wil-search-v2",
    mixins: [SearchFormTagRevelationHelper, SearchFormHelper],
    components: {
      WilSearchFormV2Mobile,
      WilSearchFormV2,
      WilAutoComplete,
      WilAsyncGrid,
      WilPagination,
      WilSearchFormPostTypes,
      WilMapbox: () =>
        import(
          /*webpackChunkName: "WilMapbox" */
          /*webpackPreload: true */
          "./components/dumbs/map/WilMapbox.vue"
        ),
      WilGoogleMap: () =>
        import(
          /*webpackChunkName: "WilGoogleMap" */
          /*webpackPreload: true */
          "./components/dumbs/map/WilGoogleMap.vue"
        )
    },
    data() {
      return {
        isFocusHidden: false,
        posts: [],
        postTypes: [],
        postType: "",
        cacheTimestamp: 0,
        searchFields: [],
        originalSearchFields: [],
        maxItems: 0,
        maxPages: 0,
        errorMsg: "",
        query: {},
        keyword: "", // on top search form
        isFetchingListings: true,
        startingMatchHeight: false,
        searchFieldCacheAt: 0,
        originalQuery: {},
        userID: WILOKE_INLINE_GLOBAL.userID,
        currentPageURL: "",
        listingLocation: {},
        taxonomiesLoaded: [],
        ajaxSelectedOptions: {}, // the fields are ajax field but there is a selected before ajax loading. We will save this option first
        isShowMap: false,
        mouseOnItem: {},
        mouseLeaveItem: {},
        isDropdownActivate: false,
        excludeFields: ["wp_search", "google_place", "type", "postType"],
        excludePostTypeFromMap: [],
        postalCode: null
        // selectedCategories: []
      };
    },
    created() {
      const parseScript = JSON.parse(window.atob(WILCITY_SEARCH));
      this.listingLocation = parseScript.listing_location;
      if (!_.isEmpty(parseScript.terms)) {
        this.updateTermsCache([...parseScript.terms]);
      }

      const rawQuery = { ...parseScript.query };
      if (!_.isUndefined(parseScript.excludePostTypesFromMap)) {
        try {
          this.excludePostTypeFromMap = [
            ...parseScript.excludePostTypesFromMap
          ];
        } catch (e) {}
      }
      this.postType = rawQuery.postType;
      this.setSearchFields();
      this.setQueryArgsInitialize(rawQuery);
      this.updateSearchField();
      if (this.listingLocation && this.listingLocation.label) {
        this.fetchTermChildren({ parent: this.listingLocation.id });
      }
    },
    mounted() {
      this.originalQuery = {
        ...this.query
      };
      this.originalSearchFields = [...this.searchFields];
      this.currentPageURL = `${location.protocol}//${location.host}${location.pathname}`;

      // if (this.originalQuery["listing_cat"]) {
      // this.selectedCategories = _.isArray(this.originalQuery["listing_cat"])
      //   ? [...this.originalQuery["listing_cat"]]
      //   : [this.originalQuery["listing_cat"]];
      // }
    },
    watch: {
      postType: {
        handler(postType, beforePostType) {
          // Only change the data if a customer clicked on Post Type button
          if (beforePostType.length) {
            this.taxonomiesLoaded = [];
            this.setSearchFields(true);
          }
        }
      },
      query: {
        handler(args) {
          this.isDropdownActivate = false; // hidding search fields on Mobile
          this.generateHistoryState(args);
          this.storeSearchQuery({ postType: this.postType, query: args });
          this.updateListingCatToTagQuery(args.listing_cat);
        },
        deep: true
      }
    },
    methods: {
      getFieldIndex(key) {
        return this.findItemIndexInArray(
          "key",
          "listing_tag",
          this.searchFields
        );
      },
      scrollToTop() {
        const top = document.getElementById("wil-results-wrapper");
        window.scrollTo(0, top.offsetTop - 200);
      },
      handleTopSearchFormClick() {
        if (this.keyword.length) {
          this.query = {
            ...this.query,
            keyword: this.keyword
          };
        } else {
          Vue.delete(this.query, "keyword");
        }
      },
      handleUpdateKeyword(keyword) {
        this.keyword = keyword;
      },
      loadAllTaxonomiesTerms() {
        return this.searchFields.map((field, index) => {
          if (field.group && field.group === "term") {
            this.loadTermsAfterClicking(index);
          }
        });
      },
      handleDropdownClick(status, index, field) {
        // Mobile App Field
        if (!!field && field.key === "more_filters") {
          this.loadAllTaxonomiesTerms();
        } else {
          this.loadTermsAfterClicking(index);
        }

        this.isDropdownActivate = status;
      },
      handleMouseOnListing(item) {
        this.mouseOnItem = item;
      },
      handleMouseLeaveListing(item) {
        this.mouseOnItem = {};
      },
      ...mapActions({
        storeSearchFields: "ModuleSearchForm/updateSearchFields",
        storeSearchQuery: "ModuleSearchForm/updateSearchQuery",
        updateTermsToStore: "ModuleTerms/updateTerms"
      }),
      handleUpdatePosts(posts) {
        this.posts = [...posts];
      },
      handleUpdateMaxPosts(total) {
        this.maxItems = total;
      },
      updateSearchField(key, val) {
        if (!this.searchFields.length) {
          return false;
        }

        if (!_.isEmpty(this.ajaxSelectedOptions)) {
          this.searchFields = this.searchFields.map(item => {
            if (item.group === "term" && this.ajaxSelectedOptions[item.key]) {
              item = {
                ...item,
                options: [...this.ajaxSelectedOptions[item.key]]
              };
            }
            return item;
          });
        }
      },
      removeTaxonomiesLoaded(taxonomy) {
        this.taxonomiesLoaded = this.taxonomiesLoaded.filter(
          item => item !== taxonomy
        );
      },
      addTaxonomiesLoaded(taxonomy) {
        if (!this.taxonomiesLoaded.includes(taxonomy)) {
          this.taxonomiesLoaded = [...this.taxonomiesLoaded, taxonomy];
        }
      },
      getDefaultQuery(searchFields) {
        return searchFields.reduce((carry, item) => {
          if (!!item.std) {
            carry = {
              ...carry,
              [item.key]: item.std
            };
          }

          return carry;
        }, {});
      },
      async setSearchFields(isRebuildQueryArgs) {
        let searchFields = this.getStoreSearchFields(this.postType);
        let query = this.getStorePostTypeQuery(this.postType);

        if (searchFields.fields) {
          if (isRebuildQueryArgs) {
            query = _.isEmpty(query)
              ? this.getDefaultQuery(searchFields.fields)
              : query;
            this.query = {
              ...query,
              offset: 1,
              postType: this.postType
            };
          }
          this.searchFields = [...searchFields.fields];
          this.searchFieldCacheAt = searchFields.savedAt;
        }
        searchFields = await this.fetchSearchFields();
        if (!_.isEmpty(searchFields)) {
          if (isRebuildQueryArgs) {
            query = this.getDefaultQuery(searchFields);
            this.query = {
              ...query,
              offset: 1,
              postType: this.postType
            };
          }
          this.searchFields = [...searchFields];
        }
      },
      handleSearchAfterMapDragend({ bound }) {
        this.query = {
          ...this.query,
          offset: 1,
          map_bounds: bound
        };
      },
      handlePostTypeChange(postType) {
        this.handleFieldChange("postType", postType);
      },
      handlePaginationChange(page) {
        this.handleFieldChange("offset", page);
      },
      handleFieldChange(key, val) {
        switch (key) {
          case "postType":
            this.postType = val;
            break;
          case "listing_cat":
            this.setSelectedCats(val);
            this.removeTaxonomiesLoaded("listing_tag");
            this.handleCatFieldChanged(val);

            if (this.isMobile) {
              const tagFieldIndex = this.getFieldIndex("listing_tag");
              if (tagFieldIndex !== -1) {
                this.loadTermsAfterClicking(tagFieldIndex);
              }
            }
            break;
        }

        if (key === "offset") {
          this.query = {
            ...this.query,
            [key]: val
          };
        }
      },
      generateHistoryState(query) {
        const state = null;
        const title = null;
        const queryArgs = WilQueryHelper.buildQuery(query, true);

        window.history.pushState(
          state,
          title,
          `${this.currentPageURL}?${queryArgs}`
        );
      },
      reset() {
        this.query = {
          ...this.originalQuery,
          postType: this.postType,
          isReset: true
        };
        this.isDropdownActivate = false;
        if (this.postType === this.originalQuery.postType) {
          this.searchFields = [...this.originalSearchFields];
        } else {
          const searchFields = this.getStoreSearchFields(this.postType);
          this.searchFields = [...searchFields.fields];
        }
        // this.taxonomiesLoaded.includes(field.key)
      },
      switchPage(page) {
        this.query = {
          ...this.query,
          offset: page
        };
      },
      findSearchFieldIndex(fieldKey) {
        return this.searchFields.findIndex(item => {
          return item.key === fieldKey;
        });
      },
      async handleAutoCompleteChange(selected, prevSelected) {
        let query = {
          ...this.query
        };

        if (!_.isEmpty(prevSelected)) {
          if (prevSelected.item.type === "geocoder") {
            if (query.oAddress) {
              Vue.delete(query, "oAddress");
              // this.removeTaxonomiesLoaded("listing_location");
            }
          } else if (prevSelected.item.type === "term") {
            Vue.delete(query, prevSelected.item.taxonomy);
          }
        }

        if (selected === "") {
          if (!_.isEmpty(prevSelected)) {
            this.query = {
              ...query,
              isReset: true
            };
          }
          return false;
        }

        let params = {},
          locationFieldIndex = -1;
        if (selected.item.type === "geocoder") {
          const {
            item: { coordinate, context }
          } = selected;
          this.query = {
            ...query,
            oAddress: coordinate,
            isReset: true // which means We will re-update modelCaching => Re-update label
          };
          // const locationFieldIndex = this.findSearchFieldIndex(
          //   "listing_location"
          // );
          // if (locationFieldIndex !== -1) {
          //   if (context.place) {
          //     params = {
          //       context: context.place
          //     };
          //   } else if (context.region) {
          //     params = {
          //       context: context.region
          //     };
          //   } else {
          //     params = {
          //       context: context.country
          //     };
          //   }
          // }
        } else {
          if (selected.item.taxonomy === "listing_location") {
            locationFieldIndex = this.findSearchFieldIndex("listing_location");
          }

          if (locationFieldIndex !== -1) {
            params = {
              parent: selected.item.ID,
              postType: this.postType
            };

            this.listingLocation = {
              id: selected.item.ID,
              label: selected.item.name
            };
          }

          this.query = {
            ...query,
            [selected.item.taxonomy]: selected.item.ID,
            isReset: true // which means We will re-update modelCaching => Re-update label
          };
        }

        if (locationFieldIndex !== -1) {
          const results = await this.fetchTermChildren(params);
          if (!results.hasSubTerms) {
            wilModifyObject.deleteItem("listing_location", this.searchFields);
            this.removeTaxonomiesLoaded("listing_location");
          }
        }
      },
      buildFetchTermArgs(field) {
        const queryKeys = [
          "isHideEmpty",
          "orderBy",
          "order",
          "isShowParentOnly"
        ];
        let args = {};
        for (const [key, val] of Object.entries(field)) {
          if (queryKeys.includes(key)) {
            args[key] = typeof val === "object" ? JSON.stringify(val) : val;
          }
        }

        if (field.key === "listing_tag") {
          let listingCat = null;
          if (!!field.listing_cat) {
            listingCat = field.listing_cat;
          } else if (this.query.listing_cat) {
            listingCat = this.query.listing_cat;
          }

          args = {
            ...args,
            listing_cat: listingCat
          };
        }

        args = {
          ...args,
          postType: this.postType
        };

        if (
          field.group === "term" &&
          field.isMultiple === "no" &&
          !_.isUndefined(this.query[field.key])
        ) {
          args = {
            ...args,
            parent: this.query[field.key]
          };
        }

        return args;
      },
      updateTermsCache(rawTerms) {
        const terms = rawTerms.reduce((carry, item) => {
          const termId = item.term_id.toString();
          return {
            ...carry,
            [termId]: item
          };
        }, {});
        this.updateTermsToStore({ terms });
      },
      async fetchTerms(field) {
        if (field.key === "listing_tag") {
          const listingTags = this.getTagRevelationCache();
          if (!_.isEmpty(listingTags)) {
            return {
              terms: listingTags
            };
          }
        }

        let data = {
          terms: []
        };
        let terms;
        await Vue.axios
          .get(`${WILOKE_GLOBAL.restAPI}taxonomy/${field.key}`, {
            params: this.buildFetchTermArgs(field)
          })
          .then(response => {
            if (response.data.status === "success") {
              terms = response.data.terms.map(term => {
                return {
                  label: term.name,
                  id: term.term_id,
                  belongsTo: _.isUndefined(term.belongsTo)
                    ? false
                    : term.belongsTo
                };
              });
              data = {
                ...data,
                terms
              };
              this.updateTermsCache(response.data.terms);
              if (field.key === "listing_tag") {
                this.setTagRevelationCache(terms);
              }
            } else {
              data = {
                ...data,
                errMsg: response.data.msg
              };
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
            data = {
              ...data,
              errMsg: response.message
            };
          });

        return data;
      },
      async fetchTermChildren(params) {
        let terms = [];
        this.taxonomiesLoaded = [...this.taxonomiesLoaded, "listing_location"];
        await Vue.axios
          .get(`${WILOKE_GLOBAL.restAPI}taxonomy/listing_location/sub-terms`, {
            params
          })
          .then(response => {
            if (response.data.status === "success") {
              terms = response.data.terms.map(term => {
                return { label: term.name, id: term.term_id };
              });
              this.updateTermsCache(response.data.terms);
            }
          });
        const hasSubTerms = terms.length;
        if (terms.length) {
          terms = [this.listingLocation, ...terms];
          const locationFieldIndex = this.findSearchFieldIndex(
            "listing_location"
          );
          const field = this.searchFields[locationFieldIndex];
          this.searchFields = wilModifyObject.addValToItem(
            this.searchFields,
            locationFieldIndex,
            {
              options: terms,
              isLoading: false,
              isHidden: !hasSubTerms,
              value: field.childType === "wil-checkbox" ? [] : ""
            }
          );
          this.addTaxonomiesLoaded("listing_location");
        }
        return { hasSubTerms: hasSubTerms, terms };
      },
      updateTermsToSearchField(data, fieldIndex, fieldKey) {
        if (data.terms.length) {
          this.searchFields = wilModifyObject.addValToItem(
            this.searchFields,
            fieldIndex,
            {
              options: data.terms,
              isLoading: false,
              errMsg: ""
            }
          );
          // After loading category, We will add it to cache to avoid re-loading next time.
          this.addTaxonomiesLoaded(fieldKey);
        } else {
          this.searchFields = wilModifyObject.addValToItem(
            this.searchFields,
            fieldIndex,
            {
              options: [],
              isLoading: false,
              errMsg: data.errMsg
            }
          );
        }
      },
      async loadTermsAfterClicking(index) {
        const field = {
          ...this.searchFields[index]
        };

        if (
          field.group &&
          (!this.taxonomiesLoaded.includes(field.key) ||
            _.isEmpty(field.options))
        ) {
          this.searchFields = wilModifyObject.addValToItem(
            this.searchFields,
            index,
            { isLoading: true }
          );
          const data = await this.fetchTerms(field);
          this.updateTermsToSearchField(data, index, field.key);
        }
      },
      resetData() {
        this.errorMsg = "";
      },
      cleanQueryBeforeSearching(query) {
        let cleanQuery = {
          ...query
        };
        for (const [key, val] of Object.entries(query)) {
          if (!!val === false) {
            delete cleanQuery[key];
          } else {
            if (_.isArray(val)) {
              if (!val.length) {
                delete cleanQuery[key];
              }
            } else if (_.isObject(val)) {
              if (!Object.values(val).length) {
                delete cleanQuery[key];
              }
            } else {
              try {
                if (!_.isNumber(val)) {
                  const parseVal = JSON.parse(val);
                  if (_.isEmpty(parseVal)) {
                    delete cleanQuery[key];
                  }
                }
              } catch (e) {}
            }
          }
        }
        return cleanQuery;
      },
      async handleFormChange(query) {
        this.query = this.cleanQueryBeforeSearching(query);
      },
      convertFromOldFieldToNewField(oldFieldType) {
        let newFieldType = "";

        switch (oldFieldType) {
          case "select2":
            newFieldType = "dropdown";
            break;
          case "checkbox2":
            newFieldType = "dropdown";
            break;
          case "date_range":
          case "autocomplete":
            newFieldType = "";
            break;
        }

        return newFieldType;
      },
      async fetchSearchFields() {
        // Optionally the request above could also be done as
        let searchFields = [];
        await Vue.axios
          .get(`${WILOKE_GLOBAL.restAPI}search/fields`, {
            params: {
              cacheAt: this.searchFieldCacheAt,
              postType: this.postType
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              if (response.data.action === "update_search_fields") {
                const fields = [...response.data.fields];
                searchFields = fields.filter(field => {
                  return !this.excludeFields.includes(field.key);
                });
                this.storeSearchFields({
                  fields: searchFields,
                  postType: this.postType
                });
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
        return searchFields;
      }
    },
    computed: {
      ...mapGetters({
        getStorePostTypeQuery: "ModuleSearchForm/getPostTypeQuery",
        getStoreSearchFields: "ModuleSearchForm/getSearchFields",
        getTermFromStore: "ModuleTerms/getTerm"
      }),
      isHideMapBtn() {
        if (_.isEmpty(this.excludePostTypeFromMap)) {
          return false;
        }

        return this.excludePostTypeFromMap.includes(this.postType);
      },
      isMobile() {
        const windowWidth = window.innerWidth;
        return windowWidth <= 480;
      },
      parseItemType() {
        return this.isShowMap ? "list" : "grid";
      },
      contentClasses() {
        if (this.isShowMap) {
          return `col-xs-12 col-sm-12 col-md-6 col-lg-6 `;
        } else {
          return "w-100";
        }
      },
      mapClasses() {
        return "col-xs-12 col-sm-12 col-md-6 col-lg-6";
      },
      parseAutoCompleteParams() {
        const params = {
          ...this.query
        };
        delete params.listing_location;
        delete params.oAddress;

        return params;
      },
      totalListingText() {
        const text =
          this.maxItems > 1
            ? this.$options.filters.filterTranslation("", "listings")
            : this.$options.filters.filterTranslation("", "listing");
        return `${this.maxItems} ${text}`;
      },
      searchFieldWrapper() {
        let classes =
          "filter_module__p0Iwz filter-bar gray js-listing-bar-sticky";
        if (this.isDropdownActivate) {
          return `${classes} is-checked`;
        }

        return classes;
      },
      listingTagField() {
        return this.findItemInArray("key", "listing_tag", this.searchFields);
      }
    }
  });
}
