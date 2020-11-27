<template>
  <wil-popup
    @close="handleClosePopup"
    id="report-popup"
    :is-open="true"
    :title="''|filterTranslation('reportTitle')"
  >
    <div slot="body" style="min-height: 150px;">
      <wil-block-loading :isLoading="isLoading" />
      <p v-if="!isReported && description.length" v-html="description"></p>
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" />
      <div v-if="!isLoading && !isReported">
        <component
          v-for="field in formFields"
          :is="determineFieldType(field)"
          :key="`report-field-${field.key}`"
          :label="field.label"
          :options="field.options"
          :value="getFieldValue(field)"
          v-on="{change: handleFieldChange(field.key)}"
          :is-required="field.isRequired === 'yes'"
        ></component>
      </div>
    </div>
    <footer class="popup_footer__2pUrl clearfix" slot="footer">
      <div class="popup_footerRight__qvdP6" v-if="!isLoading && !isReported">
        <wil-link
          @click="handleClosePopup"
          wrapper-classes="wil-btn wil-btn--secondary wil-btn--sm wil-btn--round"
        >{{'Cancel'|filterTranslation('cancel')}}</wil-link>
        <wil-link
          @click="handleSubmitReport"
          :is-loading="isSubmitting"
          wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
        >{{'Submit'|filterTranslation('submit')}}</wil-link>
      </div>
    </footer>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "wil-report-popup",
  data() {
    return {
      formFields: [],
      description: "",
      msg: "",
      msgType: "",
      isLoading: true,
      isSubmitting: false,
      isReported: false,
      data: {}
    };
  },
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  created() {
    this.fetchPopupFields();
  },
  methods: {
    determineFieldType(field) {
      let type = "";
      switch (field.type) {
        case "select":
          type = "simple-select";
          break;
        case "text":
          type = "input";
          break;
        default:
          type = field.type;
          break;
      }
      return `wil-${type}`;
    },
    fetchPopupFields() {
      if (this.formFields.length) {
        return false;
      }
      this.msg = "";
      Vue.axios({
        method: "GET",
        url: WilCityHelpers.buildRestRequest(
          "listings/fields/reports?isWeb=true"
        )
      })
        .then(response => {
          if (!response.data.success) {
            this.msg = response.data.data.msg;
            this.msgType = "danger";
          } else {
            this.formFields = [...response.data.data.fields];
            this.description = response.data.data.description;
          }
        })
        .finally(() => (this.isLoading = false));
    },
    handleClosePopup() {
      this.$emit("close");
    },
    getFieldValue(field) {
      if (this.data[field.key]) {
        return this.data[field.key];
      }

      if (field.value) {
        return field.value;
      }

      return "";
    },
    handleFieldChange(key) {
      return val => {
        this.data = {
          ...this.data,
          [key]: val
        };
      };
    },
    handleSubmitReport() {
      this.msg = "";
      this.isLoading = true;
      let data = {
        action: "wilcity_submit_report",
        data: JSON.stringify(this.data)
      };

      if (this.postId && this.postId !== 0) {
        data = { ...data, postID: this.postId };
      }

      const formData = WilQueryHelper.buildFormData(data);

      Vue.axios({
        url: WILOKE_GLOBAL.ajaxurl,
        method: "POST",
        data: formData
      })
        .then(response => {
          this.msg = response.data.data.msg;
          if (response.data.success) {
            this.isReported = true;
            this.msgType = "success";
            setTimeout(() => {
              this.handleClosePopup();
            }, 3000);
          } else {
            this.msgType = "danger";
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
