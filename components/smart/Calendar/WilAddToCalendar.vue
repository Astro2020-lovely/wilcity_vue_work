<template>
  <div :class="wrapperClasses" style="z-index: 9">
    <ul :class="ulClasses">
      <li v-for="(item, key) in items" :key="`wil-add-to-${key}-calendar`" :class="liClasses">
        <a
          class="list_link__2rDA1 text-ellipsis color-primary--hover"
          :href="buildParams(key)"
          target="_blank"
        >
          <span :class="iconWrapperClasses">
            <i :class="item.icon"></i>
          </span>
          <span :class="textClasses">{{item.text|filterTranslation(item.textTranslation)}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "wil-add-to-calendar",
  data() {
    return {
      items: {
        google: {
          url: "http://www.google.com/calendar/event?action=TEMPLATE&trp=false",
          text: "Google calendar",
          textTranslation: "googleCalendar",
          icon: "fa fa-google"
        },
        microsoft: {
          url: "https://outlook.live.com/owa/?rru=addevent",
          text: "Microsoft live calendar",
          textTranslation: "microsoftCalendar",
          icon: "fa fa-windows"
        }
      }
    };
  },
  methods: {
    formatString(string) {
      return encodeURIComponent(string).replace(/%20/g, "+");
    },
    formatDate(date) {
      return date ? date.toISOString().replace(/-|:|\.\d+/g, "") : null;
    },
    buildParams(cb) {
      const parameters = this[`${cb}Params`](
        this.formatString(this.title),
        this.formatString(this.location),
        this.formatString(this.details),
        this.formatDate(new Date(this.startTimestamp)),
        this.formatDate(new Date(this.endTimestamp))
      );

      let url = `${this.items[cb].url}`;
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key) && parameters[key]) {
          url += `&${key}=${parameters[key]}`;
        }
      }

      return url;
    },
    googleParams(title, location, details, start, end) {
      const parameters = {
        text: title,
        location: location,
        details: details
      };

      if (start && end) {
        parameters.dates = `${start}/${end}`;
      }

      return parameters;
    },
    microsoftParams(title, location, details, start, end) {
      return {
        subject: title,
        location: location,
        body: details,
        startdt: start,
        enddt: end
      };
    }
  },
  mounted() {},
  props: {
    wrapperClasses: {
      type: String,
      default: "listing-detail_shareContent__2nr-2 active"
    },
    ulClasses: {
      type: String,
      default:
        "list_module__1eis9 list-none list_social__31Q0V list_medium__1aT2c list_abs__OP7Og arrow--top-right"
    },
    liClasses: {
      type: String,
      default: "list_item__3YghP"
    },
    iconWrapperClasses: {
      type: String,
      default: "list_icon__2YpTp"
    },
    textClasses: {
      type: String,
      default: "list_text__35R07"
    },
    startTimestamp: {
      type: Number,
      required: true
    },
    endTimestamp: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    details: {
      type: String,
      default: ""
    }
  }
};
</script>
