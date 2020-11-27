export default class StripeSCA {
  constructor(sessionID) {
    this.sessionID = sessionID;
    this.proceedPayment();
  }

  proceedPayment() {
    const oStripe = Stripe(WILCITY_GLOBAL.oStripe.publishableKey)
    oStripe.redirectToCheckout({
      sessionId: this.sessionID
    }).then(result => {
      console.log(result)
    })
  }
}
