<template>
  <div class="message_right__2YFjj">
    <div class="message_head__2tf2D">
      <h6 class="mg-0">{{''|filterTranslation('recipientInfo')}}</h6>
    </div>
    <div class="message_body__njHFs">
      <div class="author-listing_module__3K7-I">
        <div
          class="utility-box-1_module__MYXpX utility-box-1_md__VsXoU utility-box-1_boxLeft__3iS6b clearfix mb-20 mb-sm-15"
        >
          <div class="utility-box-1_avatar__DB9c_ rounded-circle">
            <a target="_blank" :href="oUserInfo.profileUrl">
              <img
                style="display:block !important;"
                :src="oUserInfo.avatar"
                :alt="oUserInfo.displayName"
              />
            </a>
          </div>
          <div class="utility-box-1_body__8qd9j">
            <div class="utility-box-1_group__2ZPA2">
              <h3 class="utility-box-1_title__1I925">
                <a target="_blank" :href="oUserInfo.profileUrl" v-html="oUserInfo.displayName"></a>
              </h3>
              <div v-if="oUserInfo.position" class="utility-box-1_description__2VDJ6">
                <a target="_blank" :href="oUserInfo.profileUrl" v-html="oUserInfo.position"></a>
              </div>
            </div>
          </div>
        </div>
        <div class="social-icon_module__HOrwr social-icon_style-2__17BFy">
          <template v-for="(val, icon) in oUserInfo.aSocialNetworks">
            <a
              v-if="val.toString().length"
              :key="generateUserInfoKey(icon)"
              class="social-icon_item__3SLnb"
              :href="val"
              target="_blank"
            >
              <i :class="renderSocialIcon(icon)"></i>
            </a>
          </template>
        </div>

        <div class="wil-divider mt-20 mt-sm-15 mb-15"></div>
        <div
          v-if="oUserInfo.address"
          class="icon-box-1_module__uyg5F one-text-ellipsis mt-20 mt-sm-15 text-pre"
        >
          <div class="icon-box-1_block1__bJ25J">
            <a target="_blank" :href="renderGoogleAddressUrl(oUserInfo.address)">
              <div class="icon-box-1_icon__3V5c0 rounded-circle">
                <i class="la la-map-marker"></i>
              </div>
              <div class="icon-box-1_text__3R39g" v-html="oUserInfo.address"></div>
            </a>
          </div>
        </div>
        <div
          v-if="oUserInfo.phone"
          class="icon-box-1_module__uyg5F one-text-ellipsis mt-20 mt-sm-15 text-pre"
        >
          <div class="icon-box-1_block1__bJ25J">
            <a :href="renderPhone(oUserInfo.phone)">
              <div class="icon-box-1_icon__3V5c0 rounded-circle">
                <i class="la la-phone"></i>
              </div>
              <div class="icon-box-1_text__3R39g" v-html="oUserInfo.phone"></div>
            </a>
          </div>
        </div>
        <div
          v-if="oUserInfo.website"
          class="icon-box-1_module__uyg5F one-text-ellipsis mt-20 mt-sm-15 text-pre"
        >
          <div class="icon-box-1_block1__bJ25J">
            <a target="_blank" href="oUserInfo.website">
              <div class="icon-box-1_icon__3V5c0 rounded-circle">
                <i class="la la-globe"></i>
              </div>
              <div class="icon-box-1_text__3R39g" v-html="oUserInfo.website"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "wil-chat-recipient-info",
  computed: {
    chattingWithId() {
      return this.$store.getters["ModuleMessage/getChattingWithId"];
    },
    oUserInfo() {
      return this.$store.getters["ModuleMessage/getChattingWithProfileDetails"];
    }
  },
  watch: {
    chattingWithId: {
      handler(userId) {
        if (userId !== null) {
          this.$store.dispatch(
            "ModuleMessage/fetchChattingWithProfileDetails",
            userId
          );
        }
      },
      immediate: true
    }
  },
  methods: {
    generateUserInfoKey(icon) {
      return `wil-user-info-${icon}`;
    },
    renderSocialIcon(icon) {
      return "fa fa-" + icon;
    },
    renderGoogleAddressUrl(address) {
      return "https://www.google.com/maps/search/" + address;
    },
    renderPhone(phone) {
      return "tel:" + phone;
    }
  }
};
</script>
