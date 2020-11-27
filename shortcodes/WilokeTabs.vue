<template>
  <div class="wilTab_module__jlr12 wil-tab">
    <ul :class="['wilTab_nav__1_kwb wil-tab__nav ignore-swipper', tabAlignment]">
      <slot name="specialnavitembefore"></slot>
      <li v-for="oTab in aTabs" :id="oTab.tabId" v-if="oTab.name">
        <a
          @click.prevent="switchTab(oTab)"
          v-html="oTab.name"
          :class="{'active': isSelectedTab(oTab)}"
          :href="renderHref(oTab)"
        ></a>
      </li>
      <slot name="specialnavitemafter"></slot>
    </ul>
    <slot name="afternav"></slot>
    <div class="wilTab_content__2j_o5 wil-tab__content">
      <slot :selected="selectedTab"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aTabs: [],
      isActivate: false,
      selectedTab: ""
    };
  },
  props: {
    tabAlignment: {
      type: String,
      default: "wil-text-center"
    },
    selected: {
      type: String,
      required: true
    }
  },
  watch: {
    selectedTab: {
      handler: function(val) {
        this.$emit("changed-selected", val);
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
    }
  },
  mounted() {
    this.aTabs = this.$children;
    this.selectedTab = this.selected;
  }
};
</script>
