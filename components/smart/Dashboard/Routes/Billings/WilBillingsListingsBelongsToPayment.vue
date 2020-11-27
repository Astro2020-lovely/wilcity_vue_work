<template>
  <div class="accordion-01_collapse__TtEsI">
    <div class="row">
      <div>
        <div class="col-xs-12 col-sm-12">
          <wil-heading
            icon="la la-book"
            :heading="''|filterTranslation('listingsBelongToPayment')"
          />
          <p>
            <i>{{''|filterTranslation('leaveEmptyMeansUpgradeAll')}}</i>
          </p>
        </div>

        <div v-if="error" class="col-md-12 col-xs-12">
          <wil-alert :msg="error" status="danger" icon="la la-warning" />
        </div>

        <div v-else class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-6-clear col-lg-6-clear">
          <wil-checkbox
            v-for="item in aListings"
            :key="`listings-belong-to-payment-${item.ID}`"
            :label="renderPostTitle(item)"
            :true-value="item.ID"
            :value="inputVal(item.ID)"
            @change="handleFieldChange"
            wrapper-classes="checkbox__module checkbox__inline mb-20 js-checkbox"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "wil-billings-listings-belongs-to-payment",
  data() {
    return {
      aListings: [],
      aCheckedListings: [],
      error: ""
    };
  },
  props: {
    paymentId: {
      type: Number,
      required: true,
      default: 0
    },
    postId: {
      type: Number,
      required: false,
      default: 0
    }
  },
  watch: {
    paymentId: function(paymentId) {
      this.fetchListings(paymentId);
    },
    aCheckedListings: function(val) {
      this.$emit("change", val);
    }
  },
  created() {
    this.fetchListings(this.paymentId, this.postId);

    if (this.postId) {
      this.aCheckedListings.push(this.postId);
    }
  },
  methods: {
    renderPostTitle(oListing) {
      return oListing.postTitle + " (" + oListing.postStatus + ") ";
    },
    inputVal(listingID) {
      return this.aCheckedListings.indexOf(listingID) !== -1 ? listingID : "";
    },
    handleFieldChange(listingID) {
      return val => {
        if (val !== "no") {
          this.aCheckedListings = this.aCheckedListings.concat(listingID);
        } else {
          const order = this.aCheckedListings.indexOf(listingID);
          this.aCheckedListings = this.arrDeleteItem(
            order,
            this.aCheckedListings
          );
        }
      };
    },
    fetchListings(paymentID, postId) {
      console.log("fetching");
      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        cache: false,
        data: {
          action: "fetch_listings_in_payment_id",
          paymentID: paymentID,
          security: WILOKE_INLINE_GLOBAL.security,
          postID: postId
        },
        success: response => {
          if (response.success) {
            this.aListings = response.data.listings;
          } else {
            this.error = response.data.msg;
          }
        }
      });
    }
  }
};
</script>
