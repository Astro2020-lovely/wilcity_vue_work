export default {
  setPaymentID(state, paymentID) {
    state.paymentID = paymentID;
  },
  calledSubscription(state, paymentID) {
    state.calledSubscription = paymentID;
  }
}
