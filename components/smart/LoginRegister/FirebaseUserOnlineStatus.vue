<template>
  <form @submit.prevent="createUser">
    <p>
      <label>Username</label>
      <input v-model="email" type="text" />
    </p>
    <p>
      <label>Password</label>
      <input v-model="password" type="text" />
    </p>
    <button type="submit">Submit</button>
  </form>
</template>
<script>
import firebase from "./../firebase.js";

export default {
  data() {
    return {
      signUpError: null,
      signInError: null,
      isLoggedIn: false,
      aListUsersOnline: []
    };
  },
  store: WILCITY_VUEX,
  mounted() {
    this.setUserStatus();
  },
  props: {
    userId: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    password: {
      type: String,
      default: ""
    }
  },
  methods: {
    getListUsersOnline() {
      let refConnections = firebase.db.ref("connections");
      refConnections.on("value", snap => {
        const aUsersOnline = snap.val();
        if (aUsersOnline !== null) {
          this.aListUsersOnline = aUsersOnline;
        } else {
          this.aListUsersOnline = [];
        }
      });
    },
    checkLoginStatus() {
      firebase.auth.onAuthStateChanged(firebaseUser => {
        this.isLoggedIn = firebaseUser !== null;
        this.setUserStatus();
      });
    },
    signIn() {
      firebase.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(oUser => {
          WilCityHelpers.setFirebaseID(oUser.user.uid);
        })
        .catch(e => {
          this.signInError = e.message;
          this.createUser();
        });
    },
    createUser() {
      const promise = firebase.auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      );
      promise
        .then(oUser => {
          this.signIn();
        })
        .catch(e => {
          this.signUpError = e.message;
        });
    },
    setUserStatus() {
      if (!this.userId || !this.status.length) {
        return false;
      }

      const dbRefConnections = firebase.db
        .ref("connections")
        .child(this.userId);
      if (this.status === "login") {
        dbRefConnections.set(true);
        this.signIn();
      } else {
        dbRefConnections.set(null);
      }
    },
    userLogout() {
      firebase.auth.signOut().then(
        function() {
          console.log("Signed Out");
          WilCityHelpers.clearFirebaseID();
        },
        function(error) {
          console.error("Sign Out Error", error);
        }
      );
    }
  }
};
</script>
