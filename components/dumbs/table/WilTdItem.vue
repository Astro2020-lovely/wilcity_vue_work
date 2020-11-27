<template>
  <article :class="wrapperClasses">
    <div :class="innerClasses">
      <header v-if="featuredImg" class="listing_header__2pt4D">
        <a :href="permalink" :target="target">
          <div
            class="listing_img__3pwlB pos-a-full bg-cover"
            :style="`background-image: url(${featuredImg})`"
          >
            <img :src="featuredImg" :alt="title" />
          </div>
        </a>
      </header>
      <div v-if="title" class="listing_body__31ndf">
        <slot name="before-title" :item="item"></slot>
        <h2 class="listing_title__2920A text-ellipsis">
          <a :href="permalink" :target="target" v-html="title"></a>
        </h2>
        <slot name="after-title" :item="item"></slot>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  name: "wil-td-item",
  computed: {
    featuredImg() {
      if (this.item.preview) {
        return this.item.preview;
      }

      if (this.item.featuredImage) {
        return this.item.featuredImage;
      }

      return false;
    },
    title() {
      if (this.item.title) {
        return this.item.title;
      }

      if (this.item.name) {
        return this.item.name;
      }

      return false;
    },
    permalink() {
      if (this.item.permalink) {
        return this.item.permalink;
      }

      if (this.item.link) {
        return this.item.link;
      }

      return "#";
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    target: {
      type: String,
      default: "_self"
    },
    wrapperClasses: {
      type: String,
      default:
        "listing_module__2EnGq wil-shadow listing_list2__2An8C js-listing-module"
    },
    innerClasses: {
      type: String,
      default: "listing_firstWrap__36UOZ"
    }
  }
};
</script>
