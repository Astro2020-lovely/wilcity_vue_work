// import Vue from 'vue/dist/vue.esm.js';
import WilQuickSearchFormField from "./components/smart/QuickSearchForm/WilQuickSearchFormField.vue";
const id = `${WHITE_LABEL}-quick-search-wrapper`;
if (document.getElementById(id)) {
    new Vue({
        render: h => h(WilQuickSearchFormField)
    }).$mount(`#${id}`);
}
