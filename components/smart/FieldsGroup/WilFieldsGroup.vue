<template>
  <div :class="wrapperClasses">
    <p class="wil-section-description" v-if="parseDesc.length">
      <i v-html="parseDesc"></i>
    </p>
    <div
      v-for="(field, index) in wilFields"
      :key="generateFieldKey(index)"
      class="mb-15"
    >
      <component
        v-if="isEnable(field)"
        :is="determineFieldComponent(field.type)"
        :value="getValue(field)"
        :label="field.label"
        :description="field.description"
        :is-required="isRequired(field)"
        :settings="parseField(field)"
        :mode="loadOptionMode(field)"
        :placeholder="field.placeholder"
        :maximum-items="parseMaximumItems(field)"
        :search-url="searchUrl(field)"
        :select-value-format="selectValueFormat(field)"
        :wrapper-classes="parseFieldClasses(field)"
        :options="fieldOptions(field)"
        :pickup-options="field.pickupOptions"
        :add-item-btn-name="field.addItemBtnName"
        :pickup-item-label="field.pickupItemLabel"
        v-on="{ change: handleFieldChange(field.key, index) }"
      ></component>
    </div>
  </div>
</template>
<script lang="javascript">
import { ParseOption } from "./../../../mixins/ParseOption";
import { FieldsGroupHelper } from "./../../../mixins/FieldsGroupHelper";
import { DetermineFieldComponent } from "./../../../mixins/DetermineFieldComponent";

export default {
  name: "wil-fields-group",
  mixins: [ParseOption, FieldsGroupHelper, DetermineFieldComponent],
  components: {
    WilEditor: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */

        /* wepkacPreload: true */

        "./../../dumbs/WilEditor.vue"
      ),
    WilEventCalendar: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */

        /* wepkacPreload: true */

        "./../../smart/Event/WilEventCalendar.vue"
      ),
    WilSearchAddress: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */

        /* wepkacPreload: true */

        "./../../dumbs/WilSearchAddress.vue"
      ),
    WilBusinessHours: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */

        /* wepkacPreload: true */

        "./../../dumbs/WilBusinessHours.vue"
      ),
    WilUploader: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */

        /* wepkacPreload: true */
        "./../../dumbs/uploads/WilUploader.vue"
      ),
    WilPickupAndSet: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */

        /* wepkacPreload: true */
        "./../../dumbs/WilPickupAndSet.vue"
      ),
    WilPriceRange: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */
        /* wepkacPreload: true */
        "./../../dumbs/WilPriceRange.vue"
      ),
    WilDateTime: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */ /* wepkacPreload: true */ "./../../dumbs/WilDateTime.vue"
      ),
    WilGroup: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */
        /* wepkacPreload: true */
        "./../../dumbs/WilGroup.vue"
      ),
    WilColorpicker: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */ /* wepkacPreload: true */ "./../../dumbs/WilColorpicker.vue"
      ),
    WilDatepicker: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */ /* wepkacPreload: true */ "./../../dumbs/WilDatepicker.vue"
      ),
    WilMultipleCheckbox: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */ /* wepkacPreload: true */
        "./../../dumbs/WilMultipleCheckbox.vue"
      ),
    WilIcon: () =>
      import(
        /* webpackChunkName: "WilFieldsGroup" */
        /* wepkacPreload: true */
        "./../../dumbs/WilIcon.vue"
      )
  },
  computed: {
    model: {
      get() {
        if (!this.value) {
          return {};
        }
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    },
    parseDesc() {
      if (this.settings.description && this.settings.description.length) {
        return this.settings.description;
      }
      return "";
    }
  },
  props: {
    settings: {
      type: Object,
      default() {
        return {};
      }
    },
    postType: {
      type: String,
      default: ""
    },
    wrapperClasses: {
      type: String,
      default: "content-box_body__3tSRB"
    },
    wilFields: {
      // To avoid conflicting with vee-validate
      type: [Object, Array],
      required: true,
      default() {
        return {};
      }
    },
    value: {
      type: [Object, Array],
      required: false,
      default: () => {}
    }
  },
  mounted() {
    // console.log(this.value);
  },
  methods: {
    handleFieldChange(key) {
      return val => {
        this.model = {
          ...this.model,
          [key]: val
        };
      };
    },
    generateFieldKey(index) {
      return `addlisting-field-${index}`;
    }
  }
};
</script>
