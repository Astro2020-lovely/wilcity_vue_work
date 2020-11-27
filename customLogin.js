const $SocialLogin = document.getElementById(WHITE_LABEL + '-social-login');

if ($SocialLogin) {
    new Vue({
        el: '#' + WHITE_LABEL + '-social-login',
        components: {
            AppleLogin: () => import (
                /*webpackChunkName: 'AppleLogin' */
                    "./components/smart/LoginRegister/AppleLogin.vue"
            )
        }
    });
}
