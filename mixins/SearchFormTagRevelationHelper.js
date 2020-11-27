import { mapGetters, mapActions } from "vuex";
export const SearchFormTagRevelationHelper = {
  data() {
    return {
      cacheTagRevelations: {},
      categoriesSelected: null
    };
  },
  computed: {
    ...mapGetters({
      getTermFromStore: "ModuleTerms/getTerm"
    })
  },
  methods: {
    getFieldByKey(key) {
      return this.searchFields.find(item => {
        return item.key === key;
      });
    },
    setSelectedCats(catIds) {
      this.categoriesSelected = _.isArray(catIds) ? [...catIds] : catIds;
    },
    getTagRevelationCacheKey() {
      let cacheKey = "all";
      if (!!this.categoriesSelected) {
        if (_.isArray(this.categoriesSelected)) {
          cacheKey = WilCacheKeyHelper.generateCacheKey(
            this.categoriesSelected
          );
        } else {
          cacheKey = this.categoriesSelected;
        }
      }
      return `${this.postType}_${cacheKey}`;
    },
    getTagRevelationCache(cacheKey) {
      cacheKey = _.isUndefined(cacheKey)
        ? this.getTagRevelationCacheKey()
        : cacheKey;
      if (!_.isEmpty(this.cacheTagRevelations[cacheKey])) {
        return this.cacheTagRevelations[cacheKey];
      }

      return [];
    },
    setTagRevelationCache(tags, cacheKey) {
      cacheKey = _.isUndefined(cacheKey)
        ? this.getTagRevelationCacheKey()
        : cacheKey;

      this.cacheTagRevelations = {
        ...this.cacheTagRevelations,
        [cacheKey]: _.isArray(tags) ? [...tags] : tags
      };
    },
    updateListingCatToTagQuery(category) {
      this.searchFields = this.searchFields.map(item => {
        if (item.key === "listing_tag") {
          if (!!category === false) {
            delete item.listing_cat;
          } else {
            item = {
              ...item,
              listing_cat: category
            };
          }
          // this.removeTaxonomiesLoaded("listing_tag");
        }
        return item;
      });
    },
    updateTagsOptionToTagField(catIds) {
      // this.categoriesSelected = catIds;
      const catField = this.getFieldByKey("listing_cat");
      if (catField.isMultiple === "no") {
        const tagField = this.getTagRevelationCache(catIds);
        if (!_.isEmpty(tagField)) {
          this.searchFields = this.searchFields.map(item => {
            return item.key !== "listing_tag"
              ? item
              : {
                  ...item,
                  options: tagField
                };
          });
        }
      }
    },
    handleAfterClearValue() {
      this.updateListingCatToTagQuery();
      this.categoriesSelected = null;
    },
    // If it's Search V2, the field changed but customer still not click on Apply button
    handleCatFieldChanged(val) {
      this.updateListingCatToTagQuery(val);
      this.updateTagsOptionToTagField(val);
    },
    // catIds is an array of category ids [1,2,3]
    // tagOptions is an array of tag options [{ID: 1, belongsTo: [1,2,3]|false}]
    removeUnRevelationTags(catIds, tagOptions) {
      if (_.isEmpty(catIds) || _.isEmpty(tagOptions)) {
        return false;
      }

      return tagOptions.filter(item => {
        return this.isTagBelongsToCat(item, catIds);
      });
    },
    isTagBelongsToCat(tagOption, catIds) {
      return (
        !tagOption.belongsTo ||
        tagOption.belongsTo.some(catId => catIds.includes(catId))
      );
    }
  }
};
