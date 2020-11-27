<template>
  <form :class="wrapperClasses">
    <slot name="beforeformfields"></slot>
    <template v-for="(field, index) in parseSearchFields">
      <wil-toggle-btn
        v-if="field.type === 'wil-toggle-btn'"
        :key="generateFieldKey(field)"
        :value="getFieldValue(field)"
        :name="`search-form-field-${field.key}`"
        :label="field.label"
        :wrapper-classes="searchBtnClasses(field)"
        v-on="{ change: handleFieldChange(field.key, field.childType, field) }"
        :field="field"
      ></wil-toggle-btn>
      <wil-search-dropdown
        v-else-if="field.type === 'wil-search-dropdown'"
        :wrapper-classes="searchBtnClasses(field)"
        :dropdown-btn-classes="dropdownClasses(field)"
        :dropdown-wrapper-classes="dropdownWrapperClasses(field.key)"
        :has-footer-controller="
          field.hasFooterController && field.hasFooterController === 'no'
            ? false
            : true
        "
        :key="generateFieldKey(field)"
        :is="determineComponent(field.type)"
        :name="`search-form-field-${field.key}`"
        :btn-name="getSearchDropdownBtnName(field)"
        :settings="field"
        @clear="handleClearValue(field.key)"
        @applied="handleAppliedFilter"
        v-on="{
          click: handleDropdownClick(index)
        }"
      >
        <template slot:default="{isLoading, field, dropdownStatus}">
          <wil-block-loading v-show="field.isLoading" />
          <component
            :is="determineChildSearchDropdownComponent(field)"
            :settings="getSettings(field)"
            :value="getFieldValue(field)"
            :name="`search-form-field-${field.key}`"
            @close="handleFocusCloseSearchField"
            v-on="{
              change: handleFieldChange(field.key, field.childType, field)
            }"
          >
            <template slot="sub-fields" slot-scope="{ subFields }">
              <div
                v-for="(subField, index) in subFields"
                :key="`wil-sub-field-${subField.key}-${index}`"
                class="filter_card__3y4LX"
              >
                <div class="filter_block1__3Z-hL">
                  <component
                    :is="determineSubFieldComponent(subField)"
                    :name="`wil-sub-field-${subField.key}-${index}`"
                    :settings="subField"
                    :label="subField.label"
                    :value="getFieldValue(subField)"
                    false-value
                    v-on="{
                      change: handleFieldChange(
                        subField.key,
                        subField.childType,
                        subField
                      )
                    }"
                    wrapper-classes="filterType3_module__2x4yA"
                  >
                    <template v-slot:wil-before>
                      <span class="checkbox_text__3Go1u text-ellipsis">
                        <span>{{ subField.label }}</span>
                      </span>
                    </template>
                  </component>
                </div>
              </div>
            </template>
          </component>
        </template>
      </wil-search-dropdown>
    </template>
    <slot name="afterformfields"></slot>
  </form>
</template>
<script lang="javascript">
import {
  SearchFieldHelper,
  SearchFieldV2Helper
} from "./../../../mixins/SearchFieldHelper";
import { DetermineFieldComponent } from "./../../../mixins/DetermineFieldComponent";
import WilSubSearchFields from "./WilSubSearchFields.vue";

export default {
  name: "wil-search-form-v2-mobile",
  mixins: [DetermineFieldComponent, SearchFieldHelper, SearchFieldV2Helper],
  components: { WilSubSearchFields },
  data() {
    return {
      searchFormListFields: ["wil-radio", "wil-checkbox"]
    };
  },
  created() {
    this.moreFilterValues = this.moreFilterFields.reduce((carry, item) => {
      return {
        ...carry,
        [item.key]: this.getFieldValue(item)
      };
    }, {});
  },
  methods: {
    getSettings(field) {
      if (field.childType === "wil-sub-search-fields") {
        return field.settings;
      }

      return field;
    },
    determineSubFieldComponent(field) {
      let component = "";
      switch (field.type) {
        case "wil-toggle-btn":
          component = "wil-switch";
          break;
        case "wil-search-dropdown":
          if (field.childType === "wil-price-range") {
            component = "wil-search-form-price-range";
          } else if (this.searchFormListFields.includes(field.childType)) {
            component = "wil-search-form-list";
          }
          break;
      }

      return component;
    }
  }
};
</script>
