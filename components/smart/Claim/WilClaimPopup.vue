<template>
  <wil-popup
    @close="handleClosePopup"
    id="claim-popup"
    :is-open="true"
    :is-loading="isLoading"
    @submit="handleSubmitClaim"
    :title="'Claim Listing' | filterTranslation('claimListing')"
  >
    <div slot="body" style="min-height: 200px;">
      <wil-block-loading :is-loading="isLoading" />
      <wil-alert v-show="msg.length" :msg="msg" :type="msgType" />
      <div v-if="!hasPackage">
        <wil-alert
          :msg="'' | filterTranslation('noClaimFields')"
          type="danger"
        />
      </div>
      <div v-else>
        <template v-for="field in claimFields">
          <component
            :is="determineType(field)"
            v-on="{ change: handleFieldChange(field.key) }"
            :is-required="field.isRequired && field.isRequired === 'yes'"
            :options="parseFieldOptions(field.options)"
            :value="getFieldVal(field.key)"
            mode="default"
            :maximum-items="field.maximum ? field.maximum : 1"
            :label="field.label"
            :key="`wil-claim-field-${field.key}`"
          ></component>
        </template>
      </div>
    </div>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "wil-claim-popup",
  data() {
    return {
      claimFields: [],
      data: {},
      msg: "",
      msgType: "",
      isLoading: true
    };
  },
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  created() {
    this.fetchClaimFields();
  },
  computed: {
    hasPackage() {
      const hasNoPlan = this.claimFields.filter(field => field.noPackage);
      return !hasNoPlan.length;
    }
  },
  methods: {
    parseFieldOptions(rawOptions) {
      if (!_.isObject(rawOptions)) {
        return [];
      }

      return Object.values(rawOptions).map(item => {
        return {
          id: item.id,
          label: item.label
        };
      });
    },
    determineType(field) {
      let type;
      switch (field.type) {
        case "text":
          type = "wil-input";
          break;
        case "checkbox":
        case "select":
        case "radio":
        case "claimPackage":
          type = "wil-select-tree";
          break;
        default:
          type = `wil-${field.type}`;
          break;
      }

      return type;
    },
    getFieldVal(key) {
      return this.data[key] ? this.data[key] : "";
    },
    handleFieldChange(key) {
      return val => {
        this.data = {
          ...this.data,
          [key]: val
        };
      };
    },
    handleClosePopup() {
      this.$emit("close");
    },
    handleSubmitClaim() {
      this.isLoading = true;
      this.data = {
        ...this.data,
        postID: this.postId
      };

      Vue.axios({
        url: WILOKE_GLOBAL.ajaxurl,
        method: "POST",
        data: this.createFormData({
          action: "wilcity_claim_request",
          data: JSON.stringify(this.data)
        })
      })
        .then(response => {
          if (response.data.success) {
            if (response.data.data.redirectTo) {
              window.location.href = response.data.data.redirectTo;
            } else {
              this.msg = response.data.data.msg;
              this.msgType = "success";
              setTimeout(() => {
                this.handleClosePopup();
              }, 4000);
            }
          } else {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          }
        })
        .finally(() => (this.isLoading = false));
    },
    fetchClaimFields() {
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wil_fetch_claim_fields",
          postID: this.postId
        })
      })
        .then(response => {
          if (response.data.success) {
            this.claimFields = [...response.data.data.fields];
          } else {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
