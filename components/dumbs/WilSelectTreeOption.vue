<template>
  <label :class="wrapperClasses">
    <div v-if="hasImg" class="wil-select-tree__img-wrapper">
      <img :alt="props.node.label" :src="parseImgSrc" />
    </div>
    <div v-else-if="hasIcon" class="wil-select-tree__img-wrapper">
      <i :class="icon" :style="generateIconStyle"></i>
    </div>
    <div class="wil-select-tree--label_wrapper">
      <span v-html="parseLabel"></span>
      <span v-if="props.shouldShowCount" :class="props.countClassName"
        >({{ props.count }})</span
      >
    </div>
  </label>
</template>
<style>
.wil-select-tree-without-img {
  padding-left: 0;
}
</style>
<script lang="javascript">
export default {
  data() {
    return {
      img: "",
      defaultIcon: null
    }
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    props: {
      type: Object,
      default: () => {}
    },
    defaultOptions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    parseImgSrc() {
      if (!_.isEmpty(this.img)) {
        return this.img;
      }

      if (this.hasNode) {
        return this.props.node.raw.img;
      }

      return "";
    },
    hasNode() {
      return !_.isEmpty(this.props.node);
    },
    hasImg() {
      if (!this.hasNode) {
        return false;
      }

      if (!this.props.node.raw.img) {
       return this.hasDefaultImage(this.props.node.raw.id);
      }

      const img = this.props.node.raw.img;
      if (!img.length) {
        return false;
      }

      if (img.includes("map-icon.png")) {
        if (this.hasIcon) {
          return false;
        }
      }

      return true;
    },
    hasLabel() {
      return this.hasNode && this.props.node.label;
    },
    hasIcon() {
      return (
        this.hasNode &&
        ((this.props.node.raw.icon &&
        !_.isEmpty(this.props.node.raw.icon))
        ||
        this.hasDefaultIcon(this.props.node.raw.id))
      );
    },
    icon() {
      if (!this.hasIcon) {
        return "";
      }

      if (!_.isEmpty(this.defaultIcon)) {
        return this.defaultIcon.icon ? this.defaultIcon.icon : this.defaultIcon;
      }

      if (this.props.node.raw.icon && this.props.node.raw.icon.icon) {
        return this.props.node.raw.icon.icon;
      }

      return this.props.node.raw.icon;
    },
    iconColor() {
      if (!this.hasIcon) {
        return "";
      }

      if (!_.isEmpty(this.defaultIcon)) {
        return this.defaultIcon.iconColor ? this.defaultIcon.iconColor : "";
      }

      if (this.props.node.raw.icon && this.props.node.raw.icon.iconColor) {
        return this.props.node.raw.icon.iconColor;
      }

      if (this.props.node.raw.icon_color && this.props.node.raw.icon_color) {
        return this.props.node.raw.icon_color;
      }

      return "";
    },
    parseLabel() {
      const val = this.hasLabel ? this.props.node.label : this.props.node.name;
      if (val.includes("unknown")) {
        if (!_.isEmpty(this.defaultOptions)) {
            const selectedItem = this.defaultOptions.filter(item => {
              if (item.id && item.id === this.props.node.raw.id) {
                return true;
              }

              return false;
            });
            if (selectedItem.length) {
              return selectedItem[0].label;
            }
        }
        return this.props.node.raw.id;
      }

      return val;
    },
    wrapperClasses() {
      let classes = "wil-select-tree-label";
      if (this.hasNode && this.props.labelClassName) {
        classes += " " + this.props.labelClassName;
      }

      if (
        this.hasNode &&
        (this.props.node.raw.img || this.props.node.raw.icon)
      ) {
        classes += " wil-has-img";
      } else {
        classes = " wil-select-tree-without-img";
      }
      return classes;
    },
    generateIconStyle() {
      if (this.hasIcon) {
        return {
          color: this.iconColor
        };
      }

      return "";
    }
  },
  methods: {
    hasDefaultIcon(id) {
      if (_.isEmpty(this.defaultOptions)) {
        return false;
      }

      const matched = this.defaultOptions.filter(item => {
        return item.id == id;
      });

      if (!_.isEmpty(matched)) {
        if (!_.isUndefined(matched[0].icon)) {
          this.defaultIcon = matched[0].icon;
        }
      }

      return !!this.defaultIcon ? this.defaultIcon  : false;
    },
    hasDefaultImage(id) {
      let img = "";

      if (!_.isEmpty(this.defaultOptions)) {
        const matched = this.defaultOptions.filter(item => {
          return item.id == id;
        });

        if (!_.isEmpty(matched)) {
          img = _.isUndefined(matched[0].img) ? false : matched[0].img;
            if (!!img && !img.includes("map-icon.png")) {
            this.img = img;
            return true;
          }
        }
      }
      return false;
    },
  },
  mounted() {
    // console.log(this.settings);
  }
};
</script>
