export const WilCacheKeyHelper = {
  generateCacheKey(rawKey) {
    return _.isArray(rawKey) ? [...rawKey].sort().join("_") : rawKey;
  }
};
