<template>
  <a v-if="item.link" :class="wrapperClasses" :href="item.link">
    <template v-if="!isDisableIcon && item.oIcon">
      <div v-if="item.oIcon.type==='image'" class="icon-box-1_icon__3V5c0 rounded-circle">
        <img :src="item.oIcon.url" :alt="item.name" />
      </div>
      <div
        v-else-if="item.oIcon.color"
        class="icon-box-1_icon__3V5c0 rounded-circle"
        :style="{'background-color': item.oIcon.color}"
      >
        <i :class="item.oIcon.icon"></i>
      </div>
      <div v-else-if="item.oIcon.icon" class="icon-box-1_icon__3V5c0 rounded-circle">
        <i :class="item.oIcon.icon"></i>
      </div>
    </template>
    <span class="icon-box-1_text__3R39g" v-html="item.name"></span>
  </a>
</template>

<script>
export default {
  name: "wil-grid-term",
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    isDisableIcon: {
      type: Boolean,
      default: false
    },
    wrapperClasses: {
      type: String,
      default: "text-ellipsis"
    }
  }
};
</script>
