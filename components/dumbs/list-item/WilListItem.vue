<template>
  <a :class="wrapperClasses" :href="item.link">
    <span
      v-if="hasRemove"
      class="list-utility_remove__1Vlf4 color-primary--hover"
      @click.prevent="handleDeleteItem"
    >
      <i class="la la-close"></i>
    </span>
    <div :class="innerClasses">
      <slot name="feature-image" :item="item">
        <div
          v-if="item.featuredImg"
          class="utility-box-1_avatar__DB9c_ rounded-circle"
          :style="{'background-image': 'url('+item.featuredImg+')'}"
        >
          <img :src="item.featuredImg" :alt="item.title" />
        </div>
      </slot>
      <slot name="content" :item="item">
        <div class="utility-box-1_body__8qd9j">
          <div class="utility-box-1_group__2ZPA2">
            <h3 class="utility-box-1_title__1I925" v-if="item.title" v-html="item.title"></h3>
            <div class="utility-box-1_content__3jEL7" v-html="item.content">
              <span
                v-if="item.contentHighlight"
                class="color-dark-1"
                v-html="item.contentHighlight"
              ></span>
            </div>
          </div>
          <div class="utility-box-1_description__2VDJ6">
            <i class="la la-comments color-primary"></i>
            {{item.time}}
          </div>
        </div>
      </slot>
    </div>
  </a>
</template>

<script>
export default {
  name: "wil-list-item",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: "list-utility_link__3BRZx"
    },
    innerClasses: {
      type: String,
      default:
        "utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix"
    },
    hasRemove: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleDeleteItem(action) {
      const askHim = confirm(
        this.$options.filters.filterTranslation(
          "Are you sure to delete this item?",
          "confirmDelete"
        )
      );
      if (!askHim) {
        return false;
      }

      this.$emit("remove");
    }
  }
};
</script>
