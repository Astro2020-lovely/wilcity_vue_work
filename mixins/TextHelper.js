const ShowTextMoreLess = {
    data() {
        return {isShowMore: true, isNoMoreLess: true, showMoreHeight: 100}
    },
    mounted() {
        this.$nextTick(() => {
            this.showMoreLess();
        })
    },
    computed: {
        showMoreLessClasses() {
            return !this.isShowMore ? 'wilcity-expand-text wilcity-show-more color-primary' : 'wilcity-expand-text wilcity-show-less color-primary';
        },
        showMoreBtnName() {
            return !this.isShowMore ? this.$options.filters.filterTranslation('', 'showMore') : this.$options.filters.filterTranslation('', 'showLess');
        }
    },
    methods: {
        toggleShowMoreLess() {
            this.isShowMore = !this.isShowMore;
        },
        showMoreLess() {
            const $content = this.$el.querySelector('.wilcity-review-content');
            if ($content.offsetHeight > 100) {
                this.isShowMore = false;
                this.isNoMoreLess = false;
            }
        }
    }
}

export {
    ShowTextMoreLess
}
