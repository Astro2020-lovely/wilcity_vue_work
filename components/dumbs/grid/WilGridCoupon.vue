<template>
  <div class="wil-coupon" v-if="hasCountdown">
    <wil-countdown
      :time="couponTimestamp"
      wrapper-classes="wil-coupon__dayDate"
      :interval="countdownInterval"
    >
      <template
        v-slot:countdown="{days, textDays, hours, minutes, seconds}"
        class="fa fa-calendar-minus-o"
      >
        <span v-if="days >= 1">
          <i class="fa fa-calendar-minus-o"></i>
          {{days}} {{textDays}}
        </span>
        <span v-else>
          <i class="fa fa-calendar-minus-o"></i>
          {{ hours }}:{{ minutes }}:{{ seconds }}
        </span>
      </template>
    </wil-countdown>
    <div class="wil-coupon__code">
      <span v-html="post.coupon.highlight"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-grid-coupon",
  props: {
    post: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: "listing_rated__1y7qV"
    }
  },
  computed: {
    now() {
      return new Date().getTime();
    },
    couponTimestamp() {
      if (!this.post.coupon || !this.post.coupon.utcTimestamp) {
        return 0;
      }

      return this.post.coupon.utcTimestamp * 1000;
    },
    hasCountdown() {
      return this.couponTimestamp > this.now;
    },
    countdownInterval() {
      if (this.couponTimestamp - this.now > 86400000) {
        return 6000;
      }
      return 100;
    }
  },
  components: {
    WilCountdown: () =>
      import(
        /*webpackPreload: true */
        /*webpackChunkName: "WilCountdown"*/
        "./../WilCountdown.vue"
      )
  }
};
</script>
