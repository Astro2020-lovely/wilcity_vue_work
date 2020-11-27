export default {
    setAskForCancelPlanToOpen(context) {
        context.commit('setAskForCancelPlan', 'open');
    },
    openPromotionPopup(context) {
        context.commit('promotion-popup', 'open');
    },
    closePromotionPopup(context) {
        context.commit('promotion-popup', 'close');
    },
    updateHeroSearchForm(context, oInfo) {
        context.commit('updateHeroSearchForm', oInfo);
    },
    // openRegisterLoginPopup(context) {
    //     context.commit('updateRegisterLoginPopupStatus', 'open');
    // },
    // setRegisterAsDefaultComponentOfRegisterLoginPopup(context) {
    //     context.commit('setDefaultComponentOfRegisterLoginPopup', 'register');
    // },
    // setLoginAsDefaultComponentOfRegisterLoginPopup(context) {
    //     context.commit('setDefaultComponentOfRegisterLoginPopup', 'login');
    // },
    // setLostPasswordAsDefaultComponentOfRegisterLoginPopup(context) {
    //     context.commit('setDefaultComponentOfRegisterLoginPopup', 'lost-password');
    // },
    // closeRegisterLoginPopup(context) {
    //     context.commit('updateRegisterLoginPopupStatus', 'close');
    // },
    closePopup(context, oPopupInfo) {
        context.commit('updatePopupStatus', oPopupInfo);
    },
    openSearchFormPopup(context) {
        context.commit('updatePopupStatus', {
            id: 'search-form-popup',
            status: 'open'
        });
    },
    closeSearchFormPopup(context) {
        context.commit('updatePopupStatus', {
            id: 'search-form-popup',
            status: 'close'
        });
    },
    // openQuickSearchFormPopup(context) {
    //     context.commit('updatePopupStatus', {
    //         id: 'quick-search-form-popup',
    //         status: 'open'
    //     });
    // },
    // closeQuickSearchFormPopup(context) {
    //     context.commit('updatePopupStatus', {
    //         id: 'quick-search-form-popup',
    //         status: 'close'
    //     });
    // }
}
