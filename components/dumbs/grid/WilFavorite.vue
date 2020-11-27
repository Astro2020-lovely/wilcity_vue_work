<template>
  <wil-link
    :wrapper-classes="[wrapperClasses]"
    :data-post-id="post.ID"
    :link="post.permalink"
    :data-tooltip="'Favorite' | filterTranslation('favoriteTooltip')"
    :icon="icon"
    data-tooltip-placement="top"
    v-my-favorite:click="{icon: 'toggleFavoriteIcon', postID: post.ID}"
  />
</template>
<script lang="javascript">
export default {
  name: "wil-favorite",
  computed: {
    isMyFavorite: {
      get() {
        return this.saved === "yes";
      },
      set(status) {
        this.$emit("change", status ? "yes" : "no");
      }
    },
    icon() {
      if (this.iconType === "love") {
        return this.isMyFavorite
          ? "la la-heart color-primary"
          : "la la-heart-o";
      }
      return this.isMyFavorite ? "la la-star color-primary" : "la la-star-o";
    }
  },
  methods: {
    toggleFavoriteIcon() {
      this.isMyFavorite = !this.isMyFavorite;
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default:
        "utility-meta_module__mfOnV utility-meta_primary__2xTvX utility-meta_border__3O9g6 mb-10 mr-5 is-event",
      required: false
    },
    post: {
      type: Object,
      default: () => {},
      required: false
    },
    saved: {
      type: String,
      default: "no",
      required: false
    },
    iconType: {
      type: String,
      default: "love" // love or star
    }
  }
};
</script>
