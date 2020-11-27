export default {
  methods: {
    shuffle(input) {
      for (let i = input.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [input[i], input[j]] = [input[j], input[i]];
      }

      return input;
    },
    arrDeleteItem(order, arr) {
      return arr.filter((item, itemOrder) => {
        return itemOrder !== order;
      });
    },
    findItemInArray(needleKey, matchedVal, arr) {
      return arr.find(item => {
        return item[needleKey] === matchedVal;
      });
    },
    findItemIndexInArray(needleKey, matchedVal, arr) {
      return arr.findIndex(item => {
        return item[needleKey] === matchedVal;
      });
    },
    pluckArr(key, arr) {
      return arr.map(item => {
        return item[key];
      });
    },
    addItem(modifyOrder, updatedVal, arr) {
      const valueFormat = typeof updatedVal;
      if (valueFormat === "object") {
        return [
          ...arr,
          {
            ...updatedVal
          }
        ];
      } else {
        return [...arr, updatedVal];
      }
    },
    updateItemValueInArray(modifyOrder, updatedVal, arr) {
      const valueFormat = typeof updatedVal;
      if (!arr[modifyOrder]) {
        if (valueFormat === "object") {
          return [
            ...arr,
            {
              ...updatedVal
            }
          ];
        } else {
          return [...arr, updatedVal];
        }
      }

      return arr.map((field, order) => {
        if (order === modifyOrder) {
          if (valueFormat === "object") {
            field = {
              ...field,
              ...updatedVal
            };
          } else {
            field = updatedVal;
          }
        }
        return field;
      });
    }
  }
};
