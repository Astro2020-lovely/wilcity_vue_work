<template>
  <div class="wil-group01_List__2bgXD">
    <wiloke-toggle-group
      v-for="(oItem, index) in aItems"
      v-on:onDeleteItem="confirmRemoveItem(index)"
      :key="index"
      :is-auto-open="isAutoOpenMenuItem"
      :toggle-title="oItem.title"
      wrapper-class="wil-group01_Item__AOJlj"
    >
      <template v-slot:content>
        <div class="wil-group01_content__1oeej">
          <menu-item v-model="aItems[index]" :index="index" :o-value="oItem"></menu-item>
        </div>
      </template>
    </wiloke-toggle-group>
    <a href="#" :class="addNewClass" @click.prevent="addNewMenuItem">
      <i class="la la-plus"></i>
      <span v-html="oTranslations.addNew"></span>
    </a>
    <div class="clearfix" v-show="maximumItemWarning != ''"></div>
    <span
      class="field_message__3Z6FX color-quaternary"
      v-show="maximumItemWarning != ''"
      v-html="maximumItemWarning"
    ></span>
  </div>
</template>
<script>
import WilokeToggleGroup from "./../WilokeToggleGroup.vue";
import MenuItem from "./MenuItem.vue";
import WilokeInput from "./../WilokeInput.vue";
import WilokeIcon from "./../WilokeIcon.vue";

export default {
  data() {
    return {
      oTranslations: WILCITY_I18,
      aItems: this.aValues,
      isAutoOpenMenuItem: "no"
    };
  },
  components: {
    WilokeIcon,
    WilokeInput,
    WilokeToggleGroup,
    MenuItem
  },
  props: {
    aValues: {
      type: Array,
      default: () => [
        {
          title: "",
          description: "",
          price: "",
          link_to: "",
          is_open_new_window: ""
        }
      ]
    }
  },
  computed: {
    maximumItems() {
      return typeof this.$store.getters.getListingPlanSettings(
        "maximumItemsInMenu"
      ) === "undefined"
        ? 0
        : parseInt(
            this.$store.getters.getListingPlanSettings("maximumItemsInMenu"),
            10
          );
    },
    maximumItemWarning() {
      if (this.maximumItems !== 0 && !isNaN(this.maximumItems)) {
        return this.oTranslations.maximumItemWarning.replace(
          "%s",
          this.maximumItems
        );
      }
    },
    addNewClass() {
      return {
        "wil-btn mb-5 wil-btn--gray wil-btn--round wil-btn--xs": 1 == 1,
        disable:
          this.maximumItems != 0 && this.aItems.length === this.maximumItems
      };
    }
  },
  methods: {
    confirmRemoveItem(index) {
      let isDelete = confirm(this.oTranslations.confirmDeleteSetting);
      if (isDelete) {
        this.aItems.splice(index, 1);
      }
    },
    addNewMenuItem() {
      this.isAutoOpenMenuItem = "yes";
      this.aItems.push({
        title: "",
        description: "",
        price: "",
        gallery: "",
        link_to: "",
        is_open_new_window: ""
      });
    }
  }
};
</script>
