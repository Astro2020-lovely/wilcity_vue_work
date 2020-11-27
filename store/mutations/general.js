export default {
    setAskForCancelPlanPopupStatus(state, status) {
        state.oPopupStatus['ask-for-cancel-plan'] = status;
    },
    updatePostsNotIn(state, aPostIDs) {
        state.aPostsNotIn = aPostIDs;
    },
    updateSingleNavStatus(state, oTab) {
        state[oTab.key] = oTab.status;
    },
    updateChatWithProfile(state, chatWithProfile) {
        state.oChatWith = chatWithProfile;
    },
    updateSearchField(state, oData) {
        state.oSearchFields[oData.postType] = oData.aFields;
    },
    updateSelect2Store(state, $select2) {
        state.aSelect2Store.push($select2);
    },
    cleanSelect2Store(state) {
        state.aSelect2Store = [];
    },
    updateSingleClickedSection(state, sectionID) {
        state.aSingleClickedSection[sectionID] = 'yes';
    },
    updateNewBusinessHours(state, aNewHours) {
        state.aNewBusinessHoursOptions.cId = aNewHours.cId;
        state.aNewBusinessHoursOptions.aHours = aNewHours.aHours;
    },
    updatePlanSettings(state, oPlanSettings) {
        state.oPlanSettings.cId = oPlanSettings;
    },
    setDefaultComponentOfRegisterLoginPopup(state, component) {
        state.defaultComponentOfRegisterLogin = component;
    },
    updateRegisterLoginPopupStatus(state, status) {
        state.oPopupStatus['signin-popup'] = status;
    },
    updatePopupArgs(state, oPopupInfo) {
        if (typeof state.oPopUpArgs[oPopupInfo.id] === 'undefined') {
            state.oPopUpArgs[oPopupInfo.id] = oPopupInfo.oArgs;
        } else {
            state.oPopUpArgs[oPopupInfo.id] = oPopupInfo.oArgs;
        }
    },
    updatePopupStatus(state, oPopupInfo) {
        if (typeof state.oPopupStatus[oPopupInfo.id] === 'undefined') {
            state.oPopupStatus[oPopupInfo.id] = oPopupInfo.status;
        } else {
            state.oPopupStatus[oPopupInfo.id] = oPopupInfo.status;
        }
    },
    updateCurrentSettingTab(state, tabKey) {
        state.oSettingTabs.currentTab = tabKey;
    },
    updateCurrentNavTab(state, tabKey) {
        state.oNavTab.current = tabKey;
    },
    updateSingleGallery(state, oGallery) {
        state.oSingleGallery.id = oGallery.id;
        state.oSingleGallery.aImages = state.oSingleGallery.aImages.concat(oGallery.aImages);
    },
    updateReviews(state, oData) {
        if (oData.isAddToFirst) {
            state.aReviews = (oData.oReviews).concat(state.aReviews);
        } else {
            state.aReviews = state.aReviews.concat(oData.oReviews);
        }
    },
    updatePinReviewToTop(state, order) {
        let oReview = state.aReviews[order];
        oReview.isPintToTop = 'yes';

        state.aReviews.splice(order, 1);
        state.aReviews.splice(0, 0, oReview);
    },
    updateCompareTimeout() {},
    updateNewListings(state, aListings) {
        state.aNewListings = aListings;
    },
    updateOSearchArgs(state, oNewVal) {
        state.oSearchArgs = oNewVal;
        if (state.postType !== '' && typeof state.oDefaultSearchArgs[state.postType] === 'undefined') {
            state.oDefaultSearchArgs[state.postType] = oNewVal;
        }
    },
    updateDefaultSearchFormArgs(state, postType) {
        if (typeof state.oDefaultSearchArgs[postType] !== 'undefined') {
            state.oSearchArgs[postType] = state.oDefaultSearchArgs[postType];
        }
    },
    updatePostType(state, newVal) {
        state.postType = newVal;
    },
    updateTotalListings(state, foundPosts) {
        state.foundPosts = parseInt(foundPosts, 10);
    },
    updateCurrentPage(state, currentPage) {
        state.currentPage = parseInt(currentPage, 10);
    },
    updateMaxPages(state, maxPages) {
        state.maxPages = parseInt(maxPages, 10);
    },
    updatePostsPerPage(state, postsPerPage) {
        state.postsPerPage = parseInt(postsPerPage, 10);
    },
    updateMouseOn(state, oListing) {
        state.elMouseOn = oListing;
    },
    updateReviewInfo(state, oInfo) {
        state.oReviewsInfo = oInfo;
    },
    updateCurrentListingTab(state, tabKey) {
        state.currentListingTab = tabKey;
    },
    updateIcons(state, aIcons) {
        state.aIcons = aIcons;
    },
    updateHeroSearchForm(state, oInfo) {
        if (typeof localStorage === 'undefined') {
            return false;
        }
        localStorage.setItem('wilcity_hero_search_form', JSON.stringify(oInfo.oSettings));
        localStorage.setItem('wilcity_hero_search_form_version', oInfo.version);
    },
    updateTagsBelongsToCat(state, aTags) {
        state.oTagsBelongsToCat[state.selectedCat] = aTags;
    },
    updateSelectedCat(state, selectedCat) {
        state.selectedCat = selectedCat;
    },
    updateDefaultType(state, type) {
        state.type = type;
    },
    updateSearchFields(state, oData) {
        localStorage.removeItem(oData.key + '_at');
        localStorage.removeItem(oData.key);
        localStorage.setItem(oData.key, JSON.stringify(oData.fields));
        localStorage.setItem(oData.key + '_at', oData.at);
    },
    updateTermOptions(state, oData) {
        localStorage.removeItem(oData.key + '_at');
        localStorage.removeItem(oData.key);
        localStorage.setItem(oData.key, JSON.stringify(oData.terms));
        localStorage.setItem(oData.key + '_at', oData.at);
    },
    updateTimeout(state, value) {
        value = typeof value === 'undefined' ? 1000 : value;
        state.timeout = state.timeout + value;
    },
    isFocusUpdateSelect2(state, status) {
        state.isFocusUpdateSelect2 = status;
    },
    updateSearchArgsOfPostType(state, oInfo) {
        state.aCacheSearchArgs[oInfo.postType] = oInfo.oArgs;
    },
    activateMessageDetail(state, status) {
        if (status) {
            state.messageDetailClass = 'active';
        } else {
            state.messageDetailClass = '';
        }
    },
    setEventTab(state, newTab) {
        state.eventTab = newTab;
    },
    setAuthorMessageID(state, authorID) {
        state.authorMessageID = authorID;
    },
    setTab(state, newTab) {
        state.tab = newTab;
    },
    setQuery(state, newQuery) {
        state.query = newQuery;
    },
    setListings(state, oData) {
        state.aListings[oData.postType] = oData.listings;
    },
    setAuthorInfo(state, aAuthorsInfo) {
        state.aAuthorsInfo = aAuthorsInfo;
    },
    updateSetTimeout(state, val) {
        state.dashboardTimeout = state.dashboardTimeout + 100;
    },
    updateUserProfile(state, aUserProfile) {
        state.oUserProfile = aUserProfile;
    },
    updateReceiverProfile(state, oReceiverProfile) {
        state.oReceiverProfile = oReceiverProfile;
    },
    setAddListingVal(state, oVal) {
        state.oAddListingVal[oVal.key] = oVal.val;
    },
    setUserFirebaseUserID(state, val) {
        state.firebaseUserID = val;
    },
    setCheckboxVal(state, oVal) {
        state.oCheckboxVals[oVal.key] = oVal.value;
    },
    updateTemplateStyle(state, val) {
        state.templateStyle = val;
    },
    updateFocusRefresh(state, val) {
        state.isFocusRefresh = val;
    }
}
