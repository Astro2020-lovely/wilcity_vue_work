if (document.getElementById("wilcity-become-an-author")) {
  WILOKE_GLOBAL.vmBecomeAnAuthor = new Vue({
    el: "#wilcity-become-an-author",
    data() {
      return {
        agreeToTerms: "no",
        agreeToPrivacyPolicy: "no",
        isSubmitting: false,
        isDisableBtn: false,
        isConfirmed: false
      };
    },
    computed: {
      btnClass() {
        return {
          disable:
            this.agreeToTerms !== "yes" ||
            this.agreeToPrivacyPolicy !== "yes" ||
            this.isDisableBtn,
          "wil-btn--loading": this.isSubmitting
        };
      }
    },
    methods: {
      submitBecomeAnAuthor() {
        this.isDisableBtn = false;
        this.isSubmitting = true;

        jQuery.ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: "wilcity_agree_become_to_author",
            agreeToTerms: this.agreeToTerms,
            agreeToPrivacyPolicy: this.agreeToPrivacyPolicy
          },
          success: response => {
            if (!response.success) {
              alert(response.data.msg);
            } else {
              if (response.data && response.data.redirectTo) {
                window.location.href = response.data.redirectTo;
              } else {
                if (WilCityHelpers.isMobile()) {
                  let body = jQuery("html, body");
                  body.stop().animate(
                    {
                      scrollTop: 0
                    },
                    500,
                    "swing"
                  );
                }
              }
              this.isConfirmed = true;
            }
            this.isSubmitting = false;
          }
        });
      }
    }
  });
}

function replaceBecomeAnAuthorIconOnMobile() {
  if (WilCityHelpers.isMobile()) {
    let $becomeAnAuthor = jQuery(".wilcity-become-an-author");
    if ($becomeAnAuthor.length) {
      $becomeAnAuthor.find(".la-user").attr("class", "la la-plus-circle");
    }
  }
}

jQuery(document).ready(function($) {
  replaceBecomeAnAuthorIconOnMobile();
});
