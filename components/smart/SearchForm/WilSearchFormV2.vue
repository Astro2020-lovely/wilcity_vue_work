<template>
  <div :class="wrapperClasses">
    <slot name="beforeformfields"></slot>
    <template v-for="(field, index) in searchFields">
      <wil-toggle-btn
        v-if="field.type === 'wil-toggle-btn'"
        :key="generateFieldKey(field)"
        :value="getFieldValue(field)"
        :name="`search-form-field-${field.key}`"
        :label="field.label"
        :wrapper-classes="searchBtnClasses(field)"
        v-on="{
          change: handleFieldChange(field.key, field.childType, field)
        }"
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
            :settings="field"
            :value="getFieldValue(field)"
            :name="`search-form-field-${field.key}`"
            :is-search-field="toggleSearchField(field)"
            @close="handleFocusCloseSearchField"
            v-on="{
              change: handleFieldChange(field.key, field.childType, field)
            }"
          />
        </template>
      </wil-search-dropdown>
    </template>
    <slot name="afterformfields"></slot>
  </div>
</template>
<script lang="javascript">
import { DetermineFieldComponent } from "./../../../mixins/DetermineFieldComponent";

import {
  SearchFieldHelper,
  SearchFieldV2Helper
} from "./../../../mixins/SearchFieldHelper";

export default {
  name: "wil-search-form-v2",
  mixins: [DetermineFieldComponent, SearchFieldHelper, SearchFieldV2Helper],
  methods: {
    toggleSearchField(field) {
      if (_.isUndefined(field.options) || _.isEmpty(field.options)) {
        return false;
      }

      if (field.options.length < 7) {
        return false;
      }

      return true;
    }
  }
};
</script>
