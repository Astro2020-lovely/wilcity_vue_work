export const WilUserAgentHelper = {
    is(cb) {
        return cb();
    },
    isOpera() {
        if ((!!window.opr && !!opr.addons) || !!window.opera || (navigator.userAgent.indexOf(' OPR/') >= 0)) {
            return true;
        }

        return false;
    },
    isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    },
    isSafari() {
        return /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    },
    isIE() {
        return /*@cc_on!@*/
        false || !!document.documentMode;
    },
    isEdge() {
        return !isIE && !!window.StyleMedia;
    },
    isChrome() {
        return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime || !!window.chrome.csi);
    }
}
