<template>
  <footer class="listing_footer__1PzMC">
    <slot name="beforefooter" :items="items" :post="post"></slot>
    <div v-if="leftItems.length" class="text-ellipsis">
      <div
        class="icon-box-1_module__uyg5F text-ellipsis icon-box-1_style2__1EMOP"
      >
        <template v-for="(leftItem, index) in leftItems">
          <wil-grid-footer-taxonomy
            v-if="leftItem.type === 'taxonomy'"
            :key="`${uniqid}-${leftItem.type}-${index}`"
            :item="leftItem"
          />
          <wil-grid-business-hour
            v-else-if="leftItem.type === 'business-hours'"
            :key="`${uniqid}-${leftItem.type}-${index}`"
            :item="leftItem"
          />
        </template>
      </div>
    </div>
    <div v-if="rightItems.length" class="listing_footerRight__2398w">
      <template v-for="(rightItem, index) in rightItems">
        <wil-link
          v-if="rightItem.type === 'gallery' && rightItem.value.length"
          :key="`${uniqid}-${rightItem.type}-${index}`"
          wrapper-classes="wil-trigger-gallery-btn"
          tooltip-place="top"
          :tooltip="'Gallery' | filterTranslation('gallery')"
          icon="la la-search-plus"
          @click.prevent="openGallery(rightItem)"
        >
          <i class="la la-search-plus"></i>
          <template v-slot:after-link>
            <portal v-if="toggleGallery" to="wil-modal">
              <vue-gallery-slideshow
                :images="parseGallery(rightItem.value)"
                :index="0"
                @close="closeGallery"
              ></vue-gallery-slideshow>
            </portal>
          </template>
        </wil-link>
        <wil-favorite
          v-else-if="rightItem.type === 'favorite'"
          :key="`${uniqid}-${rightItem.type}-${index}`"
          :post="post"
          :icon-type="rightItem.iconType"
          :saved="rightItem.saved"
          v-on="{ change: handleFavoriteChange(rightItem.type, 'saved') }"
          wrapper-classes
        />
        <wil-link
          v-else-if="rightItem.type === 'link' && rightItem.value"
          :key="`${uniqid}-${rightItem.type}-${index}`"
          :wrapper-classes="[
            'wil-card-footer-custom-item-link',
            rightItem.wrapperClasses ? rightItem.wrapperClasses : ''
          ]"
          :btn-name="rightItem.name"
          :icon="rightItem.icon ? rightItem.icon : ''"
          :link="rightItem.link"
        />
      </template>
    </div>
    <slot name="afterfooter" :items="items" :post="post"></slot>
  </footer>
</template>
<script lang="javascript">
export default {
  data() {
    return {
      toggleGallery: false
    };
  },
  components: {
    WilGridFooterTaxonomy: () =>
      import(
        /* WilGridFooterTaxonomy */
        "./WilGridFooterTaxonomy.vue"
      ),
    WilFavorite: () =>
      import(
        /* WilFavorite */
        "./WilFavorite.vue"
      ),
    WilLink: () =>
      import(
        /* WilLink */
        "./../buttons/WilLink.vue"
      ),
    WilGridBusinessHour: () =>
      import(
        /* WilGridBusinessHour */
        "./WilGridBusinessHour.vue"
      ),
    VueGallerySlideshow: () =>
      import(
        /* VueGallerySlideshow */
        /* webpackPreload: true */
        "vue-gallery-slideshow"
      )
  },
  methods: {
    parseGallery(gallery) {
      return gallery.reduce((accumulator, img) => {
        return [...accumulator, img.src];
      }, []);
    },
    handleFavoriteChange(type, changed) {
      return val => {
        const index = this.findItemIndexInArray("type", type, this.items);
        let item = { ...this.items[index] };
        item = {
          ...item,
          [changed]: val
        };
        this.$emit(
          "change",
          this.updateItemValueInArray(index, item, this.items)
        );
      };
    },
    closeGallery() {
      this.toggleGallery = false;
    },
    openGallery(item) {
      this.toggleGallery = !this.toggleGallery;
    }
  },
  computed: {
    uniqid() {
      const date = new Date().getTime();
      return `${date}`;
    },
    leftItems() {
      return this.items.filter(item => {
        return item.position === "left" || !item.position;
      });
    },
    rightItems() {
      return this.items.filter(item => {
        return item.position === "right";
      });
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
    }
  }
};
</script>
