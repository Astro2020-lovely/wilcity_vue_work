<template>
  <div class="dropdown_module__J_Zpj">
    <a :class="dropdownBtnClass" href="#" @click.prevent="toggleDropdown">
      <span>{{ "More" | filterTranslation("more") }}</span>
      <i class="la la-angle-down"></i>
    </a>
    <div :class="dropdownClass" v-show="isShowingDropdown">
      <!-- list_module__1eis9 list-none -->
      <ul
        class="list_module__1eis9 list-none list_small__3fRoS list_abs__OP7Og arrow--top-right"
      >
        <li class="list_item__3YghP wilcity-dasboard-edit-listing">
          <a
            class="list_link__2rDA1 text-ellipsis color-primary--hover"
            href="#"
            @click.prevent="goToEditPage"
          >
            <span class="list_icon__2YpTp">
              <i class="la la-pencil"></i>
            </span>
            <span class="list_text__35R07" v-html="editButtonName"></span>
          </a>
        </li>
        <li
          v-if="item.postStatus == 'publish'"
          class="list_item__3YghP wilcity-dasboard-hide-listing"
        >
          <a
            class="list_link__2rDA1 text-ellipsis color-primary--hover"
            href="#"
            @click.prevent="hideListing"
          >
            <span class="list_icon__2YpTp">
              <i class="la la-toggle-off"></i>
            </span>
            <span class="list_text__35R07">{{
              "Hide" | filterTranslation("hide")
            }}</span>
          </a>
        </li>
        <li
          v-if="item.postStatus == 'temporary_close'"
          class="list_item__3YghP wilcity-dasboard-publish-listing"
        >
          <a
            class="list_link__2rDA1 text-ellipsis color-primary--hover"
            href="#"
            @click.prevent="publishListing"
          >
            <span class="list_icon__2YpTp">
              <i class="la la-toggle-off"></i>
            </span>
            <span class="list_text__35R07">{{
              "Publish" | filterTranslation("publish")
            }}</span>
          </a>
        </li>
        <li class="list_item__3YghP wilcity-dasboard-remove-listing">
          <a
            class="list_link__2rDA1 text-ellipsis color-primary--hover"
            href="#"
            @click.prevent="deleteListing"
          >
            <span class="list_icon__2YpTp">
              <i class="la la-trash-o"></i>
            </span>
            <span class="list_text__35R07">{{
              "Remove" | filterTranslation("remove")
            }}</span>
          </a>
        </li>
      </ul>
      <!-- End /  list_module__1eis9 list-none -->
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-dashboard-dropdown-controller",
  data() {
    return {
      isShowingDropdown: false,
      xhr: null
    };
  },
  computed: {
    dropdownBtnClass() {
      return this.isShowingDropdown
        ? "wil-btn wil-btn--xs wil-btn--gray wil-btn--round active"
        : "wil-btn wil-btn--xs wil-btn--gray wil-btn--round";
    },
    dropdownClass() {
      return this.isShowingDropdown
        ? "dropdown_itemsWrap__2fuze active"
        : "dropdown_itemsWrap__2fuze";
    },
    editButtonName() {
      if (this.item.postStatus == "expired") {
        return this.$options.filters.filterTranslation("Renew", "renew");
      } else if (this.item.postStatus == "unpaid") {
        return this.$options.filters.filterTranslation(
          "Pay and Publish",
          "payAndPublish"
        );
      } else {
        return this.$options.filters.filterTranslation("Edit", "edit");
      }
    }
  },
  props: {
    item: {
      type: Object,
      default: {}
    },
    postFilterStatus: {
      type: String,
      default: "any"
    }
  },
  methods: {
    toggleDropdown() {
      this.isShowingDropdown = !this.isShowingDropdown;
    },
    hideListing() {
      let askHim = confirm(WILCITY_I18.confirmHide);
      if (!askHim) {
        return false;
      }

      this.xhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_hide_listing",
          postID: this.item.postID
        },
        success: response => {
          if (response.success && this.postFilterStatus !== "any") {
            this.$emit("removed-listing");
          }
          alert(response.data.msg);
        }
      });
    },
    publishListing() {
      let askHim = confirm(WILCITY_I18.confirmRePublish);
      if (!askHim) {
        return false;
      }

      this.xhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_republish_listing",
          postID: this.item.postID
        },
        success: response => {
          this.$emit("published");
          alert(response.data.msg);
        }
      });
    },
    goToEditPage() {
      if (this.xhr !== null) {
        return false;
      }

      this.xhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_get_edit_url",
          postID: this.item.postID
        },
        success: response => {
          if (response.success) {
            window.location.href = response.data.url;
          } else {
            alert(response.data.msg);
          }
        }
      });
    },
    deleteListing() {
      let askHim = prompt(WILCITY_I18.confirmDelete);
      if (askHim != "x") {
        alert(WILCITY_I18.wrongConfirmation);
        return false;
      }

      this.xhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_delete_listing",
          postID: this.item.postID
        },
        success: response => {
          alert(response.data.msg);
        }
      });
    }
  }
};
</script>
