<template>
  <div :class="wrapperClasses">
    <div class="field-has-close">
      <div v-if="pickedupOptions.length">
        <div
          v-for="(item, order) in pickedupOptions"
          :key="item.id"
          class="row"
        >
          <div v-if="hasPickupOptions" :class="columnClasses">
            <wil-select-tree
              :options="
                pickupOptions | filterWithExcludes('id', excludesOptions(item))
              "
              :wrapper-classes="pickupItemClasses"
              :placeholder="pickupItemLabel"
              :value="valueFormat === 'id' ? item.id : item"
              :value-format="valueFormat"
              v-on="{ change: handleFieldChange(order, 'id', item) }"
            ></wil-select-tree>
          </div>
          <div :class="columnClasses">
            <wil-input
              :wrapper-classes="pickupItemClasses"
              :label="getLabel(item)"
              :value="item.value"
              v-on="{ change: handleFieldChange(order, 'value', item) }"
            />
            <wil-link
              @click="removeItem(item, order)"
              wrapper-classes="wil-btn--remove wil-btn mb-15 wil-btn--gray wil-btn--round wil-btn--xs wil-btn--icon"
              link="#"
              icon="la la-close"
            />
          </div>
        </div>
      </div>
    </div>
    <a
      v-show="!isExceededPickupOptions"
      @click.prevent="addItem"
      :class="addItemClasses"
      href="#"
    >
      <i class="la la-plus"></i>
      {{ addItemBtnName }}
    </a>

    <div v-if="parseDesc" class="mt-20 wil-field-desc">
      <p>{{ parseDesc }}</p>
    </div>
  </div>
</template>
<style scoped>
.wil-btn--remove {
  right: -25px;
}
</style>
<script>
// Let's instance, You want setup Social networks for a Listing, and instead of showing up
// all social networks by a fixed order You can click Add new button => An setting group will be shown up =>
// On the left of this setting, We have a select option that you can pick up what social network you want to use
// On the right of this setting, We can provide URL of social network setting

import { mapGetters } from "vuex";
import findAvailablePickupOptions from "./../../filters/FilterWithExclude";

export default {
  name: "wil-pickup-and-set",
  props: {
    value: {
      // It should look like this [{id: 'facebook', value: '#'}, {id: 'twitter', value: '#'}]
      type: Array,
      default() {
        return [];
      },
      required: false
    },
    pickupOptions: {
      type: Array,
      default() {
        return [];
      },
      required: false
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    addItemClasses: {
      type: String,
      default: "wil-btn mb-5 wil-btn--gray wil-btn--round wil-btn--xs"
    },
    pickupItemClasses: {
      type: String,
      default: "field_module__1H6kT field_style2__2Znhe mb-15"
    },
    pickupItemLabel: {
      type: String,
      default: ""
    },
    addItemBtnName: {
      type: String,
      default: "Add More"
    },
    label: {
      type: String,
      default: ""
    },
    valueFormat: {
      type: String,
      default: "object", // Format of value prop. There are 2 type of format: id and object
      required: false
    },
    maximumItems: {
      type: Number,
      default: 0,
      required: false
    },
    settings: {
      type: Object,
      default: () => {},
      required: false
    },
    description: {
      type: String,
      default: ""
    }
  },
  computed: {
    parseDesc() {
      if (_.isEmpty(this.description)) {
        return "";
      }

      return this.description.replace("%maximum%", this.maximumItems);
    },
    isExceededPickupOptions() {
      const pickedupLength = this.pickedupOptions.length;
      return (
        (this.hasPickupOptions > 0 &&
          this.pickupOptions.length === pickedupLength) ||
        (this.maximumItems > 0 && this.maximumItems <= pickedupLength)
      );
    },
    columnClasses() {
      return this.pickupOptions.length
        ? "col-xs-6 col-sm-6"
        : "col-xs-12 col-sm-12";
    },
    hasPickupOptions() {
      return this.pickupOptions.length;
    }
  },
  data() {
    return {
      pickedupOptions: [],
      availableOptions: []
    };
  },
  watch: {
    pickedupOptions: {
      handler(newVal) {
        this.$emit("change", newVal);
      },
      deep: true
    }
  },
  methods: {
    findAvailablePickupOptions,
    getLabel(item) {
      return item.label ? item.label : this.label;
    },
    handleFieldChange(order, key, item) {
      return val => {
        let newVal = {};
        if (this.valueFormat === "id") {
          newVal = {
            [key]: val
          };
          this.pickedupOptions = this.updateItemValueInArray(
            order,
            newVal,
            this.pickedupOptions
          );
        } else {
          if (key === "id") {
            newVal = { ...val };
          } else {
            newVal = {
              [key]: val
            };
          }
          this.pickedupOptions = this.updateItemValueInArray(
            order,
            newVal,
            this.pickedupOptions
          );
        }
      };
    },
    // We will exclude all selected options except the current option value
    excludesOptions(item) {
      if (!this.pickedupOptions.length) {
        return [];
      }
      const pickedupOptions = [...this.pickedupOptions];
      if (item) {
        const index = this.findItemIndexInArray(
          "id",
          item.id,
          this.pickedupOptions
        );
        if (index !== -1) {
          pickedupOptions.splice(index, 1);
        }
      }

      return pickedupOptions.map(option => option.id);
    },
    getPickedupLabel(item) {
      if (item.label) {
        return item.label;
      }
      const val = item.id;

      const matchedItem = this.findItemInArray(
        "id",
        val,
        this.pluckArr("id", this.pickedupOptions)
      );
      if (matchedItem) {
        return item.label;
      }

      return "";
    },
    removeItem(item, order) {
      let index = 0;
      if (item.id) {
        const val = item.id;
        index = this.findItemIndexInArray("id", val, this.pickedupOptions);
      } else {
        index = order;
      }
      if (index !== -1) {
        this.pickedupOptions = this.arrDeleteItem(index, this.pickedupOptions);
      }
    },
    addItem() {
      let newItem = { value: "" };
      if (this.hasPickupOptions) {
        const pickupOptionIds = this.excludesOptions();
        const availableOptions = this.findAvailablePickupOptions(
          this.pickupOptions,
          "id",
          pickupOptionIds
        );
        const option = availableOptions.slice(0, 1);
        delete option.label;
        newItem = { ...newItem, ...option[0] };
      }

      this.pickedupOptions = [...this.pickedupOptions, newItem];
    }
  },
  created() {
    this.pickedupOptions = [...this.value];
  }
};
</script>
