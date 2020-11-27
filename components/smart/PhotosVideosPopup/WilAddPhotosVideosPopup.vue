<template>
  <wil-popup
    id="add-photos-videos-popup"
    @close="handleClosePopup"
    :is-open="true"
    @submit="handleSubmit"
    :is-loading="isLoading"
    :title="''|filterTranslation('addPhotoVideoPopupTitle')"
  >
    <div slot="body" style="min-height: 200px;">
      <wil-block-loading :is-loading="isLoading" />
      <wil-alert v-if="msg.length" icon="la la-bullhorn" :msg="msg" :type="msgType">
        <wil-link
          slot="after-msg"
          v-if="upgradeUrl.length"
          aligment="center"
          :btn-name="''|filterTranslation('goToUpgrade')"
          wrapper-classes="mt-20 wil-btn wil-btn--round wil-btn--sm wil-btn--primary "
          :href="upgradeUrl"
        />
      </wil-alert>

      <!-- promo-item_module__24ZhT -->
      <wil-heading
        v-if="isSetDefault"
        wrapper-classes="promo-item_module__24ZhT"
        inner-classes="promo-item_group__2ZJhC"
        left-classes="promo-item_title__3hfHG"
        :heading="''|filterTranslation('uploadMultipleImagesTitle')"
      >
        <template slot:after-heading>
          <p
            class="promo-item_description__2nc26"
          >{{''|filterTranslation('uploadMultipleImagesDesc')}}</p>
        </template>
      </wil-heading>
      <!-- End / promo-item_module__24ZhT -->

      <div
        :class="['field_module__1H6kT field_style2__2Znhe mb-15', !canUploadGallery ? 'disabled' : '']"
      >
        <wil-uploader
          v-if="isSetDefault"
          :value="gallery"
          :maximum-items="maximumImages"
          v-on="{change: handleFieldChange('gallery')}"
        />
      </div>

      <wil-heading
        v-if="isSetDefault"
        wrapper-classes="promo-item_module__24ZhT"
        inner-classes="promo-item_group__2ZJhC"
        left-classes="promo-item_title__3hfHG"
        :heading="''|filterTranslation('uploadVideosTitle')"
      >
        <template slot:after-heading>
          <p class="promo-item_description__2nc26">{{''|filterTranslation('uploadVideosDesc')}}</p>
        </template>
      </wil-heading>

      <div
        :class="['field_module__1H6kT field_style2__2Znhe mb-15', !canUploadVideo ? 'disabled' : '']"
      >
        <wil-pickup-and-set
          :maximum-items="maximumVideos"
          :value="videos"
          v-if="isSetDefault"
          :add-item-btn-name="''|filterTranslation('addVideoBtn')"
          v-on="{change: handleFieldChange('videos')}"
        />
      </div>
    </div>
  </wil-popup>
</template>
<script>
export default {
  name: "wil-add-photos-videos-popup",
  components: {
    WilUploader: () => import("./../../dumbs/uploads/WilUploader.vue"),
    WilPickupAndSet: () => import("./../../dumbs/WilPickupAndSet.vue")
  },
  data() {
    return {
      isLoading: false,
      videos: [],
      gallery: [],
      msg: "",
      msgType: "",
      maximumImages: 10,
      maximumVideos: 10,
      canUploadGallery: true,
      canUploadVideo: true,
      isSetDefault: false,
      upgradeUrl: "",
      newData: {}
    };
  },
  props: {
    postId: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleClosePopup() {
      this.$emit("close");
    },
    fetchGalleryVideo() {
      this.isLoading = true;
      this.msg = "";
      Vue.axios({
        method: "GET",
        url: WilQueryHelper.buildQueryUrl({
          action: "wil_fetch_edit_gallery_video",
          postID: this.postId
        })
      })
        .then(response => {
          if (!response.data.success) {
            this.msg = response.data.data.msg;
          } else {
            this.gallery = [...response.data.data.gallery];
            this.videos = [...response.data.data.videos];

            this.canUploadGallery =
              response.data.data.canUploadGallery === "yes";
            this.canUploadVideo = response.data.data.canUploadVideo === "yes";
            this.maximumVideos = response.data.data.maximumVideos;
            this.maximumImages = response.data.data.maximumGalleryImages;
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isSetDefault = true;
        });
    },
    handleFieldChange(key) {
      return val => {
        if (key === "videos") {
          this.videos = [...val];
        } else {
          this.gallery = [...val];
        }

        this.newData = {
          ...this.newData,
          [key]: val
        };
      };
    },
    handleSubmit() {
      this.isLoading = true;
      Vue.axios({
        method: "POST",
        url: WILOKE_GLOBAL.ajaxurl,
        data: this.createFormData({
          postID: this.postId,
          action: "wil_update_gallery_videos",
          data: JSON.stringify(this.newData)
        })
      })
        .then(response => {
          this.msg = response.data.data.msg;
          if (response.data.data.needUpgradePlan) {
            this.upgradeUrl = response.data.data.upgradeUrl;
          }

          if (response.data.success) {
            this.msgType = "success";
            setTimeout(() => {
              this.handleClosePopup();
            }, 3000);
          } else {
            this.msgType = "danger";
          }
        })
        .finally(() => (this.isLoading = false));
    }
  },
  created() {
    this.fetchGalleryVideo();
  }
};
</script>
