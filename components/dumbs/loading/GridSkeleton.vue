<template>
  <div class="row">
    <div v-for="i in itemsPerRow" :key="`${unidId}-${i}`" :class="parseColumnClasses">
      <article :class="articleClasses">
        <div class="listing_firstWrap__36UOZ">
          <div style="position: absolute;top:10px;left:10px;z-index:99"></div>
          <header class="listing_header__2pt4D is-verified"></header>
          <div class="listing_body__31ndf" :style="{'min-height': parseMinHeight}"></div>
        </div>
        <footer class="listing_footer__1PzMC"></footer>
        <div class="listing-loading_module__2_Uwh wave-loading">
          <div class="shape-transparent">
            <div class="shape shape--left"></div>
            <div class="shape shape--right"></div>
          </div>
          <div class="shape shape--special">
            <div class="wave-loading"></div>
          </div>
          <div class="shape shape--1"></div>
          <div class="shape shape--2"></div>
          <div class="shape shape--3"></div>
          <div class="shape shape--4"></div>
        </div>
      </article>
    </div>
  </div>
</template>
<style scoped>
.wil-grid-item .shape--special:before {
  display: none;
}
.shape--special {
  margin-bottom: 20px;
}
</style>
<script>
export default {
  name: "grid-skeleton",
  computed: {
    unidId() {
      return new Date().getTime();
    },
    articleClasses() {
      if (this.type === "list") {
        return "wil-list-item listing_module__2EnGq wil-shadow listing_list__32GHD mb-30 loading js-listing-module";
      }
      return "wil-grid-item listing_module__2EnGq wil-shadow mb-30 loading js-listing-module";
    },
    parseColumnClasses() {
      if (this.type === "list") {
        return "col-sm-12 col-md-12 col-lg-12";
      }

      return this.columnClasses;
    },
    parseMinHeight() {
      return this.type === "list" ? "205px" : "300px";
    }
  },
  props: {
    columnClasses: {
      type: String,
      default: "col-sm-6 col-md-4 col-lg-4"
    },
    itemsPerRow: {
      type: Number,
      default: 3
    },
    type: {
      type: String,
      default: "grid"
    }
  }
};
</script>
