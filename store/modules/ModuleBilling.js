import getterBilling from './../getters/getterBilling'
import mutationBilling from './../mutations/mutationBilling'

import {actionAskForCancelPopupPlan} from  './../actions/billing/actionAskForCancelPopupPlan'
import {actionSetPaymentID} from  './../actions/billing/actionSetPaymentID'
import {actionCancelledSubscription} from  './../actions/billing/actionCancelledSubscription'

export const ModuleBilling = {
  namespaced: true,
  state: {
    paymentID: null,
    calledSubscription: null
  },
  getters: {
    ...getterBilling
  },
  actions: {
    actionAskForCancelPopupPlan,
    actionSetPaymentID,
    actionCancelledSubscription
  },
  mutations: {
    ...mutationBilling
  }
}
