<template>
  <header v-if="heading.length" :class="wrapperClasses">
    <div :class="innerClasses">
      <slot name="heading" left-class="leftClasses" :icon="icon" :heading="heading">
        <slot name="before-heading"></slot>
        <h4 :class="leftClasses">
          <i v-if="icon.length" :class="icon"></i>
          <span v-html="heading"></span>
        </h4>
        <slot name="after-heading"></slot>
      </slot>
    </div>
    <slot name="desc" :desc="desc">
      <div v-if="desc.length" :class="rightClasses">
        <span class="fs-12" v-html="desc"></span>
        <slot name="after-desc" :desc="desc"></slot>
      </div>
    </slot>
  </header>
</template>
<script>
export default {
  name: "wil-heading",
  data() {
    return {};
  },
  props: {
    heading: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "content-box_header__xPnGx clearfix"
    },
    innerClasses: {
      type: String,
      default: "wil-float-left"
    },
    leftClasses: {
      type: String,
      default: "content-box_title__1gBHS"
    },
    rightClasses: {
      type: String,
      default: "wil-float-right"
    },
    desc: {
      type: String,
      default: ""
    }
  }
};
</script>
