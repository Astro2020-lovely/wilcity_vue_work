import firebase from "./../../firebase.js";

export const updateChattedWith = function({ commit, state, getters }) {
  if (getters.isUsingFirebase) {
    if (state.isListenToChangedChattedWith) {
      return false;
    }
    const oListenToChangedChattedWith = firebase.db.ref(
      WilCityHelpers.buildFirebaseUsersKey(state.loggedInId)
    );
    oListenToChangedChattedWith.on("child_changed", snap => {
      const { key } = snap;
      commit("deleteListOfChattedWith", key);
      const newUser = snap.val();
      if (!_.isEmpty(state.oListOfChattedWith)) {
        const usersFetchedFromAjax = Object.keys(
          state.oListOfChattedWith
        ).filter(item => {
          return !isNaN(item);
        });

        if (!!usersFetchedFromAjax) {
          for (const order in usersFetchedFromAjax) {
            if (
              state.oListOfChattedWith[usersFetchedFromAjax[order]] ==
              newUser.userID
            ) {
              commit("deleteListOfChattedWith", newUser.userID);
            }
          }
        }
      }

      commit("setListOfChattedWith", {
        [key]: snap.val(),
        ...state.oListOfChattedWith
      });
    });
    commit("setIsListenToChangedChattedWith", true);
  }
};
