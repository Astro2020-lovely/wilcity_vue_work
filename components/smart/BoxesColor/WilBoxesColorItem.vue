<template>
  <!-- icon-box-2_module__AWd3Y wil-text-center bg-color-primary -->
  <div :class="wrapperClasses">
    <wil-link
      :target="item.target ? item.target : '_self'"
      :style="`background-color: ${item.bgColor}`"
      :link="item.link"
      @click="handleClick"
    >
      <template>
        <div v-if="item.icon && item.icon.length" class="icon-box-2_icon__ZqobK">
          <i :class="item.icon"></i>
        </div>
        <h2
          v-if="item.heading && item.heading.length"
          class="icon-box-2_title__2cgba"
          v-html="item.heading"
        ></h2>
      </template>
      <template v-slot:after-link>
        <portal to="wil-modal" v-if="item.popupTarget && item.popupTarget.length && isOpenPopup">
          <wil-popups
            :popup="item.popupTarget"
            :post-id="postId"
            :settings="item"
            @close="handleClosePopup"
          />
        </portal>
      </template>
    </wil-link>
  </div>
  <!-- End / icon-box-2_module__AWd3Y wil-text-center bg-color-primary -->
</template>
<script>
import WilPopups from "./../Popup/WilPopups.vue";

export default {
  name: "wil-boxes-color-item",
  components: {
    WilPopups
  },
  data() {
    return {
      isOpenPopup: false
    };
  },
  methods: {
    handleClick(event) {
      if (this.item.popupTarget && this.item.popupTarget.length) {
        this.isOpenPopup = true;
      }
    },
    handleClosePopup() {
      this.isOpenPopup = false;
      this.$emit("close");
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "icon-box-2_module__AWd3Y wil-text-center"
    },
    item: {
      type: Object,
      default: () => {}
    },
    postId: {
      type: Number,
      default: 0
    }
  }
};
</script>
