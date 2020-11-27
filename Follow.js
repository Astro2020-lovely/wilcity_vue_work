export default class Follow {
  constructor() {
    this.$toggle = jQuery("." + WHITE_LABEL + "-toggle-follow");
    this.init();
  }

  init() {
    if (!this.$toggle.length) {
      return false;
    }

    this.$toggle.on("click", event => {
      event.preventDefault();

      if (WILOKE_INLINE_GLOBAL.isUserLoggedIn !== "yes") {
        document.getElementById("wilcity-login-btn").click();
        return false;
      }

      let $target = jQuery(event.currentTarget),
        authorID = $target.data("authorid"),
        $followersNumber = jQuery(
          "#" + WHITE_LABEL + "-follower-number-" + authorID
        );

      let status = $target.data("currentStatus");

      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_update_following",
          authorID: authorID
        },
        success: response => {
          if (response.success) {
            if ($followersNumber.length) {
              $followersNumber
                .find("." + WHITE_LABEL + "-print-number")
                .html(response.data);
            }

            if ($target.data("textonly")) {
              if (status === "followingtext") {
                $target.html(
                  '<i class="la la-refresh"></i> ' + $target.data("followtext")
                );
                $target.data("currentStatus", "followtext");
              } else {
                $target.html(
                  '<i class="la la-refresh"></i> ' +
                    $target.data("followingtext")
                );
                $target.data("currentStatus", "followingtext");
              }
            } else {
              $target.find("span").html(response.data);

              if (status === "followingtext") {
                $target.html(
                  "<span>" +
                    response.data +
                    "</span> " +
                    $target.data("followtext")
                );
                $target.data("currentStatus", "followtext");
              } else {
                $target.html(
                  '<span class="color-primary">' +
                    response.data +
                    "</span> " +
                    $target.data("followingtext")
                );
                $target.data("currentStatus", "followingtext");
              }
            }
          } else {
            alert(response.data.msg);
          }
        }
      });
    });
  }
}
