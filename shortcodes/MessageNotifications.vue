<template>
  <div>
    <a
      :class="aCssClass"
      href="#"
      data-toggle-min-width="768"
      :dataTooltip="oTranslation.messages"
      data-tooltip-placement="top"
      data-tooltip-theme="light"
      @click.prevent="toggleShowing"
    >
      <i class="la la-envelope js-message-notification"></i>
      <span
        v-show="countNewNotifications"
        class="header_number__1a6F5 bg-color-quaternary"
      >{{countNewNotifications}}</span>
    </a>
    <div :class="wrapperNotificationsClass">
      <div class="pos-r" v-show="isLoading=='yes'" style="min-height: 100px;">
        <wil-block-loading :is-loading="isLoading" />
      </div>
      <ul
        v-show="isLoading=='no'"
        class="list-utility_module__32oNg list-none list-utility_abs__OYiyL arrow--top-right"
      >
        <li v-for="oNewMessage in oNotifications" class="list-utility_list__1DzGk">
          <a class="list-utility_link__3BRZx" :href="renderLink(oNewMessage)">
            <div
              class="utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix"
            >
              <div
                v-if="oNewMessage.avatar"
                class="utility-box-1_avatar__DB9c_ rounded-circle"
                :style="{'background-image': 'url('+oNewMessage.avatar+')'}"
              >
                <img :src="oNewMessage.avatar" :alt="oNewMessage.displayName" />
              </div>
              <div class="utility-box-1_body__8qd9j">
                <div class="utility-box-1_group__2ZPA2 text-ellipsis" style="white-space: normal">
                  <h3
                    class="utility-box-1_title__1I925"
                    v-if="oNewMessage.displayName"
                    v-html="oNewMessage.displayName"
                  ></h3>
                  <div class="utility-box-1_content__3jEL7" v-html="oNewMessage.message"></div>
                </div>
                <div class="utility-box-1_description__2VDJ6">
                  <i class="la la-comments color-primary"></i>
                  <span v-html="sentAt(oNewMessage)"></span>
                </div>
              </div>
            </div>
          </a>
        </li>
        <li class="list-utility_list__1DzGk">
          <a
            class="list-utility_more__2Y_w7 wil-text-center color-primary--hover"
            :href="messageDashboardUrl"
            v-html="oTranslation.viewAll"
          ></a>
        </li>
      </ul>
      <ul
        v-show="errMsg.length"
        class="list-utility_module__32oNg list-none list-utility_abs__OYiyL arrow--top-right"
      >
        <li class="list-utility_list__1DzGk">
          <a href="#" class="list-utility_link__3BRZx">
            <div
              class="utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix"
            >
              <div class="utility-box-1_body__8qd9j">
                <div class="utility-box-1_group__2ZPA2 text-ellipsis">
                  <div class="utility-box-1_content__3jEL7" v-html="errMsg"></div>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      oTranslation: WILCITY_I18,
      isShowing: false,
      isLoading: "no",
      isListenOutsideClick: false,
      needDashboardUrl: "yes",
      errMsg: "",
      messageDashboardUrl: this.dashboardUrl + "#/messages",
      countNewNotifications: 0,
      oNotifications: null
    };
  },
  props: ["userId", "dashboardUrl"],
  watch: {
    oNewMessages: {
      handler(oNewMessages) {
        if (oNewMessages === null) {
          this.countNewNotifications = 0;
        } else {
          let aNewNotifications = Object.values(oNewMessages).filter(
            oMessage => {
              return oMessage.new === true;
            }
          );

          this.countNewNotifications = aNewNotifications.length;
          aNewNotifications.sort((a, b) => {
            return b.timestamp - a.timestamp;
          });

          this.oNotifications = [...aNewNotifications];
        }
      },
      immediate: true
    }
  },
  computed: {
    wrapperNotificationsClass() {
      return !this.isShowing
        ? "header_loginBody__2hz2g"
        : "header_loginBody__2hz2g active";
    },
    aCssClass() {
      return this.isShowing
        ? "header_loginHead__3HoVP active"
        : "header_loginHead__3HoVP";
    },
    ...mapState({
      oNewMessages: state => state.ModuleMessage.oMyNewMessages,
      isUsingFirebase: state => state.ModuleMessage.isUsingFirebase === "yes"
    })
  },
  mounted() {
    if (!this.isUsingFirebase) {
      setTimeout(() => {
        this.fetchNewNotifications();
        this.$store.commit("updateTimeout");
      }, this.$store.getters.getTimeout);
    } else {
      this.getMyNewMessages();
    }
    this.hideMenuWhenOutsideClick();
  },
  methods: {
    getMyNewMessages() {
      const oCheckLoggedInStatus = this.$store.dispatch(
        "ModuleMessage/signInToFirebase"
      );
      return oCheckLoggedInStatus.then(status => {
        if (status) {
          this.$store.dispatch("ModuleMessage/fetchMyNewMessages");
        }
      });
    },
    renderLink(oNewMessage) {
      if (!this.isUsingFirebase) {
        return oNewMessage.link;
      }

      return this.dashboardUrl + "#/messages?u=" + oNewMessage.displayName;
    },
    buildUserKey() {
      return "___" + this.userId + "___";
    },
    sentAt(oNewMessage) {
      if (!this.isUsingFirebase) {
        return oNewMessage.time;
      }

      return WilCityHelpers.timestampToDate(oNewMessage.timestamp);
    },
    pollingNotification() {
      setInterval(() => {
        this.fetchNewNotifications();
      }, 300000);
    },
    fetchNewNotifications() {
      jQuery.ajax({
        type: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: {
          action: "wilcity_count_new_messages"
        },
        success: response => {
          this.countNewNotifications = response.data;
        }
      });
    },
    toggleShowing() {
      this.isShowing = !this.isShowing;
      if (this.isUsingFirebase) {
        this.isLoading = "no";
      } else {
        this.isLoading = "yes";
        jQuery.ajax({
          type: "post",
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: "wilcity_fetch_list_messages",
            needDashboardUrl: this.needDashboardUrl,
            limit: 5
          },
          success: response => {
            if (response.success) {
              this.oNotifications = response.data.aInfo;
              if (this.messageDashboardUrl === "#") {
                this.messageDashboardUrl = response.data.dashboardUrl;
                this.needDashboardUrl = "no";
              }
            } else {
              this.errMsg = response.data.msg;
            }
            this.isLoading = "no";
          }
        });
      }
    },
    hideMenuWhenOutsideClick() {
      jQuery(document).on("click", event => {
        if (!jQuery(event.target).hasClass("js-message-notification")) {
          this.isShowing = false;
        }
      });
    }
  }
};
</script>
