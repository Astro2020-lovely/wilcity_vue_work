<template>
  <wil-popup
    id="wil-promotion-popup"
    :is-open="true"
    @close="closePopup"
    icon="la la la-bullhorn"
    :title="'Boost Post' | filterTranslation('boostPost')"
  >
    <div slot="body" style="min-height: 90px;">
      <wil-block-loading :is-loading="isLoading" />
      <wil-alert v-if="msg.length" :msg="msg" :type="msgType" />
      <div v-if="plans.length" v-show="!isLoading">
        <div class="promo-item_module__24ZhT">
          <div class="promo-item_group__2ZJhC">
            <h3 class="promo-item_title__3hfHG">
              {{
                "Select your promotion plans"
                  | filterTranslation("selectAdsPosition")
              }}
            </h3>
            <p class="promo-item_description__2nc26">
              {{
                "Boost this post to a specify positions on the website"
                  | filterTranslation("selectAdsDesc")
              }}
            </p>
          </div>
        </div>
        <div class="row" data-col-xs-gap="20">
          <div
            v-for="(plan, index) in plans"
            :class="{
              'col-md-4 col-lg-4': 1 == 1,
              'disable promotion is-available': plan.isUsing == 'yes'
            }"
            :key="index"
          >
            <wil-img-checkbox
              :preview="plan.preview"
              :desc="renderDesc(plan)"
              :label="renderName(plan.name, plan.price)"
              v-on="{ change: updatePromotion(plan, index) }"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      slot="before-footer"
      v-if="oPaymentGateways"
      :class="paymentGatewayWrapperClass"
    >
      <div
        v-for="(gatewayName, gateway) in oPaymentGateways"
        :class="paymentGatewayWrapper"
        :key="gateway"
      >
        <div class="image-radio-checkbox_module__29DK2">
          <label class="image-radio-checkbox_inner__1VI-d">
            <input type="radio" v-model="selectedGateway" :value="gateway" />
            <div class="image-radio-checkbox_img__1_YKz">
              <div :class="paymentClassItem(gateway)">
                <a @click.prevent="payVia(gateway)" href="#">
                  <div class="icon-box-2_icon__ZqobK">
                    <i :class="paymentIcon(gateway)"></i>
                  </div>
                  <p class="icon-box-2_content__1J1Eb" v-html="gatewayName"></p>
                </a>
              </div>
              <div class="image-radio-checkbox_icon__1LtKv">
                <i class="la la-check"></i>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <footer
      v-show="!isLoading"
      slot="footer"
      class="popup_footer__2pUrl clearfix"
    >
      <div v-if="tax > 0" class="float-left mr-10">
        <span>{{ "Sub Total" | filterTranslation("subTotal") }}</span>
        <span v-html="parseRenderPrice(subTotal)"></span>
      </div>
      <div v-if="tax > 0" class="float-left mr-10">
        <span v-html="parseTaxTitle">:</span>
        <span v-html="parseRenderPrice(tax)"></span>
      </div>
      <div class="float-left mr-10">
        <span>{{ "Total" | filterTranslation("totalLabel") }}:</span>
        <span v-html="parseRenderPrice(total)"></span>
      </div>
      <div class="popup_footerRight__qvdP6">
        <wil-link
          @click="closePopup"
          wrapper-classes="wil-btn wil-btn--gray wil-btn--sm wil-btn--round"
          :btn-name="'Cancel' | filterTranslation('cancel')"
        />
        <wil-link
          @click="prepareBoostPost"
          wrapper-classes="wil-btn wil-btn--primary wil-btn--sm wil-btn--round"
          :is-loading="isSubmitting"
          :btn-name="'Boost Now' | filterTranslation('boostSaleBtn')"
        />
      </div>
    </footer>
  </wil-popup>
</template>
<script>
import WilokeImgCheckbox from "./../../dumbs/WilImgCheckbox.vue";
import StripeSCA from "./../../../StripeSCA.js";
import { formData } from "./../../../mixins/FormHelper";
import { Money } from "./../../../mixins/Money";

export default {
  name: "wil-promotion-popup",
  mixins: [formData, Money],
  data() {
    return {
      msg: "",
      msgType: "",
      selectedGateway: "",
      currencySymbol: "",
      currencyPosition: "",
      discount: 0,
      taxRate: 0,
      taxTitle: "",
      subTotal: 0,
      xhr: null,
      plans: [],
      selectedPlans: [],
      oPaymentGateways: null,
      aWooCommerceIDs: [],
      oStripe: {},
      oStripeData: {},
      isLoading: true,
      isSubmitting: false,
      isUsingWooCommerce: false
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    postId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isOpen: {
      handler(status) {
        if (status) {
          this.fetchPlans();
          this.fetchPaymentGateways();
        }
      },
      immediate: true
    }
  },
  computed: {
    parseTaxTitle() {
      return this.$options.filters.filterTranslation(this.taxTitle);
    },
    paymentGatewayWrapperClass() {
      return this.selectedPlans.length
        ? "row payment-gateways active"
        : "row payment-gateways";
    },
    tax() {
      if (this.isUsingWooCommerce) {
        return 0;
      }

      return ((this.subTotal - this.discount) * this.taxRate) / 100;
    },
    total() {
      return this.subTotal - this.discount + this.tax;
    },
    paymentGatewayWrapper() {
      let count =
        this.oPaymentGateways === null
          ? 0
          : Object.values(this.oPaymentGateways).length;
      if (count === 1) {
        return "col-md-12 col-lg-12";
      } else if (count === 2) {
        return "col-md-6 col-lg-6";
      } else {
        return "col-md-4 col-lg-4";
      }
    }
  },
  components: {
    WilokeImgCheckbox
  },
  methods: {
    parseRenderPrice(price) {
      price = parseFloat(price, 10);
      return this.renderPrice(
        price.toFixed(2),
        this.currencySymbol,
        this.currencyPosition
      );
    },
    addProductsToCart(resolve, reject) {
      if (this.aWooCommerceIDs.length === 0) {
        resolve(true);
      }

      let self = this,
        productID = this.aWooCommerceIDs.shift(),
        oData = {
          product_id: productID,
          quantity: 1
        };

      jQuery.post(
        wc_add_to_cart_params.wc_ajax_url
          .toString()
          .replace("%%endpoint%%", "add_to_cart"),
        oData,
        function(response) {
          if (!response) {
            reject(WILCITY_I18.couldNotAddProduct);
          }

          if (response.error) {
            reject(WILCITY_I18.couldNotAddProduct);
          }

          self.addProductsToCart(resolve, reject);
        }
      );
    },
    paymentClassItem(gateway) {
      return (
        "icon-box-2_module__AWd3Y wil-text-center bg-color-" +
        gateway.toLowerCase()
      );
    },
    paymentIcon(gateway) {
      gateway = gateway.toLowerCase();

      if (gateway === "banktransfer" || gateway === "woocommerce") {
        gateway = "la la-money";
      } else {
        gateway = "la la-cc-" + gateway;
      }

      return gateway;
    },
    renderName(name, price) {
      return (
        name +
        " - " +
        this.renderPrice(price, this.currencySymbol, this.currencyPosition)
      );
    },
    renderDesc(oPlan) {
      if (typeof oPlan.expiry !== "undefined") {
        return oPlan.expiry;
      }

      if (oPlan.duration !== "") {
        return;
        `${this.$options.filters.filterTranslation(
          "Promotion Duration:",
          "promotionDuration"
        )} ${oPlan.duration} ${
          oPlan.duration > 1
            ? this.$options.filters.filterTranslation("days", "days")
            : this.$options.filters.filterTranslation("day", "day")
        }
        `;
      }
      return "";
    },
    closePopup() {
      this.plans = [];
      this.$emit("close");
    },
    afterStripeGetToken(token) {
      this.oStripeData.token = token.id;
      this.oStripeData.email = token.email;
    },
    showStripePopup() {
      this.oStripeData = {};
      this.oStripe.open({
        name: WILCITY_GLOBAL.oGeneral.brandName,
        zipCode: false,
        closed: () => {
          this.isSubmitting = false;
        },
        token: token => {
          this.afterStripeGetToken(token);
          this.tokenTriggered = true;
          this.processing();
        }
      });
    },
    prepareBoostPost() {
      if (!this.selectedPlans.length) {
        return false;
      }

      this.processing();
    },
    processing() {
      this.isSubmitting = true;
      const data = this.createFormData({
        action: "wilcity_boost_listing",
        gateway: this.selectedGateway,
        aPlans: JSON.stringify(this.plans),
        postID: this.postId,
        oStripeData: JSON.stringify(this.oStripeData)
      });

      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data,
        success: response => {
          this.isSubmitting = false;
        }
      })
        .then(response => {
          if (response.data.data.gateway === "stripe") {
            new StripeSCA(response.data.data.sessionID);
          } else {
            if (response.data.success) {
              if (response.data.data.redirectTo) {
                window.location.replace(response.data.data.redirectTo);
              } else if (response.data.data.productIDs) {
                this.aWooCommerceIDs = response.data.data.productIDs;
                let promise = new Promise((resolve, reject) => {
                  this.addProductsToCart(resolve, reject);
                }).then(
                  resolved => {
                    window.location.replace(response.data.data.cartUrl);
                  },
                  error => {
                    this.msgType = "danger";
                    this.msg = error;
                  }
                );
              } else {
                this.msg = response.data.data.msg;
                this.msgType = "success";
                setTimeout(() => {
                  this.closePopup();
                }, 3000);
              }
            } else {
              this.msg = response.data.data.msg;
              this.msgType = "danger";
              this.selectedPlans = [];
            }
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isSubmitting = false;
        });
    },
    updatePromotion(oPlan, index) {
      return value => {
        this.plans[index].value = value;

        if (value === "yes") {
          this.subTotal = this.subTotal + parseFloat(oPlan.price);
          this.selectedPlans = [...this.selectedPlans, oPlan.position];
        } else {
          this.subTotal = this.subTotal - parseFloat(oPlan.price);
          const order = this.selectedPlans.indexOf(oPlan.position);
          this.selectedPlans = this.arrDeleteItem(order, this.selectedPlans);
        }
      };
    },
    fetchPlans() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_fetch_promotion_plans&postID=${this.postId}`
      })
        .then(response => {
          const data = { ...response.data.data };
          this.plans = Object.values(data.plans);
          this.currencySymbol = data.symbol;
          this.currencyPosition = data.position;
          this.taxRate = data.taxRate;
          this.taxTitle = data.taxTitle;
          this.selectedPlans = [];
        })
        .finally(() => {
          this.isLoading = false;
          this.isSubmitting = false;
        });
    },
    fetchPaymentGateways() {
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_get_payment_gateways`
      })
        .then(response => {
          if (!response.data.success) {
            if (!response.data.data.doNotShowMessage) {
              this.msg = response.data.data.msg;
            } else {
              this.isUsingWooCommerce = true;
            }
          } else {
            this.oPaymentGateways = response.data.data;
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isSubmitting = false;
        });
    }
  }
};
</script>
