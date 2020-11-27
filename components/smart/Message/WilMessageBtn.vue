<template>
  <wil-link
    :icon="icon"
    :btn-name="btnName"
    @click="toggleOpenPopup"
    :wrapper-classes="wrapperClasses"
  >
    <template v-slot:after-link>
      <portal to="wil-modal" v-if="isOpenPopup">
        <wil-message-popup
          @close="isOpenPopup = false"
          :receiver-id="receiverId"
          :receiver-name="receiverName"
        />
      </portal>
    </template>
  </wil-link>
</template>
<script>
export default {
  name: "wil-message-btn",
  data() {
    return {
      isOpenPopup: false
    };
  },
  components: {
    WilMessagePopup: () =>
      import(
        /*webpackChunkName: "WilMessagePopup"*/
        /*webpackPrefetch: true*/
        "./WilMessagePopup.vue"
      )
  },
  watch: {
    isOpenPopup(status) {
      if (!status) {
        this.$emit("close");
      }
    }
  },
  methods: {
    toggleOpenPopup() {
      WilClickHelper.next(() => {
        this.isOpenPopup = !this.isOpenPopup;
      });
    }
  },
  props: {
    btnName: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "wil-btn wil-btn--border wil-btn--round wil-btn--sm"
    },
    icon: {
      type: String,
      default: "la la-envelope color-1"
    },
    receiverId: {
      type: Number,
      required: true
    },
    receiverName: {
      type: String,
      default: ""
    }
  }
};
</script>
