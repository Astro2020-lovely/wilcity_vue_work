<template>
  <div id="wilcity-quick-search-form-tax-suggestion-wrapper">
    <h2 v-if="title.length" class="search-screen_title__oplSb" v-html="title"></h2>
    <div class="row" data-col-xs-gap="10" data-col-sm-gap="20">
      <div
        v-for="term in terms"
        :key="`wil-quick-search-form-${term.term_id}`"
        class="col-sm-6 col-md-4 col-lg-4"
      >
        <div class="image-box_module__G53mA">
          <a :href="term.link">
            <header class="image-box_header__1bT-m">
              <div class="wil-overlay"></div>
              <div
                class="image-box_img__mh3A- bg-cover"
                :style="{'background-image': 'url('+term.featuredImg+')'}"
              >
                <img :src="term.featuredImg" :alt="term.name" />
                <div
                  v-if="term.oGradient"
                  class="gradient-color"
                  :style="{'background-image': generateTermGradient(term)}"
                ></div>
              </div>
            </header>
            <div class="image-box_body__Je8Uw">
              <h2 class="image-box_title__1PnHo" v-html="term.name"></h2>
              <span class="image-box_text__1K_bA">
                <i class="la la-edit color-primary"></i>
                {{renderNumberListings(term.count)}}
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="javascript">
export default {
  name: "wil-quick-search-form-terms",
  props: {
    terms: {
      type: [Object, Array],
      default: () => []
    },
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    renderNumberListings(count) {
      if (count === 0 || count > 1) {
        return count + " " + WILCITY_I18.listings;
      } else {
        return count + " " + WILCITY_I18.listing;
      }
    },
    generateTermGradient(item) {
      return (
        "linear-gradient(to top, " +
        item.oGradient.left +
        " 7%, " +
        item.oGradient.right +
        " 100%)"
      );
    }
  }
};
</script>
