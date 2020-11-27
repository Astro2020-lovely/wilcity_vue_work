<template>
  <div :class="parseWrapperClasses">
    <template v-if="isMultiple">
      <div class="upload-image_row__2UK1p clearfix">
        <div v-if="images.length">
          <wil-list-imgs :value="images" @removeImg="removeImg" />
        </div>
        <div :class="uploadClasses">
          <label>
            <input
              :id="generateID"
              type="file"
              ref="inputFile"
              multiple
              @change="prepareUploadGallery"
            />
          </label>
          <div v-if="!isUploading" class="upload-image_buttonContent__fjl5V">
            <i class="la la-image"></i>
          </div>
          <div v-else class="full-load">
            <div class="pill-loading_module__3LZ6v pos-a-center">
              <div class="pill-loading_loader__3LOnT"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="field_wrap__Gv92k">
        <input
          :id="generateID"
          class="field_field__3U_Rt"
          type="file"
          ref="inputFile"
          @change="prepareUploadSIngleImage"
        />
        <span
          v-if="images.src"
          @click="uploadImages"
          class="input-filename"
          :data-text="images.filename"
        >
          <span class="input-fileimg" :style="backgroundImage(images)"></span>
        </span>
        <span
          class="field_label__2eCP7 text-ellipsis"
          :class="{required: isRequired}"
          v-html="label"
        ></span>
        <span class="bg-color-primary"></span>
        <div class="field_right__2qM90 pos-a-center-right">
          <a :class="uploadBtnClasses" href="#" @click.prevent="uploadImages">
            <span>{{''|filterTranslation('uploadSingleImageTitle')}}</span>
            <div v-show="isUploading" class="pill-loading_module__3LZ6v">
              <div class="pill-loading_loader__3LOnT"></div>
            </div>
          </a>
        </div>
      </div>
    </template>
    <wil-field-error-msg :msg="errMsg" />
  </div>
</template>

<script lang="javascript">
import WilListImgs from "./WilListImgs.vue";
import MediaUpload from "./../../../mixins/MediaUpload";

export default {
  name: "wil-default-uploader",
  mixins: [MediaUpload],
  data() {
    return {
      images: [],
      errMsg: "",
      aErrors: [],
      isUploading: false,
      previousImgs: {}
    };
  },
  computed: {
    uploadBtnClasses() {
      const classes = "wil-btn wil-btn--primary wil-btn--round wil-btn--xxs";
      if (this.isUploading) {
        return `${classes} wil-btn--loading`;
      }

      return classes;
    },
    uploadClasses() {
      const defaultClasses = "upload-image_button__3-6QW color-primary--hover";
      return this.maximumItems < this.images.length
        ? `${defaultClasses} disable`
        : defaultClasses;
    },
    generateID() {
      let oDate = new Date();
      return "js-upload-" + oDate.getUTCMilliseconds();
    },
    parseWrapperClasses() {
      if (this.errMsg.length) {
        return `${this.wrapperClasses} error`;
      }

      if (this.isMultiple) {
        if (this.images.length) {
          return `${this.wrapperClasses} active`;
        }
      } else {
        if (this.images.src) {
          return `${this.wrapperClasses} active`;
        }
      }

      return `${this.wrapperClasses}`;
    },
    wrapperSingleUploadClasses() {
      return this.images.src ? "active" : "";
    }
  },
  methods: {
    backgroundImage(img) {
      return {
        backgroundImage: "url(" + img.src + ")"
      };
    },
    async submitFiles(formData) {
      this.isUploading = true;
      let url = `${WILOKE_GLOBAL.ajaxurl}?action=wilcity_ajax_upload_imgs&security=${WILOKE_INLINE_GLOBAL.security}`;
      if (this.images.id) {
        url = `${url}&previous=${this.images.id}`;
      }
      const { data } = await Vue.axios({
        method: "POST",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).finally(() => {
        this.isUploading = false;
      });

      return data;
    },
    handleUploadResponse(response) {
      if (response.success) {
        if (this.isMultiple) {
          this.images = [...this.images, response.data.aImgs[0]];
        } else {
          this.images = { ...response.data.aImgs[0] };
        }
      } else {
        if (this.isMultiple) {
          this.aErrors = [...this.aErrors, response.data.msg];
        } else {
          this.errMsg = response.data.msg;
        }
      }
    },
    async prepareUploadSIngleImage() {
      const formData = new FormData();
      const file = this.$refs.inputFile.files[0];
      formData.append("aFile", file);
      const response = await this.submitFiles(formData);
      this.handleUploadResponse(response);
    },
    prepareUploadGallery() {
      let files;
      files = this.$refs.inputFile.files;
      const total =
        files.length > this.maximumItems ? this.maximumItems : files.length;
      let i = 0;

      while (i < total) {
        const formData = new FormData();
        formData.append("aFile", files[i]);

        this.submitFiles(formData).then(response => {
          this.handleUploadResponse(response);
        });

        i++;
      }
    },
    uploadImages() {
      this.$refs.inputFile.click();
    },
    deleteImg(imgID) {
      const data = new FormData();
      data.append("action", "wilcity_delete_attachment");
      data.append("id", imgID);
      data.append("security", WILOKE_INLINE_GLOBAL.security);

      Vue.axios({
        url: WILOKE_GLOBAL.ajaxurl,
        method: "POST",
        data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
      });
    },
    removeImg(order) {
      this.deleteImg(this.images[order].id);
      this.images = this.arrDeleteItem(order, this.images);
    }
  },
  components: {
    WilListImgs
  }
};
</script>
