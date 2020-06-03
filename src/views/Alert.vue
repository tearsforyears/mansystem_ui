<template>
  <div style="margin-top: 60px">
    <el-container>
      <el-header style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        预警名单
      </el-header>
      <el-main style="margin-left: auto;margin-right: auto;">
        <el-table :data="tableAlert">
          <el-table-column prop="username" label="姓名" width="200">
          </el-table-column>
          <el-table-column prop="times" label="出入次数" width="240" sortable>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="240">
          </el-table-column>
        </el-table>
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
      this.render_alert();
    },
    data() {
      return {
        tableAlert: [],
      }
    },
    methods: {
      render_alert() {
        this.$axios.get("/api/alert/getAlertInfo?token=" + window.localStorage["token"]).then((response) => {
          this.tableAlert = response.data;
          console.log(response.data);
        }).catch((err) => {
        })
      },
    }
  }
</script>

<style scoped>

</style>
