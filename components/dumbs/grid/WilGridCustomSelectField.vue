<template>
  <div :class="wrapperClasses" v-if="items.length">
    <i v-if="icon.length" :class="[icon, 'color-primary']"></i>
    <a :href="post.permalink">
      <span
        v-for="(item, index) in items"
        :key="`${uquidId}-${index}`"
        v-html="item.name"
        :class="parseItemClasses(index)"
      ></span>
    </a>
  </div>
</template>
<style scoped>
.comma:not(:last-child):after {
  content: ",";
  margin-right: 2px;
}
</style>
<script>
export default {
  name: "wil-grid-custom-select-field",
  props: {
    wrapperClasses: {
      type: String,
      default:
        "text-ellipsis wil-custom-field wil-custom-select-field d-inline-block"
    },
    items: {
      type: Array,
      default: () => []
    },
    post: {
      type: Object,
      default: () => {}
    },
    icon: {
      type: String,
      default: ""
    }
  },
  methods: {
    parseItemClasses(index) {
      return this.totalItems === index + 1 || this.totalItems === 1
        ? ""
        : "text-comma";
    }
  },
  computed: {
    totalItems() {
      return this.items.length;
    },
    uquidId() {
      const time = new Date().getTime();
      return `wil-custom-select-field-${this.post.postID}-${time}`;
    }
  }
};
</script>
