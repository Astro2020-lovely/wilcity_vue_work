__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
import Reviews from "./plugins/Reviews";
import WilReportBtn from "./components/smart/Report/WilReportBtn.vue";
Vue.use(Reviews);
Vue.component(WilReportBtn.name, WilReportBtn);
import {mapActions} from "vuex";

if (document.getElementById('wilcity-single-event-wrapper')) {
    WILOKE_GLOBAL.vmSingleEvent = new Vue({
        el: '#wilcity-single-event-wrapper',
        store: WILCITY_VUEX,
        data() {
            return {reviewConfiguration: {}, data: {}};
        },
        created() {
            this.data = {
                ...WIL_SINGLE_EVENT
            };
            this.reviewConfiguration = {
                ...WIL_REVIEW_CONFIGURATION
            };
        },
        methods: {
            ...mapActions(
                {reviewObserver: "ModuleReviews/reviewObserver"}
            ),
            handleSubmittedDiscussion(data) {
                this.reviewObserver({status: 'prepend', info: data});
            }
        },
        components: {
            WilAddToCalendar: () => import (
                /*webpackChunkName: "WilAddToCalendar"*/
                /*webpackPreload: true*/
                    "./components/smart/Calendar/WilAddToCalendar.vue"
            ),
            WilMapbox: () => import (
                /*webpackChunkName: "WilMapbox"*/
                /*webpackPreload: true*/
                    "./components/dumbs/map/WilMapbox.vue"
            ),
            WilGoogleMap: () => import (
                /*webpackChunkName: "WilGoogleMap"*/
                /*webpackPreload: true*/
                    "./components/dumbs/map/WilGoogleMap.vue"
            ),
            WilToggleController: () => import (
                /*webpackChunkName: "WilToggleController"*/
                /*webpackPreload: true*/
                    "./components/dumbs/WilToggleController.vue"
            ),
            WilCommentForm: () => import (
                /*webpackChunkName: "WilCommentForm"*/
                /*webpackPreload: true*/
                    "./components/smart/Review/WilCommentForm.vue"
            ),
            WilReportBtn: () => import (
                /*webpackChunkName: "WilReportBtn"*/
                /*webpackPreload: true*/
                    "./components/smart/Report/WilReportBtn.vue"
            ),
            WilMessageBtn: () => import (
                /*webpackChunkName: "WilMessageBtn"*/
                /*webpackPreload: true*/
                    "./components/smart/Message/WilMessageBtn.vue"
            ),
            WilFavoriteBtn: () => import (
                /*webpackChunkName: "WilFavoriteBtn"*/
                /*webpackPreload: true*/
                    "./components/smart/Favorite/WilFavoriteBtn.vue"
            )
        }
    });
}
