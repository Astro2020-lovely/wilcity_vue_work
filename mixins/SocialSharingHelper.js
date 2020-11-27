export default {
    props: {
        type: {
            type: String,
            default: "list"
        },
        settings: {
            type: Object,
            default: () => {}
        },
        wrapperClasses: {
            type: String,
            default: "list_link__2rDA1 text-ellipsis color-primary--hover"
        }
    },
    computed: {
        title() {
            let title = "";
            if (this.settings.title) {
                title = this.settings.title;
            }
            return title;
        },
        desc() {
            let title = "";
            if (this.settings.content) {
                title = this.settings.content;
            }
            return title;
        },
        href() {
            if (this.settings.link) {
                return this.settings.link;
            }

            return "";
        },
        picture() {
            if (this.settings.img) {
                return this.settings.img;
            }

            return "";
        },
        titleOg() {
            let titleOg = "";
            if (this.settings.title) {
                titleOg = this.settings.title;
            }

            if (this.settings.img) {
                titleOg = `${titleOg}?og:image=${
                    this.settings.img
                }`;
            }

            return titleOg;
        },
        quote() {
            if (this.settings.quote) {
                return this.settings.quote;
            }

            return "";
        },
        code() {
            if (this.settings.code) {
                return this.settings.code;
            }

            return "";
        },
        hashtags() {
            if (this.settings.hashtags) {
                return this.settings.hashtags;
            }
            return this.code;
        }
    }
}
