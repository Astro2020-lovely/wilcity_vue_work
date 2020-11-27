<template>
  <div :id="parseId" class="single-tab-content">
    <div class="content-box_module__333d9 pos-r">
      <wil-block-loading :is-loading="isLoading" />
      <wil-single-nav-heading :settings="settings" />
      <div class="content-box_body__3tSRB">
        <wil-boxes-icon-items :items="items" :id="parseId" />
        <wil-alert v-if="parseErrMgs.length" :msg="parseErrMgs" />
      </div>
    </div>
  </div>
</template>
<script>
import WilSingleNavHeading from "./WilSingleNavHeading.vue";
export default {
  name: "wil-single-nav-term",
  data() {
    return {
      isLoading: true
    };
  },
  components: {
    WilSingleNavHeading
  },
  computed: {
    parseId() {
      return `single-nav-${this.taxonomy}`;
    },
    parseErrMgs() {
      if (this.items.length) {
        return "";
      }
      return this.$options.filters.filterTranslation("", "noTerm");
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.isLoading = false;
    });
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    items: {
      type: Array,
      default: () => []
    }
  }
};
</script>
