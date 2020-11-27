<template>
  <div :class="parseWrapperClasses">
    <div class="field_wrap__Gv92k" v-click-outside="hideColorpicker">
      <div class="pos-r">
        <input type="text" @focus="toggleColorpicker" class="field_field__3U_Rt" :value="model" />
        <span :class="labelClasses" v-if="label" v-html="label"></span>
        <wil-link
          @click="toggleColorpicker"
          wrapper-classes="wil-btn--toggle wil-btn mb-15 wil-btn--gray wil-btn--round wil-btn--xs wil-btn--icon"
          link="#"
          icon="fa fa-paint-brush"
          :color="model"
          :btn-style="{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: model
          }"
        />
      </div>
      <div v-show="isOpen" class="spetrum-wrapper">
        <sketch v-model="model" type="text" />
      </div>
      <span class="bg-color-primary"></span>
    </div>
  </div>
</template>
<script>
import { Sketch } from "vue-color";

export default {
  name: "wil-colorpicker",
  data() {
    return {
      isOpen: false
    };
  },
  components: {
    Sketch
  },
  methods: {
    hideColorpicker() {
      this.isOpen = false;
    },
    toggleColorpicker() {
      this.isOpen = !this.isOpen;
    }
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "field_module__1H6kT field_style5__3OR3T mb-0 js-field"
    },
    valueFormat: {
      type: String,
      default: "rgba" // hex, rgba, hsv, hex8
    }
  },
  computed: {
    parseWrapperClasses() {
      return [this.wrapperClasses, this.model.length ? "active" : ""];
    },
    labelClasses() {
      return [
        "field_label__2eCP7 text-ellipsis",
        this.isRequired ? "required" : ""
      ];
    },
    model: {
      get() {
        return this.value ? this.value : "";
      },
      set(val) {
        let color;
        if (this.valueFormat === "rgba") {
          color = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a},${val.a})`;
        } else {
          color = val[this.valueFormat] ? val[this.valueFormat] : val.hex;
        }
        this.$emit("change", color);
      }
    }
  }
};
</script>
