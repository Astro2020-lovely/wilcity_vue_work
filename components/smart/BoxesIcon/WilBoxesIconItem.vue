<template>
  <div :class="wrapperClasses">
    <div :class="innerClasses">
      <a :href="item.link" :target="parseTarget">
        <div v-if="parseImg.length" :class="['bg-transparent', iconClasses]">
          <img :src="parseImg" :alt="parseName" />
        </div>
        <div
          v-else-if="parseIcon.length && parseIconColor.length"
          :class="iconClasses"
          :style="{ 'background-color': parseIconColor }"
        >
          <i :class="parseIcon"></i>
        </div>
        <div v-else-if="parseIcon.length" :class="iconClasses">
          <i :class="parseIcon"></i>
        </div>
        <div
          v-if="parseName.length"
          :class="textClasses"
          v-html="parseName"
        ></div>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-boxes-icon-item",
  computed: {
    parseIconColor() {
      if (this.item.icon && this.item.icon.type === "icon") {
        return !!this.item.icon.iconColor ? this.item.icon.iconColor : "";
      }

      return this.item.iconColor ? this.item.iconColor : "";
    },
    parseImg() {
      if (this.item.icon && this.item.icon.type === "image") {
        return this.item.icon.url;
      }

      return this.item.imgSrc ? this.item.imgSrc : "";
    },
    parseTarget() {
      return this.item.target ? this.item.target : "_self";
    },
    parseIcon() {
      if (this.item.icon && this.item.icon.type === "icon") {
        return this.item.icon.icon;
      }

      return this.item.icon ? this.item.icon : "";
    },
    parseName() {
      return this.item.name ? this.item.name : "";
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {} // {link, target, icon, text}
    },
    wrapperClasses: {
      type: String,
      default: "icon-box-1_module__uyg5F mt-20 mt-sm-15"
    },
    innerClasses: {
      type: String,
      default: "icon-box-1_block1__bJ25J"
    },
    iconClasses: {
      type: String,
      default: "icon-box-1_icon__3V5c0 rounded-circle"
    },
    textClasses: {
      type: String,
      default: "icon-box-1_text__3R39g"
    }
  }
};
</script>
