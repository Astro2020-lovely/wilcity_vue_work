<template>
  <vue-countdown :time="parseTime" :interval="interval" :tag="tag" :class="wrapperClasses">
    <template v-slot:default="{days, hours, minutes, seconds}">
      <slot name="before-countdown">
        <span v-if="beforeCountdown.length" class="wil-before-countdown">{{beforeCountdown}}</span>
      </slot>
      <slot
        name="countdown"
        :days="days"
        :text-days="getDayText(days)"
        :hours="hours"
        :minutes="minutes"
        :seconds="seconds"
      >
        <span
          class="wil-countdown"
        >{{days}} {{getDayText(days)}} {{ hours }}:{{ minutes }}:{{ seconds }}</span>
      </slot>
      <slot name="after-countdown">
        <span v-if="afterCountdown.length" class="wil-after-countdown">{{afterCountdown}}</span>
      </slot>
    </template>
  </vue-countdown>
</template>
<script>
import VueCountdown from "@chenfengyuan/vue-countdown";
export default {
  name: "wil-coutdown",
  components: {
    VueCountdown
  },
  props: {
    time: {
      // timestamp
      type: Number,
      default: 0
    },
    interval: {
      type: Number,
      default: 100
    },
    tag: {
      type: String,
      default: "div"
    },
    wrapperClasses: {
      type: String,
      default: "wil-coutdown-text"
    },
    icon: {
      type: String,
      default: ""
    },
    beforeCountdown: {
      type: String,
      default: ""
    },
    afterCountdown: {
      type: String,
      default: ""
    }
  },
  computed: {
    parseTime() {
      const now = new Date().getTime();
      return this.time - now;
    }
  },
  methods: {
    getDayText(days) {
      if (days > 1) {
        return this.$options.filters.filterTranslation("days", "days");
      }
      return this.$options.filters.filterTranslation("day", "day");
    }
  }
};
</script>
