<template>
  <div :class="wrapperClasses" v-click-outside="handleCloseEditForm">
    <div
      class="utility-box-1_module__MYXpX utility-box-1_xs__3Nipt utility-box-1_boxLeft__3iS6b clearfix"
    >
      <a
        :href="discussion.author.authorLink"
        class="utility-box-1_avatar__DB9c_ rounded-circle wil-float-left"
        :style="`background-image: url(${discussion.author.avatar});`"
      >
        <img :src="discussion.author.avatar" :alt="discussion.author.displayName" />
      </a>
      <div class="utility-box-1_body__8qd9j">
        <div class="utility-box-1_group__2ZPA2">
          <h3 class="utility-box-1_title__1I925">
            <a :href="discussion.author.authorLink">{{discussion.author.displayName}}</a>
          </h3>
          <div class="utility-box-1_content__3jEL7" v-html="parseDiscussionContent"></div>
        </div>
        <div class="utility-box-1_description__2VDJ6">{{parseDiscussionInfo}}</div>
      </div>

      <wil-review-discussion-form
        v-if="isOpenEditForm"
        :value="discussion.content"
        @close="handleCloseEditForm"
        @update="handleUpdateDiscussion"
        :is-submitted="isSubmitted"
        :is-user-logged-in="isUserLoggedIn"
        inner-classes="field_module__1H6kT field_style4__2DBqx field-autoHeight"
      />
    </div>

    <wil-buttons-dropdown
      v-if="parseDropdownItems.length"
      :is-active="isDropdownActive"
      @change="toggleDropdownStatus"
      wrapper-classes="dropdown_module__J_Zpj"
    >
      <wil-lists
        :items="parseDropdownItems"
        wrapper-classes="list_module__1eis9 list-none list_small__3fRoS list_abs__OP7Og arrow--top-right"
        inner-classes="list_item__3YghP"
        :has-wrap-for-icon="true"
      >
        <template v-slot:list-item="{item}">
          <component
            :is="item.component"
            :wrapper-classes="item.wrapperClasses"
            :icon="item.icon"
            has-wrapper-for-icon="yes"
            span-classes="list_text__35R07"
            :btn-name="item.btnName"
            @click="handleBtnClick(item)"
            @close="toggleDropdownStatus"
          />
        </template>
      </wil-lists>
    </wil-buttons-dropdown>
  </div>
</template>
<style scoped>
/deep/ .dropdown_module__J_Zpj {
  position: absolute;
  top: 18px;
  right: 20px;
}
</style>
<script>
export default {
  name: "wil-review-discussion-item",
  data() {
    return {
      isOpenEditForm: false,
      isDropdownActive: false
    };
  },
  mounted() {},
  components: {
    WilReviewDiscussionForm: () =>
      import(
        /*webpackChunkName: "WilReviewDiscussionForm" */
        /*webpackPreload: true */
        "./WilReviewDiscussionForm.vue"
      ),
    WilReviewAuthorInfo: () =>
      import(
        /*webpackChunkName: "WilReviewAuthorInfo" */
        /*webpackPreload: true */
        "./WilReviewAuthorInfo.vue"
      )
  },
  props: {
    canDoAnything: {
      type: Boolean,
      default: false
    },
    discussion: {
      type: Object,
      required: true
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    isSubmitted: {
      type: Boolean,
      default: true
    },
    isUserLoggedIn: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    parseDropdownItems() {
      let items = [];

      if (this.discussion.isAuthor === "yes") {
        items = [
          ...items,
          {
            type: "edit",
            component: "wil-link",
            wrapperClasses:
              "list_link__2rDA1 text-ellipsis color-primary--hover",
            btnName: this.$options.filters.filterTranslation("", "edit"),
            icon: "la la-edit"
          }
        ];
      }

      if (this.canDoAnything || this.discussion.isAuthor === "yes") {
        items = [
          ...items,
          {
            type: "delete",
            component: "wil-link",
            wrapperClasses:
              "list_link__2rDA1 text-ellipsis color-primary--hover",
            btnName: this.$options.filters.filterTranslation("", "delete"),
            icon: "la la-trash"
          }
        ];
      }

      return items;
    },
    renderGenerateRef() {
      return "discussion-" + this.parentId;
    },
    parseDiscussionInfo() {
      if (this.discussion.position) {
        return this.discussion.position + " . " + this.discussion.date;
      } else {
        return this.discussion.date;
      }
    },
    parseDiscussionContent() {
      return this.discussion.content.replace("\n", "<br/>");
    }
  },
  methods: {
    handleBtnClick(item) {
      switch (item.type) {
        case "edit":
          this.isOpenEditForm = true;
          break;
        case "delete":
          this.$emit("delete");
          break;
      }

      this.toggleDropdownStatus();
    },
    toggleDropdownStatus(status) {
      this.isDropdownActive = status;
    },
    handleCloseEditForm() {
      this.isOpenEditForm = false;
      this.isDropdownActive = false;
    },
    handleUpdateDiscussion(content) {
      this.$emit("update", content);
    }
  }
};
</script>
