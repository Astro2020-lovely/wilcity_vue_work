<template>
  <div :class="wrapperClasses">
    <div
      v-show="oChatWithProfile.displayName || isMobile"
      class="message_head__2tf2D wilcity-chatform-name"
    >
      <span
        class="message_back__pjtJp color-primary"
        @click.prevent="backOverviewMessage"
      >
        <i class="la la-angle-left"></i>
      </span>
      <div
        class="utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix wil-text-center"
      >
        <div class="utility-box-1_body__8qd9j">
          <div class="utility-box-1_group__2ZPA2">
            <h3
              class="utility-box-1_title__1I925"
              v-html="oChatWithProfile.displayName"
            ></h3>
          </div>
        </div>
      </div>
    </div>
    <div id="wilcity-wrapper-message-body" class="message_body__njHFs">
      <wil-line-loading :is-loading="isLoading" />
      <div class="wil-tb">
        <div class="wil-tb__cell">
          <div
            id="wilcity-author-messages-wrapper"
            class="message_content__2l2Qt pos-r"
          >
            <div
              v-for="(oMessage, firebaseMsgID) in oChatRoomMessages"
              :id="renderMessageId(oMessage, firebaseMsgID)"
              :key="`wil-author-message-${firebaseMsgID}`"
              class="wilcity-message-content pos-r"
            >
              <div
                v-if="
                  oMessage.userID != senderId &&
                    oMessage.messageAuthorID != senderId
                "
                id="chinhlaanh"
                class="utility-box-1_module__MYXpX utility-box-1_arrowLeft__2cSvI clearfix"
              >
                <div
                  class="utility-box-1_avatar__DB9c_ rounded-circle"
                  :style="{
                    'background-image': 'url(' + oChatWithProfile.avatar + ')'
                  }"
                >
                  <img
                    :src="oChatWithProfile.avatar"
                    :alt="oChatWithProfile.displayName"
                  />
                </div>
                <div class="utility-box-1_body__8qd9j">
                  <div class="utility-box-1_group__2ZPA2">
                    <div
                      class="utility-box-1_content__3jEL7"
                      v-html="printMessage(oMessage.message)"
                    ></div>
                  </div>
                  <div
                    v-if="oMessage.messageAt"
                    class="utility-box-1_description__2VDJ6"
                  >
                    {{ oMessage.messageAt }}
                  </div>
                  <div v-else class="utility-box-1_description__2VDJ6">
                    {{ renderSentAt(oMessage.timestamp) }}
                  </div>
                </div>
              </div>
              <div
                v-else
                class="utility-box-1_module__MYXpX utility-box-1_arrowRight__uwhMc clearfix"
              >
                <div class="utility-box-1_body__8qd9j">
                  <div class="utility-box-1_group__2ZPA2">
                    <div
                      class="utility-box-1_content__3jEL7"
                      v-html="printMessage(oMessage.message)"
                    ></div>
                    <span
                      @click.prevent="
                        askForDeletingMessage(oMessage, firebaseMsgID)
                      "
                      class="list-utility_remove__1Vlf4 color-primary--hover"
                      :title="
                        'Delete Message' | filterTranslation('deleteMessage')
                      "
                    >
                      <i class="la la-close"></i>
                    </span>
                  </div>
                  <div
                    v-if="oMessage.timestamp"
                    class="utility-box-1_description__2VDJ6"
                  >
                    {{ renderSentAt(oMessage.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
            <div id="msg-content-waypoint-place-holder"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="message_sendMessage__1tW4G">
      <div :class="wrapperMsgFieldClass">
        <div class="field_wrap__Gv92k">
          <textarea
            class="field_field__3U_Rt"
            :value="newMessage"
            data-height-default="22"
            @input="newMessage = $event.target.value"
            @focus="
              readChatMessage();
              isCustomerVerified();
            "
            @keydown="submitMsg"
          ></textarea>
          <span class="field_label__2eCP7 text-ellipsis">{{
            "Type a message" | filterTranslation("typeAMessage")
          }}</span>
          <span class="bg-color-primary"></span>
          <div :class="submitMsgWrapperClass">
            <span
              class="field_iconButton__2p3sr bg-color-primary"
              @click="submitMsg"
            >
              <i class="la la-arrow-up"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <portal to="wil-modal">
      <wil-confirmation-popup
        id="wil-ask-for-deleting-message"
        :title="'' | filterTranslation('deleteMsg')"
        :body="'' | filterTranslation('confirmDeleteMsg')"
        :is-open="isOpenPopup"
        @close="handleClosePopup"
        @confirmed="handleDeleteMessage"
        :is-loading="isDeleting"
        :msg="deleteMsg"
        :msg-type="deleteMsgType"
      />
    </portal>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import firebase from "./../../../../../firebase.js";
import { ListenScrollTo } from "./../../../../../ListenScrollTo.js";

export default {
  name: "wil-chat-window",
  data() {
    return {
      isUserConfirmed: false,
      isCheckingCustomerAccount: false,
      oObserverScroll: null,
      newMessageError: false,
      isLoading: false,
      newMessage: "",
      isMobile: WilCityHelpers.isMobile(),
      scrollDirection: "down",
      deleteMessageInfo: {},
      deleteMsg: "",
      deleteMsgType: "",
      isDeleting: false,
      isOpenPopup: false
    };
  },
  props: {
    senderId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    chattingWithId: {
      handler(chattingWithId) {
        if (chattingWithId) {
          // Clear messages of previous user
          this.handleChatWith();
        }
      },
      immediate: true
    },
    oChatRoomMessages: {
      handler(newMessage) {
        if (newMessage) {
          if (
            !this.$store.getters[
              "ModuleMessage/isLoadedAllMessageInTheChatRoom"
            ]
          ) {
            setTimeout(() => {
              this.scrollTo();
            }, 10);
          }
        }
      }
    }
  },
  computed: {
    oChatRoomMessages() {
      return this.$store.getters["ModuleMessage/getChatRoomMessages"];
    },
    oChatWithProfile() {
      return this.$store.getters["ModuleMessage/getChattingWithProfileDetails"];
    },
    submitMsgWrapperClass() {
      let cl = "field_rightButton__1GGWz js-field-rightButton";
      if (this.newMessage.length) {
        return cl + " active";
      } else {
        return cl;
      }
    },
    wrapperMsgFieldClass() {
      let classes = "field_module__1H6kT field_style4__2DBqx";
      if (this.newMessage.length) {
        classes = `${classes} active`;
        this.newMessageError = false;
      } else if (this.newMessageError) {
        classes = `${classes} error`;
      }

      if (this.$store.getters["ModuleMessage/getIsDisablingChatMessage"]) {
        classes = `${classes} disable`;
      } else if (this.isCheckingCustomerAccount) {
        classes = `${classes} disable`;
      }

      return classes;
    },
    wrapperClasses() {
      return [
        "message_chatContent__1AhzJ wilcity-message-column",
        this.$store.getters.getMessageDetailClass,
        _.isEmpty(this.oChatWithProfile) ? "disabled" : ""
      ];
    },
    chattingWithId() {
      return this.$store.getters["ModuleMessage/getChattingWithId"];
    },
    myUserId() {
      return this.$store.getters["ModuleMessage/getMyUserId"];
    }
  },
  methods: {
    alertAccountMustBeConfirmed() {
      Vue.notify({
        type: "error",
        group: "dashboard-notification",
        text: this.$options.filters.filterTranslation(
          "yourAccountMustBeVerified"
        )
      });
    },
    handleClosePopup() {
      this.isOpenPopup = false;
    },
    readChatMessage() {
      this.$store.dispatch("ModuleMessage/maskLatestMessageAsRead");
    },
    isCustomerVerified() {
      if (this.isUserConfirmed) {
        return true;
      }
      this.isCheckingCustomerAccount = true;
      jQuery
        .ajax({
          type: "POST",
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: "wilcity_is_customer_confirmed"
          },
          success: response => {
            if (response.success) {
              if (response.data.isConfirmed === "yes") {
                this.isUserConfirmed = true;
                return true;
              }
            }
            this.alertAccountMustBeConfirmed();
          }
        })
        .always(() => (this.isCheckingCustomerAccount = false));
    },
    renderSentAt(timestamp) {
      return WilCityHelpers.timestampToDate(timestamp);
    },
    printMessage(message) {
      return WilCityHelpers.maybeMapMessage(message);
    },
    askForDeletingMessage(oMessage, firebaseMsgID) {
      this.deleteMessageInfo = {
        ...oMessage,
        firebaseChatKey: firebaseMsgID
      };
      this.isOpenPopup = true;
    },
    handleDeleteMessage() {
      this.isDeleting = true;
      this.$store
        .dispatch("ModuleMessage/deleteMessage", this.deleteMessageInfo)
        .then(oStatus => {
          if (!oStatus.success) {
            this.deleteMsg = oStatus.msg;
            this.deleteMsgType = "danger";
          } else {
            this.handleClosePopup();
          }

          this.isDeleting = false;
        });
    },
    backOverviewMessage() {
      this.$store.commit("activateMessageDetail", false);
    },
    renderMessageId(oMessage, msgID) {
      return this.isUsingFirebase ? msgID : "wilcity-message-id-" + oMessage.ID;
    },
    submitMsg(event) {
      if (event.type !== "click" && event.keyCode) {
        if (event.keyCode !== 13) {
          return true;
        } else {
          if (event.shiftKey) {
            return true;
          }
        }
      }

      if (!this.isUserConfirmed) {
        this.alertAccountMustBeConfirmed();
        return false;
      }

      if (!this.newMessage.trim().length) {
        return false;
      }

      event.preventDefault();
      this.isLoading = !this.isLoading;
      const oResponse = this.$store.dispatch(
        "ModuleMessage/submitChatMessage",
        this.newMessage
      );
      oResponse.then(oStatus => {
        this.isLoading = !this.isLoading;
        if (oStatus.isUsingFirebase) {
          if (!oStatus.success) {
            this.newMessageError = true;
            alert(oStatus.errMsg);
          } else {
            const $wrapper = document.getElementById(
              "wilcity-wrapper-message-body"
            );
            $wrapper.scrollTop = $wrapper.offsetHeight + 10000;
          }
        }
        this.newMessage = "";
      });
    },
    listenScrollTo() {
      if (!this.oObserverScroll) {
        this.oObserverScroll = new ListenScrollTo(
          "wilcity-wrapper-message-body",
          {
            scrolledUp: self => {
              this.scrollDirection = "up";
              if (self.currentTop < 50) {
                this.isLoading = true;
                setTimeout(() => {
                  this.$store
                    .dispatch("ModuleMessage/handleChatWith")
                    .then(oStatus => {
                      if (oStatus.isFoundAll || !oStatus.success) {
                        this.oObserverScroll.destroy();
                      }
                      this.isLoading = false;
                    });
                }, 500);
              }
            },
            scrolledDown: self => {
              this.scrollDirection = "down";
            }
          },
          {
            top: 50,
            bottom: 0
          }
        );
      }
    },
    scrollTo() {
      let objDiv = document.getElementById("wilcity-wrapper-message-body");
      if (this.scrollDirection == "down") {
        objDiv.scrollTop = objDiv.scrollHeight;
      } else {
        objDiv.scrollTop = 50;
      }
    },
    handleChatWith() {
      this.$store.dispatch("ModuleMessage/clearChatRoomMessages");
      this.$store.dispatch("ModuleMessage/handleChatWith").then(oStatus => {
        this.$store.dispatch("ModuleMessage/chatListenChildAdded");
        this.$store.dispatch("ModuleMessage/chatListenChildRemoved");
        if (oStatus.success) {
          if (!oStatus.isFoundAll) {
            setTimeout(() => {
              this.listenScrollTo();
            }, 500);
          }
        }
      });
    }
  }
};
</script>
