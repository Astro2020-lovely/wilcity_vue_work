import WilHeroSearchForm from "./components/smart/HeroSearchForm/WilHeroSearchForm.vue";
import ModuleHeroSearchForm from "./store/modules/ModuleHeroSearchForm.js";
const $hero = document.getElementById(WHITE_LABEL + '-hero-search-form');
WILCITY_VUEX.registerModule("ModuleHeroSearchForm", ModuleHeroSearchForm);

if (document.getElementById(WHITE_LABEL + '-hero-search-form')) {
    new Vue({
        store: WILCITY_VUEX,
        render: createElement => {
            const context = {
                props: {
                    ... $hero.dataset
                }
            };
            return createElement(WilHeroSearchForm, context);
        }
    }).$mount(`#${WHITE_LABEL}-hero-search-form`);
}
