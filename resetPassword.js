import Vue from 'vue/dist/vue.esm.js';
__webpack_public_path__ = WILOKE_INLINE_GLOBAL.productionURL;

import WilAlert from './components/dumbs/WilAlert.vue'
if (document.getElementById('wilcity-reset-password')) {
    new Vue({
        el: '#wilcity-reset-password',
        data() {
            return {
                usernameOrEmail: '',
                newPassword: '',
                msgStatus: '',
                rpKey: '',
                hideForm: false,
                msg: ''
            }
        },
        computed: {
            getResetLinkBtnClass() {
                let formBtnClass = 'wil-btn wil-btn--primary wil-btn--block wil-btn--md wil-btn--round';
                if (this.usernameOrEmail.length) {
                    return formBtnClass;
                }

                return formBtnClass + ' disable';
            },
            resetPassWordLinkBtnClass() {
                let formBtnClass = 'wil-btn wil-btn--primary wil-btn--block wil-btn--md wil-btn--round';
                if (this.newPassword.length) {
                    return formBtnClass;
                }

                return formBtnClass + ' disable';
            },
            wrapperResetPasswordField() {
                if (this.newPassword.length) {
                    return 'field_module__1H6kT field_style2__2Znhe mb-15 active';
                }
                return 'field_module__1H6kT field_style2__2Znhe mb-15';
            }
        },
        methods: {
            addLoading($btn) {
                $btn.toggleClass('wil-btn--loading');
                $btn.append('<div class="pill-loading_module__3LZ6v"><div class="pill-loading_loader__3LOnT"></div></div>');
            },
            removeLoading($btn) {
                $btn.toggleClass('wil-btn--loading');
                $btn.find('.pill-loading_module__3LZ6v').remove();
            },
            sendResetPasswordLink(event) {
                let $btn = jQuery(event.currentTarget).find('button');
                this.addLoading($btn);

                jQuery.ajax({
                    type: 'POST',
                    url: WILOKE_GLOBAL.ajaxurl,
                    data: {
                        action: 'wilcity_send_retrieve_password',
                        user_login: this.usernameOrEmail
                    },
                    success: response => {
                        if (response.success) {
                            this.hideForm = true;
                            this.msgStatus = 'success';
                        } else {
                            this.msgStatus = 'danger';
                        }
                        this.msg = response.data;
                        this.removeLoading($btn);
                    }
                })
            },
            updatePassword(event) {
                const $btn = jQuery(event.currentTarget).find('button');
                this.addLoading($btn);

                jQuery.ajax({
                    type: 'POST',
                    url: WILOKE_GLOBAL.ajaxurl,
                    data: {
                        action: 'wilcity_update_password',
                        user_login: document.getElementById('wilcity-rp-username').value,
                        rpKey: document.getElementById('wilcity-rp-key').value,
                        newPassword: this.newPassword
                    },
                    success: response => {
                        if (response.success) {
                            this.hideForm = true;
                            this.msgStatus = 'success';
                        } else {
                            this.msgStatus = 'danger';
                        }
                        this.msg = response.data;
                        this.removeLoading($btn);
                    }
                });

            }
        },
        components: {
          WilAlert
        }
    });
}
