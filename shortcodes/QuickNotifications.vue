<template>
  <div>
    <a :class="aCssClass"
       href="#"
       data-toggle-minWidth="768"
       :data-tooltip="oTranslation.notifications"
       data-tooltip-placement="top"
       data-tooltip-theme="light"
       @click.prevent="toggleShowing">
      <i class="la la-bell-o"></i>
      <span v-show="countNewNotifications"
            class="header_number__1a6F5 bg-color-quaternary">{{countNewNotifications}}</span>
    </a>
    <div :class="wrapperNotificationsClass">
      <div class="pos-r" v-show="isLoading=='yes'" style="min-height: 100px;">
        <block-loading :is-loading="isLoading" position="pos-a-center"></block-loading>
      </div>
      <ul v-show="aNotifications.length"
          class="list-utility_module__32oNg list-none list-utility_abs__OYiyL arrow--top-right">
        <li v-for="oNotification in aNotifications" class="list-utility_list__1DzGk">
          <a class="list-utility_link__3BRZx"
             :href="oNotification.link">
              <span class="list-utility_remove__1Vlf4 color-primary--hover"
                    :title="oTranslation.deleteMsg"
                    @click.prevent="deleteNotification(oNotification, order)">
                <i class="la la-close"></i>
              </span>
            <div class="utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix ">
              <div v-if="oNotification.featuredImg"
                   class="utility-box-1_avatar__DB9c_ rounded-circle"
                   :style="{'background-image': 'url('+oNotification.featuredImg+')'}">
                <img :src="oNotification.featuredImg" :alt="oNotification.title"/>
              </div>
              <div class="utility-box-1_body__8qd9j">
                <div class="utility-box-1_group__2ZPA2 text-ellipsis">
                  <h3 v-if="oNotification.title" class="utility-box-1_title__1I925" v-html="oNotification.title"></h3>
                  <div class="utility-box-1_content__3jEL7">
                    <span v-html="oNotification.content"></span>
                    <span v-if="oNotification.contentHighlight"
                          class="color-dark-1"
                          v-html="oNotification.contentHighlight"></span>
                  </div>
                </div>
                <div class="utility-box-1_description__2VDJ6"><i class="la la-comments color-primary"></i>
                  {{oNotification.time}}
                </div>
              </div>
            </div>
          </a>
        </li>
        <li v-show="aNotifications.length" class="list-utility_list__1DzGk">
          <a class="list-utility_more__2Y_w7 wil-text-center color-primary--hover"
             :href="notificationDashboardUrl">{{oTranslation.viewAll}}</a>
        </li>
      </ul>
      <ul v-show="errMsg.length" class="list-utility_module__32oNg list-none list-utility_abs__OYiyL arrow--top-right">
        <li class="list-utility_list__1DzGk">
          <a href="#" class="list-utility_link__3BRZx">
            <div class="utility-box-1_module__MYXpX utility-box-1_sm__mopok utility-box-1_boxLeft__3iS6b clearfix">
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
<script lang="javascript">
  import BlockLoading from './BlockLoading.vue'

  export default {
    data() {
      return {
        oTranslation: WILCITY_I18,
        isShowing: 'no',
        isLoading: 'no',
        needDashboardUrl: 'yes',
        aNotifications: [],
        errMsg: '',
        notificationDashboardUrl: '#',
        countNewNotifications: 0,
        isLoadedCheckUnFocusClick: false
      }
    },
    components: {
      BlockLoading
    },
    computed: {
      wrapperNotificationsClass() {
        return this.isShowing === 'no' ? 'header_loginBody__2hz2g' : 'header_loginBody__2hz2g active';
      },
      aCssClass() {
        return this.isShowing === 'yes' ? 'header_loginHead__3HoVP active' : 'header_loginHead__3HoVP';
      }
    },
    mounted() {
      setTimeout(() => {
        this.fetchNewNotifications();
        this.$store.commit('updateTimeout');
      }, this.$store.getters.getTimeout);
    },
    methods: {
      deleteNotification(oNotification, order) {
        let askHim = confirm(this.oTranslation.confirmDeleteNotification);
        if (!askHim) {
          return false;
        }

        jQuery.ajax({
          type: 'POST',
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: 'wilcity_delete_notification',
            ID: oNotification.ID
          },
          success: response => {
            if (response.success) {
              this.aNotifications.splice(order, 1);
            } else {
              this.errorMsg = response.data.msg;
            }
          }
        })
      },
      fetchNewNotifications() {
        jQuery.ajax({
          type: 'POST',
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: 'wilcity_count_new_notifications'
          },
          success: response => {
            this.countNewNotifications = response.data;
          }
        })
      },
      resetNotification() {
        if (this.countNewNotifications < 1) {
          return false;
        }
        this.countNewNotifications = 0;
        setTimeout(() => {
          jQuery.ajax({
            type: 'POST',
            url: WILOKE_GLOBAL.ajaxurl,
            data: {
              action: 'wilcity_reset_new_notifications'
            }
          })
        }, 4000);
      },
      hideMenu() {
        this.isShowing = 'no';
      },
      toggleShowing() {
        this.isShowing = this.isShowing === 'no' ? 'yes' : 'no';

        if (!this.isLoadedCheckUnFocusClick) {
          this.hideWhenOurClick();
          this.isLoadedCheckUnFocusClick = true;
        }

        this.isLoading = 'yes';
        this.errMsg = '';
        this.aNotifications = [];
        this.resetNotification();

        jQuery.ajax({
          type: 'post',
          url: WILOKE_GLOBAL.ajaxurl,
          data: {
            action: 'wilcity_fetch_list_notifications',
            needDashboardUrl: this.needDashboardUrl,
            limit: 5
          },
          success: response => {
            if (response.success) {
              this.aNotifications = response.data.oInfo;
              if (this.notificationDashboardUrl === '#') {
                this.notificationDashboardUrl = response.data.dashboardUrl;
                this.needDashboardUrl = 'no';
              }
            } else {
              this.errMsg = response.data.msg;
            }
            this.isLoading = 'no';
          }
        })
      },
      hideWhenOurClick() {
        jQuery(document).on('click', (event => {
          if (this.isShowing === 'yes') {
            if (!jQuery(event.target).closest('#' + WHITE_LABEL + '-quick-notifications').length) {
              this.isShowing = 'no';
            }
          }
        }))
      }
    }
  }
</script>
