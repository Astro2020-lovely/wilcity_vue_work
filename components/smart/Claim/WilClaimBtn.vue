<template>
  <wil-link
    wrapper-classes="wil-btn wil-btn--dark wil-btn--sm wil-btn--round"
    :btn-name="'' | filterTranslation('claimListing')"
    @click="toggleClaimPopup"
  >
    <template v-slot:after-link>
      <portal to="wil-modal" v-if="isOpen">
        <wil-claim-popup :post-id="postId" @close="handleClosePopup" />
      </portal>
    </template>
  </wil-link>
</template>
<script>
import WilClaimPopup from "./WilClaimPopup.vue";

export default {
  name: "wil-claim-btn",
  data() {
    return {
      isOpen: false
    };
  },
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  watch: {
    isOpen(status) {
      if (!status) {
        this.$emit("close");
      }
    }
  },
  methods: {
    toggleClaimPopup() {
      WilClickHelper.next(() => {
        this.isOpen = !this.isOpen;
      });
    },
    handleClosePopup() {
      this.isOpen = false;
    }
  },
  components: {
    WilClaimPopup
  }
};
</script>
