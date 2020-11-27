<template>
  <wil-popup
    :id="id"
    :title="title"
    @close="handleClosePopup"
    has-submit-btn="no"
    icon="la la-tag"
    :is-open="true"
  >
    <div slot="body" style="min-height: 200px;">
      <div v-if="img && img.length" :class="imgWrapperClasses">
        <img :src="img" :alt="code" />
      </div>
      <div :class="couponCodeClasses">
        <span>{{ code }}</span>
      </div>
      <div
        v-if="description && description.length"
        :class="counponCodeDescriptionClasses"
      >
        <p v-html="description"></p>
      </div>
      <wil-social-sharing-lists
        :socials="socialNetworks"
        type="button"
        social-classes="wil-btn mb-10 wil-btn--primary wil-btn--md wil-btn--block wil-btn--round"
        :settings="parseSocialSettings"
      />
      <wil-link
        wrapper-classes="wil-btn wil-btn--primary wil-btn--md wil-btn--block wil-btn--round"
        @click="copyCoupon"
        :btn-name="parseCopyBtn"
      />
      <input :id="generateCouponCodeId" type="hidden" :value="code" />
    </div>
  </wil-popup>
</template>
<script lang="javascript">
export default {
  name: "wil-counpon-popup",
  data() {
    return {
      isCopied: false,
      id: "coupon-popup",
      socialNetworks: ["facebook", "twitter", "whatsapp", "email", "pinterest"]
    };
  },
  components: {
    WilSocialSharingLists: () =>
      import(
        /*webpackChunkName: "WilSocialSharingLists" */
        /*webpackPreload: true */
        "./../SocialSharing/WilSocialSharingLists.vue"
      )
  },
  props: {
    settings: {
      type: Object,
      default: () => {}
    },
    postUrl: {
      type: String,
      default: ""
    },
    generateCouponCodeId: {
      type: String,
      default: "wil-copy-coupon-code"
    },
    wrapperClasses: {
      type: String,
      default:
        "popup_module__3M-0- pos-f-full popup_md__3El3k popup_mobile-full__1hyc4 wil-coupon"
    },
    imgWrapperClasses: {
      type: String,
      default: "wilcity-coupon-image wil-text-center"
    },
    couponCodeClasses: {
      type: String,
      default: "wilcity-coupon-code color-secondary"
    },
    counponCodeDescriptionClasses: {
      type: String,
      default: "wilcity-coupon-description"
    }
  },
  computed: {
    parseSocialSettings() {
      return {
        title: this.title,
        code: this.code,
        link: this.postUrl,
        img: this.img,
        body: this.body,
        postID: this.postID
      };
    },
    parseCopyBtn() {
      return this.isCopied
        ? this.$options.filters.filterTranslation("", "copied")
        : this.$options.filters.filterTranslation("", "copy");
    },
    title() {
      return this.settings.title ? this.settings.title : "";
    },
    description() {
      return this.settings.popup_description ? this.settings.popup_description : "";
    },
    code() {
      return this.settings.code ? this.settings.code : "";
    },
    img() {
      return this.settings.popup_image ? this.settings.popup_image : "";
    },
    postID() {
      return this.settings.postID ? this.settings.postID : "";
    },
    body() {
      return `
        ${this.description} ${this.$options.filters.filterTranslation(
        "",
        "pleaseUseThisCouponCode"
      )} ${this.code}
        `;
    }
  },
  methods: {
    handleClosePopup() {
      this.$emit("close");
    },
    copyCoupon() {
      let copyCoupon = document.getElementById("wil-copy-coupon-code");
      copyCoupon.setAttribute("type", "text");
      copyCoupon.select();
      document.execCommand("copy");
      this.isCopied = true;
      copyCoupon.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    }
  }
};
</script>
