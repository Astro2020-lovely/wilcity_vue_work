import ToggleLoading from "./ToggleLoadingBtn.js";

export default class {
  constructor() {
    jQuery("#wilcity-submit-coupon").on("click", event => {
      event.preventDefault();
      let $target = jQuery(event.currentTarget),
        couponCode = jQuery("#wilcity-coupon-code").val(),
        $msg = jQuery("#wilcity-coupon-msg");

      if (couponCode === "") {
        return false;
      }

      new ToggleLoading($target);

      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wiloke_submission_verify_coupon",
          code: couponCode
        },
        success(response) {
          jQuery(".column-sub").html(response.data.subTotal);
          jQuery(".column-discount").html(response.data.discount);
          jQuery(".column-total").html(response.data.total);
          jQuery(".column-tax").html(response.data.tax);

          if (response.success) {
            jQuery("#wilcity-valid-coupon-code").attr("value", couponCode);
          } else {
            jQuery("#wilcity-valid-coupon-code").attr("value", "");
          }
          $msg.html('<div class="mt-20"></div>' + response.data.msg);
          new ToggleLoading($target);
        }
      });
    });
  }
}
