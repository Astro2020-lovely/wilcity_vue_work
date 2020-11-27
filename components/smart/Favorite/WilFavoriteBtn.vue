<template>
  <wil-link
    :wrapper-classes="wrapperClasses"
    :btn-name="btnName"
    :icon="icon"
    @click="handleFavorite"
  >
    <template
      v-if="hasWrapperForIcon === 'yes'"
      v-slot:default="{ btnName, icon }"
    >
      <span class="list_icon__2YpTp">
        <i :class="icon"></i>
      </span>
      <span
        class="list_text__35R07"
        v-if="btnName.length"
        v-html="btnName"
      ></span>
    </template>
  </wil-link>
</template>

<script>
import { isUserLoggedIn } from "./../../../mixins/UserHelper";

export default {
  name: "wil-favorite-btn",
  mixins: [isUserLoggedIn],
  data() {
    return {
      isFavorited: false
    };
  },
  computed: {
    icon() {
      if (!this.isFavorited) {
        return "la color-quaternary la la-heart-o";
      } else {
        return "la la-heart color-primary";
      }
    }
  },
  methods: {
    handleFavorite() {
      WilClickHelper.next(() => {
        this.isFavorited = !this.isFavorited;
        jQuery.ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: "wilcity_favorite_statistics",
            postID: this.postId
          }
        });
      });
    },
    fetchFavoriteStatus() {
      this.isUserLoggedIn(() => {
        jQuery.ajax({
          type: "GET",
          url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_is_my_favorited&postID=${this.postId}`,
          success: response => {
            if (!response.success || response.data.status === "no") {
              this.isFavorited = false;
            } else {
              this.isFavorited = true;
            }
          }
        });
      });
    }
  },
  mounted() {
    this.fetchFavoriteStatus();
  },
  props: {
    hasWrapperForIcon: {
      type: String,
      default: "no"
    },
    postId: {
      type: Number,
      default: 0,
      required: true
    },
    btnName: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "wil-btn wil-btn--border wil-btn--round wil-btn--sm"
    }
  }
};
</script>
