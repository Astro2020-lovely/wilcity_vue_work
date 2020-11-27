<template>
  <!-- content-box_module__333d9 -->
  <div :class="wrapperClasses">
    <div class="content-box_body__3tSRB">
      <!-- promo-item_module__24ZhT -->
      <wil-heading
        :heading="translation.navigation"
        wrapper-classes="promo-item_module__24ZhT mb-15"
        inner-classes="promo-item_group__2ZJhC"
        left-classes="promo-item_title__3hfHG"
      >
        <template v-slot:after-heading>
          <p class="promo-item_description__2nc26" v-html="translation.navigationDesc"></p>
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
      <div v-show="mode != 'yes'" class="sort-box_module__1aAtu">
        <div class="sort-box_item__1156W">
          <h3 class="sort-box_text__1E0Ln" v-html="fixedItems.home.name"></h3>
        </div>

        <draggable v-model="draggableItems" class="dragArea">
          <div
            class="sort-box_item__1156W"
            v-for="(item, order) in draggableItems"
            :key="`wil-navigation-item-${item.key}`"
          >
            <div class="pos-r">
              <span class="sort-box_iconSort__1cDhT">
                <i class="la la-bars"></i>
              </span>
              <h3 class="sort-box_text__1E0Ln" v-html="item.name"></h3>

              <!-- checkbox_module__1K5IS -->
              <wil-switch
                :value="item.status"
                :label="translation.isUseDefaultLabel"
                span-classes="float-right"
                wrapper-classes="checkbox_module__1K5IS checkbox_toggle__vd6vd sort-box_toggle__1tHcf pos-a-center-right"
              />
            </div>
            <!-- End / checkbox_module__1K5IS -->
            <div v-if="item.status==='yes'" class="content-box_module__333d9 mb-0">
              <div class="content-box_body__3tSRB">
                <wil-switch
                  :value="item.status"
                  :label="''|filterTranslation('isShowOnHome')"
                  v-on="{change: handleFieldChange(order, 'status')}"
                  span-classes="float-right mr-10"
                  wrapper-classes="checkbox_module__1K5IS mb-0"
                />
              </div>
            </div>
          </div>
        </draggable>
        <div class="sort-box_item__1156W">
          <h3 class="sort-box_text__1E0Ln" v-html="fixedItems.insights.name"></h3>
        </div>
        <div class="sort-box_item__1156W">
          <h3 class="sort-box_text__1E0Ln" v-html="fixedItems.settings.name"></h3>
        </div>
      </div>
      <!-- End /  sort-box_module__1aAtu -->
    </div>
  </div>
  <!-- End / content-box_module__333d9 -->
</template>
<script>
export default {
  name: "wil-listing-settings-edit-navigation",
  data() {
    return {
      key: "edit-navigation",
      draggableItems: [],
      fixedItems: {},
      mode: "",
      countUpdate: 1
    };
  },
  created() {
    this.draggableItems = Object.values(this.items.draggable);
    this.fixedItems = { ...this.items.fixed };
    this.mode = this.isUsingDefaultNav;
  },
  props: {
    translation: {
      type: Object,
      default: () => {}
    },
    wrapperClasses: {
      type: String,
      default:
        "wil-listing-settings wil-listing-settings content-box_module__333d9"
    },
    isUsingDefaultNav: {
      type: String,
      default: "yes"
    },
    items: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    draggable: () => import("vuedraggable")
  },
  watch: {
    draggableItems(items) {
      if (this.countUpdate !== 1) {
        this.$emit("updateNavOrderItems", items);
      }
      this.countUpdate += this.countUpdate;
    }
  },
  methods: {
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
  }
};
</script>
