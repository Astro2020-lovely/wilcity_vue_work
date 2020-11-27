export const DashboardMenuHelper = {
  data() {
    return { rootUrl: "", menuItems: {}, isLoading: false };
  },
  methods: {
    isExternalLink(item) {
      return item.externalLinkTarget && item.externalLinkTarget.length;
    },
    getItemLinkTarget(item) {
      return this.isExternalLink(item) ? item.externalLinkTarget : "_self";
    },
    getItemLink(item) {
      if (item.externalLink && item.externalLink.length) {
        return item.externalLink.replace("&amp;", "&");
      }

      if (item.redirect && item.redirect.length) {
        return item.redirect;
      }

      return `${this.rootUrl}#/${
        item.webEndpoint ? item.webEndpoint : item.endpoint
      }`;
    },
    fetchDashboardMenuItems() {
      if (this.rootUrl.length) {
        return true;
      }
      this.isLoading = true;

      Vue.axios({
        method: "GET",
        url: `${WILOKE_GLOBAL.ajaxurl}?action=dashboard_menu`
      })
        .then(response => {
          if (response.data.success) {
            this.menuItems = {
              ...response.data.data.items
            };
            this.rootUrl = response.data.data.rootUrl;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
