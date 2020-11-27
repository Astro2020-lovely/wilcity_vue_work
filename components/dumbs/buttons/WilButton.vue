<template>
  <button :class="btnClasses" :href="link" v-html="btnName" @click="handleClick"></button>
</template>
<script lang="javascript">
export default {
  name: "wil-button",
  props: {
    size: {
      type: String,
      default: "sm",
      required: false
    },
    color: {
      type: String,
      default: "primary",
      required: false
    },
    link: {
      type: String,
      default: "#",
      required: true
    },
    btnName: {
      type: String,
      default: "Button",
      required: true
    },
    wrapperClasses: {
      type: String,
      default: ""
    }
  },
  computed: {
    btnClasses() {
      if (this.wrapperClasses.length) {
        return this.wrapperClasses;
      }

      return `wil-btn wil-btn--round wil-btn--${this.size} wil-btn--${this.color}`;
    }
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    }
  }
};
</script>
