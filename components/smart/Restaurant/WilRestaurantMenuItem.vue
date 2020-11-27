<template>
  <div :class="wrapperClasses">
    <div v-if="hasTitle" class="mb-20 pt-10 wil-text-center">
      <h5
        class="mt-0 mb-0"
        v-if="item.group_title.length"
        v-html="item.group_title"
      ></h5>
      <p
        class="fs-13"
        v-if="item.group_description.length"
        v-html="item.group_description"
      ></p>
      <i
        v-if="item.group_icon.length"
        :class="`fs-32 color-primary ${item.group_icon}`"
      ></i>
    </div>
    <wil-lists
      :items="item.items"
      wrapper-classes="list-none mb-20"
      inner-classes="no-style"
    >
      <template v-slot:list-item="{ item }">
        <div
          v-if="item.title || item.price || item.description"
          class="utility-box-1_module__MYXpX utility-box-1_menus__17rbu"
        >
          <wil-second-gallery :items="item.gallery" />

          <wil-link
            :target="item.is_open_new_window == 'yes' ? '_blank' : '_self'"
            :link="!!item.link_to ? item.link_to : '#'"
            rel="nofollow"
            wrapper-classes="no-style"
          >
            <div class="utility-box-1_body__8qd9j">
              <div class="utility-box-1_group__2ZPA2">
                <h3
                  class="utility-box-1_title__1I925"
                  v-if="item.title"
                  v-html="item.title"
                ></h3>
                <div
                  class="utility-box-1_content__3jEL7"
                  v-if="item.description"
                  v-html="item.description"
                ></div>
              </div>
              <div
                class="utility-box-1_description__2VDJ6"
                v-if="item.price"
                v-html="item.price"
              ></div>
            </div>
          </wil-link>
        </div>
      </template>
    </wil-lists>
  </div>
</template>
<script>
export default {
  name: "wil-restaurant-menu-item",
  props: {
    item: {
      type: Object,
      required: true
    },
    wrapperClasses: {
      type: String,
      default: ""
    }
  },
  computed: {
    hasTitle() {
      return this.item.group_title || this.item.group_description;
    }
  }
};
</script>
