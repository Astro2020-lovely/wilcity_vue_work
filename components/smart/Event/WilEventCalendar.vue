<template>
  <div :class="wrapperClasses">
    <wil-select-tree
      v-on="{change: handleFieldChange('frequency')}"
      :options="frequencyOptions"
      :value="model.frequency"
      mode="default"
    />
    <keep-alive>
      <wil-event-weekly
        v-if="model.frequency === 'weekly'"
        :value="model.specifyDays"
        v-on="{change: handleFieldChange('specifyDays')}"
      />
    </keep-alive>
    <wil-event-date v-on="{change: handleFieldChange('date')}" :value="getDate" />
  </div>
</template>
<script>
export default {
  name: "wil-event-calendar",
  data() {
    return {
      frequencyOptions: [],
      default: {
        frequency: "occurs_once",
        specifyDays: "",
        date: {
          starts: "",
          ends: ""
        }
      }
    };
  },
  created() {
    this.frequencyOptions = WILCITY_I18.aEventFrequency.map(item => {
      return {
        id: item.value,
        label: item.name
      };
    });
  },
  computed: {
    getDate() {
      if (!_.isEmpty(this.model.date)) {
        return this.model.date;
      }

      return this.default.date;
    },
    model: {
      get() {
        return _.isEmpty(this.value) ? this.default : this.value;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          frequency: "occurs_once",
          specifyDays: "",
          date: ""
        };
      }
    },
    wrapperClasses: {
      type: String,
      default: ""
    }
  },
  components: {
    WilEventWeekly: () =>
      import(
        /* webpackChunkName: 'WilEventWeekly' */
        /* webpackPreload: true */
        "./WilEventWeekly.vue"
      ),
    WilEventDate: () =>
      import(
        /*webpackChunkName: 'WilEventDate' */
        /*webpackPreload: true */
        "./WilEventDate.vue"
      )
  },
  methods: {
    handleFieldChange(key) {
      return val => {
        this.model = {
          ...this.model,
          [key]: val
        };
      };
    }
  }
};
</script>
