export const MatchHeight = {
    data() {
        return {matchHeightElements: []};
    },
    methods: {
        getMaxHeight(elements) {
            let max = 0;
            [].forEach.call(elements, function (element) {
                if (element.offsetHeight > max) {
                    max = element.offsetHeight;
                }
            });
            return max;
        },
        equalHeight() {
            const totalItems = this.items.length;

            if (totalItems === 0) {
                return false;
            }

            const totalRows = (totalItems / this.itemsPerRow);
            const totalMHElements = this.matchHeightElements.length;
            for (let i = 1; i <= totalRows; i++) {
                for (let z = 0; z < totalMHElements; z++) {
                    const $items = this.$el.querySelectorAll(`.equal-height-${i} ${
                        this.matchHeightElements[z]
                    }`);
                    const maxHeightOfRow = this.getMaxHeight($items);
                    this.setHeight($items, maxHeightOfRow);
                }
            }
        },
        setHeight(elements, height) {
            [].forEach.call(elements, function (element) {
                element.style.height = height + "px";
            });
        }
    }
};
