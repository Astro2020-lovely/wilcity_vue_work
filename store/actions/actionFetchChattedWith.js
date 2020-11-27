import firebase from "./../../firebase.js";
const { fromJS } = require("immutable");

export const fetchChattedWith = async function(
  { state, commit, getters, dispatch },
  specifyChattedWith
) {
  let oStatus = {
    success: true,
    isFoundAll: false
  };
  let numberOfItems = 10;
  let isAppend = false;
  let aListOfChattedWith;
  let oListOfChattedWith;
  let lastMsgID = null;
  if (specifyChattedWith === "deleted_an_author") {
    numberOfItems = 2; // 1 of old customer and 1 for new
    specifyChattedWith = null;
    isAppend = true;
  }
  let oFirebaseFetchChattedWith = null;
  if (getters.isUsingFirebase) {
    oListOfChattedWith = state.oListOfChattedWith
      ? {
          ...state.oListOfChattedWith
        }
      : null;
    if (specifyChattedWith) {
      // If the chattedWithId is specifying
      oFirebaseFetchChattedWith = firebase.db
        .ref(WilCityHelpers.buildFirebaseUsersKey(state.loggedInId))
        .orderByChild("displayName")
        .startAt(specifyChattedWith)
        .endAt(specifyChattedWith + "\uf8ff")
        .limitToLast(numberOfItems);
      commit("setListOfChattedWith", null);
    } else {
      if (!state.oFirstChattedWithInfo) {
        const oFirstChattedWith = firebase.db
          .ref(WilCityHelpers.buildFirebaseUsersKey(state.loggedInId))
          .orderByChild("timestamp")
          .limitToFirst(1);
        oFirstChattedWith.once("value", snap => {
          if (snap.val() !== null) {
            commit("setFirstChattedWithInfo", Object.values(snap.val())[0]);
          }
        });
      }

      if (state.oListOfChattedWith) {
        const aListOfChattedKeys = Object.keys(oListOfChattedWith);
        lastMsgID = aListOfChattedKeys[aListOfChattedKeys.length - 1];
        const oLastObjectInfo = {
          ...oListOfChattedWith[lastMsgID]
        };
        oFirebaseFetchChattedWith = firebase.db
          .ref(WilCityHelpers.buildFirebaseUsersKey(state.loggedInId))
          .orderByChild("timestamp")
          .limitToLast(numberOfItems)
          .endAt(parseInt(oLastObjectInfo.timestamp));
      } else {
        oFirebaseFetchChattedWith = firebase.db
          .ref(WilCityHelpers.buildFirebaseUsersKey(state.loggedInId))
          .orderByChild("timestamp")
          .limitToLast(numberOfItems);
      }
    }

    await oFirebaseFetchChattedWith.once("value", snap => {
      let oUsers = snap.val();
      if (oUsers) {
        const aUsers = Object.values(oUsers);
        const aFirebasHashedKeys = Object.keys(oUsers);
        aFirebasHashedKeys.map(hashedKey => {
          if (
            oUsers[hashedKey] &&
            oUsers[hashedKey].userID == state.loggedInId
          ) {
            delete oUsers.hashedKey; // exclude me
          }
        });

        if (
          state.oFirstChattedWithInfo &&
          state.oFirstChattedWithInfo.timestamp === aUsers[0].timestamp
        ) {
          oStatus = {
            ...oStatus,
            isFoundAll: true
          };
        }

        oUsers = fromJS(oUsers);
        oUsers = oUsers
          .sort((a, b) => {
            return b.get("timestamp") - a.get("timestamp");
          })
          .toJS();
        if (!isAppend) {
          oListOfChattedWith = {
            ...oUsers,
            ...oListOfChattedWith
          };
        } else {
          oListOfChattedWith = {
            ...oListOfChattedWith,
            ...oUsers
          };
        }

        // Auto trigger first authors to get chat with id
        if (!state.isTriggeredGetChatWithID) {
          aListOfChattedWith = Object.values(oListOfChattedWith);
          commit("setChattingWithId", aListOfChattedWith[0].userID);
          commit("setChattingWithFirebaseId", aFirebasHashedKeys[0]);
        }

        commit("setListOfChattedWith", oListOfChattedWith);

        if (!state.isFetchedChattedWithAvatar) {
          Object.values(oUsers).map((oInfo, index) => {
            dispatch("fetchUserDisplayNameAndAvatar", {
              firebaseHashedKey: aFirebasHashedKeys[index],
              uid: oInfo.userID
            });
          });
          commit("setIsFetchedChattedWithAvatar", true);
        }
        dispatch("updateChattedWith");
      } else {
        // Some customers may won't not sign up to firebase
        const oFetchUserByAjax = dispatch(
          "ajaxSearchUsers",
          specifyChattedWith
        );
        oFetchUserByAjax.then(oResponse => {
          commit("setListOfChattedWith", {
            ...oResponse.users
          });
        });
      }
    });

    return oStatus;
  } else {
    let oFetchChattedWith;
    if (specifyChattedWith) {
      oFetchChattedWith = dispatch("ajaxSearchUsers", specifyChattedWith);
    } else {
      oFetchChattedWith = dispatch("ajaxFetchChattedWith", numberOfItems);
    }

    oFetchChattedWith.then(oResponse => {
      if (oResponse.success) {
        oListOfChattedWith = {
          ...oResponse.users
        };

        if (!state.isTriggeredGetChatWithID) {
          aListOfChattedWith = Object.values(oListOfChattedWith);
          commit("setChattingWithId", aListOfChattedWith[0].userID);
        }
        commit("setListOfChattedWith", oListOfChattedWith);
      } else {
        oStatus = {
          ...oStatus,
          success: false
        };
      }
    });

    return oStatus;
  }
};
