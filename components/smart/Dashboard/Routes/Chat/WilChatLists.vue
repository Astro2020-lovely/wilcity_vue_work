<template>
  <div :class="authorWrapperClasses">
    <div class="message_head__2tf2D">
      <div class="message_search__EhmrU" style="padding-right: 0;">
        <div :class="searchWrapperClasses">
          <div class="field_wrap__Gv92k">
            <input class="field_field__3U_Rt" type="text" v-model="username" />
            <span class="field_label__2eCP7 text-ellipsis">{{
              "" | filterTranslation("searchUsersInChat")
            }}</span>
            <span class="bg-color-primary"></span>
            <div class="field_right__2qM90 pos-a-center-right">
              <span class="field_icon__1_sOi">
                <i class="la la-search"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="wilcity-list-authors-wrapper" class="message_body__njHFs">
      <ul
        v-if="oUsersInfo"
        class="list-utility_module__32oNg list-none list-utility_message__JT9x8"
      >
        <li
          v-for="(oUser, authId) in oUsersInfo"
          :id="listWrapperID(oUser)"
          :key="`wil-message-author-${authId}`"
          :class="listWrapperClass(oUser, authId)"
        >
          <span
            @click.prevent="askDeleteAuthorMessagePopup(oUser, authId)"
            class="list-utility_remove__1Vlf4 color-primary--hover"
            :title="'Delete message' | filterTranslation('deleteMessage')"
          >
            <i class="la la-close"></i>
          </span>
          <a
            @click.prevent="switchToChatWithAnotherUser(oUser, authId)"
            class="list-utility_link__3BRZx"
            href="#"
          >
            <div
              class="utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix"
            >
              <div
                class="utility-box-1_avatar__DB9c_ rounded-circle"
                :style="{ 'background-image': 'url(' + oUser.avatar + ')' }"
              >
                <img :src="oUser.avatar" :alt="oUser.displayName" />
              </div>
              <div class="utility-box-1_body__8qd9j">
                <div class="utility-box-1_group__2ZPA2 text-ellipsis">
                  <h3
                    class="utility-box-1_title__1I925"
                    v-html="oUser.displayName"
                    style="display: block"
                  ></h3>
                  <div
                    v-if="oUser.message"
                    class="utility-box-1_content__3jEL7"
                    v-html="shortDescription(oUser.message)"
                  ></div>
                </div>
                <div
                  v-if="isUsingFirebase"
                  class="utility-box-1_description__2VDJ6"
                  v-html="renderSentAt(oUser.timestamp)"
                ></div>
                <div v-else class="utility-box-1_description__2VDJ6">
                  {{ oUser.diff }}
                </div>
              </div>
            </div>
          </a>
        </li>
        <li v-show="isLoading" class="list-utility_list__1DzGk">
          <wil-block-loading :is-loading="true" />
        </li>
      </ul>
      <span id="msg-waypoint-load-more"></span>
    </div>

    <portal to="wil-modal" v-if="isOpenPopup">
      <wil-confirmation-popup
        id="wil-ask-for-deleting-author-message"
        :title="'' | filterTranslation('deleteAuthorMsgTitle')"
        :body="'' | filterTranslation('deleteAuthorMsgQuestion')"
        :is-open="isOpenPopup"
        @close="handleClosePopup"
        @confirmed="handleDeleteAuthor"
        :is-loading="isDeleting"
        :msg="deleteMsg"
        :msg-type="deleteMsgType"
      />
    </portal>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { ListenScrollTo } from "./../../../../../ListenScrollTo.js";

export default {
  name: "wil-chat-lists",
  data() {
    return {
      username: "",
      isLoading: false,
      isFirstLoading: false,
      waypoint: null,
      isWaypoint: false,
      oObserverScroll: null,
      debounceSearch: null,
      scrollDirection: "",
      isOpenPopup: false,
      isDeleting: false,
      deleteAuthorInfo: null,
      deleteMsg: "",
      deleteMsgType: ""
    };
  },
  computed: {
    searchWrapperClasses() {
      let classes = "field_module__1H6kT field_style2__2Znhe";
      if (this.username.length) {
        return `${classes} active`;
      }
      return classes;
    },
    ...mapState({
      oUsersInfo: state => state.ModuleMessage.oListOfChattedWith,
      authorWrapperClasses: state => {
        if (!state.ModuleMessage.isLoggedIntoChatRoom) {
          return "message_left__3_nbH wilcity-message-column disable";
        } else {
          return "message_left__3_nbH wilcity-message-column";
        }
      },
      myUserId: state => state.loggedInId,
      chattingWithId: state => state.ModuleMessage.chattingWithId
    })
  },
  props: {
    sUsername: {
      type: String,
      default: ""
    },
    msgId: {
      type: [String, Number],
      default: ""
    },
    isUsingFirebase: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    username: {
      handler(s) {
        if (s.length) {
          this.searchUsers();
        } else {
          this.fetchUsers();
        }
      },
      immediate: true
    }
  },
  created() {
    this.username = this.sUsername;
  },
  methods: {
    shortDescription(message) {
      return WilCityHelpers.maybeMapMessage(message);
    },
    renderSentAt(timestamp) {
      if (timestamp == "") {
        return "";
      }
      return WilCityHelpers.renderSentAt(timestamp);
    },
    askDeleteAuthorMessagePopup(oAuthor, chatRoomKey) {
      this.deleteAuthorInfo = { ...oAuthor, ...{ key: chatRoomKey } };
      this.isOpenPopup = true;
    },
    handleClosePopup() {
      this.isOpenPopup = false;
    },
    handleDeleteAuthor() {
      this.isDeleting = true;
      const oDeleteChatRoom = this.$store.dispatch(
        "ModuleMessage/deleteChatRoom",
        this.deleteAuthorInfo
      );
      oDeleteChatRoom.then(oStatus => {
        this.isDeleting = false;
        if (oStatus.success) {
          this.handleClosePopup();
        } else {
          this.deleteMsg = oStatus.msg;
          this.deleteMsg = "danger";
        }
      });
    },
    listWrapperClass(oUser, authId) {
      let liClass = "list-utility_list__1DzGk pos-r";
      if (
        this.$store.getters["ModuleMessage/getChattingWithId"] == oUser.userID
      ) {
        liClass += " active";
      }

      if (
        oUser.new ||
        (oUser.seen == "no" && this.msgId != oUser.messageAuthorID)
      ) {
        liClass += " unread";
      }
      return liClass;
    },
    listWrapperID(oAuthorInfo) {
      return this.isUsingFirebase
        ? "wilcity-sent-from-" + this.myUserId
        : "wilcity-sent-from-" + oAuthorInfo.messageAuthorID;
    },
    switchToChatWithAnotherUser(oUser, authId) {
      this.$store.dispatch("ModuleMessage/setChattingWithId", oUser.userID);
      this.$store.dispatch("ModuleMessage/setChattingWithFirebaseId", authId);
      this.$store.dispatch("ModuleMessage/updateReadMessage");
      this.$store.commit("activateMessageDetail", true);
    },
    searchUsers() {
      if (this.debounceSearch !== null) {
        clearTimeout(this.debounceSearch);
      }
      this.isLoading = true;

      this.debounceSearch = setTimeout(() => {
        this.$store
          .dispatch("ModuleMessage/fetchChattedWith", this.username)
          .then(oStatus => {
            this.isLoading = false;
            // if there is no chatted with id, we will get the first one
            if (this.oUsersInfo && this.chattingWithId) {
              const usersInfo = Object.values(this.oUsersInfo);
              const oFirstUser = { ...usersInfo[0] };
              this.$store.commit(
                "ModuleMessage/setChattingWithId",
                oFirstUser.userID
              );
              if (this.isUsingFirebase) {
                const userKeysInfo = Object.keys(this.oUsersInfo);
                const firstUserKey = [...userKeysInfo];
                this.$store.commit(
                  "ModuleMessage/setChattingWithFirebaseId",
                  firstUserKey
                );
              }
            }
          });

        clearTimeout(this.debounceSearch);
      }, 400);
    },
    fetchUsers() {
      this.isLoading = false;
      const oFetchChattedWith = this.$store.dispatch(
        "ModuleMessage/fetchChattedWith"
      );
      oFetchChattedWith.then(oStatus => {
        if (oStatus.success && !oStatus.isFoundAll) {
          this.listenScrollTo();
        }
      });
    },
    listenScrollTo() {
      if (this.oObserverScroll === null) {
        this.oObserverScroll = new ListenScrollTo(
          "wilcity-list-authors-wrapper",
          {
            scrolledDown: self => {
              this.scrollDirection = "down";
              if (self.currentButtom < 50) {
                this.isLoading = true;
                setTimeout(() => {
                  this.$store
                    .dispatch("ModuleMessage/fetchChattedWith")
                    .then(oStatus => {
                      if (oStatus.isFoundAll || !oStatus.success) {
                        this.oObserverScroll.destroy();
                      }
                      this.isLoading = false;
                    });
                }, 500);
              }
            },
            scrolledUp: self => {
              this.scrollDirection = "up";
            }
          },
          {
            bottom: 50,
            top: 0
          }
        );
      }
    },
    scrollTo() {
      let objDiv = document.getElementById("wilcity-list-authors-wrapper");
      if (this.scrollDirection == "down") {
        objDiv.scrollTop = objDiv.scrollHeight;
      } else {
        objDiv.scrollTop = 50;
      }
    }
  }
};
</script>
