export default class WilokePagination {
  constructor($wrapper, totalPosts, postsPerPage, maxPages, currentPage) {
    this.currentPage = typeof currentPage !== "undefined" ? currentPage : 1;
    this.totalPosts = totalPosts;
    this.postsPerPage = postsPerPage;
    this.maxPages = maxPages;
    this.nextPage = 0;
    this.prevPage = 0;
    this.aPostsNotIn = [];
    this.xhr = null;
    this.$wrapper = $wrapper;
  }

  resetPagination() {
    this.$wrapper.on(
      "resetPagination",
      (event, currentPage, totalPosts) => {
        this.currentPage = currentPage;
        this.totalPosts = totalPosts;
        this.$wrapper.html(this.createPagination());
      }
    );
  }

  ajaxLoading() {
    jQuery("body").on("click", ".pagination_pageItem__3SatM", event => {
      event.preventDefault();
      if (this.xhr !== null && this.xhr.status !== 200) {
        this.xhr.abort();
      }

      this.$wrapper
        .find(".pagination_pageItem__3SatM.current")
        .removeClass("current");
      let $target = jQuery(event.currentTarget),
        gridID = this.$wrapper.data("gridid"),
        $grid = jQuery("#" + gridID);
      jQuery("body").trigger("blockLoading", [ gridID ]);

      $target.addClass("current");

      this.currentPage = $target.find("a").attr("data-page");

      let oArgs = {
        page: this.currentPage,
        action: this.$wrapper.data("action")
      };

      if (this.currentPage == 2 && $grid.length) {
        this.aPostsNotIn = [];

        $grid
          .find(".js-listing-module, .js-event")
          .each((order, event) => {
            this.aPostsNotIn.push(jQuery(event).data("id"));
          });
      } else if (this.currentPage == 1) {
        this.aPostsNotIn = [];
      }

      if (this.aPostsNotIn.length == this.totalPosts) {
        this.aPostsNotIn = [];
      }

      oArgs = Object.assign({}, this.$wrapper.data(), oArgs);
      oArgs.postsNotIn = this.aPostsNotIn;

      this.xhr = jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: oArgs,
        success: response => {
          let $body = jQuery("body");
          $body.trigger("paginationLoaded", [ response, gridID ]);
          if (!response.success) {
            this.$wrapper.addClass("hidden");
          } else {
            this.$wrapper.html(this.createPagination());
          }

          if (typeof response.data.postsNotIn !== "undefined") {
            this.aPostsNotIn.push(...response.data.postsNotIn);
          }

          $body.trigger("listingLoaded", [
            this.$wrapper.data("gridid")
          ]);
        }
      });
    });
  }

  createPagination() {
    let aPages = [],
      pagination = "";
    this.totalPosts = parseInt(this.totalPosts);
    this.postsPerPage = parseInt(this.postsPerPage);
    if (this.totalPosts === 0 || this.totalPosts <= this.postsPerPage) {
      return "";
    }

    this.currentPage = parseInt(this.currentPage, 10);
    this.nextPage = this.currentPage + 1;
    this.prevPage = this.currentPage - 1;
    this.maxPages = Math.ceil(this.totalPosts / this.postsPerPage);

    // If, in case, We have only one page, simply print nothing
    if (this.maxPages <= 1) {
      return false;
    }

    // If the total page is smaller than 8 or equal to 8, We print all
    if (this.maxPages <= 8) {
      for (let i = 1; i <= this.maxPages; i++) {
        aPages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        // If the current page is smaller than 4, We print the first three pages and the last page
        aPages = [ 1, 2, 3, 4, "x", this.maxPages ];
      } else if (this.currentPage < 7) {
        // if the current page is smaller than 7, We print the first seven pages and the last page
        aPages = [ 1, 2, 3, 4, 5, 6, 7, "x", this.maxPages ];
      } else {
        // And, in the last casfe, We print the first three pages and the pages range of [currentPage-3, currentPage]
        aPages = [ 1, "x" ];

        for (let i = 2; i >= 0; i--) {
          aPages.push(this.currentPage - i);
        }

        let currentToLast = this.maxPages - this.currentPage;
        if (currentToLast <= 8) {
          for (
            let j = this.currentPage + 1;
            j <= this.maxPages;
            j++
          ) {
            aPages.push(j);
          }
        } else {
          for (let j = 0; j <= 2; j++) {
            aPages.push(this.currentPage + 1 + j);
          }

          aPages.push("x");
          aPages.push(this.maxPages);
        }
      }
    }

    for (let i = 0, maximum = aPages.length; i < maximum; i++) {
      if (this.currentPage === aPages[i]) {
        pagination +=
          '<li class="pagination_pageItem__3SatM current"><a class="pagination_pageLink__2UQhK" data-page="' +
          aPages[i] +
          '" rel="canonical">' +
          aPages[i] +
          "</a></li>";
      } else if (aPages[i] === "x") {
        pagination +=
          '<li class="pagination_pageItem__3SatM disable"><span class="pagination_pageLink__2UQhK"><i class="la la-ellipsis-h"></i></span></li>';
      } else {
        pagination +=
          '<li class="pagination_pageItem__3SatM"><a href="#" class="pagination_pageLink__2UQhK"  data-page="' +
          aPages[i] +
          '" rel="canonical">' +
          aPages[i] +
          "</a></li>";
      }
    }

    if (pagination !== "") {
      if (this.currentPage !== 1) {
        pagination =
          '<li class="pagination_pageItem__3SatM"><a href="#" class="pagination_pageLink__2UQhK" data-page="' +
          this.prevPage +
          '" rel="canonical"><i class="la la-angle-left"></i></a></li>' +
          pagination;
      }

      if (this.currentPage !== this.maxPages) {
        pagination +=
          '<li class="pagination_pageItem__3SatM next"><a href="#" class="pagination_pageLink__2UQhK" data-page="' +
          this.nextPage +
          '" rel="canonical"><i class="la la-angle-right"></i></a></li>';
      }
    }

    return pagination;
  }
}
