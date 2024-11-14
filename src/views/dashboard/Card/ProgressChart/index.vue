<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressChart",
  mounted() {
    const chart = echarts.init(this.$refs.chart);
    chart.setOption({
      xAxis: {
        show: false,
        min:0,
        max:100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      tooltip: {},
      series: [
        {
          type: "bar",
          data: [78],
          color: 'yellowgreen',
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
        },
      ],
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
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