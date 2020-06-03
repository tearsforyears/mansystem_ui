<template>
  <div style="margin-top: 60px">
    <el-container>
      <el-header style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        社区列表
      </el-header>

      <el-main style="margin-left: auto;margin-right: auto;">
        <el-container>
          <el-table :data="tableCommunity">
            <el-table-column prop="name" label="名字" width="200">
            </el-table-column>
            <el-table-column prop="description" label="描述" width="200">
            </el-table-column>
            <el-table-column prop="address" label="地址" width="400">
            </el-table-column>

            <el-table-column prop="id" label="申请" width="150">
              <template slot-scope="scope">
                <el-button type="primary" @click.native="apply(scope.row.id)" plain>申请管理社区</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-container>
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
    methods: {
      handleCurrentChange(val) {
        let pagesize = this.page_size;
        let page = val - 1; // 这里是个坑点 因为最后编译的sql从0开始数
        this.current_page = val;
        this.$axios.get("/api/info/getCommunities?page=" + page + "&pagesize=" + pagesize + "&token=" + window.localStorage.getItem("token")).then((response) => {
          console.log(response.data);
          this.tableCommunity = response.data;
        }).catch((err) => {
        });
        this.$axios.get("/api/info/countCommunities?token=" + window.localStorage.getItem("token")).then((response) => {
          this.total = Math.ceil(response.data.amount / this.page_size);
        }).catch((err) => {
        });
      },
      apply(id) {
        let params = new URLSearchParams();
        params.append("id", id);
        params.append("token", window.localStorage["token"]);
        this.$axios.post("/api/info/insertManCommunityUsers", params).then((response) => {
          this.$message({
            type: 'info',
            message: response.data.msg,
          });
        }).catch((err) => {
        })
      }
    },
    created() {
      loginCheck(this);
      this.$axios.get("/api/info/countCommunities?token="+window.localStorage.getItem("token")).then((response) => {
        this.total = response.data.amount;
      }).catch((err) => {
      });
      this.$axios.get("/api/info/getCommunities?page=0&pagesize=" + this.page_size+"&token=" + window.localStorage.getItem("token")).then((response) => {
        this.tableCommunity = response.data;
      }).catch((err) => {
      })
    },
    data() {
      return {
        tableCommunity: [],
        total: 10,
        page_size: 30,
        current_page: 0,
        name: "",
        description: "",
        address: "",
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 65px;
  }

  .login-box {
    border: 1px solid #b9cee6;
    width: 400px;
    height: 350px;
    margin-right: auto;
    margin-left: auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }
</style>
