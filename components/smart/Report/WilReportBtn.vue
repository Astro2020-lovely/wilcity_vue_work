<template>
  <wil-link
    :wrapper-classes="wrapperClasses"
    :btn-name="btnName"
    :icon="icon"
    span-classes="list_text__35R07"
    :has-wrapper-for-icon="hasWrapperForIcon"
    @click="handleOpenPopup"
  >
    <template v-slot:after-link>
      <portal to="wil-modal" v-if="isOpenPopup">
        <wil-report-popup @close="handleClosePopup" :post-id="postId" />
      </portal>
    </template>
  </wil-link>
</template>
<script>
export default {
  name: "wil-report-btn",
  data() {
    return {
      isOpenPopup: false
    };
  },
  components: {
    WilReportPopup: () =>
      import(
        /*webpackChunkName: "WilReportPopup" */
        /*webpackPrefetch: true */
        "./WilReportPopup.vue"
      )
  },
  props: {
    postId: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: ""
    },
    btnName: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "wil-btn wil-btn--border wil-btn--round wil-btn--sm"
    },
    hasWrapperForIcon: {
      type: String,
      default: "yes"
    }
  },
  methods: {
    handleClosePopup() {
      this.isOpenPopup = false;
      this.$emit("close");
    },
    handleOpenPopup() {
      WilClickHelper.next(() => {
        this.isOpenPopup = true;
      });
    }
  }
};
</script>
