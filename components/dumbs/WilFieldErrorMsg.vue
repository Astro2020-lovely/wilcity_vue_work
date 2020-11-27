<template>
  <div v-show="msg!=''">
    <div class="clearfix"></div>
    <span class="field_message__3Z6FX color-quaternary" v-html="msg"></span>
  </div>
</template>
<script>
export default {
  name: "wil-field-error-msg",
  props: {
    msg: {
      type: String,
      default: ""
    }
  }
};
</script>
