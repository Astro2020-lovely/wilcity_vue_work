import ToggleLoadingBtn from './ToggleLoadingBtn.js'
import StripeSCA from './StripeSCA.js'
import WilokeSubmitCouponCode from './WilokeSubmitCouponCode.js'

function proceedPayment() {
  jQuery(document).on('click', '.wilcity-gateway-box', function (event) {
    const $this = jQuery(event.currentTarget)
    event.preventDefault()

    const oData = {
      couponCode: jQuery('#wilcity-valid-coupon-code').attr('value'),
      gateway: $this.data('gateway'),
      action: 'wiloke_submission_purchase_add_listing_plan'
    }
    new ToggleLoadingBtn($this)

    this.xhr = jQuery.ajax({
      type: 'POST',
      data: oData,
      url: WILOKE_GLOBAL.ajaxurl,
      success: (response => {
        if (response.success) {
          switch ($this.data('gateway')) {
            case 'stripe':
              new StripeSCA(response.data.sessionID)
              break
            case 'paypal':
              window.location.href = response.data.redirectTo
              break
            case 'banktransfer':
              window.location.href = response.data.redirectTo
              break
          }
        } else {
          jQuery('#wilcity-print-msg').trigger('printErrMsg', [response.data.msg])
        }

        new ToggleLoadingBtn($this)
      })
    })
  });

  jQuery('.wilcity-gateway-box').removeClass('disable')
}

jQuery(document).ready(function ($) {
  proceedPayment()
  new WilokeSubmitCouponCode()
})
