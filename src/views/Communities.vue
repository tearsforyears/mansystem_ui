<template>
  <div style="margin-top: 60px">
    <el-container>
      <el-header style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        社区列表
      </el-header>
      <el-main style="margin-left: auto;margin-right: auto;">
        <el-table :data="tableCommunity">
          <el-table-column prop="name" label="名字" width="200">
          </el-table-column>
          <el-table-column prop="description" label="描述" width="200">
          </el-table-column>
          <el-table-column prop="address" label="地址" width="500">
          </el-table-column>
          <el-table-column prop="id" label="加入" width="120">
            <template slot-scope="scope">
              <el-button type="primary" @click.native="add2(scope.row.id)" plain>加入社区</el-button>
            </template>
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
      <el-button type="primary" plain @click="ret()" style="width: 100px;margin-left: auto;margin-right: auto;">返回
      </el-button>
    </el-container>
  </div>
</template>

<script>
  import loginCheck from '@/login.js'
  import {requestUserCommunity} from "@/requestInfo.js";

  export default {
    name: "",
    methods: {
      ret() {
        this.$router.push({
          name: "Info"
        })
      },
      handleCurrentChange(val) {
        let pagesize = this.page_size;
        let page = val - 1; // 这里是个坑点 因为最后编译的sql从0开始数
        this.current_page = val;
        this.$axios.get("/api/info/getCommunities?page=" + page + "&pagesize=" + pagesize+"&token=" + window.localStorage.getItem("token")).then((response) => {
          console.log(response.data);
          this.tableCommunity = response.data;
        }).catch((err) => {
        });
        this.$axios.get("/api/info/countCommunities?token="+window.localStorage.getItem("token")).then((response) => {
          this.total = Math.ceil(response.data.amount / this.page_size);
        }).catch((err) => {
        });
      },
      add2(id) {
        this.$confirm('确认加入该社区(一个账号只能加入一个社区)?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = new URLSearchParams();
          param.append("token", window.localStorage["token"]);
          param.append("id", id);
          this.$axios.post("/api/info/join", param).then((response) => {
            this.$message({
              type: "info",
              message: response.data.msg,
              duration: 1000,
            });
            requestUserCommunity(this);
          }).catch((err) => {
          })
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '取消加入社区',
            duration: 1000,
          });
        })
      }
    },
    created() {
      loginCheck(this);
      this.$axios.get("/api/info/countCommunities").then((response) => {
        this.total = response.data.amount;
      }).catch((err) => {
      });
      this.$axios.get("/api/info/getCommunities?page=0&pagesize=" + this.page_size).then((response) => {
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
</style>
