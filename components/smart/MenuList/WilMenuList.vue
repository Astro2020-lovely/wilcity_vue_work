<template>
  <div class="wil-group01_List__2bgXD">
    <wil-toggle-group
      v-for="(val, order) in model"
      v-on:delete="confirmRemoveItem(order)"
      :key="generateItemKey(val, order)"
      :is-auto-open="isAutoOpen"
      :toggle-title="val.title"
      wrapper-classes="wil-group01_Item__AOJlj"
    >
      <template slot="content">
        <div class="wil-group01_content__1oeej">
          <div class="menu-general-settings">
            <wil-fields-group
              :wil-fields="parseFieldsSkeleton"
              :value="val"
              v-on="{ change: handleFieldChange(order) }"
            ></wil-fields-group>
          </div>
        </div>
      </template>
    </wil-toggle-group>
    <wil-link
      v-if="!exceededMaximumItems"
      @click="addNewItem"
      :wrapper-classes="parseAddNewBtnClasses"
      icon="la la-plus"
      :btn-name="btnName"
    ></wil-link>
  </div>
</template>
<script>
import WilToggleGroup from "./../ToggleGroup/WilToggleGroup.vue";
import { FieldsGroupHelper } from "./../../../mixins/FieldsGroupHelper";

/**
 * The model is an array and it has the following structure:
 * [{title: '', 'name': ''}] The title and name are keys of itemsSkeleton item
 */
export default {
  data() {
    return {
      cacheField: {},
      parseFieldsSkeleton: []
    };
  },
  mixins: [FieldsGroupHelper],
  components: {
    "wil-toggle-group": WilToggleGroup
    // "wil-fields-group": WilFieldsGroup
  },
  created() {
    this.parseFieldsSkeleton = [...this.fieldsSkeleton];
  },
  props: {
    isDefaultValue: {
      // if this is true, the default value will be created automatically if the value is null
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    maximumItems: {
      type: Number,
      value: 0
    },
    addNewBtnClasses: {
      type: String,
      default: "wil-btn mb-5 wil-btn--gray wil-btn--round wil-btn--xs"
    },
    fieldsSkeleton: {
      // this contains information of a field. EG [{type: wil-input, label: 'Label', 'key': 'yourname'}]
      type: [Object, Array],
      default: () => {}
    },
    // itemsSkeleton: {
    //   // EG: [{yourname: 'Oke'}] it's a key-value pair
    //   type: [Array, Object],
    //   default: () => {}
    // },
    disableAddNewBtn: {
      type: Boolean,
      default: false
    },
    isAutoOpen: {
      type: Boolean,
      default: true
    },
    addNewBtnName: {
      type: String,
      default: ""
    }
  },
  watch: {
    model: {
      handler(val) {
        this.$emit("change", val);
      },
      deep: true
    }
  },
  computed: {
    exceededMaximumItems() {
      if (
        this.disableAddNewBtn ||
        this.maximumItems === 0 ||
        !this.maximumItems
      ) {
        return true;
      }

      return this.model && this.model.length >= this.maximumItems;
    },
    btnName() {
      return this.addNewBtnName.length
        ? this.addNewBtnName
        : WILCITY_I18.addNew;
    },
    parseAddNewBtnClasses() {
      return [
        this.addNewBtnClasses,
        this.maximumItems > 0 && this.maximumItems <= this.model.length
          ? "disabled"
          : ""
      ];
    },
    model: {
      get() {
        if (!this.value || !this.value.length) {
          return this.setDefaultValue();
        }
        return this.value;
      },
      set(newVal) {
        this.$emit("change", newVal);
      }
    },
    isObjectSkeleton() {
      return !Array.isArray(this.parseFieldsSkeleton);
    },
    itemValueSkeleton() {
      const fieldsSkeleton = this.isObjectSkeleton
        ? Object.values(this.parseFieldsSkeleton)
        : this.parseFieldsSkeleton;

      return fieldsSkeleton.reduce((accumulator, item) => {
        let value;
        if (item.type === "wil-select-tree") {
          return { ...accumulator, [item.key]: item.value };
        }
        if (!value) {
          if (item.valueFormat === "object") {
            value = {};
          } else if (item.valueFormat === "array") {
            value = [];
          } else {
            value = "";
          }
        }
        return { ...accumulator, [item.key]: value };
      }, {});
    }
  },
  methods: {
    setDefaultValue() {
      const val = this.parseFieldsSkeleton.reduce((accumulator, item) => {
        return { ...accumulator, [item.key]: this.getValue(item, true) };
      }, {});
      return [val];
    },
    handleFieldChange(itemOrder) {
      return val => {
        if (this.model[itemOrder]) {
          this.model = this.updateItemValueInArray(itemOrder, val, this.model);
        } else {
          this.model = this.addItem(itemOrder, val, this.model);
        }
      };
    },
    generateItemKey(item, index) {
      if (item.id) {
        return `${item.id}-${index}`;
      }

      if (item.value) {
        return `${item.value}-${index}`;
      }

      if (item.key) {
        return `${item.key}-${index}`;
      }

      return index;
    },
    getField(key) {
      if (this.cacheField[key]) {
        return this.cacheField[key];
      }

      if (this.isObjectSkeleton) {
        return this.parseFieldsSkeleton[key];
      }
      this.cacheField = {
        ...this.cacheField,
        [key]: this.findItemInArray("key", key, this.parseFieldsSkeleton)
      };

      return this.cacheField[key];
    },
    confirmRemoveItem(index) {
      let isDelete = confirm(WILCITY_I18.confirmDeleteSetting);
      if (isDelete) {
        this.parseFieldsSkeleton = this.parseFieldsSkeleton.map(item => {
          if (["wil-select-tree", "wil-checkbox"].includes(item.type)) {
            item = {
              ...item,
              lastReset: new Date().getTime()
            };
          }
          return item;
        });
        this.model = this.arrDeleteItem(index, this.model);
      }
    },
    addNewItem(event) {
      event.preventDefault();

      if (this.model.length) {
        this.model = [...this.model, this.itemValueSkeleton];
      } else {
        this.model = [this.itemValueSkeleton];
      }
    }
  }
};
</script>
