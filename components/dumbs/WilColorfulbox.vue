<template>
  <div :class="wrapperClasses">
    <div :class="[innerClasses, bgColor]">
      <div v-if="icon.length" class="icon-box-3_icon__10En1">
        <i :class="icon"></i>
      </div>
      <h3 class="icon-box-3_number__1pDzT" v-if="heading !== ''">{{heading}}</h3>
      <div class="icon-box-3_status__1AD8A" v-if="desc.length" v-html="desc"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-colorful-box",
  props: {
    wrapperClasses: {
      type: String,
      default: ""
    },
    innerClasses: {
      type: String,
      default: "icon-box-3_module__Z77Cu"
    },
    bgColor: {
      type: String,
      default: "bg-gradient-1" // bg-gradient-1,2,3,4
    },
    icon: {
      type: String,
      default: ""
    },
    heading: {
      type: [String, Number],
      default: ""
    },
    desc: {
      type: String,
      default: ""
    }
  }
};
</script>
