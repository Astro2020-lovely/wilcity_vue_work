<template>
  <div>
    <wil-toggle-group
      v-for="(group, index) in model"
      v-on:delete="confirmRemoveItem(index)"
      :key="index"
      :is-auto-open="isAutoOpen || focusAutoOpen"
      :toggle-title="group.group_title"
      wrapper-classes="wil-group01_block__3X0D9"
    >
      <template v-slot:content>
        <slot v-if="!disableHeader" name="header">
          <div class="wil-group01_content__1oeej">
            <wil-input
              :value="group.group_title"
              :label="settings.groupTitleLabel"
              v-on="{ change: handleHeaderSettingChange('group_title', index) }"
            />
            <wil-input
              :value="group.group_description"
              :label="settings.groupDescriptionLabel"
              v-on="{
                change: handleHeaderSettingChange('group_description', index)
              }"
            />
            <wil-icon
              :valbel="group.group_icon"
              :label="settings.groupIconLabel"
              v-on="{ change: handleHeaderSettingChange('group_icon', index) }"
            />
          </div>
        </slot>
        <wil-menu-list
          :value="group.items"
          :fields-skeleton="settings.fieldsSkeleton"
          :maximum-items="
            settings.maximumChildren
              ? parseInt(settings.maximumChildren, 10)
              : 1
          "
          v-on="{ change: handleMenuListChange(index) }"
          :is-default-value="isDefaultValue"
        />
      </template>
    </wil-toggle-group>
    <wil-link
      v-show="!exceededMaximum"
      :btn-name="addNewBtnName | filterTranslation('addNew')"
      icon="la la-plus"
      @click="addGroup"
    />
    <wil-field-error-msg :msg="errorMsg" />
  </div>
</template>
<script>
import WilToggleGroup from "./../smart/ToggleGroup/WilToggleGroup.vue";
import WilMenuList from "./../smart/MenuList/WilMenuList.vue";
import WilIcon from "./WilIcon.vue";

export default {
  name: "wil-group",
  data() {
    return {
      focusAutoOpen: false
    };
  },
  created() {
    if (
      this.settings &&
      this.settings.alwaysExpand &&
      this.settings.alwaysExpand === "yes"
    ) {
      this.focusAutoOpen = true;
    }
  },
  components: {
    WilToggleGroup,
    WilMenuList,
    WilIcon
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    isAutoOpen: {
      type: Boolean,
      default: false
    },
    value: {
      // [{group_title: '', group_description: '', group_icon: '', items: [{item1: 'x'}, {item1: 'y'}]}]
      type: Array,
      default: () => []
    },
    errorMsg: {
      type: String,
      default: ""
    },
    addNewBtnName: {
      type: String,
      default: ""
    },
    maximumItems: {
      type: Number,
      default: 0
    },
    isDefaultValue: {
      // if this is true, the default value will be created automatically if the value is null
      type: Boolean,
      default: true
    }
  },
  mounted() {
    // console.log(this.value, "group");
  },
  computed: {
    model: {
      get() {
        return this.value.length
          ? this.value
          : [
              {
                group_title: "",
                group_icon: "",
                group_description: "",
                items: []
              }
            ];
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    },
    disableHeader() {
      return this.settings.disableHeader;
    },
    exceededMaximum() {
      if (this.maximumItems === 0) {
        return false;
      }
      return this.maximumItems <= this.model.length;
    }
  },
  methods: {
    setDefaultValue() {
      if (!this.model.length && this.isDefaultValue) {
        this.model = [
          {
            group_title: "",
            group_icon: "",
            group_description: "",
            items: []
          }
        ];
      }
    },
    handleHeaderSettingChange(key, index) {
      return val => {
        const modelVal = {
          ...this.model[index],
          [key]: val
        };

        this.model = this.updateItemValueInArray(index, modelVal, this.model);
      };
    },
    handleMenuListChange(index) {
      return val => {
        const modelValue = {
          ...this.model[index],
          items: val
        };
        this.model = this.updateItemValueInArray(index, modelValue, this.model);
      };
    },
    addGroup(event) {
      event.preventDefault();

      this.focusAutoOpen = true;
      this.model = [
        ...this.model,
        {
          group_title: "",
          group_description: "",
          group_icon: "",
          items: []
        }
      ];
    },
    confirmRemoveItem(index) {
      const isDelete = confirm(WILCITY_I18.confirmDeleteSetting);
      if (isDelete) {
        this.model = this.arrDeleteItem(index, this.model);
      }
    }
  }
};
</script>
