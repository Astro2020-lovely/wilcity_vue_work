import WilFieldsGroup from "./components/smart/FieldsGroup/WilFieldsGroup.vue";
import WilHeaderGroup from "./components/smart/FieldsGroup/WilHeaderGroup.vue";
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
Vue.component(WilFieldsGroup.name, WilFieldsGroup);
// if (WILOKE_GLOBAL.DEBUG_SCRIPT && WILOKE_GLOBAL.DEBUG_SCRIPT == "yes") {
//   Vue.config.devtools = true;
// } else {
Vue.config.silent = true;
Vue.config.devtools = false;
// Vue.config.devtools = true;
// }

if (document.getElementById(WHITE_LABEL + "-addlisting")) {
  WILOKE_GLOBAL.vm = new Vue({
    el: "#" + WHITE_LABEL + "-addlisting",
    store: WILCITY_VUEX,
    components: {
      // WilFieldsGroup,
      WilHeaderGroup
    },
    data() {
      return {
        sections: [],
        oAllSocialNetworks: WILCITY_ADDLISTING_INLINE.oSocialNetworks,
        ajaxHandleReview: null,
        listingID: WILCITY_ADDLISTING_INLINE.listingID,
        planID: WILCITY_ADDLISTING_INLINE.planID,
        listingType: WILCITY_ADDLISTING_INLINE.listingType,
        isWorkingOn: "",
        isSubmitting: false,
        aSectionsRange: [],
        scrollBarTop: 0,
        errorMsgs: [],
        wilcityAddListingCsrf: WILCITY_ADDLISTING_INLINE.wilcityAddListingCsrf,
        results: {},
        listingTagsAndCatRevelations: {},
        listingTagsOrder: null // Determining Listing Tag order in the sections variable. Because This field depends on Category, We will have to update its query everytime the Category changes. The cache order helps to reduce finding time
      };
    },
    created() {
      if (WILCITY_ADDLISTING_INLINE.results) {
        this.results = {
          ...WILCITY_ADDLISTING_INLINE.results
        };
      }
    },
    mounted() {
      // this.calculateMaxMinHeightOfSection();
      this.init();
    },
    methods: {
      preventToSubmit() {},
      init() {
        this.sections = [...WILCITY_ADDLISTING_INLINE.sections];
      },
      activeSidebar(sectionID) {
        jQuery(this.$el)
          .find(".list_item__3YghP")
          .removeClass("active");
        jQuery(this.$el)
          .find('a[href="#' + sectionID + '"]')
          .parent()
          .addClass("active");
      },
      calculateMaxMinHeightOfSection() {
        const $sections = jQuery(this.$el)
          .find("#" + WHITE_LABEL + "-addlisting-form")
          .children();
        if (!$sections.length) {
          return false;
        }
        const self = this;
        $sections.each(function() {
          const sectionID = jQuery(this).attr("id");
          if (sectionID) {
            const $section = jQuery("#" + sectionID);
            self.aSectionsRange.push({
              max: $section.offset().top + $section.outerHeight(),
              min: $section.offset().top,
              id: sectionID
            });
          }
        });
        this.activeSidebar(self.aSectionsRange[0].id);
        this.listenScroll();
      },
      listenScroll() {
        let isScrolling;
        const windowHeight = jQuery(window).height();
        const countSections = this.aSectionsRange.length - 1;

        jQuery(window).scroll(() => {
          window.clearTimeout(isScrolling);
          isScrolling = setTimeout(() => {
            const scrollTop = jQuery(window).scrollTop();
            if (scrollTop !== this.scrollBarTop) {
              this.scrollBarTop = scrollTop;
              for (let order = 0; order <= countSections; order++) {
                if (
                  this.aSectionsRange[order].min > scrollTop &&
                  this.aSectionsRange[order].min < windowHeight + scrollTop
                ) {
                  this.activeSidebar(this.aSectionsRange[order].id);
                  break;
                }
              }
            }
          }, 80);
        });
      },
      generateSectionKey(id, addHash) {
        let generateID = `${WHITE_LABEL}-addlisting-${id}`;
        if (addHash) {
          generateID = "#" + generateID;
        }
        return generateID;
      },
      scrollTo(sectionKey) {
        this.isWorkingOn = sectionKey;
        const sectionID = this.generateSectionKey(sectionKey, true);

        jQuery("html, body").animate(
          {
            scrollTop:
              jQuery(sectionID).offset().top -
              WilCityHelpers.additionalHeightToScrollTop()
          },
          500
        );
      },
      sidebarClass(sectionKey) {
        return {
          list_item__3YghP: 1 === 1,
          active: sectionKey === this.isWorkingOn
        };
      },
      handlePreview() {
        this.isSubmitting = true;
        this.errorMsgs = [];
        let ajaxAction = "";

        ajaxAction = "wilcity_handle_review_listing";
        const formData = new FormData();
        formData.append("action", ajaxAction);
        formData.append("planID", this.planID);
        formData.append("listingID", this.listingID);
        formData.append("listingType", this.listingType);
        formData.append("data", JSON.stringify(this.results));
        formData.append("wilcityAddListingCsrf", this.wilcityAddListingCsrf);

        Vue.axios
          .post(WILOKE_GLOBAL.ajaxurl, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(response => {
            if (!response.data.success) {
              if (response.data.data.msg) {
                this.errorMsgs = [response.data.data.msg];
              } else {
                this.errorMsgs = [...response.data.data];
              }
            } else {
              window.location.href = response.data.data.redirectTo;
            }
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      },
      generateCacheTagRevelationKey() {
        const catIds = this.getListingCatIds();
        if (!catIds.length) {
          return "all";
        }

        return WilCacheKeyHelper.generateCacheKey(catIds);
      },
      removeInRevelationTags() {
        const catIds = this.getListingCatIds();
        if (!catIds.length) {
          return false;
        }

        const rawTags = this.getValue("listing_tag");
        if (!!rawTags.listing_tag === false || !rawTags.listing_tag.length) {
          return false;
        }

        let tags = [];
        if (_.isArray(rawTags.listing_tag)) {
          tags = rawTags.listing_tag.filter(tag => {
            return (
              _.isEmpty(tag.belongsTo) ||
              tag.belongsTo.some(catId => catIds.includes(catId))
            );
          });
        } else {
          tags =
            _.isEmpty(rawTags.belongsTo) ||
            rawTags.belongsTo.some(catId => catIds.includes(catId))
              ? rawTags
              : [];
        }
        this.updateResults("listing_tag", {
          listing_tag: tags
        });
      },
      getListingCatIds() {
        const rawListingCat = this.getValue("listing_cat");
        if (
          !!rawListingCat.listing_cat === false ||
          _.isEmpty(rawListingCat.listing_cat)
        ) {
          return [];
        }
        const listingCat = rawListingCat.listing_cat;
        let listingCatIds = [];
        if (_.isNumber(listingCat)) {
          listingCatIds = [listingCat];
        } else if (_.isArray(listingCat)) {
          listingCatIds = listingCat.map(item => {
            return !_.isUndefined(item.ID) ? item.ID : item.id;
          });
        } else if (_.isObject(listingCat)) {
          listingCatIds = !_.isUndefined(listingCat.ID)
            ? [listingCat.ID]
            : [listingCat.id];
        }

        return listingCatIds;
      },
      setListingTagsCache() {
        const tags = this.getValue("listing_tag");
        const catIds = this.getListingCatIds();
        const cacheKey = this.generateCacheTagRevelationKey();
        this.listingTagsAndCatRevelations = {
          ...this.listingTagsAndCatRevelations,
          [cacheKey]: tags.listing_tag
        };
      },
      updateListingTagQuery() {
        if (this.listingTagsOrder === null) {
          this.listingTagsOrder = this.sections.findIndex(item => {
            return item.key === "listing_tag";
          });
        }
        const listingCatIds = this.getListingCatIds();
        if (!listingCatIds.length) {
          return false;
        }

        if (this.listingTagsOrder !== -1) {
          let listingTag = { ...this.sections[this.listingTagsOrder] };

          listingTag = {
            ...listingTag,
            fieldGroups: {
              ...listingTag.fieldGroups,
              listing_tag: {
                ...listingTag.fieldGroups.listing_tag,
                queryArgs: {
                  ...listingTag.fieldGroups.listing_tag.queryArgs,
                  listing_cat: listingCatIds
                },
                lastReset: new Date().getTime()
              }
            }
          };
          this.sections = this.sections.map((section, index) => {
            return index === this.listingTagsOrder ? listingTag : section;
          });
        }
      },
      updateTagsByListingCat(listingCat) {
        if (
          !!listingCat.listing_cat === false ||
          _.isEmpty(listingCat.listing_cat)
        ) {
          return false;
        }

        const cacheKey = this.generateCacheTagRevelationKey();

        if (!!this.listingTagsAndCatRevelations[cacheKey]) {
          this.updateResults("listing_tag", {
            listing_tag: this.listingTagsAndCatRevelations[cacheKey]
          });
        }
      },
      deleteResult(key) {
        Vue.delete(this.results, key);
      },
      updateResults(key, val) {
        this.results = {
          ...this.results,
          [key]: val
        };

        if (key === "listing_tag") {
          this.setListingTagsCache();
        }
      },
      handleFieldChange(key) {
        return val => {
          this.updateResults(key, val);

          if (key === "listing_cat") {
            this.updateListingTagQuery(val);
            this.updateTagsByListingCat(val);
            this.removeInRevelationTags();
          }
        };
      },
      getValue(key) {
        return this.results[key] ? this.results[key] : {};
      }
    },
    computed: {
      submitBtnClass() {
        return { "disable wil-btn--loading": this.isSubmitting };
      },
      pillLoadingClass() {
        return { "pill-loading_loader__3LOnT": this.isSubmitting };
      }
    }
  });
}
