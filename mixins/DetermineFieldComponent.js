export const DetermineFieldComponent = {
    data() {
        return {libComponents: ["vue-editor"]}
    },
    methods: {
        determineFieldComponent(component) { // This feature helps to determine the name of new field in 1.2.0
            if (this.libComponents.includes(component)) {
                return component;
            }
            let newComponent = "";
            switch (component) {
                case 'event_calendar': newComponent = 'wil-event-calendar';
                    break;
                case 'select2': newComponent = 'wil-select-tree';
                    break;
                case "date_range": newComponent = "wil-date-range";
                    break;
                case "autocomplete": newComponent = "wil-auto-complete";
                    break;
                case "wil-price-range": newComponent = "wil-search-form-price-range";
                    break;
                default: newComponent = component.indexOf("wil") !== 0 ? `wil-${component}` : component;
                    break;
            }
            return newComponent;
        }
    }
}
