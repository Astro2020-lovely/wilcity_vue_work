<template>
  <div :class="parseWrapperClasses">
    <template v-if="isMultiple">
      <div class="upload-image_row__2UK1p clearfix">
        <div v-if="images.length">
          <wil-list-imgs :value="images" @removeImg="removeImg" />
        </div>
        <div :class="uploadClasses">
          <label>
            <input :id="generateID" type="text" @click.prevent="uploadImages" />
          </label>
          <div class="upload-image_buttonContent__fjl5V">
            <i class="la la-image"></i>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <wil-input
        :inner-classes="innerClasses"
        :label="label"
        :is-required="isRequired"
        :ignore-validation="true"
      >
        <template v-slot:beforelabel>
          <span
            v-if="images.src"
            :data-text="images.fileName"
            class="input-filename"
          >
            <span class="input-fileimg" :style="backgroundImage(images)"></span>
          </span>
        </template>
        <template v-slot:afterlabel>
          <div class="field_right__2qM90 pos-a-center-right">
            <a
              href="#"
              @click.prevent="uploadImages"
              class="wil-btn wil-btn--primary wil-btn--round wil-btn--xxs"
            >
              <span>{{ "" | filterTranslation("upload") }}</span>
            </a>
          </div>
        </template>
      </wil-input>
    </template>

    <wil-field-error-msg :msg="errMsg" />
  </div>
</template>

<script lang="javascript">
import WilListImgs from "./WilListImgs.vue";
import MediaUpload from "./../../../mixins/MediaUpload";

export default {
  name: "wil-wp-uploader",
  mixins: [MediaUpload],
  data() {
    return {
      cacheMedia: null
    };
  },
  computed: {
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
    handleSingleUpload(oAttachment) {
      this.images = {
        id: oAttachment.id,
        src: oAttachment.url,
        fileName: oAttachment.filename
      };
    },
    handleMultipleUpload(oAttachments) {
      const aParseAttachments = oAttachments.reduce(
        (accumulator, oAttachment) => {
          return [
            ...accumulator,
            {
              id: oAttachment.id,
              src: oAttachment.url,
              fileName: oAttachment.filename
            }
          ];
        },
        []
      );

      this.images = this.images.concat(aParseAttachments);

      if (this.images.length > this.maximumItems) {
        this.images = this.images.slice(0, this.maximumItems);
      }
    },
    uploadImages(event) {
      if (this.cacheMedia) {
        this.cacheMedia.open();
        return true;
      }

      this.cacheMedia = wp.media({
        multiple: this.isMultiple
      });

      this.cacheMedia.on("select", () => {
        if (!this.isMultiple) {
          this.handleSingleUpload(
            this.cacheMedia
              .state()
              .get("selection")
              .first()
              .toJSON()
          );
        } else {
          this.handleMultipleUpload(
            this.cacheMedia
              .state()
              .get("selection")
              .toJSON()
          );
        }
      });

      this.cacheMedia.open();
    },
    removeImg(order) {
      this.images = this.arrDeleteItem(order, this.images);
    }
  },
  components: {
    WilListImgs
  }
};
</script>
