<template>
  <article :class="articleClass">
    <div class="listing_firstWrap__36UOZ">
      <header class="listing_header__2pt4D event_header__u3oXZ">
        <a :href="oListing.permalink">
          <div
            v-if="oListing.featuredImage"
            class="event_img__1mVnG pos-a-full bg-cover"
            :style="{'background-image':'url('+oListing.featuredImage+')'}"
          >
            <img :src="oListing.featuredImage" :alt="oListing.postTitle" />
          </div>
        </a>
      </header>
      <div class="event_body__BfZIC">
        <div class="event_calendar__2x4Hv">
          <span class="event_month__S8D_o color-primary">{{oListing.startsOn}}</span>
          <span class="event_date__2Z7TH" v-if="oListing.startAt">{{oListing.startAt}}</span>
        </div>
        <div class="event_content__2fB-4">
          <h2 class="event_title__3C2PA">
            <a :href="oListing.permalink" v-html="oListing.postTitle"></a>
          </h2>
          <ul class="event_meta__CFFPg list-none">
            <template v-for="(oItem, itemType) in oListing.oBody">
              <li
                v-if="itemType=='google_address'"
                class="event_metaList__1bEBH google_address pos-r"
              >
                <a :href="oItem.value.googleMapAddress" target="_blank">
                  <span
                    v-html="oItem.value.address"
                    class="text-ellipsis d-block"
                    style="padding-right: 70px;"
                  ></span>
                  <span
                    v-if="isSearchNearByMe"
                    style="position: absolute; top: 0; right: 0;"
                    v-html="distanceText"
                  ></span>
                </a>
              </li>
              <li
                v-else-if="itemType=='interested'"
                class="interested_people event_metaList__1bEBH text-ellipsis"
              >
                <span>{{oItem.value}}</span>
              </li>
              <li
                v-else-if="itemType=='event_starts_on'"
                class="starts_on event_metaList__1bEBH text-ellipsis starts_on"
              >
                <span>{{oItem.value.day}} {{oItem.value.hour}}</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <footer class="event_footer__1TsCF">
      <span class="event_by__23HUz">
        {{oTranslation.hostedBy}}
        <a
          :href="oListing.hostedByURL"
          class="color-dark-2"
          :target="oListing.hostedByTarget"
        >{{oListing.hostedByName}}</a>
      </span>
      <div class="event_right__drLk5 pos-a-center-right">
        <span
          :class="generateJsFavoriteClass"
          data-tooltip-placement="top"
          :data-post-id="oListing.postID"
        >
          <i :class="oListing.interestedClass"></i>
        </span>
      </div>
    </footer>
  </article>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      oTranslation: WILCITY_I18,
      defaultArticleClass:
        "event_module__2zicF wil-shadow mb-30 mb-sm-20 js-event"
    };
  },
  props: {
    oListing: {
      type: Object,
      default: {}
    }
  },
  computed: {
    generateJsFavoriteClass() {
      return "event_interested__2RxI- is-event " + WHITE_LABEL + "-js-favorite";
    },
    articleClass() {
      if (this.$store.getters.getTemplateStyle == "list") {
        return this.defaultArticleClass + " js-listing-list";
      }

      return this.defaultArticleClass;
    }
  },
  mounted() {
    this.renderDistanceFromListingToMe();
  }
};
</script>
