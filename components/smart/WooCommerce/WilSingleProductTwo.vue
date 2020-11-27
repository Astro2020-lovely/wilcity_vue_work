<template>
  <div :class="[wrapperClasses, extraWrapperClasses]">
    <div class="product-lists_item__3yMKp">
      <slot name="thumbnail" v-bind:products="slotData">
        <div v-if="product.thumbnail" class="product-lists_thumb__2XLKr">
          <div
            class="product-lists_img__35Liu bg-cover"
            :style="productListingImgStyles"
            @click="handleClick(product)"
          ></div>
        </div>
      </slot>
      <slot name="info" v-bind:products="slotData">
        <div class="product-lists_meta__1YMSG">
          <h3><a :href="product.link" v-html="product.title"></a></h3>
          <div class="starRating_module__w77sS">
            <div
              v-if="product.averageRating > 0"
              class="starRating_point__12mp0"
              v-html="product.averageRating"
            ></div>
            <div
              class="starRating_data__xAaEP"
              :data-rating="product.dataAverageRating"
            >
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
            <div class="starRating_text__3_CO9"></div>
          </div>
          <div class="product-lists_price__1rg2p">
            <ins
              ><span
                class="amount color-primary"
                v-html="product.priceHTML"
              ></span
            ></ins>
          </div>
        </div>
      </slot>
      <wil-checkbox
        :value="selected"
        @change="toggleSelection"
        wrapper-classes="checkbox_module__1K5IS checkbox_circleRound__1-GdQ js-checkbox"
      />
    </div>
  </div>
</template>
<style scoped>
.woocommerce-Price-currencySymbol {
  color: #f06292 !important;
}
</style>
<script lang="javascript">
export default {
  name: "wil-single-product-two", // style 2
  data() {
    return {
      touched: false
    }
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: {}
    },
    wrapperClasses: {
      type: String,
      default: 'col-xs-12 col-sm-12 col-md-6 col-lg-6'
    },
    extraWrapperClasses: {
      type: String,
      default: ''
    },
    value: {
      type: String | Number,
      default: '',
      description: "Whether checkbox is checked"
    }
  },
  methods: {
    handleClick(product) {
      window.location.replace(product.link);
    },
    toggleSelection(status) {
      this.selected = status;
    }
  },
  computed: {
    productListingImgStyles() {
      return {
        'backgroundImage': `url(${this.product.thumbnail})`,
        'cursor': 'pointer',
      }
    },
    slotData() {
      return {
        ...this.products,
        selected: this.selected
      };
    },
    selected: {
      get() {
        return this.value;
      },
      set(status) {
        this.$emit("change", status);
      }
    }
  }
}
</script>
