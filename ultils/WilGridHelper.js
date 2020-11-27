const wilGridHelper = {
    findItemsPerRow(classes) {
        const windowWidth = document.body.clientWidth;
        let items = 0;

        if (this.hasColFive(classes, windowWidth)) {
            return 5;
        }

        if (windowWidth > 991) {
            return this.findItemsPerRowRegex("(?:lg|md)-(\\d+)", classes);
        } else if (windowWidth > 767) {
            return this.findItemsPerRowRegex("(:?md|sm)-(\\d+)", classes);
        } else {
            return this.findItemsPerRowRegex("(:?sm|xs)-(\\d+)", classes);
        }
    },
    hasColFive(classes, windowWidth) {
        if (windowWidth > 991) {
            return classes.includes('wil-col-5') && classes.includes('col-lg-2');
        }

        if (windowWidth > 767) {
            return classes.includes('wil-col-5') && classes.includes('col-md-2');
        }

        return false;
    },
    findItemsPerRowRegex(regex, classes) {
        const matched = classes.match(regex);
        let items = parseInt(matched[1], 10);
        if (isNaN(items)) {
            return 4;
        }
        return 12 / items;
    }
}
export {
    wilGridHelper
};
