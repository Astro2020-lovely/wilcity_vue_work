export const wilValueFormat = {
  correct(format, val) {
    let correctVal;
    switch (format) {
      case "boolean":
      case "bool":
        correctVal = !!val ? true : false;
        break;
      case "array":
        correctVal = !_.isArray(val) ? [] : val;
        break;
      case "object":
        correctVal = !_.isArray(val) && _.isObject(val) ? val : {};
        break;
      case "int":
        correctVal = !!val ? parseInt(val, 10) : 0;
        break;
      case "float":
        correctVal = !!val ? parseFloat(val, 10) : 0;
        break;
      default:
        correctVal = !!val ? val : "";
        break;
    }

    return correctVal;
  }
};
