<template>
  <div :class="wrapperClasses">
    <slot name="before-nav"></slot>
    <ul v-show="!isHideTab" :class="[innerClasses, tabAlignment]">
      <slot name="first-nav-item"></slot>
      <li v-for="oTab in aTabs" :id="oTab.tabId" :key="`${tabKey}-${oTab.tabId}`">
        <a
          v-if="oTab.name"
          @click.prevent="switchTab(oTab)"
          v-html="oTab.name"
          :class="{'active': isSelectedTab(oTab)}"
          :href="renderHref(oTab)"
        ></a>
      </li>
      <slot name="last-nav-item"></slot>
    </ul>
    <slot name="after-nav"></slot>
    <div :class="tabContentClasses">
      <slot :selected="selectedTab"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "wil-tabs",
  data() {
    return {
      aTabs: [],
      isActivate: false,
      selectedTab: ""
    };
  },
  computed: {
    isHideTab() {
      return this.isHideIfHasOne && this.aTabs.length < 2;
    }
  },
  props: {
    isHideIfHasOne: {
      type: Boolean,
      default: false
    },
    tabKey: {
      // it is used to as tab key prefix
      type: String,
      required: true
    },
    tabAlignment: {
      type: String,
      default: "wil-text-center"
    },
    selected: {
      type: String,
      required: true
    },
    wrapperClasses: {
      type: String,
      default: "wilTab_module__jlr12 wil-tab"
    },
    innerClasses: {
      type: String,
      default: "wilTab_nav__1_kwb wil-tab__nav ignore-swipper"
    },
    tabContentClasses: {
      type: String,
      default: "wilTab_content__2j_o5 wil-tab__content"
    }
  },
  watch: {
    selectedTab: {
      handler: function(val) {
        this.$emit("change", val);
      },
      immediate: true
    }
  },
  methods: {
    renderHref(oTab) {
      return "#" + oTab.tabId;
    },
    isSelectedTab(oTab) {
      return oTab.tabId == this.selectedTab;
    },
    switchTab(oTab) {
      this.selectedTab = oTab.tabId;
      this.$emit("switch-tab", this.selectedTab);
    }
  },
  mounted() {
    this.aTabs = this.$children.filter(child => {
      return child.$options._componentTag === "wil-tab";
    });
    this.selectedTab = this.selected;
  }
};
</script>
