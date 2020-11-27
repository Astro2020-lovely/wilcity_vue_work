<template>
  <div v-if="products.length" :class="wrapperClasses">
    <wil-heading
      v-if="settings.name && settings.isShowBoxTitle === 'yes'"
      :heading="settings.name"
    />

    <div :class="[productsWrapperClasses, 'pos-r']">
      <wil-block-loading :is-loading="isSubmitting" />
      <div class="product-lists_module__3LNpm">
        <div class="row">
          <slot name="products">
            <wil-single-product-two
              v-for="product in products"
              :key="generateProductKey(product)"
              :product="product"
              :extra-wrapper-classes="productClasses(product.ID)"
              :value="getProductValue(product)"
              v-on="{ change: handleSelectedProducts(product) }"
            />
          </slot>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div
              class="product-lists_total__1AWzE"
              style="justify-content: flex-end"
            >
              <div class="product-lists_subtotal__1wxM9" v-if="total > 0">
                <span v-html="totalLabel"></span>:
                <span class="color-primary d-inline-block ml-10">
                  <del
                    v-if="subTotal > total"
                    class="woocommerce-del-price"
                    v-html="renderPriceHTML(subTotal, true)"
                  ></del>
                </span>
                <ins
                  ><span
                    class="color-primary d-inline-block ml-10"
                    v-html="renderPriceHTML(total)"
                  ></span
                ></ins>
              </div>
              <div class="product-lists_action__3HTzH float-right">
                <wil-link
                  :wrapper-classes="viewCartClasses"
                  size="sm"
                  variation="info"
                  icon="la la-shopping-cart"
                  @click.prevent="redirectToViewCart"
                  :btn-name="viewCartLabel"
                />
                <wil-link
                  :wrapper-classes="checkoutClasses"
                  size="sm"
                  variation="primary"
                  icon="la la-paper-plane"
                  :btn-name="checkoutLabel"
                  @click.prevent="handlePrepareCheckout"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <portal v-if="isShowCheckoutPopup" to="wil-modal">
      <wil-checkout-popup
        @close="handleClosePopup"
        @submit="handleDirectlyCheckout"
        :is-open="isShowCheckoutPopup"
        :is-loading="isSubmitting"
        :popup-fields="popupFields"
        :msg="msg"
        :title="checkoutText"
      ></wil-checkout-popup>
    </portal>
  </div>
</template>
<script lang="javascript">
export default {
  data() {
    return {
      msg: {},
      products: [],
      selectedProducts: [],
      total: 0,
      subTotal: 0,
      regularPrice: null,
      currencySymbol: '',
      numDecimals: 2,
      thousandSep: ',',
      currencyPos: 'left',
      isSubmitting: false,
      isDisableBtn: false,
      workingOnProducts: [],
      isShowCheckoutPopup: false,
      popupFields: {}
    };
  },
  watch: {
    products: {
      handler() {
        this.priceCalculation();
      },
      deep: true
    }
  },
  computed: {
    checkoutText() {
      return this.$options.filters.filterTranslation('Checkout');
    },
    viewCartClasses() {
      let classes = 'wil-btn mr-10 wil-btn--info wil-btn--round wil-btn--sm';
      if (this.total === 0 || this.isDisableBtn) {
        classes += ' disabled';
      }
      return classes;
    },
    checkoutClasses() {
      let classes = 'wil-btn wil-btn--primary wil-btn--round wil-btn--sm';
      if (this.total === 0 || this.isDisableBtn) {
        classes += ' disabled';
      }
      return classes;
    }
  },
  props: {
    checkoutType: {
      type: String,
      default: 'redirect', // there are 2 types: redirect means go to WooCommerce Checkout page or popup
      // means Checkout popup
      required: false
    },
    wrapperClasses: {
      type: String,
      default: 'content-box_module__333d9',
      required: false
    },
    settings: {
      type: Object,
      required: false,
      default: {},
      description: 'General settings'
    },
    isShowIfEmpty: {
      type: String,
      default: 'no',
      required: false
    },
    postId: {
      type: Number,
      required: true
    },
    totalLabel: {
      type: String,
      default: ''
    },
    viewCartLabel: {
      type: String,
      default: ''
    },
    checkoutLabel: {
      type: String,
      default: ''
    },
    cartUrl: {
      type: String,
      default: ''
    },
    checkoutUrl: {
      type: String,
      default: ''
    },
    productsWrapperClasses: {
      type: String,
      default: 'content-box_body__3tSRB',
      required: false
    }
  },
  components: {
    WilSingleProductTwo: () => import (
        /* webpackPreload: true */
        /* webpackChunkName: "WilSingleProductTwo" */
            './WilSingleProductTwo.vue'
    ),
     WilCheckoutPopup: () => import (
        /* webpackPreload: true */
        /* webpackPrefetch: true */
        /* webpackChunkName: "WilCheckoutPopup" */
            './WilCheckoutPopup.vue'
    )
  },
  methods: {
    handleDirectlyCheckout(customerInfo) {
      this.isSubmitting = true;
      const data = WilQueryHelper.buildFormData({
        action: 'wilcity_directly_order',
        products: JSON.stringify(this.selectedProducts),
        customerInfo: JSON.stringify(customerInfo),
        security: WILOKE_INLINE_GLOBAL.security
      });

      Vue.axios({
        method: 'POST',
        url: WILOKE_GLOBAL.ajaxurl,
        data,
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        }
      }).then(response => {
        if (response.data.success) {
          this.isShowCheckoutPopup = true;
          this.msg = {
            type: "success",
            heading: response.data.data.heading,
            msg: response.data.data.msg,
          };

          setTimeout(() => {
            this.isShowCheckoutPopup = false;
            this.msg = {};
          }, 5000);
        } else {
          this.msg = {
            type: "danger",
            msg: response.data.data.msg
          };
        }
      }).finally(() => {
        this.isSubmitting = false;
      });
    },
    handleClosePopup() {
      this.isShowCheckoutPopup = false;
    },
    redirectToViewCart() {
      window.location.href = this.cartUrl;
    },
    removeWorkingOnProduct(productID) {
      this.workingOnProducts = this.workingOnProducts.filter(id => id !== productID);
    },
    priceCalculation() {
      if (this.products) {
        const totalProduct = this.products.length;
        this.total = 0;
        this.subTotal = 0;
        this.selectedProducts = [];
        for (let i = 0; i < totalProduct; i++) {
          if (this.products[i].cartKey) {
            this.total = this.total + this.products[i].price;
            this.subTotal = this.subTotal + this.products[i].regularPrice;
            const {cartKey, ID} = this.products[i];
            this.selectedProducts = [ ...this.selectedProducts, {cartKey, ID} ];
          }
        }
      }
    },
    addProductToCart(productID) {
      this.isDisableBtn = true;
      const order = this.products.findIndex(product => {
        return product.ID == productID;
      });
      this.workingOnProducts = [...this.workingOnProducts, productID];

      jQuery.ajax({
        type: 'POST',
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: 'add_product_to_cart',
          security: WILOKE_INLINE_GLOBAL.security,
          productID: productID
        },
        success: (oResponse => {
          if (!oResponse.success) {
            alert(oResponse.data.msg);
          } else {
            let oUpdatedProduct = {...this.products[order]};
            oUpdatedProduct = {
              ...oUpdatedProduct, ...{
                cartKey: oResponse.data.cartKey
              }
            };
            this.products = [
              ...this.products.slice(0, order),
              oUpdatedProduct,
              ...this.products.slice(order + 1)
            ];
            this.removeWorkingOnProduct(productID);
          }
        })
      }).always(() => {
        this.isDisableBtn = false;
      });
    },
    removeProductFromCart(cartKey, productID) {
      this.isDisableBtn = true;
      this.workingOnProducts = [...this.workingOnProducts, productID];

      jQuery.ajax({
        type: 'POST',
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: 'remove_product_to_cart',
          security: WILOKE_INLINE_GLOBAL.security,
          cartKey
        },
        success: (oResponse => {
          if (!oResponse.success) {
            alert(oResponse.data.msg);
          } else {
            this.products = this.products.map(item => {
              if (item.cartKey === cartKey) {
                delete item.cartKey;
              }

              return item;
            });

            this.removeWorkingOnProduct(productID);
          }
        })
      }).always(() => {
        this.isDisableBtn = false;
      });
    },
    getProductValue(product) {
      return product.cartKey ? 'yes' : 'no';
    },
    renderPriceHTML(price, isDel) {
      price = price.toFixed(this.numDecimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + this.thousandSep);
      let currencyHTML = '';
      if (typeof isDel === 'undefined') {
        currencyHTML = `<span class="woocommerce-Price-currencySymbol color-primary">${this.currencySymbol}<span>`;
      } else {
        currencyHTML = `<span class="woocommerce-Price-currencySymbol color-primary"
              style="text-decoration:line-through">${this.currencySymbol}<span>`;
      }
      switch (this.currencyPos) {
        case 'left':
          price = currencyHTML + price;
          break;
        case 'right':
          price = price + currencyHTML;
          break;
        case 'left_space':
          price = currencyHTML + ' ' + price;
          break;
        case 'right_space':
          price = price + ' ' + currencyHTML;
          break;
      }

      return '<span class="woocommerce-Price-amount amount">' + price + '<span>';
    },
    generateProductKey(product) {
      return 'single-product-id-' + product.ID;
    },
    productClasses(productID) {
      return this.workingOnProducts.includes(productID) ? 'disabled' : '';
    },
    fetchProducts() {
      Vue.axios({
        method: 'GET',
        url:  `${WILOKE_GLOBAL.restAPI}listing-products/${this.postId}`
      }).then(response => {
          if (response.data.status === "success") {
            this.products = [ ...response.data.products ];
            this.currencySymbol = response.data.currencySymbol;
            this.numDecimals = response.data.numDecimals;
            this.thousandSep = response.data.thousandSep;
            this.currencyPos = response.data.currencyPos;
          }
      });
    },
    handleSelectedProducts(product) {
      return selected => {
        if (selected === 'yes') {
          const {cartKey, ID} = product;
          this.selectedProducts = [ ...this.selectedProducts, {cartKey, ID} ];
          this.total = this.total + product.price;
          this.subTotal = this.subTotal + product.regularPrice;
          this.addProductToCart(product.ID);
        } else {
          this.selectedProducts = this.selectedProducts.filter(productId => {
            return productId !== product.ID;
          });

          this.total = this.total - product.price;
          this.subTotal = this.subTotal - product.regularPrice;
          this.removeProductFromCart(product.cartKey, product.ID);
        }

        if (this.regularPrice === null) {
          this.regularPrice = product.regularPriceHTML;
        }
      }
    },
    handlePrepareCheckout() {
      if (this.checkoutType === 'redirect') {
        window.location.href = this.checkoutUrl;
      } else {
        if (WILOKE_INLINE_GLOBAL.isUserLoggedIn === 'yes') {
          this.handleDirectlyCheckout();
        } else {
          this.isShowCheckoutPopup = true;
        }
      }
    }
  },
  created() {
    this.fetchProducts();
  },
  mounted() {
    if (typeof WIL_ADVANCED_WOOCOMMERCE !== 'undefined') {
      this.popupFields = {...WIL_ADVANCED_WOOCOMMERCE.checkoutPopupFields};
    }
  }
}
</script>
