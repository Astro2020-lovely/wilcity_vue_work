export const WilClickHelper = {
    next(cb) {
        if (WILOKE_INLINE_GLOBAL.isUserLoggedIn !== "yes") {
            if (WIL_REGISTER_LOGIN.mode === 'popup') {
                jQuery("body").trigger("onOpenLoginRegisterPopup", ['login-form']);
                return false;
            } else {
                window.location.href = `${
                    WIL_REGISTER_LOGIN.customLoginPageUrl
                }?redirect_to=${
                    WIL_REGISTER_LOGIN.loggedInRedirectTo
                }`;
                return false;
            }
        }
        return cb();
    }
};
