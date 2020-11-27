<template>
  <div class="image-radio-checkbox_module__29DK2">
    <label class="image-radio-checkbox_inner__1VI-d">
      <input
        class="js-image-radio-checkbox"
        v-model="value"
        true-value="yes"
        false-value="no"
        @change="changed"
        type="checkbox"
      />
      <div class="image-radio-checkbox_img__1_YKz">
        <img v-if="preview.length" :src="preview" />
        <div class="image-radio-checkbox_icon__1LtKv">
          <i class="la la-check"></i>
        </div>
      </div>
      <div v-if="label.length && desc.length" class="image-radio-checkbox_footer__1jn1d">
        <h6 v-if="label.length" v-html="label"></h6>
        <p v-if="desc.length" v-html="desc"></p>
      </div>
    </label>
  </div>
</template>
<script>
export default {
  props: {
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
    index: {
      type: Number,
      default: 0
    },
    oOther: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      value: "no"
    };
  },
  methods: {
    changed() {
      this.$emit("checkboxChanged", this.value, {
        index: this.index,
        key: this.key,
        oOther: this.oOther
      });
    }
  }
};
</script>
