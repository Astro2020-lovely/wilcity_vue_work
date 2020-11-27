<template>
  <wil-link
    :wrapper-classes="wrapperClasses"
    :btn-name="btnName"
    :icon="icon"
    @click="handleOpenPopup"
  >
    <template v-if="hasWrapperForIcon==='yes'" v-slot:default="{btnName, icon}">
      <span class="list_icon__2YpTp">
        <i v-if="icon" :class="icon"></i>
      </span>
      <span class="list_text__35R07" v-if="btnName.length" v-html="btnName"></span>
    </template>
    <template v-slot:after-link>
      <portal to="wil-modal" v-if="isOpenPopup">
        <wil-promotion-popup @close="handleClosePopup" :is-open="isOpenPopup" :post-id="postId" />
      </portal>
    </template>
  </wil-link>
</template>

<script>
export default {
  name: "wil-promotion-btn",
  data() {
    return {
      isOpenPopup: false
    };
  },
  components: {
    WilPromotionPopup: () =>
      import(
        /*wepackChuckName: "WilPromotionPopup" */
        /*webpackPreload: true */
        "./WilPromotionPopup.vue"
      )
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
  },
  props: {
    hasWrapperForIcon: {
      type: String,
      default: "no"
    },
    postId: {
      type: Number,
      default: 0,
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
    }
  }
};
</script>
