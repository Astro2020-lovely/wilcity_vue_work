<template>
  <wil-link
    :wrapper-classes="parseWrapperClasses"
    @click="handleSwitchTab"
    :href="renderHref"
    :btn-name="btnName"
    :icon="icon"
  >
    <template v-if="hasWrapperForIcon==='yes'" v-slot:default="{btnName, icon}">
      <span v-if="icon.length" class="list_icon__2YpTp">
        <i :class="icon"></i>
      </span>
      <span class="list_text__35R07" v-if="btnName.length" v-html="btnName"></span>
    </template>
  </wil-link>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "wil-switch-tab-btn",
  props: {
    wrapperClasses: {
      type: String,
      default: "list_link__2rDA1 text-ellipsis color-primary--hover"
    },
    hasWrapperForIcon: {
      type: String,
      default: "yes"
    },
    tabKey: {
      type: String,
      required: true
    },
    tabHref: {
      type: String,
      default: ""
    },
    pageUrl: {
      type: String,
      default: ""
    },
    btnName: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  },
  computed: {
    renderHref() {
      if (!this.pageUrl.length) {
        return "#";
      }

      if (this.tabHref.length) {
        return `${this.pageUrl}?tab=${this.tabHref}`;
      }

      return `${this.pageUrl}?tab=${this.tabKey}`;
    },
    parseWrapperClasses() {
      let classes = this.wrapperClasses;
      if (this.tabKey === this.currentTab) {
        classes = `${classes} color-primary`;
      }
      return classes;
    },
    ...mapGetters({
      currentTab: "ModuleSingleListing/getCurrentTab"
    })
  },
  methods: {
    handleSwitchTab(event) {
      event.preventDefault();
      this.$store.dispatch("ModuleSingleListing/updateCurrentTab", this.tabKey);
      history.pushState(null, this.tabTitle, this.renderHref);
      this.$emit("click");
    }
  }
};
</script>
