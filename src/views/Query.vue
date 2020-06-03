<template>
  <div style="margin-top: 60px">
    <el-container>
      <el-header style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        我的行程查询
      </el-header>
      <el-main style="margin-left: auto;margin-right: auto;">
        <el-table :data="tableInOutInfo">
          <el-table-column prop="userName" label="用户名" width="100">
          </el-table-column>
          <el-table-column prop="phone" label="联系方式" width="140">
          </el-table-column>

          <el-table-column prop="fromCommunityName" label="入社区名字" width="100">
          </el-table-column>
          <el-table-column prop="inTime" label="入社区时间" width="200" :formatter="timestampToTime" sortable>
          </el-table-column>
          <el-table-column prop="inUserName" label="入社区负责任" width="150">
          </el-table-column>

          <el-table-column prop="toCommunityName" label="出社区名字" width="100">
          </el-table-column>
          <el-table-column prop="outTime" label="出社区时间" width="200" :formatter="timestampToTime" sortable>
          </el-table-column>
          <el-table-column prop="outUserName" label="出社区负责人" width="150">
          </el-table-column>

          <el-table-column prop="comment" label="备注" width="150">
          </el-table-column>

        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="current_page"
          :page-size="page_size"
          layout="prev, next, jumper"
          :total="total">
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import loginCheck from '@/login.js'
  export default {
    name: "",
    created() {
      loginCheck(this);
      this.render_inout();
    },
    data() {
      return {
        tableInOutInfo: [],
        current_page: 0,
        page_size: 30,
        total: 10,
      }
    },
    methods: {
      render_inout() {
        this.$axios.get("/api/info/countinoutinfo?token=" + window.localStorage["token"]).then((response) => {
          this.total = Math.ceil(response.data.amount / this.page_size);
        }).catch((err) => {
        });
        this.$axios.get("/api/info/inoutinfo?page=0&pageSize=" + this.page_size + "&token=" + window.localStorage["token"]).then((response) => {
          this.tableInOutInfo = response.data;
        }).catch((err) => {
        })
      },
      timestampToTime(row, column) {
        let date = new Date(row[column.property]);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y + M + D + h + m + s;
      },
      handleCurrentChange(val) {
        let pagesize = this.page_size;
        let page = val - 1;
        this.current_page = val;
        this.$axios.get("/api/info/inoutinfo?page=" + page + "&pageSize=" + pagesize + "&token=" + window.localStorage["token"]).then((response) => {
          this.tableInOutInfo = response.data;
        }).catch((err) => {
        });

        this.$axios.get("/api/info/countinoutinfo?token=" + window.localStorage["token"]).then((response) => {
          this.total = response.data.amount;
        }).catch((err) => {
        });
      },
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 65px;
  }
</style>
