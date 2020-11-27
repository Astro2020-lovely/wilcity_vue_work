import WilAsyncGrid from "./components/smart/Grid/WilAsyncGrid.vue";
import WilPagination from "./components/dumbs/WilPagination.vue";
import { mapGetters, mapActions } from "vuex";
import { SearchFormTagRevelationHelper } from "./mixins/SearchFormTagRevelationHelper";
import { SearchFormHelper } from "./mixins/SearchFormHelper";

if (document.getElementById("wil-search-v1")) {
  WILOKE_GLOBAL.vmNewSearchForm = new Vue({
    store: WILCITY_VUEX,
    mixins: [SearchFormTagRevelationHelper, SearchFormHelper],
    el: "#wil-search-v1",
    components: {
      WilLayoutSwitch: () =>
        import(
          /*webpackChunkName: "WilLayoutSwitch" */
          /*webpackPreload: true */
          "./components/smart/SearchForm/WilLayoutSwitch.vue"
        ),
      WilSearchFormV1: () =>
        import(
          /*webpackChunkName: "WilSearchFormV1" */
          /*webpackPreload: true */
          "./components/smart/SearchForm/WilSearchFormV1.vue"
        ),
      WilAsyncGrid,
      WilPagination,
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
        isOpenSearchPopup: false,
        isFocusHidden: false,
        isFetchingSearchFields: true,
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
        temporaryQuery: {},
        isFetchingListings: true,
        startingMatchHeight: false,
        searchFieldCacheAt: 0,
        originalQuery: {},
        userID: WILOKE_INLINE_GLOBAL.userID,
        currentPageURL: "",
        taxonomiesLoaded: [],
        ajaxSelectedOptions: {}, // the fields are ajax field but there is a selected before ajax loading. We will save this option first
        isShowMap: false,
        mouseOnItem: {},
        mouseLeaveItem: {},
        searchFieldErrMsg: "",
        parseItemType: "grid",
        fieldsExcludeFromV1: {
          originalKey: ["new_price_range", "custom_dropdown"]
        }
      };
    },
    created() {
      const parseScript = JSON.parse(window.atob(WILCITY_SEARCH));
      const rawQuery = { ...parseScript.query };
      this.postType = rawQuery.postType;
      this.setSearchFields();
      this.setQueryArgsInitialize(rawQuery);
      this.updateSearchField();
      this.temporaryQuery = { ...this.query };
    },
    mounted() {
      this.originalQuery = {
        ...this.query
      };
      this.originalSearchFields = [...this.searchFields];
      this.currentPageURL = `${location.protocol}//${location.host}${location.pathname}`;
    },
    watch: {
      postType: {
        handler(postType, beforePostType) {
          // Only change the data if a customer clicked on Post Type button
          if (beforePostType.length) {
            this.taxonomiesLoaded = [];
            const query = this.getStorePostTypeQuery(this.postType);
            this.query = {
              ...query,
              page: 1,
              postType
            };
            this.setSearchFields();
          }
        }
      },
      query: {
        handler(args) {
          this.generateHistoryState(args);
          if (this.postType !== args.postType) {
            this.postType = args.postType;
          }

          this.storeSearchQuery({ postType: this.postType, query: args });
        },
        deep: true
      }
    },
    methods: {
      handleMobileSearchQuery() {
        this.query = { ...this.temporaryQuery };
        this.isOpenSearchPopup = false;
      },
      toggleSearchPopupBtn() {
        this.isOpenSearchPopup = !this.isOpenSearchPopup;
      },
      removeExcludeSearchFields() {
        const excludeKeys = Object.keys(this.fieldsExcludeFromV1);
        this.searchFields = this.searchFields.filter(item => {
          return excludeKeys.every(key => {
            return (
              !item[key] || !this.fieldsExcludeFromV1[key].includes(item[key])
            );
          });
        });
      },
      handleUpdateListingLayout(layout) {
        this.parseItemType = layout;
      },
      handleMouseOnListing(item) {
        this.mouseOnItem = item;
      },
      handleMouseLeaveListing(item) {
        this.mouseOnItem = {};
      },
      ...mapActions({
        storeSearchFields: "ModuleSearchForm/updateSearchFields",
        storeSearchQuery: "ModuleSearchForm/updateSearchQuery"
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
      setSearchFields() {
        this.isFetchingSearchFields = true;
        const searchFields = this.getStoreSearchFields(this.postType);
        if (searchFields.fields) {
          this.searchFields = [...searchFields.fields];
          this.removeExcludeSearchFields();
          this.searchFieldCacheAt = searchFields.savedAt;
          this.isFetchingSearchFields = false;
        }
        this.fetchSearchFields();
      },
      handleSearchAfterMapDragend({ bound }) {
        this.query = {
          ...this.query,
          page: 1,
          map_bounds: bound
        };
      },
      handlePaginationChange(page) {
        this.handleFieldChange("page", page);
      },
      handleFieldChange(key, val, prevVal) {
        if (key === "postType") {
          this.postType = val;
        } else {
          if (key === "listing_cat") {
            this.searchFields = this.searchFields.map(field => {
              if (field.key === "listing_tag") {
                field = {
                  ...field,
                  lastReset: new Date().getTime()
                };
              }
              return field;
            });
          }

          let page = key === "page" ? val : 1;
          if (this.isMobile) {
            this.temporaryQuery = {
              ...this.temporaryQuery,
              [key]: val,
              page
            };
          } else {
            this.query = {
              ...this.query,
              [key]: val,
              page
            };
          }
        }

        console.log("FieldChange", key, val, this.isMobile);
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
        this.searchFields = [...this.originalSearchFields];
      },
      switchPage(page) {
        this.query = {
          ...this.query,
          page
        };
      },
      findSearchFieldIndex(fieldKey) {
        return this.searchFields.findIndex(item => {
          return item.key === fieldKey;
        });
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
                const parseVal = JSON.parse(val);
                if (_.isObject(parseVal) && _.isEmpty(parseVal)) {
                  delete cleanQuery[key];
                }
              } catch (e) {}
            }
          }
        }

        return cleanQuery;
      },
      async handleFormChange(query) {
        if (this.isMobile) {
          this.temporaryQuery = this.cleanQueryBeforeSearching(query);
        } else {
          this.query = this.cleanQueryBeforeSearching(query);
        }
      },
      async fetchSearchFields() {
        // Optionally the request above could also be done as
        this.searchFieldErrMsg = "";
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
                // this.fields = [...response.data.fields];
                this.searchFields = response.data.fields.map(field => {
                  switch (field.type) {
                    case "select2":
                      let childType = "wil-radio";
                      if (field.isMultiple === "yes") {
                        childType = "wil-checkbox";
                      }
                      field = {
                        ...field,
                        childType: childType,
                        type: "dropdown"
                      };
                      break;
                    case "checkbox2":
                      field = {
                        ...field,
                        childType: "wil-checkbox",
                        type: "dropdown"
                      };
                      break;
                    case "checkbox":
                      field = {
                        ...field,
                        type: "wil-toggle-btn"
                      };
                      break;
                    case "wil-search-dropdown":
                      if (field.isMultiple === "yes") {
                        field = {
                          ...field,
                          valueFormat: "array"
                        };
                      }
                      break;
                  }
                  return field;
                });
                this.removeExcludeSearchFields();
                this.storeSearchFields({
                  fields: this.searchFields,
                  postType: this.postType
                });
              }
            } else {
              this.searchFieldErrMsg = response.data.msg;
            }
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            this.isFetchingSearchFields = false;
          });
      }
    },
    computed: {
      ...mapGetters({
        getStorePostTypeQuery: "ModuleSearchForm/getPostTypeQuery",
        getStoreSearchFields: "ModuleSearchForm/getSearchFields"
      }),
      totalListingText() {
        const text =
          this.maxItems > 1
            ? this.$options.filters.filterTranslation("", "listings")
            : this.$options.filters.filterTranslation("", "listing");
        return `${this.maxItems} ${text}`;
      },
      isDesktop() {
        const windowWidth = window.innerWidth;
        return windowWidth > 769;
      }
    }
  });
}
