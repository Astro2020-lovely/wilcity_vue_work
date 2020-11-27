<template>
  <header :class="wrapperClasses">
    <div :class="innerClasses">
      <slot name="before-header" :settings="settings"></slot>
      <slot
        name="header"
        :settings="settings"
        :heading="heading"
        :icon="icon"
        :description="description"
      >
        <h4
          :class="[
            'content-box_title__1gBHS',
            settings.isRequired && settings.isRequired === 'yes'
              ? 'required'
              : ''
          ]"
        >
          <i v-if="icon" :class="icon"></i>
          <span v-html="heading"></span>
        </h4>
      </slot>
      <slot name="after-header" :settings="settings"></slot>
    </div>
  </header>
</template>
<script lang="javascript">
export default {
  name: 'wil-header-group',
  props: {
    heading: {
      type: String,
      default: '',
      required: false
    },
    icon: {
      type: String,
      default: '',
      required: false
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    wrapperClasses: {
      type: String,
      default: 'content-box_header__xPnGx clearfix',
      required: false
    },
    innerClasses: {
      type: String,
      default: 'wil-float-left',
      required: false
    },
    settings: {
      type: [ Object, Array ],
      default: () => {},
      required: false
    }
  }
}
</script>
