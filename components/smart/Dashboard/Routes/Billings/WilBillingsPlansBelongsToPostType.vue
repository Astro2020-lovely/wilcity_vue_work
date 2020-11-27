<template>
  <div class="pos-r mb-20" style="min-height: 100px;">
    <content-placeholders v-if="isLoading">
      <content-placeholders-text :lines="4" />
    </content-placeholders>
    <div style="background-color: #fff">
      <wil-alert v-if="msg.length" :icon="msgIcon" :status="msgStatus" :msg="msg" />
    </div>
    <div class="accordion-01__module">
      <div
        v-for="oPlan in aPlans"
        :key="`plan-item-${oPlan.ID}`"
        :class="accordionItemClass(oPlan.ID)"
        @click="changedPlan(oPlan.ID)"
      >
        <div class="accordion-01_header__3kIN7 clearfix">
          <div class="accordion-01_left__1Zbu7">
            <div class="accordion-01_icon__FnEY_ wil-float-left">
              <div class="check-icon">
                <i class="la la-check"></i>
              </div>
            </div>
            <div class="accordion-01_header__3kIN7 wil-float-left">
              <h2 class="accordion-01_title__1c6IK color-primary" v-html="oPlan.postTitle"></h2>
              <ul class="accordion-01_listMeta__1g_bH list-none">
                <li v-if="oPlan.remainingItems">
                  <span class="tag-mini" v-html="oPlan.remainingItems"></span>
                </li>
                <li>
                  <span class="tag-mini color-02" v-html="oPlan.availability"></span>
                </li>
                <li v-if="oPlan.trialPeriod">
                  <span class="tag-mini color-3" v-html="oPlan.trialPeriod"></span>
                </li>
              </ul>
            </div>
          </div>

          <div class="accordion-01_right__5GiFw">
            <div class="accordion-01_price__Gk3w2 color-primary">
              <span class="accordion-01_amount__6ZqpY" v-html="oPlan.price"></span>
              <sub class="accordion-01_period__1XSEg" v-html="oPlan.period"></sub>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "wil-billings-plans-belongs-to-post-type",
  data() {
    return {
      isLoading: false,
      aPlans: [],
      aCachePlans: [],
      msgIcon: "la la-smile-o",
      msg: "",
      msgStatus: "success",
      isUsingWooCommerce: false,
      currentPlanID: this.oArgs.planID,
      paymentID: parseInt(this.oArgs.paymentID, 10),
      newPlanID: null
    };
  },
  props: {
    oArgs: {
      type: Object
    },
    gateway: {
      type: String
    }
  },
  watch: {
    newPlanID: function(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    this.fetchPlans();
  },
  methods: {
    accordionItemClass(planID) {
      return {
        "accordion-01_item__cM-3Z": 1 === 1,
        active: this.newPlanID == planID,
        disable: this.currentPlanID == planID
      };
    },
    changedPlan(planID) {
      this.newPlanID = planID;
    },
    fetchPlans() {
      this.isLoading = true;
      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_post_type_plans&paymentID=${this.paymentID}&currentGateway=${this.gateway}`
      })
        .then(response => {
          if (!response.data.success) {
            this.msgIcon = "la la-frown-o";
            this.msgStatus = "danger";
            this.msg = response.data.data.msg;
          } else {
            this.aPlans = response.data.data.aPlans;
            if (response.data.data.isUsingWooCommerce) {
              this.isUsingWooCommerce = true;
              this.currentGateway = "woocommerce";
            }
          }
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
