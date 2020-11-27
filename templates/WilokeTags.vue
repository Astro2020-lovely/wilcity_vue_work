<template>
  <div :class="wrapperClass">
    <div class="row">
      <div
        v-for="(oTag, index) in aListOfTags"
        class="col-md-4 col-lg-4 col-md-4-clear col-lg-4-clear"
      >
        <div class="checkbox_module__1K5IS mb-20">
          <label class="checkbox_label__3cO9k">
            <input
              v-if="isReachedMaximum && !tagChecked(oTag.value)"
              class="checkbox_inputcheck__1_X9Z"
              type="checkbox"
              v-model="aTags"
              :value="oTag.value"
              disabled
            />
            <input
              v-else
              class="checkbox_inputcheck__1_X9Z"
              type="checkbox"
              v-model="aTags"
              :value="oTag.value"
            />
            <span
              class="checkbox_icon__28tFk bg-color-primary--checked-after bd-color-primary--checked"
              ><i class="la la-check"></i>
              <span class="checkbox-iconBg"></span>
            </span>
            <span
              class="checkbox_text__3Go1u text-ellipsis"
              v-html="oTag.label"
            >
              <span class="checkbox-border"></span>
            </span>
          </label>
        </div>
      </div>
    </div>
    <span
      class="field_message__3Z6FX color-quaternary"
      v-show="isReachedMaximum"
      >{{ settings.overMaximumTagsWarning }}</span
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isReachedMaximum: false,
      oPlanSettings:
        typeof this.$store !== "undefined" &&
        typeof this.$store.getters.getPlanSettings !== "undefined"
          ? this.$store.getters.getPlanSettings
          : {},
      maximumTags:
        typeof this.settings.maximum !== "undefined"
          ? parseInt(this.settings.maximum, 10)
          : -1,
      aTags: typeof this.settings.value === "object" ? this.settings.value : []
    };
  },
  props: ["settings"],
  computed: {
    wrapperClass() {
      return {
        "field_module__1H6kT field_style2__2Znhe mb-15": 1 == 1,
        error: this.isReachedMaximum,
        disable:
          typeof this.oPlanSettings.toggle_listing_tag !== "undefined" &&
          this.oPlanSettings.toggle_listing_tag == "disable"
      };
    },
    aListOfTags() {
      let aTags = this.$store.getters.getTagsBelongsToCat(null);

      if (aTags === false || !aTags.length) {
        return this.settings.options;
      }
      return aTags;
    }
  },
  watch: {
    aTags: {
      handler: function() {
        this.checkReachedMaximum();
      },
      immediate: true
    }
  },
  methods: {
    checkReachedMaximum() {
      this.settings.value = this.aTags;
      if (this.maximumTags == -1) {
        return false;
      }
      this.isReachedMaximum = this.aTags.length >= this.maximumTags;
    },
    tagChecked(tag) {
      return this.aTags.indexOf(tag) !== -1;
    }
  }
};
</script>
