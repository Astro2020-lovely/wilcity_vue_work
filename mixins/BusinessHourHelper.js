// this method requires TimeHelpers
export const BusinessHourHelper = {
    data() {
        return {
            dayKeys: [
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday'
            ],
            businessHourToday: {}
        };
    },
    methods: {
        todayKey(timezone) {
            let todayKey = this.getDay(timezone);
            if (todayKey) {
                today = this.getDay();
            }
            return today;
        },
        convertTimeToNumber(time) {
            let parsedTime = time.replace(':', '').replace(':', '');
            if (!parseInt.length) {
                return 0;
            }

            return parseInt(parsedTime, 10);
        },
        getCurrentBusinessHourStatus(businessHours) {
            if (!businessHours || !businessHours.mode || businessHours.mode === 'no_hours_available') {
                this.businessHourToday = false;
            } else if (businessHours.mode === 'always_open') {
                this.businessHourToday = {
                    status: 'always_open',
                    text: this.$options.filters.filterTranslation('24/24', 'always_open'),
                    class: 'color-secondary'
                };
            } else {
                let todayBusinessHour = {
                    ...businessHours.operating_times[this.todayKey(businessHours.timezone)]
                };

                if (todayBusinessHour.isOpen === 'no' || ! todayBusinessHour.firstOpenHour.length || ! todayBusinessHour.firstOpenHour.length) {
                    this.businessHourToday = {
                        status: 'close',
                        text: this.$options.filters.filterTranslation('Closed', 'closed'),
                        class: 'color-secondary'
                    };

                    return true;
                }

                if (todayBusinessHour.firstCloseHour === todayBusinessHour.firstOpenHour && todayBusinessHour.firstOpenHour === '24:00:00') {
                    this.businessHourToday = {
                        status: 'open',
                        text: this.$options.filters.filterTranslation('24/24', 'always_open'),
                        class: 'color-secondary'
                    };

                    return true;
                }
                console.log(this.getHours(businessHours.timezone, 'h24'));
                let currentHour = this.convertTimeToNumber(this.getHours(businessHours.timezone, 'h24'));
                todayBusinessHour = todayBusinessHour.map(item => {
                    let businessHour = {
                        ...item
                    };
                    businessHour.firstOpenHour = this.convertTimeToNumber(businessHour.firstOpenHour);
                    businessHour.firstCloseHour = this.convertTimeToNumber(businessHour.firstCloseHour);
                    businessHour.secondOpenHour = this.convertTimeToNumber(businessHour.secondOpenHour);
                    businessHour.secondCloseHour = this.convertTimeToNumber(businessHour.secondCloseHour);

                    return businessHour;
                });

                const openStatus = {
                    status: 'open',
                    text: this.$options.filters.filterTranslation('Open', 'open'),
                    class: 'color-secondary'
                };
                const closedStatus = {
                    status: 'closed',
                    text: this.$options.filters.filterTranslation('Closed', 'closed'),
                    class: 'color-quaternary'
                };

                let lastCloseHour = todayBusinessHour.firstCloseHour;
                if (currentHour >= todayBusinessHour.firstOpenHour && currentHour <= todayBusinessHour.firstCloseHour) {
                    this.businessHourToday = {
                        ... openStatus
                    };

                    return true;
                }

                if (todayBusinessHour.secondCloseHour !== todayBusinessHour.secondOpenHour) {
                    lastCloseHour = todayBusinessHour.secondOpenHour;
                    if (currentHour >= todayBusinessHour.secondCloseHour && currentHour <= todayBusinessHour.secondOpenHour) {
                        this.businessHourToday = {
                            ... openStatus
                        };
                        return true;
                    }
                }

                if (currentHour < 25959 && lastCloseHour < 25959 && currentHour < lastCloseHour) { // This is special case: Some businesses may close at middle night. We allows maximum 02:59 AM, so the business hour must smaller than 2:59:59 AM
                    this.businessHourToday = {
                        ... openStatus
                    };
                    return true;
                }

                this.businessHourToday = {
                    ... closedStatus
                };

                return true;
            }
        }
    }
};
