<template>
  <div style="height: 500px;">
    <!--:model绑定对象是form-->
    <el-form ref="loginForm" :model="form" :rules="rules" label-width="100px" class="login-box">
      <img src="../assets/logo.png">
      <h3 class="login-title">欢迎登录社区出入管理系统</h3>
      <el-form-item label="账号/手机号" prop="account">
        <el-input type="text" placeholder="请输入账号" v-model="form.account"/>
      </el-form-item>
      <el-form-item v-if="!switch_btn" label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>
      <el-form-item v-if="switch_btn" label="验证码" prop="code">
        <el-col :span="14">
          <el-input type="text" placeholder="请输入验证码" v-model="form.code"/>
        </el-col>
        <el-col :span="1">
          <slot>&nbsp;&nbsp;&nbsp;&nbsp;</slot>
        </el-col>
        <el-col :span="5">
          <el-button v-bind:disabled="btn_disable" v-bind:type="btn_type" @click="getCode()" plain>{{btn_msg}}
          </el-button>
        </el-col>
      </el-form-item>
      <div>
        <el-switch
          v-model="switch_btn"
          active-text="短信登录"
          inactive-text="密码登录">
        </el-switch>
        <span>&nbsp;&nbsp;</span>
        <el-button @click="registe()">注册</el-button>
        <el-button type="primary" @click="login()">登录</el-button>
      </div>
    </el-form>
    <!--对话框 默认是隐藏的-->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="跳转提示"
      :visible.sync="jumpVisible"
      width="30%">
      <span>页面即将跳转</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jump()">前往</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {validatePhone} from "@/validate";
  import {requestManageCommunityInfo, requestUserInfo, requestUserCommunity} from '@/requestInfo.js'

  export default {
    name: "Login",
    data() {
      return {
        msg: "",
        btn_msg: "获取短信验证码",
        btn_type: "primary",
        btn_disable: false,
        remenber_login: true,
        form: {
          account: '',
          password: '',
          code: '',
        },
        jump_to: '',
        switch_btn: false,
        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        rules: {
          account: [
            {required: true, message: '账号不可为空', trigger: 'blur'},
            {validator: validatePhone, message: "不合法手机号", trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不可为空', trigger: 'blur'}
          ]
        },

        // 对话框显示和隐藏
        dialogVisible: false,
        jumpVisible: false
      }
    },
    methods: {
      login() {
        if (this.form.account != null && this.form.account !== "") {
          let params = new URLSearchParams();
          params.append('account', this.form.account);
          if (this.switch_btn) {
            params.append('code', this.form.code);
          } else {
            params.append('password', this.form.password);
          }
          this.$axios.post("/api/login", params).then((response) => {
            this.msg = response.data.msg;
            this.dialogVisible = true;
            if (response.data.redirect === "1") {
              // 登录成功
              // 存好token到localStorage不在使用不安全的cookie
              let storage = window.localStorage;
              storage.clear();
              storage["token"] = response.data.token;

              // 请求同步本地数据库(localStorage)
              requestUserInfo(this);
              requestManageCommunityInfo(this);
              requestUserCommunity(this);

              // 显示跳转
              setTimeout(() => {
                this.dialogVisible = false;
                this.jump_to = response.data.redirect_;
                this.jumpVisible = true;
              }, 1500);
            }
          }).catch((err) => {
            this.msg = "服务器发生错误";
            this.dialogVisible = true;
          })
        } else {
          this.msg = "请填写表单";
          this.dialogVisible = true;
        }
      },
      jump() {
        this.$router.push({
          name: this.jump_to
        })
      },
      registe() {
        // vue的动态路由跳转
        this.$router.push({
          name: 'Register'
        })
      },
      getCode() {
        // 渲染UI
        this.btn_type = "info";
        this.btn_disable = true;
        let count_down = 5;
        this.btn_msg = "请在" + count_down + "秒后尝试";
        let i = 0;
        let vue = this;

        // 手动校验下电话号码
        if (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.account) && this.form.account !== "") {
          // 访问后端接口要求发短信
          let params = new URLSearchParams();
          params.append('account', this.form.account);
          this.$axios.post("/api/sendLoginMessage", params).then((response) => {
            console.log(response.data.msg)
          }).catch((err) => {
          });
        } else {
          this.dialogVisible = true;
          this.msg = "手机号错误";
        }

        // countdown重复渲染
        let interval = setInterval(function () {
          i += 1;
          if (i <= count_down) {
            console.log(this.btn_msg);
            vue.btn_msg = "请在" + (count_down - i) + "秒后尝试";
          } else {
            vue.btn_msg = "获取短信验证码";
            vue.btn_type = "primary";
            vue.btn_disable = false;
            clearInterval(interval)
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .login-box {
    border: 1px solid #b9cee6;
    width: 485px;
    height: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }
</style>
