<template>
  <article
    :class="[wrapperClasses, type === 'list' ? 'js-listing-list' : '', 'wil-shadow wil-flex-column-between']"
  >
    <div class="listing_firstWrap__36UOZ">
      <header class="listing_header__2pt4D event_header__u3oXZ">
        <a :href="item.permalink">
          <div
            v-if="item.featuredImage"
            class="event_img__1mVnG pos-a-full bg-cover"
            :style="{'background-image':'url('+item.featuredImage+')'}"
          >
            <img :src="item.featuredImage" :alt="item.postTitle" />
          </div>
        </a>
      </header>
      <div class="event_body__BfZIC">
        <div class="event_calendar__2x4Hv">
          <span class="event_month__S8D_o color-primary">{{item.eventData.startsOn}}</span>
          <span class="event_date__2Z7TH" v-if="item.eventData.startAt">{{item.eventData.startAt}}</span>
        </div>
        <div class="event_content__2fB-4">
          <h2 class="event_title__3C2PA">
            <a :href="item.permalink" v-html="item.title"></a>
          </h2>
          <ul class="event_meta__CFFPg list-none">
            <li v-if="item.oAddress" class="event_metaList__1bEBH google_address pos-r">
              <a :href="item.oAddress.addressOnGGMap" target="_blank">
                <span
                  v-html="item.oAddress.address"
                  class="text-ellipsis d-block"
                  style="padding-right: 70px;"
                ></span>
              </a>
            </li>
            <li class="interested_people event_metaList__1bEBH text-ellipsis">
              <span>{{item.eventData.interested.value}}</span>
            </li>
            <li class="starts_on event_metaList__1bEBH text-ellipsis">
              <span>{{'Start'|filterTranslation('start')}}</span>
              <span>
                <span class="wil-event-date">{{item.eventData.start.day}}</span>
                <span class="wil-event-hours">{{item.eventData.start.hour}}</span>
              </span>
            </li>
            <li class="ends_on event_metaList__1bEBH text-ellipsis">
              <span>{{'End'|filterTranslation('end')}}</span>
              <span>
                <span class="wil-event-date">{{item.eventData.end.day}}</span>
                <span class="wil-event-hour">{{item.eventData.end.hour}}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <footer class="event_footer__1TsCF">
      <span class="event_by__23HUz">
        <span>{{'Hosted By'|filterTranslation('hostedBy')}}</span>
        <a
          :href="item.eventData.hostedByURL"
          class="color-dark-2"
          :target="item.eventData.hostedByTarget"
        >{{item.eventData.hostedByName}}</a>
      </span>
      <div class="event_right__drLk5 pos-a-center-right">
        <wil-favorite
          :key="`${uniqid}-${item.ID}`"
          :post="item"
          icon-type="interesting"
          :saved="isMyFavorite"
          @change="handleFavoriteChange"
          wrapper-classes="event_interested__2RxI- is-event"
        />
      </div>
    </footer>
  </article>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "wil-event-item",
  data() {
    return {
      isMyFavorite: "no"
    };
  },
  created() {
    this.isMyFavorite = this.item.isMyFavorite;
  },
  methods: {
    handleFavoriteChange(status) {
      this.isMyFavorite = status;
    }
  },
  components: {
    WilFavorite: () =>
      import(
        /* WilFavorite */
        "./../../dumbs/grid/WilFavorite.vue"
      )
  },
  props: {
    item: {
      type: Object,
      default: () => {},
      required: true
    },
    wrapperClasses: {
      type: String,
      default: "event_module__2zicF wil-shadow mb-30 mb-sm-20 js-event"
    },
    type: {
      type: String,
      default: "grid" // layout type
    }
  },
  computed: {
    uniqid() {
      const date = new Date().getTime();
      return `${date}`;
    },
    generateJsFavoriteClass() {
      return "event_interested__2RxI- is-event " + WHITE_LABEL + "-js-favorite";
    }
  }
};
</script>
