<template>
  <div :class="wrapperClasses">
    <wil-heading :heading="heading" :desc="desc" :icon="icon" />
    <div class="content-box_body__3tSRB">
      <div class="chart-line_module__3VJ7j chartline">
        <canvas :id="generateChartId" height="250"></canvas>
      </div>
      <div class="chart-line_footer__eQHcA clearfix">
        <div class="chart-line_left__3N9YB">
          <div class="chart-line_content2__2Glqd">
            <span v-html="headingText"></span>
            <span>: {{ total }}</span>
          </div>
        </div>
        <div v-if="compare.diff" class="chart-line_right__1vIk7">
          <div class="chart-line_content2__2Glqd" :data-tooltip="tooltipText">
            <span v-html="labelText"></span>
            <span :style="{ color: compare.representColor }">
              <i class="la la-long-arrow-up"></i>
              <span v-html="compare.diff"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  name: "wil-chart",
  data() {
    return {};
  },
  props: {
    chartColor: {
      type: String,
      default: "#f06292"
    },
    wrapperClasses: {
      type: String,
      default: "content-box_module__333d9 mb-0"
    },
    heading: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    total: {
      type: Number,
      default: 0
    },
    compare: {
      // the different between previous statistic and this week/today
      type: Object,
      default: () => {} // {diff: "",  tooltip: "", label: "", representColor: ""}
    },
    type: {
      type: String,
      default: "line"
    },
    statisticBy: {
      type: String,
      default: "day" //
    },
    borderColor: {
      type: String,
      default: "blue"
    },
    label: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  computed: {
    headingText() {
      return this.$options.filters.filterTranslation(this.heading);
    },
    labelText() {
      return this.$options.filters.filterTranslation(this.compare.label);
    },
    tooltipText() {
      return this.$options.filters.filterTranslation(this.compare.tooltip);
    },
    datasets() {
      return [
        {
          label: this.label,
          data: this.data,
          backgroundColor: "transparent",
          borderColor: this.chartColor,
          borderWidth: 2,
          fillColor: "rgba(250,174,50,0.5)"
        }
      ];
    },
    generateChartId() {
      const timestamp = new Date().getTime();
      return `wil-chart-${timestamp}`;
    },
    getLabels() {
      if (this.statisticBy === "day") {
        return WILCITY_I18.oDaysOfWeek.map(oDay => {
          return oDay.label;
        });
      }
    },
    chartConfig() {
      return {
        type: this.type,
        data: {
          labels: this.getLabels,
          datasets: this.datasets
        },
        options: {
          responsive: true,
          tooltips: {
            borderWidth: 2,
            borderColor: this.borderColor
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: true
                }
              }
            ],
            yAxes: [
              {
                display: true
              }
            ]
          }
        }
      };
    }
  },
  methods: {
    drawnChart() {
      const el = document.getElementById(this.generateChartId);
      const ctx = el.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(250,174,50,1)");
      gradient.addColorStop(1, "rgba(250,174,50,0)");
      new Chart(el, this.chartConfig);
    }
  },
  mounted() {
    this.drawnChart();
  }
};
</script>
