const formData = {
    methods: {
        createFormData(data) {
            const formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            return formData;
        }
    }
};

export {
    formData
}
