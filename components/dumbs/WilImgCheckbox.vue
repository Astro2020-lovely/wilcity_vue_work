<template>
  <div :class="wrapperClasses">
    <label :class="innerClasses">
      <input
        class="js-image-radio-checkbox"
        true-value="yes"
        false-value="no"
        v-model="model"
        type="checkbox"
      />
      <div class="image-radio-checkbox_img__1_YKz">
        <img :src="preview" />
        <div class="image-radio-checkbox_icon__1LtKv">
          <i class="la la-check"></i>
        </div>
      </div>
      <div class="image-radio-checkbox_footer__1jn1d">
        <h6 v-html="label"></h6>
        <p v-if="desc" v-html="desc"></p>
      </div>
    </label>
  </div>
</template>
<script>
export default {
  name: "wil-img-checkbox",
  props: {
    wrapperClasses: {
      type: String,
      default: "image-radio-checkbox_module__29DK2"
    },
    innerClasses: {
      type: String,
      default: "image-radio-checkbox_inner__1VI-d"
    },
    preview: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: "no"
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  }
};
</script>
