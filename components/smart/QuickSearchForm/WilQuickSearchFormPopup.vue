<template>
  <transition name="fade-shrink-in" appear>
    <div
      id="quick-search-form-popup"
      class="search-screen_module__q_w-H pos-f-full active"
      style="padding-top: 10px;"
    >
      <div class="search-screen_close__2OSie" @click="handleCloseSearchForm">
        <i class="la la-close"></i>
      </div>
      <div class="container">
        <div class="row">
          <div v-if="postTypes.length" class="col-md-12">
            <wil-link
              v-for="item in postTypes"
              :key="`wil-quick-search-for-post-type-${item.postType}`"
              :btn-name="item.name"
              @click="postType = item.postType"
              :wrapper-classes="[
                'wil-btn--round wil-btn wil-btn--md active mr-20 mb-20',
                postType === item.postType ? 'wil-btn--primary' : ''
              ]"
            />
          </div>
          <div class="col-md-12 search-screen_search__15VV1">
            <input
              id="wilcity-quick-search-field-popup"
              v-wil-focus="true"
              type="text"
              :placeholder="'' | filterTranslation('whatAreULookingFor')"
              v-model="s"
            />
          </div>
        </div>
      </div>
      <div class="search-screen_box__1jxsb wil-scroll-bar">
        <div class="container">
          <div class="row mb-30" v-if="isSearching">
            <div class="col-md-12 pos-r" style="height: 100px;">
              <wil-block-loading
                :is-loading="isSearching"
                style="background-color: #fff"
              />
            </div>
          </div>
          <div class="row mb-30" v-if="!isSearching">
            <template v-if="posts.length && !isNotFound">
              <div
                class="col-md-6"
                v-for="post in posts"
                :key="`wil-quick-searchform-${post.ID}`"
              >
                <wil-quick-search-form-item :item="post" />
              </div>
            </template>
            <wil-alert
              v-if="isNotFound"
              :msg="'' | filterTranslation('noResultsFound')"
            />
          </div>
          <wil-quick-search-form-terms
            v-if="terms.length"
            :terms="terms"
            :title="termTitle"
          />
        </div>
      </div>
    </div>
  </transition>
</template>
<style scoped>
.fade-shrink-in-enter-active,
.fade-shrink-in-leave-active {
  transition: all 0.3s ease;
}

.fade-shrink-in-enter,
.fade-shrink-in-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
<script lang="javascript">
import WilQuickSearchFormItem from "./WilQuickSearchFormItem.vue";
import WilQuickSearchFormTerms from "./WilQuickSearchFormTerms.vue";

export default {
  name: "wil-quick-search-form-popup",
  data() {
    return {
      isSearching: false,
      cache: [],
      listings: {},
      s: "",
      postType: "",
      termTitle: "",
      debound: null,
      isNotFound: false,
      terms: [],
      timeout: 0,
      queryArgs: {},
      posts: []
    };
  },
  props: {
    postTypes: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    postType: function(val) {
      this.handleQueryChange("postType", val);
    },
    s: function(val) {
      this.handleQueryChange("s", val);
    },
    isOpen: {
      handler(isOpen) {
        if (isOpen) {
          this.perfectScrollbar();
        } else {
          this.removeDisabledScroll();
        }
      },
      immediate: true
    }
  },
  components: {
    WilQuickSearchFormItem,
    WilQuickSearchFormTerms
  },
  created() {
    this.fetchTermSuggestions();
    const firstPostType = { ...this.postTypes[0] };
    this.postType = firstPostType.postType;
  },
  methods: {
    removeDisabledScroll() {
      // if (WilCityHelpers.isMobile()) {
      document.body.classList.remove("disabled-scroll");
      // }
    },
    perfectScrollbar() {
      // if (WilCityHelpers.isMobile()) {
      //   return false;
      // }
      this.$nextTick(function() {
        let scrollBar = document
          .getElementById("quick-search-form-popup")
          .querySelector(".wil-scroll-bar");
        if (scrollBar === null) {
          return false;
        }
        new PerfectScrollbar(scrollBar);
      });
    },
    handleQueryChange(key, val) {
      if (key === "s") {
        this.timeout = 1000;
      } else {
        this.timeout = 0;
      }

      if (this.debound !== null) {
        clearTimeout(this.debound);
      }

      this.queryArgs = {
        ...this.queryArgs,
        [key]: val
      };

      this.handleSearch();
    },
    handleCloseSearchForm() {
      this.$emit("close");
    },
    fetchTermSuggestions() {
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wilcity_quick_search_form_suggestion"
        })
      }).then(response => {
        if (response.data.success) {
          this.terms = response.data.data.terms;
          this.termTitle = response.data.data.title;
        }
      });
    },
    handleSearch() {
      this.isNotFound = false;
      this.isSearching = true;
      this.queryArgs = {
        ...this.queryArgs,
        searchTarget: ['listing']
      };

      this.debound = setTimeout(() => {
        Vue.axios({
          method: "GET",
          url: WilQueryHelper.buildQueryUrl({
            action: "wil_quick_search_listings",
            data: JSON.stringify(this.queryArgs)
          })
        })
          .then(response => {
            if (!response.data.success) {
              this.isNotFound = true;
              this.cache = {
                ...this.cache,
                [this.s]: "notfound"
              };
            } else {
              const posts = [...response.data.data];
              this.cache = {
                ...this.cache,
                [this.s]: posts
              };
              this.posts = posts;
            }
          })
          .finally(() => {
            this.isSearching = false;
            clearTimeout(this.debound);
          });
      }, this.timeout);
    }
  }
};
</script>
