import {WilUserAgentHelper} from "./../ultils/WilUserAgentHelper.js";
export default {
    data() {
        return {
            distanceText: '',
            oGeoLocation: {
                lat: null,
                lng: null
            },
            isNotification: false,
            errCode: 0
        };
    },
    props: {
        isSearchNearByMe: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        buildRestEndpoint(request) {
            return WILOKE_GLOBAL.restAPI + request;
        },
        cacheGeoCode(position) {
            if (this.isNotification) {
                this.notifyMsg({
                    type: 'success',
                    msg: this.$options.filters.filterTranslation('Detecting your location', 'gotYourLocation')
                })
            }
            const now = Date.now();
            localStorage.setItem('geocode_saved_at', now);
            localStorage.setItem('geocode', position.coords.latitude + '-' + position.coords.longitude);
            this.oGeoLocation = {
                ...this.oGeoLocation,
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        },
        askForLocation() {
            if (navigator.geolocation) {
                if (this.isNotification) {
                    this.notifyMsg({
                        type: 'info',
                        msg: this.$options.filters.filterTranslation('Detecting your location', 'detectingYourLocation')
                    })
                }

                return new Promise((resolve, reject) => {
                    navigator.geolocation.watchPosition(resolve, reject, {
                        timeout: 10000,
                        enableHighAccuracy: true,
                        maximumAge: 432000 // 15 days
                    });
                });
            } else {
                if (this.isNotification) {
                    this.notifyMsg({
                        type: 'warn',
                        msg: this.$options.filters.filterTranslation('Your browser does not support this feature', 'geocoderNotSupported')
                    });
                }
            }

            this.errCode = 1;
            return false;
        },
        getGeoCodeCache() {
            return this.oGeoLocation;
        },
        notifyMsg(
            {msg, type}
        ) {
            if (!this.isNotification) {
                return false;
            }
            Vue.notify({type, text: msg, duration: 50000});
        },
        notifyGeocoderErr(oErr) {
            if (oErr.code === 1) {
                if (WilUserAgentHelper.isChrome()) {
                    this.notifyMsg({
                        type: 'warn',
                        msg: this.$options.filters.filterTranslation('', 'chromeEnableGeocoderSuggestion')
                    });
                } else {
                    this.notifyMsg({
                        type: 'warn',
                        msg: this.$options.filters.filterTranslation('', 'youMustEnableGeocoder')
                    });
                }
            } else {
                this.notifyMsg({type: 'warn', msg: oErr.message});
            }
        },
        async getGeoLocationLatLng({notification}) {
            if (!!notification) {
                this.isNotification = notification;
            }
            const geocode = localStorage.getItem('geocode');

            if (1 === 1) {
                const oNewGeocode = await this.askForLocation().catch(oErr => {
                    this.notifyGeocoderErr(oErr);
                });
                if (oNewGeocode) {
                    this.cacheGeoCode(oNewGeocode);
                }
            } else {
                const savedAt = localStorage.getItem('geocode_saved_at');
                const now = Date.now();
                const millis = now - savedAt;
                if (millis / 10000 >= 600) {
                    localStorage.removeItem('geocode');
                    localStorage.removeItem('geocode_saved_at');
                    const oNewGeocode = await this.askForLocation().catch(oErr => {
                        this.notifyGeocoderErr(oErr);
                    });
                    if (oNewGeocode) {
                        this.cacheGeoCode(oNewGeocode);
                    }
                } else {
                    const aParse = geocode.split('-');
                    this.oGeoLocation = {
                        ...this.oGeoLocation,
                        lat: aParse[0],
                        lng: aParse[1]
                    };
                }
            }

            return this.oGeoLocation.lat !== null;
        },
        async getDistance(oFLatLng, oSLatLng2, unit) {
            if (_.isEmpty(oSLatLng2)) {
                await this.getGeoLocationLatLng({notification: false});
                oSLatLng2 = {
                    ...this.oGeoLocation
                };
            }

            if (_.isUndefined(unit)) {
                unit = WILOKE_INLINE_GLOBAL.unit;
            }

            if ((oFLatLng.lat === oSLatLng2.lat) && (oSLatLng2.lng === oFLatLng.lng)) {
                return 0;
            }

            const radlat1 = Math.PI * oFLatLng.lat / 180;
            const radlat2 = Math.PI * oSLatLng2.lat / 180;
            const theta = oFLatLng.lng - oSLatLng2.lng;
            const radtheta = Math.PI * theta / 180;
            // eslint-disable-next-line no-mixed-operators
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit === 'km') {
                dist = dist * 1.609344;
            }

            return dist;
        },
        async calculateDistanceFromListingToMe(listingLatLng, myLatLng) {
            const distance = await this.getDistance({
                lat: listingLatLng.lat,
                lng: listingLatLng.lng
            }, myLatLng);

            if (distance > 10) {
                this.distanceText = '';
            } else {
                this.distanceText = distance.toFixed(2) + ' ' + WILOKE_INLINE_GLOBAL.unit.toUpperCase();
            }

            return this.distanceText;
        }
    }
};
