<template>
  <div :class="wrapperClasses">
    <a :href="item.link">
      <div
        class="icon-box5_bg__3fUqQ bg-cover text-center"
        :style="`background-image: url(${item.bgImg})`"
      >
        <div class="icon-box5_content__1iR-o">
          <div v-if="item.icon && item.icon.length" class="icon-box5_icon1__2mN99 mb-5">
            <img :src="item.icon" :alt="title" />
          </div>
          <div
            class="icon-box5_text__Hf2io"
            v-if="item.title && item.title.length"
            v-html="item.title"
          ></div>
          <div v-if="item.icon2 && item.icon2.length" class="icon-box5_icon2__3Qg32">
            <img :src="item.icon2" :alt="item.title" />
          </div>
        </div>
      </div>
      <div class="icon-box5_meta__19y20">
        <div
          class="icon-box5_count__3TVft color-primary"
          v-if="item.subTitle && item.subTitle.length"
        >
          <i v-if="item.subTitleIcon && item.subTitleIcon.length" :class="item.subTitleIcon"></i>
          {{item.subTitle}}
        </div>
        <div
          class="icon-box5_dsc__1GJi7"
          v-if="item.description && item.description.length"
          v-html="item.description"
        ></div>
      </div>
    </a>
  </div>
</template>
<script>
export default {
  name: "wil-box-icon-item",
  props: {
    wrapperClasses: {
      type: String,
      default: "icon-box5_module__1YU6t"
    },
    item: {
      // link, imgBg, icon, title, subTitle, icon2, description
      type: Object,
      default: () => {}
    }
  }
};
</script>
