<template>
  <div :class="wrapperClasses" v-click-outside="close">
    <a :class="[btnClasses, isSetActiveClass && isOpen ? 'active' : '']" href="#">
      <span @click.prevent="toggleStatus">
        <i v-if="icon.length" :class="icon"></i>
        {{btnName}}
      </span>
      <i v-if="clearable" style="cursor: pointer" class="fa fa-times" @click.prevent="handleClear"></i>
    </a>
    <slot :is-open="isOpen"></slot>
  </div>
</template>
<script>
export default {
  name: "wil-toggle-controller",
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleStatus() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$emit("open");
      } else {
        this.$emit("close");
      }
    },
    close() {
      this.isOpen = false;
    },
    handleClear() {
      this.$emit("clear");
    }
  },
  props: {
    icon: {
      type: String,
      default: "la la-calendar color-primary"
    },
    wrapperClasses: {
      type: String | Array,
      default: ""
    },
    btnClasses: {
      type: String | Array,
      default: "event-detail-content_showMap__3psSs color-primary"
    },
    isSetActiveClass: {
      // set active class to button when opening
      type: Boolean,
      default: false
    },
    clearable: {
      // set active class to button when opening
      type: Boolean,
      default: false
    },
    btnName: {
      type: String,
      default: "Toggle"
    },
    isDefaultOpen: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.isOpen = this.isDefaultOpen;
  }
};
</script>
