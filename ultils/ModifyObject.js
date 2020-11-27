export const wilModifyObject = {
    findIndex(oStoreValues, key, val) {
        return oStoreValues.findIndex(field => {
            return field[key] && field.key === val;
        });
    },
    find(oStoreValues, key, val) {
        return oStoreValues.find(field => {
            return field[key] && field.key === val;
        });
    },
    addValToItem(oStoreValues, modifyOrder, addedVal) {
        return oStoreValues.map((field, order) => {
            if (order === modifyOrder) {
                field = {
                    ...field,
                    ...addedVal
                };
            }
            return field;
        });
    },
    deleteItem(rmKey, oStoreValues) {
        const aKeys = Object.keys(oStoreValues);
        const aNewKeys = aKeys.filter(key => {
            return rmKey !== key;
        });

        return aNewKeys.reduce((accumulator, key) => {
            accumulator = {
                ...accumulator,
                [key]: {
                    ...oStoreValues[key]
                }
            };

            return accumulator;
        }, {});
    }
};
