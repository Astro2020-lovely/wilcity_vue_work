<template>
  <nav v-if="liItems.length" :class="wrapperClasses">
    <ul :class="innerClasses">
      <li v-for="index in liItems" :key="`${uquid}-${index}`" :class="parseLiClasses(index)">
        <a
          v-if="!isCurrent(index)"
          class="pagination_pageLink__2UQhK"
          @click.prevent="switchNavigation(index)"
          href="#"
        >
          <template v-if="maxPages>3">
            <i v-if="index === 1" class="la la-angle-double-left"></i>
            <i v-else-if="index === maxPages" class="la la-angle-double-right"></i>
            <span v-else-if="index==='...'" class="pagination_pageLink__2UQhK">
              <i class="la la-ellipsis-h"></i>
            </span>
            <span v-else>{{index}}</span>
          </template>
          <span v-else>{{index}}</span>
        </a>
        <span v-else class="pagination_pageLink__2UQhK">{{index}}</span>
      </li>
    </ul>
  </nav>
</template>
<script lang="javascript">
export default {
  name: "wil-pagination",
  data() {
    return {
      activatePage: 1,
      liItems: []
    };
  },
  computed: {
    uquid() {
      return `pagination-item-${new Date().getTime()}-`;
    }
  },
  watch: {
    activatePage() {
      this.calculateLiItems();
    },
    maxPages() {
      this.calculateLiItems();
    }
  },
  mounted() {
    this.activatePage = this.currentPage;
    this.calculateLiItems();
  },
  methods: {
    switchNavigation(page) {
      this.activatePage = page;
      this.$emit("change", page);
    },
    parseLiClasses(page) {
      if (page === "...") {
        return `${this.liClasses} disable`;
      }

      if (this.activatePage === page) {
        return `${this.liClasses} current`;
      }

      return this.liClasses;
    },
    isCurrent(page) {
      return this.activatePage === page;
    },
    calculateLiItems() {
      if (this.maxPages <= 1) {
        this.liItems = [];
        return false;
      }

      // If the maxItems page is smaller than 8 or equal to 8, We print all
      if (this.maxPages < 8) {
        this.liItems = [];
        for (let i = 1; i <= this.maxPages; i++) {
          this.liItems = this.liItems.concat([i]);
        }
      } else {
        if (this.activatePage <= 3) {
          // If the current page is smaller than 4, We print the first three pages and the last page
          this.liItems = [1, 2, 3, 4, "...", this.maxPages];
        } else if (this.activatePage < 7) {
          // if the current page is smaller than 7, We print the first seven pages and the last page
          this.liItems = [1, 2, 3, 4, 5, 6, 7, "...", this.maxPages];
        } else {
          // And, in the last casfe, We print the first three pages and the pages range of [activatePage-3, activatePage]
          this.liItems = [1, "..."];

          for (let i = 2; i >= 0; i--) {
            this.liItems = this.liItems.concat([this.activatePage - i]);
          }

          let currentToLast = this.maxPages - this.activatePage;
          if (currentToLast <= 8) {
            for (let j = this.activatePage + 1; j <= this.maxPages; j++) {
              this.liItems = this.liItems.concat([j]);
            }
          } else {
            for (let j = 1; j <= 2; j++) {
              this.liItems = this.liItems.concat([this.activatePage + j]);
            }

            this.liItems = this.liItems.concat(["...", this.maxPages]);
          }
        }
      }
    }
  },
  props: {
    wrapperClasses: {
      type: String,
      default: "mt-20 mb-20",
      required: false
    },
    innerClasses: {
      type: String,
      default: "pagination_module__1NBfW",
      required: false
    },
    maxPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      default: 1,
      required: false
    },
    itemsPerPage: {
      type: Number,
      default: 10,
      required: false
    },
    liClasses: {
      type: String,
      default: "pagination_pageItem__3SatM"
    }
  }
};
</script>
