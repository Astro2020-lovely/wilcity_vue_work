<template>
  <div v-if="businessHourToday" class="icon-box-1_block2__1y3h0">
    <span
      :class="[businessHourToday.class, 'wil-grid-business-hour']"
      style="font-size: 13px;"
      >{{ businessHourToday.text }}</span
    >
  </div>
</template>
<style scoped>
.wil-grid-business-hour {
  font-size: 13px;
}
.wil-grid-business-hour:before {
  display: none !important;
}
</style>
<script>
import { TimeHelper, BusinessHourHelper } from "./../../../mixins/TimeHelper";

export default {
  name: "wil-grid-business-hour",
  mixins: [TimeHelper, BusinessHourHelper],
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    if (this.item.value) {
      this.getCurrentBusinessHourStatus(this.item.value);
    }
  }
};
</script>
