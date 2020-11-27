const state = {
  terms: {},
  cacheKey: "terms"
};

const helpers = {
  getTermsCache() {
    const cache = Vue.localStorage.get(state.cacheKey, false);

    if (cache) {
      try {
        const parsedCache = JSON.parse(cache);
        if (_.isObject(parsedCache)) {
          return parsedCache;
        }
        return {};
      } catch (e) {
        console.log(e);
        return {};
      }
    }

    return {};
  }
};

const getters = {
  getTerm: state => (term_id, getters) => {
    term_id = term_id.toString();
    const terms = helpers.getTermsCache();
    if (terms[term_id]) {
      return terms[term_id];
    }
    return false;
  },
  getTermBy: state => (filterBy, target, getters) => {
    const terms = helpers.getTermsCache();

    if (_.isEmpty(terms)) {
      return false;
    }

    const term = Object.values(terms).find(item => {
      if (item[filterBy] && item[filterBy] === target) {
        return true;
      }

      return false;
    });

    return !_.isEmpty(term) ? term : false;
  }
};

const mutations = {
  updateTerm(state, { term_id, term, getters }) {
    term_id = term_id.toString();
    state.terms = {
      ...state.terms,
      [term_id]: term
    };
    const terms = helpers.getTermsCache();
    Vue.localStorage.set(
      state.cacheKey,
      JSON.stringify({
        ...terms,
        [term_id]: term
      })
    );
  },
  // it's an object. Term Id is key of item (term id must be a string)
  updateTerms(state, { terms, getters }) {
    state.terms = helpers.getTermsCache();
    state.terms = {
      ...state.terms,
      ...terms
    };
    Vue.localStorage.set(state.cacheKey, JSON.stringify({ ...state.terms }));
  }
};
const actions = {
  updateTerm({ commit, getters }, { term_id, term }) {
    commit("updateTerm", { term_id, term, getters });
  },
  updateTerms({ commit, getters }, { terms }) {
    commit("updateTerms", { terms, getters });
  }
};

export default { namespaced: true, state, mutations, getters, actions };
