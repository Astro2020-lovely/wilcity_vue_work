// Register And Login
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;
import LoginRegisterApp from "./components/smart/LoginRegister/App.vue";
// if (WILOKE_GLOBAL.DEBUG_SCRIPT && WILOKE_GLOBAL.DEBUG_SCRIPT == "yes") {
//   Vue.config.devtools = true;
// } else {
Vue.config.silent = true;
Vue.config.devtools = false;
// Vue.config.devtools = true;
// }
if (document.getElementById("wil-login-register-controller")) {
  new Vue({
    render: h => h(LoginRegisterApp)
  }).$mount("#wil-login-register-controller");

  jQuery(".wilcity-trigger-login-button").on("click", event => {
    event.preventDefault();
    jQuery("body").trigger("onOpenLoginRegisterPopup", ["login"]);
  });

  jQuery(".wilcity-trigger-register-button").on("click", event => {
    event.preventDefault();
    jQuery("body").trigger("onOpenLoginRegisterPopup", ["register"]);
  });
}
