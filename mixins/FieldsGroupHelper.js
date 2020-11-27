import _default from "vuex";

export const FieldsGroupHelper = {
  data() {
    return { libComponents: ["vue-editor"] };
  },
  methods: {
    parseField(field) {
      return {
        ...field,
        queryArgs: this.buildQueryArgs(field),
        module: "addlisting"
      };
    },
    parseFieldClasses(field) {
      const defaultClasses = "field_module__1H6kT field_style2__2Znhe";
      if (field.fieldStatus) {
        return `${field.fieldStatus} ${defaultClasses}`;
      }

      return defaultClasses;
    },
    isEnable(field) {
      if (field.isEnable) {
        if (field.isEnable === "yes" || field.isEnable === true) {
          return true;
        } else {
          return false;
        }
      } else if (field.toggle) {
        if (field.toggle == "enable") {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    getValue(field, focusDefault) {
      if (!focusDefault && this.model[field.key]) {
        return this.model[field.key];
      }
      if (field.value) {
        return field.value;
      }

      if (field.valueFormat === "object") {
        if (field.type === "wil-select-tree") {
          if (field.maximum == 1) {
            if (!field.selectValueFormat || field.selectValueFormat === "id") {
              return "";
            }
          }
        }
        return {};
      }

      if (field.valueFormat === "array") {
        return [];
      }

      if (
        (field.type === "wil-uploader" || field.type === "wil-select-tree") &&
        field.maximum &&
        parseInt(field.maximum, 10) > 1
      ) {
        return [];
      }

      return "";
    },
    parseMaximumItems(field) {
      return field.maximum ? parseInt(field.maximum, 10) : 0;
    },
    buildQueryArgs(field) {
      let query = {
        ...field
      };

      if (query.queryArgs) {
        const parseQueryArgs = Object.keys(query.queryArgs).reduce(
          (accumulator, key) => {
            let value = query.queryArgs[key];
            if (_.isString(value)) {
              value = value.replace(/{{([^\}]+)}}/, (match, group1) => {
                return field[group1];
              });
            }
            return {
              ...accumulator,
              [key]: value
            };
          },
          {}
        );

        query = {
          ...query,
          ...parseQueryArgs,
          mode: "select"
        };
      }

      if (query.isTax) {
        if (field.loadOptionMode === "ajaxloadroot") {
          query = {
            ...query,
            parent: 0
          };
        }

        delete query.key;
      }

      delete query.isRequired;
      delete query.label;
      delete query.type;
      delete query.isAjax;
      delete query.restRoute;
      delete query.ajaxUrl;
      delete query.selectValueFormat;
      delete query.valueFormat;
      delete query.placeholder;
      delete query.description;
      delete query.ajaxloadroot;
      delete query.ajaxLoadMode;

      if (this.postType) {
        query = {
          ...query,
          postType: this.postType
        };
      }
      return query;
    },
    fieldOptions(field) {
      if (!field.options) {
        return [];
      }

      if (field.type !== "wil-select-tree") {
        return field.options ? field.options : "";
      }

      if (field.isCustomField) {
        if (Array.isArray(field.options)) {
          return field.options;
        }

        const rawOptions = field.options.includes("\n")
          ? field.options.split("\n")
          : field.options.split(",");
        return rawOptions.map(rawOption => {
          return this.parseOption(rawOption, "selectTree");
        });
      }

      return field.options;
    },
    loadOptionMode(field) {
      if (field.loadOptionMode) {
        return field.loadOptionMode;
      }

      return "";
    },
    selectValueFormat(field) {
      // return field.selectValueFormat ? field.selectValueFormat : "id";
      return field.selectValueFormat ? field.selectValueFormat : "id";
    },
    isRequired(field) {
      return (
        field.isRequired === true ||
        field.isRequired === "true" ||
        field.isRequired === "yes"
      );
    },
    searchUrl(field) {
      if (field.restRoute) {
        let route = field.restRoute.replace(/{{([^\}]+)}}/, (match, group1) => {
          return field[group1];
        });
        return `${WILOKE_GLOBAL.restAPI}${route}`;
      }

      if (field.isAjax) {
        return `${WILOKE_GLOBAL.ajaxurl}`;
      }

      return "";
    }
  }
};
