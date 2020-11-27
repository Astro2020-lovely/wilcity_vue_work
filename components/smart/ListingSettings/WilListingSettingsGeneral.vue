<template>
  <div :class="wrapperClasses">
    <div class="content-box_body__3tSRB">
      <div class="single-layout-settings">
        <wil-heading
          :heading="translation.layout"
          wrapper-classes="promo-item_module__24ZhT mb-15"
          inner-classes="promo-item_group__2ZJhC"
          left-classes="promo-item_title__3hfHG"
        >
          <template v-slot:after-heading>
            <p class="promo-item_description__2nc26" v-html="translation.layoutDesc"></p>
          </template>
        </wil-heading>

        <div class="d-inline-block mr-20">
          <!-- checkbox_module__1K5IS -->
          <wil-radio
            wrapper-classes="checkbox_module__1K5IS checkbox_radio__1pYzR js-checkbox"
            @change="changeSidebarPosition"
            :value="sidebarPosition"
            true-value="left"
            false-value="right"
            :label="translation.leftSidebar"
          />
          <!-- End / checkbox_module__1K5IS -->
        </div>

        <div class="d-inline-block">
          <wil-radio
            wrapper-classes="checkbox_module__1K5IS checkbox_radio__1pYzR js-checkbox"
            @change="changeSidebarPosition"
            :value="sidebarPosition"
            true-value="right"
            false-value="left"
            :label="translation.rightSidebar"
          />
        </div>
      </div>

      <div class="wil-divider mt-20 mb-20 bg-color-gray-1"></div>
      <div class="wil-single-button-settings wil-single-button-settings">
        <wil-heading
          :heading="translation.addButton"
          wrapper-classes="promo-item_module__24ZhT mb-15"
          inner-classes="promo-item_group__2ZJhC"
          left-classes="promo-item_title__3hfHG"
        >
          <template v-slot:after-heading>
            <p class="promo-item_description__2nc26" v-html="translation.addButtonDesc"></p>
          </template>
        </wil-heading>

        <div class="wil-addbutton-setting row">
          <div class="col-sm-4">
            <wil-input
              :label="translation.websiteLink"
              :value="modelButtonSettings.button_link"
              v-on="{change: handleChangeButtonSettings('button_link')}"
            />
          </div>
          <div class="col-sm-4">
            <wil-icon
              :label="translation.icon"
              :value="modelButtonSettings.button_icon"
              v-on="{change: handleChangeButtonSettings('button_icon')}"
            />
          </div>
          <div class="col-sm-4">
            <wil-input
              :label="translation.buttonName"
              :value="modelButtonSettings.button_name"
              v-on="{change: handleChangeButtonSettings('button_name')}"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      key: "general",
      modelButtonSettings: {},
      countUpdate: 1
    };
  },
  components: {
    WilIcon: () =>
      import(
        /*webpackChunkName: "WilIcon" */
        /*webpackPrefetch: true */
        "./../../dumbs/WilIcon.vue"
      )
  },
  created() {
    this.modelButtonSettings = { ...this.buttonSettings };
  },
  methods: {
    changeSidebarPosition(position) {
      this.$emit("updateSidebarPosition", position);
    },
    handleChangeButtonSettings(key) {
      return val => {
        this.modelButtonSettings = { ...this.modelButtonSettings, [key]: val };
        if (this.countUpdate !== 1) {
          this.$emit("updateButtonSettings", this.modelButtonSettings);
        }
        this.countUpdate += this.countUpdate;
      };
    }
  },
  props: {
    translation: {
      tyoe: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default: "wil-listing-settings wil-listing-settings"
    },
    sidebarPosition: {
      type: String,
      default: "right"
    },
    buttonSettings: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
