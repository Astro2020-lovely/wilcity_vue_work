export const PopupTemplate = {
  methods: {
    buildPopupTemplate(item) {
      if (!item.oReviews) {
        item.oReviews = {};
        item.oReviews.dataRated = 0;
        item.oReviews.average = 0;
        item.oReviews.mode = 10;
      } else {
        if (!_.isUndefined(item.oReviews.mode) && item.oReviews.mode == 5) {
          item.oReviews.dataRated = item.oReviews.average * 2;
        } else {
          item.oReviews.dataRated = item.oReviews.average;
        }
      }
      let logoUrl = "";
      if (item.logo.length) {
        logoUrl = item.logo;
      } else {
        logoUrl = item.featuredImage;
      }
      let bhClass = "color-primary";
      if (!_.isUndefined(item.oBusinessHours)) {
        bhClass =
          item.oBusinessHours.status == "open"
            ? "color-secondary"
            : "color-primary";
      }
      return `<div class="listing-item-map_module__1FxWL active">
    <header class="listing-item-map_header__3vj9H">
      <div class="marker_module__2Kxbk marker_lg__3Ep3w">
        <div class="marker_background__47Zv3"><img src="${
          this.markerSvg
        }"/></div><a href="${item.permalink}">
          <div class="marker_thumb__2NXEV" style="background-image: url('${logoUrl}')"><img src="${logoUrl}" alt="${
        item.title
      }"></div></a>
      </div>
    </header>
    <div class="listing-item-map_body__2rREN arrow--right-center">
    ${
      item.oReviews.average != 0 && item.oReviews.average
        ? `<div class="rated-small_module__1vw2B listing-item-map_rated__1qxUX">
        <div class="rated-small_wrap__2Eetz" data-rated="${item.oReviews.dataRated}">
          <div class="rated-small_overallRating__oFmKR">${item.oReviews.average}</div>
          <div class="rated-small_ratingWrap__3lzhB">
            <div class="rated-small_maxRating__2D9mI">${item.oReviews.mode}</div>
            <div class="rated-small_ratingOverview__2kCI_">${item.oReviews.quality}</div>
          </div>
        </div>
      </div>
      `
        : ``
    }
                ${
                  item.logo
                    ? `
      <a class="listing-item-map_logo__24mCj bg-cover" href="${item.permalink}" style="background-image: url('${item.logo}')"></a>
      `
                    : `
                `
                }
      <div class="listing-item-map_content__14yl8">
        <h2 class="listing-item-map_title__3jqN3 text-ellipsis"><a href="${
          item.permalink
        }">${item.title}</a></h2>
        <div class="listing-item-map_tagline__3uiVK text-ellipsis">${
          item.excerpt
        }</div>
      </div>
      <div class="listing-item-map_foot__P2CrB wil-shadow">
          ${
            item.oBusinessHours
              ? `
        <div class="listing-item-map_footLeft__2Sfw0"><span class="${bhClass}">${item.oBusinessHours.text}</span>
        `
              : `
        `
          }
        ${
          item.priceRange
            ? `
                    <span class="wilcity-map-price-range color-primary wilcity-price-range-${item.priceRangeType}">${item.priceRange}</span>
                     `
            : `
                    `
        }
        ${
          item.price
            ? `
                    <span class="wilcity-map-price color-primary wilcity-single-price">${item.price}</span>
                     `
            : `
                    `
        }
      </div>
    </div>
  </div>
  `;
    }
  }
};
