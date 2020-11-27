<template>
  <a
    v-if="tooltip"
    :class="btnClasses"
    :href="link"
    @click="handleClick"
    :target="target"
    :data-tooltip-placement="tooltipPlace"
    :data-tooltip="tooltip"
    :style="parseStyle"
  >
    <slot name="before-link"></slot>
    <slot :link="link" :btn-name="btnName" :icon="icon">
      <template v-if="icon">
        <span v-if="hasWrapperForIcon === 'yes'" class="list_icon__2YpTp">
          <i :class="icon"></i>
        </span>
        <i v-else :class="icon"></i>
      </template>
      <span v-if="btnName.length" :class="spanClasses" v-html="btnName"></span>
    </slot>
    <slot name="after-link"></slot>
    <div v-if="isLoading" class="pill-loading_module__3LZ6v">
      <div class="pill-loading_loader__3LOnT"></div>
    </div>
  </a>
  <a
    v-else
    :class="btnClasses"
    :href="link"
    @click="handleClick"
    :target="target"
    :style="parseStyle"
  >
    <slot name="before-link"></slot>
    <slot :link="link" :btn-name="btnName" :icon="icon">
      <template v-if="icon">
        <span v-if="hasWrapperForIcon === 'yes'" class="list_icon__2YpTp">
          <i :class="icon"></i>
        </span>
        <i v-else :class="icon"></i>
      </template>
      <span :class="spanClasses" v-if="btnName.length" v-html="btnName"></span>
    </slot>
    <slot name="after-link"></slot>
    <div v-if="isLoading" class="pill-loading_module__3LZ6v">
      <div class="pill-loading_loader__3LOnT"></div>
    </div>
  </a>
</template>
<script lang="javascript">
export default {
  name: "wil-link",
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
      required: false
    },
    shape: {
      type: String,
      default: "round",
      required: false
    },
    btnName: {
      type: String,
      default: "",
      required: false
    },
    extraBtnClass: {
      type: String,
      default: "",
      required: false
    },
    target: {
      type: String,
      default: "_self",
      required: false
    },
    icon: {
      type: [String, Array],
      default: "",
      required: false
    },
    tooltipPlace: {
      type: String,
      default: "top",
      required: false
    },
    tooltip: {
      type: String,
      default: "",
      required: false
    },
    wrapperClasses: {
      // this setting will override size, share, color settings
      type: String | Array,
      default: "",
      required: false
    },
    spanClasses: {
      type: String,
      default: "",
      required: false
    },
    btnStyle: {
      type: Object,
      default: () => {}
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasWrapperForIcon: {
      type: String,
      default: "no"
    }
  },
  computed: {
    parseStyle() {
      let style = {};
      if (this.color) {
        style = { ...this.btnStyle, color: this.color };
      } else {
        style = { ...this.btnStyle };
      }
      return style;
    },
    btnClasses() {
      let classes;
      if (this.wrapperClasses.length) {
        classes = this.wrapperClasses;
      } else {
        classes = `wil-btn wil-btn--${this.shape} wil-btn--${this.size} wil-btn--${this.color} ${this.extraBtnClass}`;
      }

      return this.isLoading ? `${classes} wil-btn--loading` : classes;
    }
  },
  methods: {
    handleClick(event) {
      if (this.link === "#") {
        event.preventDefault();
      }
      this.$emit("click", event);
    }
  }
};
</script>
