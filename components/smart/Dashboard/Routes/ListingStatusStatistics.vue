<template>
  <div :class="wrapperClass">
    <div :class="innerClass">
      <div class="icon-box-3_icon__10En1">
        <i :class="icon"></i>
      </div>
      <h3 class="icon-box-3_number__1pDzT">{{ total }}</h3>
      <div class="icon-box-3_status__1AD8A" v-html="status"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["wrapperClass", "icon", "total", "status", "bgColor"],
  computed: {
    innerClass() {
      return "icon-box-3_module__Z77Cu " + this.bgColor;
    }
  }
};
</script>
