<template>
  <div class="pos-r pr-50">
    <div :class="parseWrapperClass">
      <div class="field_wrap__Gv92k">
        <select v-model="selectedIcon" class="js-select-2">
          <option v-for="oOption in aOptions" :value="oOption.icon"
            ><i :class="oOption.icon"></i> {{ oOption.name }}</option
          >
        </select>
        <span
          class="field_label__2eCP7 text-ellipsis"
          :class="{ required: settings.isRequired == 'yes' }"
          >{{ settings.label }}</span
        >
        <span class="bg-color-primary"></span>
      </div>
    </div>
    <div class="field__Icon bg-color-primary">
      <i v-if="selectedIcon" :class="selectedIcon"></i>
    </div>
    <span
      class="field_message__3Z6FX color-quaternary"
      v-if="settings.errMsg"
      >{{ settings.errMsg }}</span
    >
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
  data() {
    return {
      selectedIcon: this.value,
      aOptions: [],
      canRunSelect2: false,
      $select2: null
    };
  },
  props: {
    settings: {
      type: Object,
      default: ""
    },
    value: {
      type: String,
      default: "la la-edit"
    },
    wrapperClass: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15"
    }
  },
  computed: {
    parseWrapperClass() {
      return this.selectedIcon.length
        ? this.wrapperClass + " active"
        : this.wrapperClass;
    }
  },
  watch: {
    value: function(newVal) {
      if (this.$select2) {
        this.$select2.val(newVal).trigger("change");
      }
    },
    selectedIcon: function() {
      this.settings.value = this.selectedIcon;
      this.$emit("input", this.selectedIcon);
      this.$emit("changedIcon", this.selectedIcon, this.settings);
    }
  },
  methods: {
    getIcons() {
      if (this.$store.getters.getIcons) {
        this.aOptions = this.$store.getters.getIcons;
        this.canRunSelect2 = true;
      } else {
        fetch(WilCityHelpers.buildRestRequest("icons"))
          .then(response => response.json())
          .then(response => {
            this.$store.commit("updateIcons", response.data);
            this.aOptions = response.data;
            this.canRunSelect2 = true;
          });
      }
    },
    isRequired(pattern) {
      if (pattern == "yes" || pattern === "true" || pattern === true) {
        return true;
      }

      return false;
    },
    changed() {
      this.settings.value = this.selectedIcon;
      this.$emit("inputChanged", this.selectedIcon, this.settings);
    },
    init() {
      this.getIcons();

      let run = setInterval(() => {
        if (this.canRunSelect2) {
          this.$select2 = jQuery(this.$el)
            .find(".js-select-2")
            .select2({
              allowClear: true,
              placeholder: ""
            })
            .on("select2:select", event => {
              this.selectedIcon = event.params.data.id;
            });

          if (this.value.length) {
            this.selectedIcon = this.value;
            this.$select2.val(this.value).trigger("change");
          }
          clearInterval(run);
        }
      }, 100);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
