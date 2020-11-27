export default class AddListingData {
  static configuration() {
    return {
      // planID: jQuery('#wilcity-plan-id').val(),
      couponCode: jQuery('#wilcity-valid-coupon-code').attr('value')
    };
  }
}
