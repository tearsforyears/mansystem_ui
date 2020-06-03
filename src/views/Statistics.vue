<template>
  <el-container style="margin-top: 60px">
    <el-header style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
      出入统计
    </el-header>
    <el-main>
      <el-container id="plot" style="width: 60%;height: 70vh; margin-left: auto;margin-right: auto;">
      </el-container>
    </el-main>
    <div></div>
  </el-container>
</template>

<script>
  import loginCheck from '@/login.js'
  // vue文件中引入echarts工具
  let echarts = require('echarts/lib/echarts');
  require('echarts/lib/chart/line');
  require('echarts/lib/component/title');   //  title组件
  require('echarts/lib/component/legend');  // legend组件
  export default {
    name: "",
    data() {
      return {
        smooth: true,
        line_plot: null,
        option: {
          title: {
            text: "社区总体出入统计",
          },
          legend: {data: ["入社区", "出社区"]},
          xAxis: {
            type: 'category',
            name: '时间/小时',
            data: [],
            nameTextStyle: {
              fontSize: 18,
            }
          },
          yAxis: {
            type: 'value',
            name: "出入量",
            nameTextStyle: {
              fontSize: 18,
            }
          },
          series: [],
        }
      }
    },
    mounted() {
      this.line_plot = echarts.init(document.getElementById("plot"));
      this.render_line_plot();
    },
    created() {
      loginCheck(this);
      this.render_statistics_all();
    },
    methods: {
      render_line_plot() {
        this.line_plot.setOption(this.option);
      },
      render_statistics_all() {
        this.$axios.get("/api/statistics/getInTPSInfo").then((response) => {
          let lis = response.data;
          let count_lis = [];
          let date_lis = [];
          for (let i = 0; i < lis.length; i++) {
            count_lis.push(lis[i].count);
            date_lis.push(lis[i].date);
          }
          this.option.xAxis.data = date_lis.reverse();
          this.option.series.push({
            name: '入社区',
            data: count_lis.reverse(),
            type: 'line',
            smooth: true,
          });
          this.render_line_plot();
        }).catch((err) => {
        });

        this.$axios.get("/api/statistics/getOutTPSInfo").then((response) => {
          let lis = response.data;
          let count_lis = [];
          let date_lis = [];
          for (let i = 0; i < lis.length; i++) {
            count_lis.push(lis[i].count);
            date_lis.push(lis[i].date);
          }
          this.option.xAxis.data = date_lis.reverse();
          this.option.series.push({
            name: '出社区',
            data: count_lis.reverse(),
            type: 'line',
            smooth: true,
          });
          this.render_line_plot();
        }).catch((err) => {
        });
      }
    }
  }
</script>

<style scoped>

</style>
