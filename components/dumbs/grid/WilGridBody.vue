<template>
  <div class="listing_body__31ndf">
    <slot name="beforebody" :post="post" :items="items"></slot>
    <a v-if="post.logo" class="listing_goo__3r7Tj" :href="post.permalink">
      <div
        class="listing_logo__PIZwf bg-cover"
        :style="{ 'background-image': `url(${post.logo})` }"
      ></div>
    </a>
    <h2 class="listing_title__2920A text-ellipsis">
      <a :href="post.permalink" v-html="post.title"></a>
    </h2>
    <div
      class="listing_tagline__1cOB3 text-ellipsis"
      v-html="post.excerpt"
    ></div>
    <div
      v-if="items.length"
      class="listing_meta__6BbCG"
      ref="listing_meta__6BbCG"
      style="position: relative;"
    >
      <template v-for="(item, index) in items">
        <template v-if="taxonomies.includes(item.type)">
          <template v-if="item.value && item.value.length">
            <div
              :class="[`grid-body-item-${item.type}`, itemMetaClasses]"
              :key="`grid-body-item-${item.type}-${index}`"
            >
              <i v-if="item.icon" :class="[item.icon, 'color-primary']"></i>
              <div style="display: inline; margin-left: 5px;">
                <wil-grid-term
                  v-for="(term, valueOrder) in item.value"
                  :key="`grid-body-item-term-${valueOrder}-${uquid}`"
                  :is-disable-icon="true"
                  :item="term"
                  :wrapper-classes="parseTermClasses(item, valueOrder)"
                />
              </div>
            </div>
          </template>
        </template>
        <template v-else-if="item.type == 'custom_field'">
          <template v-if="item.value">
            <wil-grid-custom-select-field
              v-if="customSelectFieldGroup.includes(item.customFieldType)"
              wrapper-classes="[`wil-custom-${item.type}-field`, 'text-ellipsis wil-custom-select-field', itemMetaClasses]"
              :key="`grid-body-item-${item.type}-${index}`"
              :items="item.value"
              :icon="item.icon"
              :post="post"
            />
            <div
              v-else
              :key="`grid-body-item-${item.type}-${index}`"
              :class="[
                btnExtraClass,
                'wil-custom-field wil-listing-filter-item',
                itemMetaClasses
              ]"
            >
              <i v-if="item.icon" :class="[item.icon, 'color-primary']"></i>
              <span v-html="item.value"></span>
            </div>
          </template>
        </template>
        <template v-else>
          <wil-link
            :key="`grid-body-item-${item.type}-${index}`"
            :wrapper-classes="[
              `grid-body-item-${item.type}`,
              btnExtraClass,
              itemMetaClasses
            ]"
            :link="generateLink(item, item.type)"
            :target="generateLinkTarget(item, item.type)"
            :icon="[item.icon, 'color-primary']"
            :btn-name="parseItemBtnName(item)"
            style="padding-right: 60px"
          >
            <template v-slot:after-link>
              <strong
                v-if="hasDistance && item.type === 'google_address'"
                class="pos-a-right"
                v-html="distanceText"
              ></strong>
            </template>
          </wil-link>
        </template>
      </template>
    </div>
    <slot name="afterbody" :items="items" :post="post"></slot>
  </div>
</template>
<style scoped>
/deep/.wil-term-item {
  display: inline-block;
  width: auto;
  margin-right: 8px;
}
/deep/.wil-custom-field .wil-wrapper-text-field,
/deep/.wil-custom-field .wil-wrapper-textarea-field {
  display: inline-block;
}
.wil-grid-body-terms-wrapper a {
  vertical-align: middle;
}

.wil-listing-filter-item a {
  display: inline;
}
.w-auto {
  width: auto;
}

.vertical-top {
  vertical-align: top;
}
</style>
<script lang="javascript">
export default {
  data() {
    return {
      taxonomies: [
        "listing_location",
        "listing_cat",
        "listing_tag",
        "custom_taxonomy",
        "taxonomy"
      ],
      customSelectFieldGroup: [
        "multiple-checkbox",
        "checkbox2",
        "select-tree",
        "select"
      ]
    };
  },
  mounted() {
    this.distanceFromListingToMe();
    this.notify();
  },
  updated() {
    this.notify();
  },
  components: {
    WilGridTerm: () =>
      import(
        /* webpackChunkName: "WilGridTerm" */
        /* webpackPreload: true */
        "./WilGridTerm.vue"
      ),
    WilGridCustomSelectField: () =>
      import(
        /* webpackChunkName: "WilGridCustomSelectField" */
        /* webpackPreload: true */
        "./WilGridCustomSelectField.vue"
      )
  },
  computed: {
    hasDistance() {
      return !_.isEmpty(this.mygeocoder) && !_.isEmpty(this.distanceText);
    },
    itemMetaClasses() {
      let classes = "";
      if (this.type === "list") {
        classes = "d-inline-block mr-15 w-auto vertical-top";
      } else {
        classes = "w-100";
      }

      return classes;
    },
    btnExtraClass() {
      return this.isSearchNearByMe
        ? "text-ellipsis wil-distance"
        : "text-ellipsis";
    },
    uquid() {
      return new Date().getTime();
    }
  },
  methods: {
    notify() {
      this.$nextTick(function() {
        this.$emit("rendered");
      });
    },
    parseTermClasses(item, valueOrder) {
      return valueOrder + 1 !== item.value.length ? "text-comma" : "";
    },
    parseItemBtnName(item) {
      let btnName = "";
      switch (item.type) {
        case "google_address":
          btnName = item.value.address;
          break;
        case "event_starts_on":
          btnName = `${item.value.day} ${item.value.hour}`;
          break;
        default:
          btnName = `${item.value}`;
          break;
      }

      return btnName;
    },
    async distanceFromListingToMe() {
      if (_.isEmpty(this.mygeocoder)) {
        return "";
      }

      await this.calculateDistanceFromListingToMe(
        {
          lat: this.post.oAddress.lat,
          lng: this.post.oAddress.lng
        },
        this.mygeocoder
      );
    },
    isTaxonomy(item) {
      return [
        "custom_taxonomy",
        "listing_category",
        "listing_cat",
        "listing_tag"
      ].includes(item.type);
    },
    generateLink(item, itemType) {
      let link;
      switch (itemType) {
        case "google_address":
          link = item.value.addressOnGGMap;
          break;
        case "phone":
          link = `tel: ${item.value}`;
          break;
        case "email":
          link = `mailto: ${item.value}`;
          break;
        case "website":
          link = item.value;
          break;
        default:
          link = this.post.permalink;
          break;
      }
      return link;
    },
    generateLinkTarget(oItem, itemType) {
      if (itemType === "google_address") {
        return "_blank";
      }

      return "_self";
    }
  },
  props: {
    post: {
      type: Object,
      required: true,
      default: () => {}
    },
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    mygeocoder: {
      type: Object,
      required: false,
      default: () => {}
    },
    type: {
      type: String,
      default: "grid"
    }
  }
};
</script>
