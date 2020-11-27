<template>
  <div :class="wrapperClasses">
    <label v-if="label" v-html="label" :class="[isRequired ? 'required' : '']"></label>
    <vue-editor
      v-model="model"
      v-validate="isRequired?'required':''"
      :data-vv-as="label"
      :name="generateName"
      :editor-toolbar="editorToolbar"
    ></vue-editor>
    <wil-field-error-msg v-show="vErrors.has(generateName)" :msg="vErrors.first(generateName)" />
  </div>
</template>
<style>
@import "~vue2-editor/dist/vue2-editor.css";

/* Import the Quill styles you want */
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.bubble.css";
@import "~quill/dist/quill.snow.css";

.ql-align-justify {
  text-align: center;
}
</style>
<script>
import { VueEditor } from "vue2-editor";
import { FieldHelper } from "./../../mixins/FieldHelper";
export default {
  mixins: [FieldHelper],
  name: "wil-editor",
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
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
      default: ""
    },
    editorToolbar: {
      type: Array,
      default: () => [
        [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ['blockquote', 'code-block'],
        [{ 'align': ''},{ 'align': 'justify'}, { 'align': 'center'}, { 'align': 'right' }],
        [{ 'color': [] }, { 'background': [] }]
      ]
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
