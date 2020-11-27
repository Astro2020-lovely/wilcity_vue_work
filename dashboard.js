// if (WILOKE_GLOBAL.DEBUG_SCRIPT && WILOKE_GLOBAL.DEBUG_SCRIPT == "yes") {
//   Vue.config.devtools = true;
// } else {
Vue.config.silent = true;
Vue.config.devtools = false;
// Vue.config.devtools = true;
// }
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
import Vuex from "vuex";
import { WilQueryHelper } from "./ultils/WilQueryHelper";
Vue.use(Vuex);
window.WilQueryHelper = WilQueryHelper;
// import firebase from './firebase.js';
import DashboardApp from "./components/smart/Dashboard/App.vue";
// import FilterTranslation from './filters/FilterTranslation';
// Vue.filter('filterTranslation', FilterTranslation);

new Vue({
  store: WILCITY_VUEX,
  render: h => h(DashboardApp)
}).$mount("#wilcity-dashboard");
