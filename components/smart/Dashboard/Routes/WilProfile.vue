<template>
  <div class="pos-r">
    <wil-block-loading :is-loading="isSubmitting" />
    <wil-alert v-if="msg.length" :type="msgStatus" :icon="msgIcon" :msg="msg" />

    <div class="wil-view-profile-btn-wrapper content-box_module__333d9 mb-10">
      <div class="content-box_body__3tSRB">
        <div class="promo-item_module__24ZhT">
          <div class="promo-item_group__2ZJhC">
            <p
              class="promo-item_description__2nc26"
              v-html="userShortInfo.description"
            ></p>
          </div>
          <div class="promo-item_action__pd8hZ">
            <a
              class="wil-btn wil-btn--xs wil-btn--primary wil-btn--round"
              :href="userShortInfo.authorPostsUrl"
            >
              <i class="la la-user"></i>
              <span>{{
                "View Profile" | filterTranslation("viewProfile")
              }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <content-placeholders v-if="isLoading">
      <content-placeholders-text :lines="4" />
    </content-placeholders>
    <div v-if="sections.length">
      <div
        v-for="section in sections"
        :id="`dashboard-section-${section.key}-info`"
        :key="`profile-${section.key}`"
        class="content-box_module__333d9 content-box_lg__3v3a- mb-10"
      >
        <wil-heading
          :heading="section.heading | filterTranslation(section.translation)"
          :icon="section.icon"
        />

        <div
          v-if="section.fields && section.fields.length"
          class="content-box_body__3tSRB"
        >
          <div
            v-for="field in section.fields"
            :key="`profile-field-${field.key}`"
            class="mb-20"
          >
            <component
              :is="field.type"
              :value="getValue(section.key, field)"
              :label="field.label"
              :maximum="field.maximum"
              :pickup-options="field.pickupOptions"
              :is-required="field.isRequired && field.isRequired === 'yes'"
              :settings="field"
              v-on="{ change: handleFieldChange(section.key, field) }"
            />
          </div>
        </div>
      </div>
    </div>

    <wil-alert v-if="msg.length" :type="msgStatus" :icon="msgIcon" :msg="msg" />
    <wil-link
      v-show="!isLoading"
      :is-loading="isSubmitting"
      :wrapper-classes="btnClasses"
      @click="handleSaveChanges"
      >{{ "Save Changes" | filterTranslation("saveChanges") }}</wil-link
    >

    <div
      v-if="enableDeleteAccount"
      class="content-box_module__333d9 content-box_lg__3v3a- mt-10"
      id="dashboard-section-delete-account"
    >
      <wil-heading
        :heading="parseHeadingDeleteAccount"
        :icon="deleteAccountSection.icon"
      />

      <div class="content-box_body__3tSRB">
        <wil-alert
          v-if="deleteAccountSection.warning.length"
          :msg="deleteAccountSection.warning"
          type="danger"
        />
        <wil-alert
          v-if="deleteAccountMsg.length"
          :msg="deleteAccountMsg"
          type="info"
        />
        <wil-input
          :label="'Current Password' | filterTranslation('currentPassword')"
          :value="currentPassword"
          @change="handleUpdateCurrentPassword"
        />
        <wil-link
          @click="handleDeleteAccount"
          :is-loading="isDeletingAccount"
          :btn-name="
            'Delete Account' | filterTranslation('permanentlyDeleteAccount')
          "
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { fetchUserInfo } from "./../../../../mixins/UserHelper";
import WilUploader from "./../../../dumbs/uploads/WilUploader.vue";
import WilPickupAndSet from "./../../../dumbs/WilPickupAndSet.vue";

export default {
  name: "wil-profile",
  mixins: [fetchUserInfo],
  components: {
    WilUploader,
    WilPickupAndSet
  },
  data() {
    return {
      sections: [],
      deleteAccountMsg: "",
      isDeletingAccount: false,
      enableDeleteAccount: false,
      deleteAccountSection: {},
      currentPassword: "",
      isLoading: true,
      isSubmitting: false,
      msg: "",
      msgIcon: "",
      msgStatus: "",
      canUpdate: false,
      values: {}
    };
  },
  computed: {
    btnClasses() {
      return "wil-btn wil-btn--primary wil-btn--round wil-btn--lg wil-btn--block";
    },
    parseHeadingDeleteAccount() {
      return this.$options.filters.filterTranslation(
        this.deleteAccountSection.heading
      );
    }
  },
  methods: {
    handleUpdateCurrentPassword(password) {
      this.currentPassword = password;
    },
    handleDeleteAccount() {
      const iWantToDelete = confirm(
        this.$options.filters.filterTranslation(
          "Are you sure to delete this account?",
          "confirmDeleteAccount"
        )
      );

      if (!iWantToDelete) {
        return false;
      }

      this.isDeletingAccount = true;
      const formData = new FormData();
      formData.append("action", "wilcity_delete_account");
      formData.append("current_password", this.currentPassword);

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData
      })
        .then(response => {
          this.deleteAccountMsg = response.data.data.msg;
          if (response.data.success) {
            setTimeout(() => {
              window.location.href = response.data.data.redirectTo;
            }, 1000);
          }
        })
        .finally(() => {
          this.isDeletingAccount = false;
        });
    },
    getValue(sectionKey, field) {
      if (this.values[sectionKey] && this.values[sectionKey][field.key]) {
        return this.values[sectionKey][field.key];
      }

      return field.value;
    },
    handleFieldChange(sectionKey, field) {
      return val => {
        const sectionValues = this.values[sectionKey]
          ? {
              ...this.values[sectionKey],
              [field.key]: val
            }
          : {
              [field.key]: val
            };
        this.values = {
          ...this.values,
          [sectionKey]: sectionValues
        };
      };
    },
    handleSaveChanges() {
      this.msg = "";
      this.isSubmitting = true;
      const formData = new FormData();
      formData.append("action", "wilcity_update_profile");
      formData.append("values", JSON.stringify(this.values));

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: formData
      })
        .then(response => {
          this.msg = response.data.data.msg;
          if (response.data.success) {
            this.msgIcon = "la la-smile-o";
            this.msgStatus = "success";
          } else {
            this.msgIcon = "la la-frown-o";
            this.msgStatus = "danger";
          }

          if (response.data.data.redirectTo) {
            setTimeout(function() {
              window.location.href = response.data.data.redirectTo;
            }, 3000);
          }
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    fetchProfileFields() {
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_profile_fields`
      })
        .then(response => {
          this.sections = response.data.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    fetchDeleteAccountFields() {
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_delete_account_fields`
      })
        .then(response => {
          if (response.data.success) {
            this.enableDeleteAccount = true;
            this.deleteAccountSection = response.data.data;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.fetchProfileFields();
    this.fetchUserInfo(
      WILOKE_INLINE_GLOBAL.userID,
      "avatar,description,displayName,authorPostsUrl"
    );
    this.fetchDeleteAccountFields();
  }
};
</script>
