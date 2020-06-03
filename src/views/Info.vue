<template>
  <el-container style="height: 750px;border: 1px solid #eee;margin-top: 50px">
    <el-aside width="300px" style="background-color: rgba(46, 48, 50,.7)">
      <el-col>
        <h5 style="color: #fff">功能导航</h5>
        <el-menu
          default-active="1-2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <span>社区</span>
            </template>
            <el-tooltip class="item" effect="dark" content="请联系超级管理员审核" placement="right">
              <el-menu-item index="1-1" @click="jump('Community')">登记新社区</el-menu-item>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="请联系超级管理员审核" placement="right">
              <el-menu-item index="1-2" @click="jump('Community')">申请社区管理资格</el-menu-item>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="加入新社区吧" placement="right">
              <el-menu-item index="1-3" @click="add2Community()">加入社区</el-menu-item>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="需社区管理员权限" placement="right">
              <el-menu-item index="1-4" @click="hint()">管理社区</el-menu-item>
            </el-tooltip>
          </el-submenu>
          <span>&nbsp;</span>
          <el-tooltip class="item" effect="dark" content="需社区管理员权限" placement="right">
            <el-menu-item index="2" @click="hint()">发布消息</el-menu-item>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="需社区管理员权限" placement="right">
            <el-menu-item index="3" @click="hint()">出入登记</el-menu-item>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="个人行程查询" placement="right">
            <el-menu-item index="4" @click="jump('Query')">个人行程查询</el-menu-item>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="统计信息" placement="right">
            <el-menu-item index="5" @click="jump('Statistics')">社区出入统计</el-menu-item>
          </el-tooltip>

          <el-menu-item index="6" @click="getUserInfo()">个人信息</el-menu-item>
        </el-menu>
      </el-col>
    </el-aside>
    <el-main>
      <el-header class="head" style="text-align: right; font-size: 15px">
        欢迎登录疫情管理系统!&nbsp;&nbsp;{{gettime}}&nbsp;&nbsp;
        <el-button type="danger" plain @click="logout()">登出</el-button>
      </el-header>
      <br>
      <el-header class="head" style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        我管理的社区
      </el-header>
      <br>
      <el-container>
        <el-table :data="tableCommunity">
          <el-table-column prop="name" label="名字" width="200">
          </el-table-column>
          <el-table-column prop="description" label="描述" width="200">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>

          <el-table-column prop="id" label="管理社区">
            <template slot-scope="scope">
              <el-button :class="{'breathe-btn':animationVisible}"
                         type="primary"
                         @click.native="add2(scope.row.id)"
                         plain>管理社区
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <br>
      <el-header class="head" style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        我加入的社区
      </el-header>
      <br>
      <el-container>
        <el-container>
          <el-table :data="tableCommunity_">
            <el-table-column prop="name" label="名字" width="200">
            </el-table-column>
            <el-table-column prop="description" label="描述" width="200">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
          </el-table>
        </el-container>
      </el-container>
      <br>

      <el-header class="head" style="font-size: 15px;background-color: #4aceff;opacity: 0.7">
        我的消息
      </el-header>
      <br>
      <el-container>
        <el-container>
          <el-table :data="messagesTable">
            <el-table-column prop="title" label="标题" width="200">
            </el-table-column>
            <el-table-column prop="content" label="内容">
            </el-table-column>
          </el-table>
        </el-container>
      </el-container>
    </el-main>


    <el-dialog
      title="个人信息"
      :visible.sync="infoVisible"
      width="30%">
      <el-row>手机号:{{account}}</el-row>
      <el-row>用户名:{{username}}</el-row>
      <el-row>性别:{{sex}}</el-row>
      <el-row>年龄:{{age}}岁</el-row>
    </el-dialog>
  </el-container>
</template>
<style>
  .breathe-btn {
    border: 1px solid #ff7700;
    border-radius: 5px;
    color: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .3);
    -webkit-animation-timing-function: ease-in-out;
    -webkit-animation-name: breathe;
    -webkit-animation-duration: 470ms;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
  }

  @-webkit-keyframes breathe {
    0% {
      opacity: .2;
      box-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
    }
    100% {
      opacity: 1;
      border: 1px solid rgba(255, 119, 0, .9);
      box-shadow: 0 5px 7px rgba(255, 119, 0, .9);
    }
  }

  .head {
    border-radius: 15px;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, .8);
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 65px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
  import loginCheck from '@/login.js'
  import {requestManageCommunityInfo} from '@/requestInfo.js'

  export default {
    data() {
      return {
        tableCommunity: [],
        tableCommunity_: [],
        messagesTable: [],
        gettime: '',
        animationVisible: false,
        infoVisible: false,
        usersVisible: true,
        account: "",
        username: "",
        sex: "",
        age: ""
      }
    },

    created() {
      // token验证
      loginCheck(this);
      // 时钟
      setInterval(this.getTime, 500);
      // 管理社区实时更新
      requestManageCommunityInfo(this);
      this.tableCommunity = JSON.parse(window.localStorage["man_communities"]);
      this.tableCommunity_ = JSON.parse(window.localStorage["community"]);
      // 渲染消息
      this.render_message();
    },
    methods: {
      add2(id) {
        this.$router.push({
          name: "ManageCommunity",
          params: {
            id: id,
          }
        })
      },
      getTime: function () {
        let _this = this;
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth() + 1;
        let dd = new Date().getDate();
        let hh = new Date().getHours();
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
        _this.gettime = yy + '年' + mm + '月' + dd + '日' + hh + ':' + mf;
      },
      jump(url) {
        this.$router.push({
          name: url
        })
      },
      hint() {
        this.$message({type: 'info', message: '请点击对应社区的管理社区按钮'})
        // 提示动画
        this.animationVisible = true;

        let vue = this;
        setTimeout(() => {
          vue.animationVisible = false;
        }, 3000)
      },
      add2Community() {
        // 检查下是否加入社区
        let storage = window.localStorage;
        let community = JSON.parse(storage.getItem("community"));
        if (community == null || community.length < 1) {
          // 未加入社区直接重定向路由
          this.$router.push({
            name: "Communities"
          })
        } else {
          this.$message({
            type: 'error',
            message: '您已经加入社区',
            duration: 1000,
          })
        }
      },
      render_message() {
        let id = JSON.parse(localStorage.getItem("community"))[0].id;
        this.$axios.get("/api/manage/getMessages?id=" + id + "&token=" + window.localStorage.getItem("token")).then((response) => {
          if (response.data.error === "1") {
            console.log("服务器出错")
          } else {
            this.messagesTable = response.data.sort(function (row1, row2) {
              return row2.importance - row1.importance
            });
          }
        }).catch((err) => {
        })
      },
      getUserInfo() {
        try {
          let storage = window.localStorage;
          let user_info = JSON.parse(storage["user_info"]);
          this.account = user_info.account;
          this.username = user_info.user_name;
          this.sex = user_info.sex ? "男" : "女";
          let birthday = user_info.birthday;
          this.age = new Date().getFullYear() - new Date(Date.parse(birthday)).getFullYear();
          this.infoVisible = true;
        } catch (e) {
          this.$message({
            type: "error",
            message: "发生错误,请重新登录",
            duration: 1000,
          });
          this.$router.push({name: "Login"})
        }
      },
      logout() {
        this.$confirm('登出之后需要重新登录, 是否继续?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 清除前端数据库并且路由到首页
          window.localStorage.clear();
          this.$router.push({
            name: "Main"
          });
          this.$message({
            type: 'success',
            message: '登出成功!',
            duration: 1000,
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登出',
            duration: 1000,
          });
        });
      }
    }
  };
</script>
