<template>
  <div class="bg-color-gray-3 bd-color-gray-1 pd-15 mb-20">
    <div class="row">
      <div class="col-md-2 col-lg-2">
        <div class="mt-25">{{'Start'|filterTranslation('Start')}}</div>
      </div>
      <wil-datepicker
        wrapper-classes="col-md-10 col-lg-10"
        :format="parseFormat"
        :is-confirm="true"
        @change="handleStartChange"
        value-type="format"
        :value="model.starts"
      />
    </div>
    <div class="row">
      <div class="col-md-2 col-lg-2">
        <div class="mt-25">{{'End'|filterTranslation('End')}}</div>
      </div>
      <wil-datepicker
        wrapper-classes="col-md-10 col-lg-10"
        :format="parseFormat"
        :is-confirm="true"
        @change="handleEndChange"
        value-type="format"
        :value="model.ends"
      />
    </div>
  </div>
</template>
<style scoped>
/deep/ .mx-datepicker {
  width: 100%;
}
</style>
<script>
export default {
  name: "wil-event-date",
  components: {
    WilDatepicker: () =>
      import(
        /* webpackChunkName: 'WilDatepicker' */
        /* webpackPreload: true */
        "./../../dumbs/WilDatepicker.vue"
      )
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          starts: new Date().getTime(),
          ends: ""
        };
      }
    }
  },
  computed: {
    parseFormat() {
      const dateFormat = WILOKE_GLOBAL.dateFormat.toUpperCase();
      return `${dateFormat} hh:mm A`;
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  methods: {
    handleStartChange(val) {
      this.model = {
        ...this.model,
        starts: val
      };
    },
    handleEndChange(val) {
      this.model = {
        ...this.model,
        ends: val
      };
    }
  }
};
</script>
