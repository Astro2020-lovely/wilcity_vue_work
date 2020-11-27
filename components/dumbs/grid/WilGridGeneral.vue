<template>
  <header class="listing_header__2pt4D is-verified">
    <slot name="beforeheader" :post="post"></slot>
    <span v-if="post.isAds=='yes'" class="wil-ads">{{'Ads'|filterTranslation('ads')}}</span>
    <a :href="post.permalink">
      <span class="wilcity-slider-gradient-before"></span>
      <template v-for="(item, index) in skeleton">
        <component
          :key="`wil-grid-${post.ID}-${index}-${item.type}`"
          :is="determineSkeleton(item)"
          :post="post"
        />
      </template>
      <span class="wilcity-slider-gradient-after"></span>
    </a>
    <span
      v-if="post.isClaimed=='yes'"
      class="wil-verified-wrap wil-verified"
    >{{'Verified'|filterTranslation('verfied')}}</span>
    <slot name="afterheader" :post="post"></slot>
  </header>
</template>
<script lang="javascript">
export default {
  name: "wil-grid-general",
  components: {
    WilReviewAverageRating: () =>
      import(
        /*webpackPreload: true */
        /*webpackChunkName: "WilReviewAverageRating"*/
        "./../review/WilReviewAverageRating.vue"
      ),
    WilGridAverageRating: () =>
      import(
        /*webpackPreload: true */
        /*webpackChunkName: "WilGridAverageRating" */
        "./WilGridAverageRating.vue"
      ),
    WilGridFeaturedImage: () =>
      import(
        /*webpackPreload: true */
        /*webpackChunkName: "WilGridFeaturedImage" */
        "./WilGridFeaturedImage.vue"
      )
  },
  methods: {
    determineSkeleton(item) {
      return item.type.includes("wil-grid")
        ? item.type
        : `wil-grid-${item.type}`;
    }
  },
  props: {
    post: {
      type: Object,
      required: true,
      default: () => {}
    },
    skeleton: {
      type: Array,
      default: () => [
        {
          type: "average-rating"
        },
        {
          type: "featured-image"
        }
      ]
    }
  },
  computed: {}
};
</script>
