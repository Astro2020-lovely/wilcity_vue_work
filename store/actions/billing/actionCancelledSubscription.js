export const actionCancelledSubscription = function({commit}, paymentID) {
  commit('calledSubscription', paymentID);
}
