<template>
  <el-card class="dashboard-sale">
    <template v-slot:header>
      <el-tabs v-model="activeName">
        <el-tab-pane label="销售额" name="first"></el-tab-pane>
        <el-tab-pane label="访问量" name="second"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="value1"
          size="mini"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="16">
        <div ref="chart" style="width: 100%; height: 300px"></div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>门店{{ text }}排名</p>
          <ul>
            <li class="active">
              <div>
                <span>1</span>
                <span>肯德基</span>
              </div>
              <div>323,234</div>
            </li>
            <li class="active">
              <div>
                <span>2</span>
                <span>麦当劳</span>
              </div>
              <div>299,132</div>
            </li>
            <li class="active">
              <div>
                <span>3</span>
                <span>肯德基</span>
              </div>
              <div>283,998</div>
            </li>
            <li>
              <div>
                <span>4</span>
                <span>海底捞</span>
              </div>
              <div>266,223</div>
            </li>
            <li>
              <div>
                <span>5</span>
                <span>西贝筱面村</span>
              </div>
              <div>223,445</div>
            </li>
            <li>
              <div>
                <span>6</span>
                <span>汉堡王</span>
              </div>
              <div>219,663</div>
            </li>
            <li>
              <div>
                <span>7</span>
                <span>真功夫</span>
              </div>
              <div>200,997</div>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
const dayjs = require('dayjs')
export default {
  name: "Sale",
  data() {
    return {
      activeName: "first",
      chart: null,
      value1: []
    };
  },
  computed: {
    text() {
      if(this.activeName === 'first') {
        return '销售额'
      }
      else {
        return '访问量'
      }
    }
  },
  watch: {
    activeName(newValue, oldValue) {
      this.chart.setOption({
        title: {
          text: `${this.text}趋势`
        }
      })
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.chart.setOption({
      title: {
        text: "销售额趋势",
      },
      xAxis: {
        type: 'category',
        data: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 500,
      },
      series: [
        {
          type: "bar",
          data: [410, 90, 200, 330, 390, 330, 220, 160, 90, 200, 150, 290],
          barWidth: 30,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      }
    });
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.value1 = [day, day]
    },
    setWeek() {
      const start_week = dayjs().startOf('week').format('YYYY-MM-DD')
      const end_week = dayjs().endOf('week').format('YYYY-MM-DD')
      this.value1 = [start_week, end_week]
    },
    setMonth() {
      const start_month = dayjs().startOf('month').format('YYYY-MM-DD')
      const end_month = dayjs().endOf('month').format('YYYY-MM-DD')
      this.value1 = [start_month, end_month]
    },
    setYear() {
      const start_year = dayjs().startOf('year').format('YYYY-MM-DD')
      const end_year = dayjs().endOf('year').format('YYYY-MM-DD')
      this.value1 = [start_year, end_year]
    }
  }
};
</script>

<style scoped lang="scss">
.el-card {
  margin-top: 10px;
  .el-tabs {
    width: 100%;
  }
  .right {
    position: absolute;
    right: 20px;
    span {
      margin-right: 20px;
    }
    .el-date-editor {
      width: 200px;
    }
  }
  .el-col-8 {
    > div {
      padding: 0 80px;
      p {
        margin: 0;
        padding: 0;
      }
      ul {
        margin: 0;
        padding: 0;
        li {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          width: 100%;
          list-style: none;
          > div:first-child {
            span {
              margin-right: 40px;
              &:first-child {
                padding: 5px 9px;
              }
            }
          }
          &.active {
            > div {
              span {
                &:first-child {
                  background-color: black;
                  border-radius: 50%;
                  color: white;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.dashboard-sale {
  .el-card__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    border-bottom: none;
  }
}
</style>