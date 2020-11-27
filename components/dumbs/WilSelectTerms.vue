<template>
    <div>
        <div>this is template body</div>
    </div>
</template>
<script lang="javascript">
  export default {
    data() {
      return {
        msg: 'hello vue'
      }
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      wrapperClasses: {
        type: String,
        default: 'checkbox_module__1K5IS checkbox_circleRound__1-GdQ js-checkbox'
      },
      innerClasses: {
        type: String,
        default: 'checkbox_label__3cO9k'
      },
      value: {
        type: String|Number,
        default: 'no'
      },
      settings: {
        type: Object,
        default() {
          return {};
        },
        required: true
      }
    }
  }
</script>
