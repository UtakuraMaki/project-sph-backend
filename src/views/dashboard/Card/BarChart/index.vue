<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarChart",
  mounted() {
    const chart = echarts.init(this.$refs.chart);
    chart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      tooltip: {},
      series: [
        {
          type: "bar",
          data: [10, 20, 5, 10, 20, 30, 40, 30, 40, 5, 10, 20, 20],
        },
      ],
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    });
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>