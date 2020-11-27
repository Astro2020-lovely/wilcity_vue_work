<div>
  <div class="rated-slider_module__s79oc d-table">
    <div class="rated-slider_item__3pr-4 d-table-row">
      <div class="rated-slider_text__RSWfi d-table-cell">{{oItem.name}}</div>
      <div class="rated-slider_slider__ncPAq d-table-cell">
        <div
          class="js-slider"
          :data-slider-min="minimum"
          :data-slider-max="maximum"
          :data-slider-value="changed"
        ></div>
        <div class="js-slider-info">
          <span class="js-slider-info__number">{{changed}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
export default {
  data() {
    return {
      isUpdated: false,
      changed: this.value,
      $jsSlider: null
    };
  },
  props: ["maximum", "minimum", "oItem", "value"],
  updated: function() {
    this.$nextTick(function() {
      if (this.isUpdated) {
        return false;
      }

      this.isUpdated = true;
      this.wilSlider();
    });
  },
  watch: {
    value: function(newVal) {
      this.changed = newVal;
      this.$jsSlider.slider("option", "value", newVal);
    }
  },
  methods: {
    wilSlider() {
      if (isNaN(this.value)) {
        this.value = 0;
      }

      this.$jsSlider = jQuery(this.$el).find(".js-slider");

      let info = this.$jsSlider.siblings(".js-slider-info"),
        key = this.$jsSlider.data("key"),
        number = jQuery(".js-slider-info__number", info);

      this.$jsSlider.slider({
        range: "min",
        min: this.$jsSlider.data("slider-min"),
        max: this.$jsSlider.data("slider-max"),
        value: this.value,
        slide: (event, ui) => {
          info.attr("data-active", "true");
          number.text(ui.value);
          this.changed = ui.value;
          if (ui.value === 0) {
            info.attr("data-active", "");
          }
        },
        stop: (event, ui) => {
          this.$emit("sliderChanged", ui.value, this.oItem);
        }
      });
    }
  },
  mounted() {
    this.wilSlider();
  }
};
</script>
