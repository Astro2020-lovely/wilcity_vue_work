export const SearchFormHelper = {
  methods: {
    setQueryArgsInitialize(rawQuery) {
      this.postTypes = [...WILOKE_GLOBAL.postTypes];
      this.query = Object.keys(rawQuery).reduce((accumator, key) => {
        if (Array.isArray(rawQuery[key])) {
          this.ajaxSelectedOptions = {
            ...this.ajaxSelectedOptions,
            [key]: [...rawQuery[key]]
          };
          return {
            ...accumator,
            [key]: rawQuery[key].map(item => {
              if (item.value) {
                return item.value;
              }

              if (item.id) {
                return item.id;
              }

              return item;
            })
          };
        } else {
          return {
            ...accumator,
            [key]: rawQuery[key]
          };
        }
      }, {});
      this.searchFields.map(item => {
        if (item.std && _.isUndefined(this.query[item.key])) {
          this.query = {
            ...this.query,
            [item.key]: item.std
          };
        }
      });
    }
  },
  computed: {
    isMobile() {
      const windowWidth = window.innerWidth;
      return windowWidth <= 480;
    }
  }
};
