<template>
  <div>
    <div
      class="checkbox_module__1K5IS checkbox_full__jTSmg checkbox_toggle__vd6vd  mb-20 js-checkbox"
    >
      <label class="checkbox_label__3cO9k">
        <input
          class="checkbox_inputcheck__1_X9Z"
          type="checkbox"
          @change="tagChanged"
          v-model="isFilterByTag"
          true-value="yes"
          false-value="no"
        />
        <span
          class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
          ><i class="la la-check"></i>
          <span class="checkbox-iconBg"></span>
        </span>
        <span class="checkbox_text__3Go1u text-ellipsis"
          >{{ settings.label }}
          <span class="checkbox-border"></span>
        </span>
      </label>
    </div>
    <div v-show="isFilterByTag == 'yes'" class="wil-visible wil-scroll-bar">
      <div v-for="oTag in settings.options">
        <!-- checkbox_module__1K5IS -->
        <div class="checkbox_module__1K5IS mb-20 js-checkbox">
          <label class="checkbox_label__3cO9k">
            <input
              v-model="aTags"
              @change="tagChanged"
              class="checkbox_inputcheck__1_X9Z"
              type="checkbox"
              :value="oTag.value"
            />
            <span
              class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
            >
              <i class="la la-check"></i>
              <span class="checkbox-iconBg"></span>
            </span>
            <span class="checkbox_text__3Go1u text-ellipsis"
              ><span v-html="oTag.name"></span>
              <span class="checkbox-border"></span>
            </span>
          </label>
        </div>
        <!-- End / checkbox_module__1K5IS -->
      </div>
    </div>
  </div>
</template>
<script>
import WilokeCheckboxTwo from "./../templates/WilokeCheckboxTwo.vue";

export default {
  data() {
    return {
      aTags: this.aStd,
      defaultValue: this.aStd,
      isFilterByTag: this.isExpandTag,
      oTranslation: WILCITY_I18
    };
  },
  props: {
    isExpandTag: {
      type: String,
      default: "no"
    },
    settings: {
      type: Object,
      default: {}
    },
    aStd: {
      type: Array,
      default: []
    }
  },
  components: {
    WilokeCheckboxTwo
  },
  mounted() {
    this.resetValue();
    this.scrollBar();
  },
  methods: {
    oTagOptions(oOptions) {
      let totalDef = this.aStd.length;
      if (totalDef) {
        let oCheckedTags = {};
        for (let i = 0; i < totalDef; i++) {
          oCheckedTags[this.aStd[i]] = oOptions[this.aStd[i]];
          delete oOptions[this.aStd[i]];
        }
        oOptions = Object.assign({}, oCheckedTags, oOptions);
      }

      return oOptions;
    },
    resetValue() {
      this.$parent.$on("resetEverything", () => {
        this.aTags = this.defaultValue;
        this.tagChanged();
      });
    },
    tagChanged() {
      if (this.isFilterByTag == "no") {
        this.$emit("onTagChanged", [], this.isFilterByTag);
      } else {
        this.$emit("onTagChanged", this.aTags, this.isFilterByTag);
      }
    },
    scrollBar() {
      this.$nextTick(() => {
        jQuery(this.$el)
          .find(".wil-scroll-bar")
          .wrapInner('<div class="wil-scroll-container"></div>');
        let scrollBar = this.$el.querySelector(".wil-scroll-bar");
        new PerfectScrollbar(scrollBar);
      });
    }
  }
};
</script>
