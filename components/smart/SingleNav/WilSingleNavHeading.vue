<template>
  <wil-heading
    v-if="settings.name && settings.name.length"
    :heading="settings.name"
    :icon="settings.icon"
  />
</template>
<script>
export default {
  name: "wil-single-nav-heading",
  props: {
    settings: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
