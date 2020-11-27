export default {
    methods: {
        typeHinting(value, format) {
            format = format.toUpperCase(format);
            let newValue;

            switch (format) {
                case 'ARRAY': newValue = Array.isArray(value) ? value : [];
                    break;
                case 'OBJECT': newValue = typeof value === 'object' ? value : {};
                    break;
                case 'INT':
                    if (Number.isInteger(value)) {
                        newValue = value;
                    } else {
                        newValue = parseInt(value, 10);
                        if (!Number.isInteger(newValue)) {
                            newValue = 0;
                        }
                    }
                    break;
                case 'FLOAT':
                    if (newValue = Number(value) === value && value % 1 !== 0) {
                        newValue = value;
                    } else {
                        newValue = parseFloat(value, 10);
                        if (isNaN(newValue)) {
                            newValue = 0;
                        }
                    }
                    break;
                default:
                    value = newValue;
                    break;
            }

            return newValue;
        }
    }
}
