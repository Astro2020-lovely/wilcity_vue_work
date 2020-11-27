export const ParseData = {
    methods: {
        parseData(data) {
            if (typeof data === 'object') {
                return data;
            }

            if (typeof data === 'string') {
                try {
                    const parsed = window.atob(data);
                    return JSON.parse(parsed);
                } catch (e) {
                    console.log(e);
                }
            }

            return data;
        }
    }
}
