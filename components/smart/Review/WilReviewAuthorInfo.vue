<template>
  <div :class="wrapperClasses">
    <a
      v-if="isShowLeft"
      :href="author.authorLink"
      class="utility-box-1_avatar__DB9c_ rounded-circle"
      :style="`background-image: url(${author.avatar});`"
    >
      <img :src="author.avatar" :alt="author.displayName" />
    </a>
    <div v-if="isShowRight" class="utility-box-1_body__8qd9j">
      <div class="utility-box-1_group__2ZPA2">
        <h3 class="utility-box-1_title__1I925">
          <a :href="author.authorLink" v-html="author.displayName"></a>
        </h3>
      </div>
      <div class="utility-box-1_description__2VDJ6">{{author.date}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-review-author-info",
  props: {
    wrapperClasses: {
      type: String,
      default:
        "utility-box-1_module__MYXpX utility-box-1_boxLeft__3iS6b clearfix utility-box-1_sm__mopok review-author-avatar"
    },
    author: {
      type: Object,
      required: true
    },
    isShowRight: {
      type: Boolean,
      default: true
    },
    isShowLeft: {
      type: Boolean,
      default: true
    }
  }
};
</script>
