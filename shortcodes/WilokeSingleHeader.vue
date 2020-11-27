<template>
  <header class="content-box_header__xPnGx clearfix">
    <div class="wil-float-left">
      <h4 class="content-box_title__1gBHS">
        <i :class="icon"></i>
        <span>{{heading}}</span>
      </h4>
    </div>
  </header>
</template>
<script>
export default {
  props: ["icon", "heading"]
};
</script>
