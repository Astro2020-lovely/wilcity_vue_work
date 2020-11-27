const fetchUserInfo = {
  data() {
    return { userShortInfo: {} };
  },
  methods: {
    fetchUserInfo(userId, pluck, isFocus) {
      if (!pluck) {
        pluck = "avatar,displayName,position";
      }
      if (
        !isFocus &&
        this.$store &&
        this.$store.getters["ModuleUser/getShortProfileInfo"](userId)
      ) {
        this.userShortInfo = {
          ...this.$store.getters["ModuleUser/getShortProfileInfo"](userId)
        };
        return this.userShortInfo;
      }

      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=user_short_info&pluck=${pluck}&userId=${userId}`
      }).then(response => {
        if (response.data.success || response.data.status === "success") {
          this.userShortInfo = {
            ...response.data.data
          };
          if (this.$store) {
            this.$store.dispatch("ModuleUser/updateShortProfileInfo", {
              userId,
              info: this.userShortInfo,
              pluck: pluck
            });
          }
          return this.userShortInfo;
        }
      });
    }
  }
};

const isUserLoggedIn = {
  methods: {
    isUserLoggedIn(cb) {
      if (WILOKE_INLINE_GLOBAL.isUserLoggedIn === "no") {
        return false;
      }
      return cb();
    }
  }
};

export { fetchUserInfo, isUserLoggedIn };
