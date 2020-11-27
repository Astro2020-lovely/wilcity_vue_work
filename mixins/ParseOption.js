export const ParseOption = {
    methods: {
        getIconColor(input) {
            return input.replace('icon_color_', '');
        },

        getIcon(input) {
            return input.replace('icon_', '').replace('_', ' ');
        },

        getOption(input) {
            const option = input.split(':');

            return {key: option[0], value: option[1]};
        },

        parseOption(input, outputType) {
            const parsedOption = input.split('|');
            return parsedOption.reduce((accumulator, item) => {
                if (item.includes('icon_color_')) {
                    return {
                        ...accumulator,
                        icon_color: this.getIconColor(item)
                    };
                }

                if (item.includes('icon_')) {
                    return {
                        ...accumulator,
                        icon: this.getIcon(item)
                    };
                }

                const option = this.getOption(item, outputType);
                if (outputType === 'selectTree') {
                    return {
                        ...accumulator,
                        id: option.key,
                        label: option.value
                    };
                }

                return {
                    ...accumulator,
                    option
                };
            }, {});
        }
    }
};
