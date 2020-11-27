const state = {
  searchFields: {},
  query: {}
};

const getters = {
  getSearchFields: state => postType => {
    let fields = state.searchFields;
    if (!fields[postType]) {
      const rawFields = Vue.localStorage.get("search_fields", false);

      if (rawFields !== false) {
        fields = JSON.parse(rawFields);
      }
    }
    // return {fields: {}, saveAt: 123}
    return fields[postType]
      ? {
          ...fields[postType]
        }
      : {};
  },
  getPostTypeQuery: state => postType => {
    return state.query[postType]
      ? {
          ...state.query[postType]
        }
      : {};
  }
};

const actions = {
  updateSearchFields({ commit }, { fields, postType }) {
    commit("updateSearchFields", { fields, postType });
  },
  updateSearchQuery({ commit }, { query, postType }) {
    commit("updateSearchQuery", { query, postType });
  }
};

const mutations = {
  updateSearchQuery(state, { query, postType }) {
    state.query = {
      ...state.query,
      [postType]: {
        ...query,
        postType
      }
    };
  },
  updateSearchFields(state, { fields, postType }) {
    const savedAt = new Date().getTime() / 1000;
    let cacheFields = Vue.localStorage.get("search_fields", false);

    if (cacheFields) {
      cacheFields = JSON.parse(cacheFields);
      cacheFields = {
        ...cacheFields,
        [postType]: {
          fields,
          savedAt
        }
      };
    } else {
      cacheFields = {
        [postType]: {
          fields,
          savedAt
        }
      };
    }
    state.searchFields = {
      ...cacheFields
    };
    Vue.localStorage.set("search_fields", JSON.stringify(cacheFields));
  }
};

export default { namespaced: true, state, mutations, getters, actions };
