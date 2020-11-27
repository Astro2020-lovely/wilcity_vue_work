const WilQueryHelper = {
  buildFormData(params) {
    const form = new FormData();
    for (let key in params) {
      form.append(key, params[key]);
    }

    return form;
  },
  buildQuery(params, isReplaceUnderscore) {
    // isReplaceUnderscore avoid 404 issue on Search Page
    const args = Object.keys(params).map(key => {
      const val = params[key];
      if (key === "post_type" || key === "type") {
        key = "postType";
      }

      let queryKey = key;
      if (isReplaceUnderscore) {
        queryKey = key.replace("_", "--");
      }

      if (typeof params[key] === "object") {
        const parsedParam = JSON.stringify(val);
        return `${queryKey}=${encodeURIComponent(parsedParam)}`;
      } else {
        return `${queryKey}=${encodeURIComponent(val)}`;
      }
    });
    return args.join("&");
  },
  buildQueryUrl(params) {
    return `${WILOKE_GLOBAL.ajaxurl}?${WilQueryHelper.buildQuery(params)}`;
  },
  getUrlVars() {
    let vars = {};
    const parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  },
  getUrlParam(parameter, defaultvalue) {
    let urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
      urlparameter = WilQueryHelper.getUrlVars()[parameter];
    }
    return urlparameter;
  }
};

export { WilQueryHelper };
