import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';
Vue.use(Vuex);
import {ModuleMessage} from './modules/ModuleMessage.js';
import {ModuleBilling} from './modules/ModuleBilling.js';
import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';
import MyGeocoder from './MyGeocoder.js';
import ModuleReviews from './modules/ModuleReviews.js';
import ModuleTerms from './modules/ModuleTerms.js';
import ModuleSearchForm from './modules/ModuleSearchForm.js';
import ModuleGallerySlideShow from './modules/ModuleGallerySlideShow.js';
import ModuleUser from './modules/ModuleUser.js';
import createLogger from './../plugins/logger.js'
const debug = process.env.NODE_ENV !== 'production';

export const store = new Vuex.Store({
    strict: debug,
    modules: {
        ModuleMessage,
        ModuleBilling,
        MyGeocoder,
        ModuleSearchForm,
        ModuleGallerySlideShow,
        // ModuleSingleListing,
        ModuleUser,
        ModuleReviews,
        ModuleTerms
    },
    state: {
        oPopupStatus: {
            'coupon-popup': 'close',
            'signin-popup': 'close',
            'message-popup': 'close',
            'claim-popup': 'close',
            'add-photos-videos-popup': 'close',
            'search-form-popup': 'close',
            'delete-review-popup': 'close',
            'report-popup': 'close',
            'write-a-review-popup': 'close',
            'quick-search-form-popup': 'close',
            'ask-delete-author-message-popup': 'close',
            'ask-delete-single-message-popup': 'close',
            'ask-for-open-cancel-plan': 'close',
            'ask-for-cancel-plan': 'close',
            'promotion-popup': 'close'
        },
        currentListingTab: '',
        defaultComponentOfRegisterLogin: 'login',
        oSettingTabs: {
            currentTab: 'general'
        },
        oNavTab: {
            current: 'home'
        },
        oSingleGallery: {
            id: '',
            aImages: []
        },
        oPopUpArgs: {
            'signin-popup': {},
            'report-popup': {},
            'message-popup': {},
            'claim-popup': {},
            'add-photos-videos-popup': {},
            'wilcity-search-form-popcd up': {},
            'delete-review-popup': {},
            'write-a-review-popup': {},
            'wilcity-review-info': {},
            'coupon-popup': {}
        },
        oTemporaryCacheTerm: {},
        oReviewsInfo: {},
        compareTimeout: 100,
        aRequireLoggedIn: [
            'add-photos-videos-popup', 'message-popup'
        ],
        aReviews: [],
        oSearchArgs: {},
        oDefaultSearchArgs: {},
        postType: '',
        isFocusRefresh: false,
        maxPages: 0,
        foundPosts: 0,
        currentPage: 1,
        postsPerPage: 0,
        isFocusUpdateSelect2: false,
        elMouseOn: null,
        isSearchAsIMoveTheMap: false,
        aNewListings: [],
        oTermOptions: {},
        aNewBusinessHoursOptions: {
            cId: '',
            aHours: []
        },
        aSingleClickedSection: {},
        aIcons: [],
        oSearchFields: {},
        oPlanSettings: typeof WILCITY_ADDLISTING_INLINE !== 'undefined' && WILCITY_ADDLISTING_INLINE.aPlanSettings !== 'undefined' ? WILCITY_ADDLISTING_INLINE.aPlanSettings : {},
        aQuickSearchFormSuggestions: [],
        oTagsBelongsToCat: {},
        selectedCat: null,
        timeout: 4000,
        aSelect2Store: [],
        aCacheSearchArgs: {},
        // dashboard,
        eventTab: 'upcoming',
        tab: '',
        aXHR: {},
        aListings: {},
        aAuthorsInfo: {},
        oReceiverProfile: {},
        fetching: '',
        authorMessageID: '',
        query: {},
        dashboardTimeout: 0,
        messageDetailClass: '',
        oUserProfile: {
            display_name: '',
            avatar: ''
        },
        firebaseUserID: '',
        oDeleteAuthorInfo: {},
        oAddListingVal: {},
        oCheckboxVals: {},
        defaultPostType: WILOKE_GLOBAL.defaultPostType,
        defaultPostTypeExcerptEvent: WILOKE_GLOBAL.defaultPostTypeExcerptEvent,
        oChatWith: {},
        templateStyle: '',
        oSingleListingTabs: {},
        oListingPlanSettings: {},
        aPostsNotIn: []
    },
    mutations: {
        ...mutations
    },
    getters: {
        ...getters
    },
    actions: {
        ...actions
    },
    plugins: debug ? [createLogger()] : []
});
