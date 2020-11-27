export default class Helpers {
    static parsePosition(position) {
        Helpers.oGeoLocation.lat = position.coords.latitude;
        Helpers.oGeoLocation.lng = position.coords.longitude;
        let now = Date.now();
        localStorage.setItem('geocode_saved_at', now);
        localStorage.setItem('geocode', position.coords.latitude + '-' + position.coords.longitude);
        return Helpers.oGeoLocation;
    }

    static generateChatRoomKey(fUser, sUser) {
        return '___' + fUser + '___' + sUser + '___';
    }

    static async askForLocation() {
        if (navigator.geolocation) {
            Helpers.oGeoLocation = {};
            return await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition((position) => {
                    Helpers.oGeoLocation.lat = position.coords.latitude;
                    Helpers.oGeoLocation.lng = position.coords.longitude;
                    let now = Date.now();
                    localStorage.setItem('geocode_saved_at', now);
                    localStorage.setItem('geocode', position.coords.latitude + '-' + position.coords.longitude);
                    return resolve(Helpers.oGeoLocation);
                });
            })
        } else {
            return false;
        }
    }

    static async getGeoLocationLatLng() {
        let geocode = localStorage.getItem('geocode');
        if (typeof geocode === 'undefined' || geocode === null) {
            await Helpers.askForLocation();
        } else {
            let savedAt = localStorage.getItem('geocode_saved_at');
            let now = Date.now();
            let millis = now - savedAt;
            if (millis / 10000 >= 600) {
                localStorage.removeItem('geocode');
                localStorage.removeItem('geocode_saved_at');
                return await Helpers.askForLocation();
            } else {
                let lat = '',
                    lng = '',
                    aParse = geocode.split('-');

                if (aParse.length == 4) {
                    lat = aParse[1] * -1;
                    lng = aParse[3] * -1;
                } else if (aParse.length == 3) {
                    if (geocode.indexOf('--') != -1) {
                        lat = aParse[0] * 1;
                        lng = aParse[2] * -1;
                    } else {
                        lat = aParse[0] * -1;
                        lng = aParse[2] * 1;
                    }
                } else {
                    lat = aParse[0] * 1;
                    lng = aParse[1] * 1;
                }

                Helpers.oGeoLocation = {};
                Helpers.oGeoLocation.lat = lat;
                Helpers.oGeoLocation.lng = lng;

                return Helpers.oGeoLocation;
            }
        }
    }

    static isNull(val) {
        return val === '' || val === null || (typeof val === 'object' && !Object.keys(val).length) || typeof val === 'undefined';
    }

    static renderCalculateDistance($target, oCurrentDistance) {
        $target.each(function () {
            let $this = jQuery(this);
            let oLatLng = $this.data('latlng');
            let oDistance = WilCityHelpers.getDistance(oLatLng, oCurrentDistance);
            oDistance.then(distance => {
                $this.append('<span style="position: absolute; top: 0; right: 0;">' + distance.toFixed(2) + ' ' + WILOKE_INLINE_GLOBAL.unit.toUpperCase() + '</span>');
            })
        });
    }

    static mapboxGetAddressByLatLng(lat, lng) {
        let baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(lat + ',' + lng) + '.json?access_token=' + WILOKE_GLOBAL.mapAPI + '&limit=10&autocomplete=true';
        jQuery.get(baseURL, (oResponse => {
            console.log(oResponse);
        }))
    }

    static count(oTarget) {
        if (typeof oTarget === 'object') {
            return Object.keys(oTarget).length;
        }

        return oTarget.length;
    }

    static async getDistance(oFLatLng, oSLatLng2, unit) {
        if (typeof oSLatLng2 === 'undefined' || oSLatLng2 === null) {
            await Helpers.getGeoLocationLatLng({notification: false});
            oSLatLng2 = Helpers.oGeoLocation;
        }

        if (typeof unit === 'undefined') {
            unit = WILOKE_INLINE_GLOBAL.unit;
        }

        if ((oFLatLng.lat === oSLatLng2.lat) && (oSLatLng2.lng === oFLatLng.lng)) {
            return 0;
        } else {
            let radlat1 = Math.PI * oFLatLng.lat / 180;
            let radlat2 = Math.PI * oSLatLng2.lat / 180;
            let theta = oFLatLng.lng - oSLatLng2.lng;
            let radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit === 'km') {
                dist = dist * 1.609344
            }

            return dist;
        }
    }

    static isRestError(oResponse) {
        return typeof oResponse.error !== 'undefined';
    }

    static buildRestRequest(request) {
        return WILOKE_GLOBAL.restAPI + request;
    }

    static consoleInternalMessage(oResponse) {
        if (typeof oResponse.error.internalMessage) {
            console.log(oResponse.error.internalMessage);
        }
    }

    static consoleUserMessage(oResponse) {
        if (typeof oResponse.error.userMessage) {
            console.log(oResponse.error.userMessage);
        }
    }

    static getUserMessage(oResponse) {
        return typeof oResponse.error.userMessage && oResponse.error.userMessage;
    }

    static buildFirebaseUsersKey(userID) {
        return 'messages/users/___' + userID + '___';
    }

    static maybeMapMessage(message) {
        if (message.indexOf('longitude') !== -1) {
            try {
                let oLatLng = JSON.parse(message);
                let mapURL = 'https://www.google.com/maps/search/?api=1&query=' + oLatLng.latitude + ',' + oLatLng.longitude;
                return '<a target="_blank" class="js-single-map wil-single-map" href="' + mapURL + '">' + mapURL + '</a>';
            } catch (oE) {
                return '';
            }
        } else {
            return WilCityHelpers.unSlashed(message);
        }
    }

    static objectReserve(oValues) {
        let aKeys = Object.keys(oValues);
        let aReverseValues = Object.values(oValues).reverse();
        let oNewValues = {};

        for (let i = 0; i < aReverseValues.length; i++) {
            oNewValues[aKeys[i]] = aReverseValues[i];
        }
        return oNewValues;
    }

    static timestampToDate(timestamp, format) {
        let oDate = new Date(timestamp);
        switch (format) {
            case 'Y-m-d':
                return oDate.getFullYear() + '-' + oDate.getMonth() + '-' + oDate.getDay();
                break;
            case 'm/d/Y':
                return oDate.getMonth() + '-' + oDate.getDay() + '-' + oDate.getFullYear();
                break;
            case 'd/m/Y':
                return oDate.getDay() + '-' + oDate.getMonth() + '-' + oDate.getFullYear();
                break;
            default:
                let now = new Date();
                if (((now - timestamp) / (1000 * 60 * 60 * 24)) > 1) {
                    return oDate.toLocaleDateString(WILOKE_GLOBAL.localeCode, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                } else {
                    return oDate.toLocaleTimeString(WILOKE_GLOBAL.localeCode);
                }
                break;
        }
    }

    static renderSentAt(timestamp, dateFormat) {
        timestamp = parseInt(timestamp);
        let oDate = new Date();
        let currentTimestamp = oDate.getTime();
        let sub = currentTimestamp - timestamp;
        if (sub <= 60000) {
            return WILCITY_I18.oneMinuteAgo;
        } else if (sub <= 600000) {
            return WILCITY_I18.aFewMinutesAgo;
        } else if (sub < 3600000) {
            let minute = parseInt(sub / 1000 / 60);
            return minute + ' ' + WILCITY_I18.minutesAgo;
        } else if (sub < 86400000) {
            let hour = parseInt(sub / 1000 / 60 / 60);
            return hour + (hour > 1 ? ' ' + WILCITY_I18.hoursAgo : ' ' + WILCITY_I18.hourAgo);
        } else {
            return Helpers.timestampToDate(timestamp, dateFormat);
        }
    }

    static unSlashed(message) {
        return message.replace(/\\/g, '');
    }

    static setFirebaseID(userID) {
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('firebaseUserID', userID);
        } else {
            alert(WILCITY_I18.browserDoesNotSupportLocalStore);
        }
    }

    static getFirebaseUserID() {
        if (typeof(Storage) !== 'undefined') {
            return localStorage.getItem('firebaseUserID');
        } else {
            alert(WILCITY_I18.browserDoesNotSupportLocalStore);
        }
    }

    static clearFirebaseID() {
        if (typeof(Storage) !== 'undefined') {
            localStorage.removeItem('firebaseUserID');
        } else {
            alert(WILCITY_I18.browserDoesNotSupportLocalStore);
        }
    }

    static scrollTop(target, offset) {
        let $target = typeof target === 'undefined' ? jQuery('html, body') : jQuery(target);
        $target.stop().animate({
            scrollTop: 0
        }, offset, 'swing');
    }

    static validEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    static ucFirst(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    static isMobile(type, screenSize) {
        if (typeof screenSize !== 'undefined') {
            if (screenSize <= window.innerWidth) {
                return false;
            }
        }

        switch (type) {
            case 'Android':
                return navigator.userAgent.match(/Android/i);
                break;
            case 'BlackBerry':
                return navigator.userAgent.match(/BlackBerry/i);
                break;
            case 'IOS':
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                break;
            case 'Opera':
                return navigator.userAgent.match(/Opera Mini/i);
                break;
            case 'Windows':
                return navigator.userAgent.match(/IEMobile/i);
                break;
            default:
                return Helpers.isMobile('Android') || Helpers.isMobile('BlackBerry') || Helpers.isMobile('IOS') || Helpers.isMobile('Opera') || Helpers.isMobile('Windows');
                break;
        }
    }

    static convertFirebaseToOrderByDescTimestamp(oSnap) {
        let aValues = Object.values(oSnap);
        let aKeys = Object.keys(oSnap);

        for (let i in aValues) {
            aValues[i].key = aKeys[i];
        }

        aValues.reverse();
        return aValues;
    }

    static additionalHeightToScrollTop() {
        let additional = 0;
        if (jQuery('header.js-header-sticky').length) {
            additional = 88;
        }

        let $adminBar = jQuery('#wpadminbar');
        if ($adminBar.lenght) {
            additional += $adminBar.outerHeight();
        }
        return additional;
    }

    static getParamFromUrl(target, href) {
        let getUrl = typeof href !== 'undefined' ? href : window.location.href;
        if (getUrl.indexOf(target + '=') === -1) {
            return false;
        }

        let aFStep = getUrl.split(target + '=');
        let aSStep = aFStep[1].indexOf('#') !== -1 ? aFStep[1].split('#') : aFStep[1].split('&');
        return aSStep[0];
    }

    static pushState(hash) {
        let currentPage = '';
        if (hash.indexOf('paged=') === -1) {
            if (window.location.href.indexOf('paged=') !== -1) {
                currentPage = Helpers.getParamFromUrl('page', window.location.href);
            }
        }

        if (currentPage.length) {
            if (hash.indexOf('?') !== -1) {
                hash += '&paged=' + currentPage;
            } else {
                hash += '?paged=' + currentPage;
            }
        }
        window.history.pushState({
            href: hash
        }, '', hash);
    }

    static buildRouter(route, url) {
        url = typeof url !== 'undefined' ? url : window.location.href;

        if (url.indexOf('?') === -1) {
            url += '#' + route;
        } else {
            let aParseUrl = url.split(',');
            url = aParseUrl[0] + '#' + route + '?' + aParseUrl[1];
        }
        return url;
    }

    static buildQuery(args, param, url) {
        url = typeof url !== 'undefined' ? url : window.location.href;
        param = encodeURIComponent(param);
        if (url.indexOf('?') === -1) {
            url = url + '?' + args + '=' + param;
        } else {
            url = url + '&' + args + '=' + param;
        }
        return url;
    }
}
