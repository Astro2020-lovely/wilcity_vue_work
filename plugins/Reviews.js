import WilReviewPopup from "./../components/smart/Review/WilReviewPopup.vue";
import WilDeleteReviewPopup from "./../components/smart/Review/WilDeleteReviewPopup.vue";
import WilReviewBtn from "./../components/smart/Review/WilReviewBtn.vue";
import WilReviewItems from './../components/smart/Review/WilReviewItems.vue';
import WilReviewItem from './../components/smart/Review/WilReviewItem.vue';
import WilReviewDiscussionItems from './../components/smart/Review/WilReviewDiscussionItems.vue';
import WilReviewTotalStatistic from "./../components/smart/Review/WilReviewTotalStatistic.vue";
import WilReviewDetailsStatistic from "./../components/smart/Review/WilReviewDetailsStatistic.vue";
import WilReviewListingStatistic from "./../components/smart/Review/WilReviewListingStatistic.vue";
import {WilClickHelper} from "./../ultils/WilClickHelper";
window.WilClickHelper = WilClickHelper;

export default {
    install(Vue) {
        Vue.component(WilReviewPopup.name, WilReviewPopup);
        Vue.component(WilDeleteReviewPopup.name, WilDeleteReviewPopup);
        Vue.component(WilReviewBtn.name, WilReviewBtn);
        Vue.component(WilReviewItems.name, WilReviewItems);
        Vue.component(WilReviewItem.name, WilReviewItem);
        Vue.component(WilReviewDiscussionItems.name, WilReviewDiscussionItems);
        Vue.component(WilReviewTotalStatistic.name, WilReviewTotalStatistic);
        Vue.component(WilReviewDetailsStatistic.name, WilReviewDetailsStatistic);
        Vue.component(WilReviewListingStatistic.name, WilReviewListingStatistic);
    }
};
