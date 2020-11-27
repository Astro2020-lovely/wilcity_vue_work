<template>
  <!-- content-box_module__333d9 -->
  <div :class="wrapperClasses">
    <div class="content-box_body__3tSRB">
      <!-- promo-item_module__24ZhT -->
      <wil-heading
        :heading="translation.sidebar"
        wrapper-classes="promo-item_module__24ZhT mb-15"
        inner-classes="promo-item_group__2ZJhC"
        left-classes="promo-item_title__3hfHG"
      >
        <template v-slot:after-heading>
          <p class="promo-item_description__2nc26" v-html="translation.sidebarDesc"></p>
        </template>
      </wil-heading>
      <!-- End / promo-item_module__24ZhT -->

      <div class="field_module__1H6kT field_style2__2Znhe mb-15">
        <wil-switch
          :value="mode"
          :label="translation.isUseDefaultLabel"
          span-classes="float-right"
          @change="handleModeChange"
        />
      </div>

      <!-- sort-box_module__1aAtu -->
      <div v-if="mode != 'yes'" class="sort-box_module__1aAtu">
        <draggable v-model="draggableItems" class="dragArea">
          <div
            class="sort-box_item__1156W"
            v-for="(item, order) in draggableItems"
            :key="generateItemKey(item)"
          >
            <div class="pos-r">
              <span class="sort-box_iconSort__1cDhT">
                <i class="la la-bars"></i>
              </span>
              <h3 class="sort-box_text__1E0Ln" v-html="item.name"></h3>

              <!-- checkbox_module__1K5IS -->
              <wil-switch
                :value="item.status"
                v-on="{change: handleFieldChange(order, 'status')}"
                :label="translation.isUseDefaultLabel"
                span-classes="float-right mr-10"
                wrapper-classes="checkbox_module__1K5IS checkbox_toggle__vd6vd sort-box_toggle__1tHcf pos-a-center-right"
              />
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
  <!-- End / content-box_module__333d9 -->
</template>
<script>
export default {
  name: "wil-listing-settings-sidebar",
  data() {
    return {
      key: "edit-navigation",
      draggableItems: [],
      mode: "",
      countUpdate: 1
    };
  },
  components: {
    draggable: () => import("vuedraggable")
  },
  props: {
    translation: {
      tyoe: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default:
        "wil-listing-settings wil-listing-settings content-box_module__333d9"
    },
    isUsingDefaultSidebar: {
      type: String,
      default: "yes"
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    draggableItems(items) {
      if (this.countUpdate !== 1) {
        this.$emit("updateSidebarOrder", items);
      }
      this.countUpdate += this.countUpdate;
    }
  },
  methods: {
    generateItemKey(item) {
      let key = `wil-sidebar-item-${item.key}`;
      if (item.promotionID) {
        key = `${key}-${item.promotionID}`;
      }
      return key;
    },
    handleModeChange(mode) {
      this.mode = mode;
      this.$emit("updateMode", this.mode);
    },
    handleFieldChange(order, key) {
      return val => {
        const newVal = { ...this.draggableItems[order], [key]: val };
        this.draggableItems = this.updateItemValueInArray(
          order,
          newVal,
          this.draggableItems
        );
      };
    }
  },
  created() {
    this.draggableItems = [...this.items];
    this.mode = this.isUsingDefaultSidebar;
  }
};
</script>
