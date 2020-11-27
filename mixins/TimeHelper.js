const TimeHelper = {
  data() {
    return {
      validDateFormat: ["YYY-MM-DD", "MM-DD-YYYY", "MM-DD-YYY", "DD/MM/YYY"]
    };
  },
  computed: {
    dateFormat() {
      return this.parseDateFormat(WILOKE_GLOBAL.dateFormat);
    },
    timeFormat() {
      let timeFormat = WILOKE_INLINE_GLOBAL.timeFormat.toLowerCase();
      return timeFormat
        .replace("g", "hh")
        .replace("i", "mm")
        .replace("a", "A");
    }
  },
  methods: {
    isValidDateFormat(dateFormat) {
      return this.validDateFormat.includes(dateFormat);
    },
    parseDateFormat(dateFormat) {
      if (this.isValidDateFormat(dateFormat)) {
        return dateFormat;
      }
      dateFormat = dateFormat.toLowerCase();
      return dateFormat
        .replace("j f y", "DD-MM-YYYY")
        .replace("f j y", "MM-DD-YYYY")
        .replace("f. j y", "MM-DD-YYYY")
        .replace("j. f y", "DD-MM-YYYY")
        .replace("j f y", "DD-MM-YYYY")
        .replace("f j, y", "MM-DD-YYYY")
        .replace("j f, y", "DD-MM-YYYY")
        .replace("y-m-d", "YYYY-MM-DD")
        .replace("m/d/y", "MM/DD/YYYY")
        .replace("d/m/y", "DD/MM/YYYY")
        .replace("yyyy", "YYYY")
        .replace("yy", "YY")
        .replace("mm", "MM")
        .replace("dd", "DD")
        .replace("hh:MM", "hh:mm");
    },
    date(timeZone) {
      try {
        const date = !timeZone
          ? new Date()
          : new Date().toLocaleString("en-US", { timeZone });
        return new Date(date);
      } catch (e) {
        return false;
      }
    },
    getLocaleTimeString(timeZone, hourCycle, isRemoveSecond) {
      // h24, h12
      let format = {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle
      };

      if (!!isRemoveSecond === false) {
        format = {
          ...format,
          second: "2-digit"
        };
      }

      if (timeZone) {
        format = {
          ...format,
          timeZone
        };
      }
      try {
        return new Date().toLocaleTimeString("en-US", format);
      } catch (e) {
        return false;
      }
    },
    getHours(timeZone, format, isRemoveSecond) {
      format = !format ? "h24" : format;
      let current = this.getLocaleTimeString(timeZone, format, isRemoveSecond);
      if (current === false) {
        current = this.getLocaleTimeString(null, format, isRemoveSecond);
      }
      return current;
    },
    getDay(timeZone) {
      const date = this.date(timeZone);
      if (!date) {
        return false;
      }

      return date.getDay();
    },
    getLocalString(timeZone) {
      const date = this.date(timeZone);
      if (!date) {
        return false;
      }
      return date.toLocaleString();
    }
  }
};
// this method requires TimeHelpers
const BusinessHourHelper = {
  data() {
    return {
      dayKeys: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ],
      businessHourToday: {},
      businessHourStatus: {
        always_open: {
          status: "always_open",
          text: this.$options.filters.filterTranslation(
            "Always Open",
            "always_open"
          ),
          class: "color-secondary"
        },
        open: {
          status: "open",
          text: this.$options.filters.filterTranslation("Open", "open"),
          class: "color-secondary"
        },
        close: {
          status: "close",
          text: this.$options.filters.filterTranslation("Closed", "closed"),
          class: "color-quaternary"
        }
      }
    };
  },
  methods: {
    todayKey(timeZone) {
      let todayKey = this.getDay(timeZone);
      if (todayKey === false) {
        todayKey = this.getDay();
      }
      return this.dayKeys[todayKey];
    },
    previousDayKey(timeZone) {
      const todayIndex = this.getDay(timeZone);
      const todayKey = this.dayKeys[todayKey];
      if (todayKey === "sunday") {
        return "saturday";
      }

      return this.dayKeys[todayIndex - 1];
    },
    convertTimeToNumber(time) {
      let timestamp;
      if (!time) {
        timestamp = parseInt(time, 10);
      } else {
        let parsedTime = time.replace(":", "").replace(":", "");
        timestamp = parseInt(parsedTime, 10);
      }

      if (isNaN(timestamp)) {
        return 0;
      }

      return timestamp;
    },
    isTurnOffBusinessHour(businessHour) {
      return (
        businessHour.isOpen === "no" ||
        isNaN(businessHour.firstOpenHour) ||
        isNaN(businessHour.firstOpenHour)
      );
    },
    isAlwaysOpen(businessHour) {
      return (
        businessHour.firstCloseHour === businessHour.firstOpenHour &&
        businessHour.firstOpenHour === 240000
      );
    },
    covertBusinessHourToNumber(businessHour) {
      return {
        ...businessHour,
        firstOpenHour: this.convertTimeToNumber(
          businessHour.firstOpenHour,
          true
        ),
        firstCloseHour: this.convertTimeToNumber(
          businessHour.firstCloseHour,
          true
        ),
        secondOpenHour: this.convertTimeToNumber(
          businessHour.secondOpenHour,
          true
        ),
        secondCloseHour: this.convertTimeToNumber(
          businessHour.secondCloseHour,
          true
        )
      };
    },
    findLastBusinessHour(businessHour) {
      const lastOpen =
        businessHour.secondOpenHour === 0
          ? businessHour.firstOpenHour
          : businessHour.secondOpenHour;
      const lastClose =
        businessHour.secondCloseHour === 0
          ? businessHour.firstCloseHour
          : businessHour.secondCloseHour;

      return { lastOpen, lastClose };
    },
    getCurrentBusinessHourStatus(businessHours) {
      if (
        !!businessHours === false ||
        !businessHours.mode ||
        businessHours.mode === "no_hours_available"
      ) {
        this.businessHourToday = false;
      } else if (businessHours.mode === "always_open") {
        this.businessHourToday = {
          ...this.businessHourStatus.always_open
        };
      } else {
        let todayBusinessHour = {
          ...businessHours.operating_times[
            this.todayKey(businessHours.timezone)
          ]
        };

        if (_.isEmpty(todayBusinessHour)) {
          this.businessHourToday = false;
          return true;
        }

        if (todayBusinessHour.firstCloseHour === "00:00:00") {
          todayBusinessHour = {
            ...todayBusinessHour,
            firstCloseHour: "23:59:59"
          };
        }

        if (todayBusinessHour.secondCloseHourUTC === "00:00:00") {
          todayBusinessHour = {
            ...todayBusinessHour,
            secondCloseHourUTC: "23:59:59"
          };
        }

        todayBusinessHour = this.covertBusinessHourToNumber(todayBusinessHour);

        if (this.isTurnOffBusinessHour(todayBusinessHour)) {
          this.businessHourToday = {
            ...this.businessHourStatus.close
          };
          return true;
        }

        if (this.isAlwaysOpen(todayBusinessHour)) {
          this.businessHourToday = {
            ...this.businessHourStatus.always_open
          };

          return true;
        }

        let currentHour = this.convertTimeToNumber(
          this.getHours(businessHours.timezone, "h24")
        );

        let lastCloseHour = todayBusinessHour.firstCloseHour;
        let lastOpenHour = todayBusinessHour.firstOpenHour;

        if (
          currentHour >= todayBusinessHour.firstOpenHour &&
          currentHour <= todayBusinessHour.firstCloseHour
        ) {
          this.businessHourToday = {
            ...this.businessHourStatus.open
          };

          return true;
        }

        if (
          todayBusinessHour.secondCloseHour !==
            todayBusinessHour.secondOpenHour &&
          !isNaN(todayBusinessHour.secondOpenHour) &&
          !isNaN(todayBusinessHour.secondCloseHour)
        ) {
          lastCloseHour = todayBusinessHour.secondOpenHour;
          lastOpenHour = todayBusinessHour.secondOpenHour;
          if (
            currentHour >= todayBusinessHour.secondOpenHour &&
            currentHour <= todayBusinessHour.secondCloseHour
          ) {
            this.businessHourToday = {
              ...this.businessHourStatus.open
            };
            return true;
          }
        }
        // This is special case: Some businesses may close over middle night. We allows maximum 05:00 AM, so the business hour must smaller than 05:00:00 AM
        if (
          currentHour > lastOpenHour &&
          currentHour < 235959 &&
          lastCloseHour <= 71000
        ) {
          this.businessHourToday = {
            ...this.businessHourStatus.open
          };
          return true;
        }

        let prevDayBusinessHour = {
          ...businessHours.operating_times[
            this.previousDayKey(businessHours.timezone)
          ]
        };

        prevDayBusinessHour = this.covertBusinessHourToNumber(
          prevDayBusinessHour
        );

        if (this.isTurnOffBusinessHour(prevDayBusinessHour)) {
          this.businessHourToday = {
            ...this.businessHourStatus.close
          };
          return true;
        }

        const prevDayLastBusinessHour = this.findLastBusinessHour(
          prevDayBusinessHour
        );
        if (prevDayLastBusinessHour.lastClose > 71000) {
          this.businessHourToday = {
            ...this.businessHourStatus.close
          };

          return true;
        }

        if (currentHour < prevDayLastBusinessHour.lastClose) {
          this.businessHourToday = {
            ...this.businessHourStatus.open
          };
          return true;
        }

        this.businessHourToday = {
          ...this.businessHourStatus.close
        };

        return true;
      }
    }
  }
};

export { TimeHelper, BusinessHourHelper };
