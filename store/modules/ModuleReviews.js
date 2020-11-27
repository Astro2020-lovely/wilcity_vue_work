const findHelper = (review, info) => {
    for (const key in info) {
        if (Array.isArray(info[key])) {
            for (const reviewKey in info[key]) {
                if (!review[reviewKey] || info[key][reviewKey] !== review[reviewKey]) {
                    return false;
                }
            }
        } else {
            if (!review[key] || review[key] != info[key]) {
                return false;
            }
        }
    }
    return true;
};

const state = {
    reviews: [],
    totalReviews: 0,
    maxPages: 1,
    qualityRating: "",
    averageRating: 0, // It's average score of all reviews belong to listing
    reviewCategoriesStatistic: [],
    modeRating: 1,
    discussions: {},
    orderby: "ID"
};

const getters = {
    getQualityRating: state => state.qualityRating,
    getModeRating: state => state.modeRating,
    getAverageRating: state => state.averageRating,
    getReviewCategoriesStatistic: state => state.reviewCategoriesStatistic,
    getMaxPages: state => state.maxPages,
    countTotal: state => state.totalReviews,
    isUserLeftReview: state => userID => state.reviews.findIndex(item => item.author.ID === userID) !== -1,
    getAll: state => state.reviews,
    getUserReviews: state => (userId, isGetLatest) => {
        const myReviews = state.reviews.filter(review => {
            return review.author.ID === userId;
        });

        if (! myReviews.length) {
            return isGetLatest ? {} : [];
        }

        if (isGetLatest) {
            return myReviews[0];
        }

        return isGetLatest ? {} : [];
    },
    find: state => info => state.reviews.filter(review => findHelper(review, info)),
    findIndex: state => info => state.reviews.findIndex(review => findHelper(review, info)),
    getOrderby: state => state.orderby,
    getAllDiscussions: state => state.discussions,
    getReviewDiscussions: state => reviewID => state.discussions[reviewID] ? state.discussions[reviewID] : []
};

const actions = {
    updateOrderby({
        commit
    }, orderby) {
        commit("updateOrderby", orderby);
    },
    resetMenuOrder({commit}) {
        commit('resetMenuOrder');
    },
    resort(
        {
            commit,
            getters
        },
        orderby
    ) {
        commit('resort', orderby ? orderby : getters.getOrderby);
    },
    setTotalReviews({
        commit
    }, total) {
        commit('setTotalReviews', total);
    },
    updateTotalReviews({commit}) {
        commit('updateTotalReviews');
    },
    setAverageRating({
        commit
    }, averageRating) {
        commit('setAverageRating', averageRating);
    },
    setReviewCategoriesStatistic({
        commit
    }, reviewCategoriesStatistic) {
        commit('setReviewCategoriesStatistic', reviewCategoriesStatistic);
    },
    setModeRating({
        commit
    }, mode) {
        commit('setModeRating', mode);
    },
    setQualityRating({
        commit
    }, quality) {
        commit('setQualityRating', quality);
    },
    add({
        commit
    }, reviews) {
        commit('add', reviews);
    },
    prepend({
        commit
    }, review) {
        commit('prepend', review);
    },
    append({
        commit
    }, review) {
        commit('add', review);
    },
    update(
        {
            commit,
            getters
        },
        {ID, value}
    ) {
        const reviewIndex = getters.findIndex({ID});
        if (reviewIndex !== -1) {
            commit('update', {reviewIndex, value});
        }
    },
    delete({
        commit
    }, reviewId) {
        commit('delete', reviewId);
    },
    reviewObserver(
        {
            commit,
            dispatch
        },
        {status, info, parentID}
    ) { // status: add, prepend or delete
        switch (status) {
            case 'add':
                dispatch('add', info.reviews);
                dispatch('setMaxPages', info.maxPages);
                break;
            case 'prepend':
                dispatch('prepend', info.review);
                break;
            case 'append':
                dispatch('prepend', info.review);
                break;
            case 'update':
                dispatch('update', {
                    ID: info.review.ID,
                    value: info.review
                });
                break;
            case 'delete':
                dispatch('delete', info.review.ID);
                break;
        }
        // maybe event discussion
        if (!!info.qualityRating) {
            dispatch('setQualityRating', info.qualityRating);
        }

        if (!!info.reviewCategoriesStatistic) {
            dispatch('setReviewCategoriesStatistic', info.reviewCategoriesStatistic);
        }

        if (!!info.averageRating) {
            dispatch('setAverageRating', info.averageRating);
        }
        
    },
    setMaxPages({
        commit
    }, maxPages) {
        commit('setMaxPages', maxPages);
    },
    addDiscussions({
        commit
    }, {parentID, value}) {
        commit('addDiscussions', {parentID, value});
    },
    deleteDiscussion({
        commit
    }, {parentID, ID}) {
        commit('deleteDiscussion', {parentID, ID});
    },
    updateDiscussion({
        commit
    }, {parentID, ID, value}) {
        commit('updateDiscussion', {parentID, ID, value});
    }
};

const mutations = {
    updateOrderby: (state, orderby) => state.orderby = orderby,
    resetMenuOrder: state => state.reviews = state.reviews.map(review => {
        return {
            ...review,
            menuOrder: 0,
            isPintToTop: "no"
        }
    }),
    resort: (state, orderby) => state.reviews = state.reviews.sort(
        (fReview, sReview) => {
            if (sReview.menuOrder !== fReview.menuOrder) {
                return sReview.menuOrder - fReview.menuOrder;
            }
            return sReview[orderby] - fReview[orderby];
        }
    ),
    add: (state, reviews) => state.reviews = [
        ... state.reviews,
        ...reviews,
    ],
    prepend: (state, review) => {
        state.reviews = [
            {
                ...review
            },
            ... state.reviews,
        ];

        state.totalReviews = state.totalReviews + 1;
    },
    append: (state, review) => {
        state.reviews = [
            ... state.reviews, {
                ...review
            }
        ];
        state.totalReviews = state.totalReviews + 1;
    },
    update: (state, info) => state.reviews = {
        ... state.reviews,
        [info.ID]: {
            ... state.reviews[info.ID],
            ...info.value
        }
    },
    delete: (state, reviewId) => {
        state.reviews = state.reviews.filter(review => review.ID !== reviewId);
        state.totalReviews = state.totalReviews - 1;
    },
    update: (state, info) => {
        state.reviews = state.reviews.map((review, reviewIndex) => {
            return reviewIndex === info.reviewIndex ? {
                ...review,
                ...info.value
            } : review;
        });
    },
    setQualityRating: (state, quality) => state.qualityRating = quality,
    setAverageRating: (state, averageRating) => state.averageRating = averageRating,
    setReviewCategoriesStatistic: (state, reviewCategoriesStatistic) => state.reviewCategoriesStatistic = reviewCategoriesStatistic,
    setModeRating: (state, mode) => state.modeRating = mode,
    setMaxPages: (state, maxPages) => state.maxPages = maxPages,
    setTotalReviews: (state, total) => {
        state.totalReviews = total;
    },
    updateTotalReviews: (state, total) => {
        state.totalReviews = state.totalReviews + 1;
    },
    addDiscussions: (state, {parentID, value}) => {
        if (state.discussions[parentID]) {
            state.discussions = {
                ... state.discussions,
                [parentID]: [
                    ... state.discussions[parentID],
                    ...value
                ]
            }
        } else {
            state.discussions = {
                ... state.discussions,
                [parentID]: value
            }
        }
    },
    deleteDiscussion: (state, {parentID, ID}) => {
        if (! state.discussions[parentID]) {
            return false;
        }

        const discussions = state.discussions[parentID].filter(item => item.ID !== ID);

        state.discussions = {
            ... state.discussions,
            [parentID]: discussions
        }
    },
    updateDiscussion: (state, {parentID, ID, value}) => {
        if (! state.discussions[parentID]) {
            return false;
        }

        const discussions = state.discussions[parentID].map(item => {
            return item.ID === ID ? {
                ...item,
                ...value
            } : item;
        });

        state.discussions = {
            ... state.discussions,
            [parentID]: discussions
        }
    }
};


export default {namespaced: true, state, getters, actions, mutations};
