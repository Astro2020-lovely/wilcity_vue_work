export default function(defaultText, keyword) {
  if (_.isUndefined(keyword)) {
    keyword = defaultText;
  }

  keyword = keyword.replace(/\s/g, "");
  keyword = keyword.charAt(0).toLowerCase() + keyword.substring(1);
  if (keyword && WILCITY_I18[keyword]) {
    return WILCITY_I18[keyword];
  }

  return defaultText;
}
