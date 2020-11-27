export default {
    getPostsNotIn(state) {
        return state.aPostsNotIn;
    },
    getSingleNavStatus(state, key) {
        return state[key];
    },
    getTemplateStyle(state) {
        return state.templateStyle;
    },
    getIsFocusRefresh(state) {
        return state.isFocusRefresh;
    },
    getCheckboxVal: state => key => {
        if (typeof state.oCheckboxVals[key] === 'undefined') {
            return false;
        }
        return state.oCheckboxVals[key];
    },
    getChatWithProfile(state) {
        return state.oChatWith;
    },
    getUserFirebaseUserID(state) {
        return state.firebaseUserID;
    },
    getDefaultPostType(state) {
        return state.defaultPostType;
    },
    defaultPostTypeExcerptEvent(state) {
        return state.defaultPostTypeExcerptEvent;
    },
    getAddListingVal: state => key => {
        if (typeof state.oAddListingVal[key] !== 'undefined') {
            return state.oAddListingVal[key];
        }

        return false;
    },
    getSearchArgsOfPostType: state => postType => {
        if (typeof state.aCacheSearchArgs[postType] !== 'undefined') {
            return state.aCacheSearchArgs[postType];
        }
        return false;
    },
    isFocusUpdateSelect2(state) {
        return state.isFocusUpdateSelect2;
    },
    getTimeout(state) {
        return state.timeout;
    },
    getTermOptions: (state) => (key) => {
        let rawTerms = localStorage.getItem(key);
        if (rawTerms === null || rawTerms === 'undefined') {
            return false;
        }

        let at = localStorage.getItem(key + '_at');
        return {terms: JSON.parse(rawTerms), at: at};
    },
    getSearchFormFields: state => key => {
        let fields = localStorage.getItem(key);
        if (fields === null || typeof fields === 'undefined') {
            return false;
        }

        let at = localStorage.getItem(key + '_at');
        return {fields: JSON.parse(fields), at: at};
    },
    getDefaultType(state) {
        return state.type;
    },
    getSelectedCat(state) {
        return state.selectedCat;
    },
    getTagsBelongsToCat: state => cat => {
        let catKey = null;
        if (typeof cat !== 'undefined' && cat !== null) {
            catKey = cat;
        } else {
            catKey = state.selectedCat
        }
        if (catKey === null) {
            return false;
        }
        return typeof state.oTagsBelongsToCat[catKey] !== 'undefined' ? state.oTagsBelongsToCat[catKey] : false;
    },
    getDefaultSearchFormArgs: (state) => (postType) => {
        if (typeof state.oDefaultSearchArgs[postType] !== 'undefined') {
            return state.oDefaultSearchArgs[postType];
        }
        return {};
    },
    getFoundPosts(state) {
        return state.foundPosts;
    },
    getSearchFields: (state) => (postType) => {
        if (typeof state.oSearchFields[postType] !== 'undefined') {
            return state.oSearchFields[postType];
        }

        return false;
    },
    getNewListings(state) {
        return state.aNewListings;
    },
    getTotalListings(state) {
        return state.foundPosts;
    },
    getCurrentPage(state) {
        return state.currentPage;
    },
    getMaxPages(state) {
        return state.maxPages;
    },
    getSearchArgs(state) {
        return state.oSearchArgs;
    },
    getPostType(state) {
        return state.postType;
    },
    getPostsPerPage(state) {
        return state.postsPerPage;
    },
    getIsSearchAsIMoveTheMap(state) {
        return state.isSearchAsIMoveTheMap;
    },
    getDefaultComponentOfRegisterLogin: (state) => {
        return state.defaultComponentOfRegisterLogin;
    },
    getPopupStatus: (state) => (popupID) => {
        if (typeof popupID !== 'undefined') {
            return state.oPopupStatus[popupID];
        }
        return state.oPopupStatus;
    },
    getPopupArgs: (state) => (popupID) => {
        if (typeof state.oPopUpArgs[popupID] === 'undefined') {
            return false;
        }
        return state.oPopUpArgs[popupID];

    },
    getCurrentSettingTab: (state) => {
        return state.oSettingTabs.currentTab;
    },
    getCurrentNavTab: (state) => {
        return state.oNavTab.current;
    },
    getSingleGallery: (state) => {
        return state.oSingleGallery.aImages;
    },
    getReviews: (state) => {
        return state.aReviews;
    },
    // changedBusinessHoursOptions: (state) => {
    // return state.aBusinessHoursOptions.aHours
    // },
    getPlanSettings: state => {
        return state.oPlanSettings;
    },
    getListingPlanSettings: state => key => {
        return typeof state.oPlanSettings[key] !== 'undefined' ? state.oPlanSettings[key] : '';
    },
    getReviewInfo: (state) => {
        if (Object.values(state.oReviewsInfo).length) {
            return state.oReviewsInfo;
        }
        return false;
    },
    getCurrentListingTab(state) {
        return state.currentListingTab;
    },
    getIcons(state) {
        return state.aIcons.length ? state.aIcons : false;
    },
    getSingleClickedSection: (state) => (sectionID) => {
        return typeof state.aSingleClickedSection[sectionID] !== 'undefined';
    },
    getHeroSearchFormSettings() {
        if (typeof localStorage === 'undefined') {
            return false;
        }
        let settings = localStorage.getItem('wilcity_hero_search_form');
        if (settings) {
            let version = localStorage.getItem('wilcity_hero_search_form_version');

            if (version === null || typeof version === 'undefined') {
                return false;
            }
            return {version: version, oSettings: JSON.parse(settings)};
        }

        return false;
    },
    getSelect2Store(state) {
        return state.aSelect2Store;
    },
    getMessageDetailClass: state => {
        return state.messageDetailClass;
    },
    getAuthorInfo: state => {
        return state.aAuthorsInfo[state.authorMessageID];
    },
    getEventTab: state => {
        return state.eventTab;
    },
    getTab: state => {
        return state.tab;
    },
    getQuery: state => {
        return state.query;
    },
    getListings: state => {
        return state.aListings;
    },
    getSetTimeout: state => {
        return parseInt(state.timeout, 10);
    },
    getUserProfile: (state) => (id) => {
        return state.oUserProfile[id];
    },
    getReceiverProfile: (state) => {
        return state.oReceiverProfile;
    }
}
