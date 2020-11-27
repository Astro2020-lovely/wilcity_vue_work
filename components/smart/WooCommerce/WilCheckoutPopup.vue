<template>
  <wil-popup
    id="advanced-checkout-popup"
    wrapper-class="popup_module__3M-0- pos-f-full popup_md__3El3k popup_mobile-full__1hyc4"
    :is-open="true"
    :title="title"
    :icon="icon"
    @submit="handleSubmit"
    @close="handleClosePopup"
    :is-loading="isLoading || parseMsgType === 'success'"
  >
    <div slot="body">
      <wil-alert-animation
        v-if="parseMsgType === 'success'"
        :heading="msg.heading"
        :desc="msg.msg"
      ></wil-alert-animation>
      <div v-else>
        <wil-alert
          v-show="parseMsg.length"
          :msg="parseMsg"
          :type="parseMsgType"
        />
        <wil-block-loading :is-loading="isLoading" />
        <template v-for="field in popupFields">
          <component
            :is="field.type"
            :label="field.label"
            :value="getValue(field.key)"
            :desc="field.desc"
            v-on="{ change: handleFieldChange(field.key, field) }"
          ></component>
        </template>
      </div>
    </div>
  </wil-popup>
</template>
<script lang="javascript">
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
export default {
  name: "wil-checkout-popup",
  data() {
    return {
      data: {}
    };
  },
  computed: {
    isFilledUpAllRequiredInfo() {
      return Object.values(this.popupFields).every(item => {
        if (!item.isRequired) {
          return true;
        }
        return !_.isEmpty(this.data[item.key]);
      });
    },
    parseMsg() {
      if (this.msg.msg) {
        return this.msg.msg;
      }

      return "";
    },
    parseMsgType() {
      if (this.msg.type) {
        return this.msg.type;
      }

      return "";
    }
  },
  methods: {
    getValue(key) {
      return wilValueFormat.correct(key, this.data[key]);
    },
    handleFieldChange(key, field) {
      return val => {
        this.data = {
          ...this.data,
          [key]: val
        }
      };
    },
    handleClosePopup() {
      this.$emit('close');
    },
    handleSubmit() {
      this.$emit('submit', this.data);
    }
  },
  props: {
    popupFields: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    msg: {
      type: Object,
      default: {}
    }
  }
};
</script>
