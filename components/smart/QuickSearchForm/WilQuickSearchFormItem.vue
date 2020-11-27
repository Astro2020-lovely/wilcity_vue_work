<template>
  <article :class="wrapperClasses">
    <div class="listing_firstWrap__36UOZ">
      <header v-if="item.featuredImage" class="listing_header__2pt4D">
        <a :href="item.permalink">
          <div
            class="listing_img__3pwlB pos-a-full bg-cover"
            :style="{ 'background-image': 'url(' + item.featuredImage + ')' }"
          >
            <img :src="item.featuredImage" :alt="item.title" />
          </div>
        </a>
      </header>
      <div class="listing_body__31ndf">
        <h2 class="listing_title__2920A text-ellipsis">
          <a :href="item.permalink" v-html="item.title"></a>
        </h2>
        <div
          v-if="item.tagLine"
          class="listing_tagline__1cOB3 text-ellipsis"
          v-html="item.tagLine"
        ></div>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  name: "wil-quick-search-form-item",
  props: {
    wrapperClasses: {
      type: String,
      default:
        "search-screen_item__1RUWk listing_module__2EnGq wil-shadow listing_list2__2An8C js-listing-module"
    },
    item: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
