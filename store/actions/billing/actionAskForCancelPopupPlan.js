export const actionAskForCancelPopupPlan = function ({commit}, status) {
  commit('setAskForCancelPlanPopupStatus', status, {root: true});
};
