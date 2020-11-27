export const FieldHelper = {
  computed: {
    generateName() {
      const uniqueKey = new Date().getTime();
      return `wil-field-name-${uniqueKey}`;
    }
  }
};
