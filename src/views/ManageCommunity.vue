<template>
  <el-container style="margin-top: 60px;height:1080px;">
    <el-aside width="300px" style="background-color: rgba(46, 48, 50,.7)">
      <el-col>
        <h5 style="color: #fff">功能导航</h5>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-tooltip class="item" effect="dark" content="请填写下面表单" placement="right">
            <el-menu-item index="1" @click="hint1()">出入登记</el-menu-item>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="请填写下面表单" placement="right">
            <el-menu-item index="2" @click="hint2()">消息发布</el-menu-item>
          </el-tooltip>
          <el-badge :value="amount" class="item">
            <el-menu-item index="5" @click="jump('Alert')">高峰预警</el-menu-item>
          </el-badge>
        </el-menu>
      </el-col>
    </el-aside>
    <el-container>
      <el-main class="main">
        <el-card class="box-card head" style="margin-right: auto;margin-left: auto;">
          <div slot="header" class="title">
            <span>社区信息</span>
          </div>
          <div v-for="item in items" class="text item">
            {{item}}
          </div>
        </el-card>
        <el-tooltip class="item" effect="dark" content="第一次登记时必须登记出社区,提交完之后无法更改请谨慎填写" placement="left">
          <el-card :class="{'box-card':true,'head':true, 'breathe-btn':inVisible}"
                   style="margin-right: auto;margin-left: auto;">
            <div slot="header" class="title">
              <span>出入登记</span>
            </div>
            <el-form v-model="queue">
              <el-form-item label="手机号" prop="phone">
                <el-input type="text" placeholder="请输入手机号" v-model="queue.phone"/>
              </el-form-item>
              <el-form-item label="备注" prop="phone">
                <el-input type="text" placeholder="备注" v-model="queue.comment"/>
              </el-form-item>
            </el-form>
            <el-button type="primary" plain @click="pop()">出社区</el-button>
            <el-button type="primary" plain @click="push()">入社区</el-button>
          </el-card>
        </el-tooltip>
        <el-card :class="{'box-card':true, 'head':true,'breathe-btn':messagesVisible}"
                 style="margin-right: auto;margin-left: auto;">
          <div slot="header" class="title">
            <span>消息发布</span>
          </div>
          <el-form :model="form">
            <el-form-item label="标题">
              <el-input type="text" placeholder="请输入标题" v-model="form.title"/>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="form.content"
                maxlength="255"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="重要程度">
              <el-slider
                style="width: 400px;float: right"
                v-model="form.importance"
                :step="10">
              </el-slider>
            </el-form-item>
            <el-button type="primary"
                       plain
                       @click="submit()"
                       style="width: 100px;margin-left: auto;margin-right: auto;">
              发布
            </el-button>
          </el-form>
        </el-card>

        <br>
        <el-button type="primary" plain @click="ret()" style="width: 100px;margin-left: auto;margin-right: auto;">返回
        </el-button>
      </el-main>
      <el-main class="main">
        <el-card class="box-card head" style="margin-right: auto;margin-left: auto;">
          <div slot="header" class="title">
            <span>已经发布的消息</span>
          </div>
          <el-table :data="messagesTable">
            <el-table-column prop="title" label="标题" width="120">
            </el-table-column>
            <el-table-column prop="content" label="内容">
            </el-table-column>
            <el-table-column prop="id" label="删除消息" width="120">
              <template slot-scope="scope">
                <el-button type="danger" @click.native="delete_msg(scope.row.id)" plain>删除消息</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import loginCheck from '@/login.js'

  export default {
    name: "",
    created() {
      loginCheck(this);
      if (this.$route.params == null || Object.keys(this.$route.params).length === 0) {
        this.$message({type: 'info', message: '参数错误请重新操作'});
        this.$router.push({name: "Info"})
      } else {
        this.id = this.$route.params.id;
        // 渲染社区信息
        this.render_community();

        // 渲染社区消息
        this.render_message()

        // 渲染预警人数
        this.$axios.get("api/alert/getAmount").then((response) => {
          this.amount = response.data.amount;
        }).catch((error) => {
        })
      }
    },
    data() {
      return {
        items: [],
        id: -1,
        form: {
          title: "",
          content: "",
          importance: 50,
        },
        queue: {
          phone: "",
          comment: "",
        },
        messagesTable: [],
        messagesVisible: false,
        inVisible: false,
        amount: -1,
      }
    },
    methods: {
      render_community() {
        this.$axios.get("/api/info/getManCom?token=" + window.localStorage["token"] + "&id=" + this.$route.params.id).then((response) => {
          let data = response.data;
          let name = data.name;
          let description = data.description;
          let address = data.address;
          this.items = ["名字 : " + name, "描述 : " + description, "地址 : " + address];
          this.id = data.id;
        }).catch((err) => {
        });
      },
      render_message() {
        this.$axios.get("/api/manage/getMessages?id=" + this.$route.params.id + "&token=" + window.localStorage.getItem("token")).then((response) => {
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
      jump(url) {
        this.$router.push({
          name: url,
        })
      },
      delete_msg(id) {
        this.$axios.delete("/api/manage/deleteMessage?token="+ window.localStorage.getItem("token"), {
          params: {
            token: window.localStorage["token"],
            id: id,
          }
        }).then((response) => {
          this.$message({
            type: "info",
            message: response.data.msg,
          });
          this.render_message()
        }).catch((err) => {
        })
      },
      ret() {
        this.$router.push({
          name: "Info"
        })
      },
      hint1() {
        this.inVisible = true;
        let vue = this;
        setTimeout(() => {
          vue.inVisible = false;
        }, 3000)
      },
      hint2() {
        this.messagesVisible = true;
        let vue = this;
        setTimeout(() => {
          vue.messagesVisible = false;
        }, 3000)
      },
      push() {
        // 入社区
        // 判断手机号格式
        if ((/^[1][3,4,5,7,8][0-9]{9}$/.test(this.queue.phone)) && this.queue.phone !== '') {
          let params = new URLSearchParams();
          params.append("token", window.localStorage["token"]);
          params.append("phone", this.queue.phone);
          params.append("comment", this.queue.comment);
          params.append("toCommunityId", this.$route.params.id);
          this.$axios.post("/api/manage/inCommunity", params).then((response) => {
            console.log(response.data);
            this.$message({
              type: "info",
              message: response.data.msg,
            });
          }).catch((err) => {
          })
        } else {
          this.$message({
            type: "info",
            message: "手机号不正确",
          })
        }
      },
      pop() {
        if ((/^[1][3,4,5,7,8][0-9]{9}$/.test(this.queue.phone)) && this.queue.phone !== '') {
          let params = new URLSearchParams();
          params.append("token", window.localStorage["token"]);
          params.append("phone", this.queue.phone);
          params.append("comment", this.queue.comment);
          params.append("fromCommunityId", this.$route.params.id);
          this.$axios.post("/api/manage/outCommunity", params).then((response) => {
            this.$message({
              type: "info",
              message: response.data.msg,
            });
          }).catch((err) => {
          })
        } else {
          this.$message({
            type: "info",
            message: "手机号不正确",
          })
        }
      },
      submit() {
        let params = new URLSearchParams();
        params.append("id", this.id);
        params.append("token", window.localStorage["token"]);
        params.append("title", this.form.title);
        params.append("content", this.form.content);
        params.append("importance", Number(this.form.importance) / 10);
        this.$axios.post("/api/manage/postMessage", params).then((response) => {
          this.$message({
            type: "info",
            message: response.data.msg,
          });
          this.render_message();
        }).catch((err) => {
        });
      },
    }
  }
</script>

<style scoped>
  .breathe-btn {
    border: 1px solid #ffffff;
    border-radius: 25px;
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
      border: 1px solid rgba(248, 244, 255, 0.9);
      box-shadow: 0 5px 7px rgba(244, 253, 255, 0.9);
    }
  }

  .head {
    border-radius: 25px;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, .8);
  }

  .main {
    background-image: radial-gradient(ellipse, rgba(255, 255, 255, .7), rgba(74, 206, 255, .7));
  }

  .title {
    font-size: 22px;
    background-color: #4aceff;
    opacity: 0.7;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    margin-top: 20px;
    width: 580px;
  }
</style>
