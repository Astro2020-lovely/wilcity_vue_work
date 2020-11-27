<template>
  <transition name="fade-shrink-in" appear>
    <div
      :id="id"
      v-if="isOpen"
      :class="parseWrapperClasses"
      :data-popup-content="id"
    >
      <div class="wil-overlay js-popup-overlay"></div>
      <div class="wil-tb">
        <div class="wil-tb__cell">
          <div class="popup_content__3CJVi">
            <header class="popup_header__2QTxC clearfix">
              <h3 class="popup_title__3q6Xh">
                <i v-if="icon" :class="icon"></i>
                <span v-html="title"></span>
              </h3>
              <div class="popup_headerRight__c4FcP">
                <span
                  class="popup_close__mJx2A color-primary--hover js-toggle-close"
                  @click="closePopup"
                >
                  <i class="la la-close"></i>
                </span>
              </div>
            </header>
            <div class="popup_body__1wtsy wil-scroll-bar">
              <div class="wil-scroll-container">
                <slot name="body"></slot>
              </div>
            </div>
            <slot name="before-footer"></slot>
            <slot name="footer" :has-submit-btn="hasSubmitBtn">
              <footer
                v-if="hasSubmitBtn === 'yes' && !isLoading"
                slot="footer"
                class="popup_footer__2pUrl clearfix"
              >
                <div class="popup_footerRight__qvdP6">
                  <wil-link
                    wrapper-classes="wil-btn wil-btn--gray wil-btn--sm wil-btn--round"
                    @click="closePopup"
                    :btn-name="cancelBtnName | filterTranslation(cancelBtnName)"
                  />
                  <wil-link
                    wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
                    @click="handleSubmit"
                    :btn-name="submitBtnName | filterTranslation(submitBtnName)"
                  />
                </div>
              </footer>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<style scoped>
.fade-shrink-in-enter-active,
.fade-shrink-in-leave-active {
  transition: all 0.3s ease;
}

.fade-shrink-in-enter,
.fade-shrink-in-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
<script lang="javascript">
export default {
  name: "wil-popup",
  props: {
    id: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    wrapperClass: {
      type: String,
      default:
        "popup_module__3M-0- pos-f-full popup_md__3El3k popup_mobile-full__1hyc4"
    },
    wrapperClasses: {
      type: String,
      default: ""
    },
    isOpen: {
      type: Boolean,
      default: false,
      required: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasSubmitBtn: {
      type: String,
      default: "yes"
    },
    submitBtnName: {
      type: String,
      default: "submit"
    },
    cancelBtnName: {
      type: String,
      default: "cancel"
    }
  },
  computed: {
    parseWrapperClasses() {
      return `${this.wrapperClasses} ${this.wrapperClass} active`;
    }
  },
  methods: {
    handleSubmit() {
      this.$emit("submit");
    },
    closePopup() {
      this.removeDisabledScroll();
      this.$emit("close");
    },
    removeDisabledScroll() {
      if (WilCityHelpers.isMobile()) {
        document.body.classList.remove("disabled-scroll");
      }
    },
    perfectScrollbar() {
      if (WilCityHelpers.isMobile()) {
        return false;
      }

      this.$nextTick(function() {
        let scrollBar = document
          .getElementById(this.id)
          .querySelector(".wil-scroll-bar");
        if (scrollBar === null) {
          return false;
        }
        new PerfectScrollbar(scrollBar);
      });
    }
  },
  watch: {
    isOpen: {
      handler(isOpen) {
        if (isOpen) {
          this.perfectScrollbar();
        }
      },
      immediate: true
    }
  }
};
</script>
