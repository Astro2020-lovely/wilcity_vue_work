<template>
  <draggable v-model="images">
    <div
      v-for="(img, order) in images"
      :key="`list-img-${order}`"
      class="upload-image_thumb__V-SH7"
    >
      <div
        class="upload-image_image__17ttf cover-after"
        :style="styles(img)"
      ></div>
      <span
        class="upload-image_remove__3Oa_t color-primary--hover"
        @click.prevent="removeImg(order)"
      >
        <i class="la la-close"></i>
      </span>
    </div>
  </draggable>
</template>
<script lang="javascript">
import draggable from 'vuedraggable';

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  components: {
    draggable
  },
  methods: {
    styles(img) {
      return {
        'backgroundImage': `url(${img.src})`
      };
    },
    removeImg(order) {
      this.$emit('removeImg', order);
    }
  },
  computed: {
    images: {
      get() {
        return [...this.value];
      },
      set(val) {
        this.$emit('change', val);
      }
    }
  }
}
</script>
