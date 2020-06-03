<template>
  <div style="height: 800px;">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="register-box">
      <img src="../assets/logo.png">
      <h3 class="register-title">请填写您的注册信息</h3>
      <el-form-item label="手机号" prop="phone">
        <el-input type="text" placeholder="请输入手机号" v-model="form.phone" ref="phone"/>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
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
      <el-form-item label="昵称" prop="username">
        <el-input type="text" placeholder="请输入昵称" v-model="form.username"/>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker type="date" placeholder="选择生日" style="width: 100%;" v-model="form.birthday"></el-date-picker>
      </el-form-item>
      <el-form>
        <el-button @click="ret()">返回</el-button>
        <el-button type="primary" @click="register()">注册</el-button>
      </el-form>
    </el-form>

    <!--对话框 默认是隐藏的-->
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {validatePhone, validateBirthday} from "@/validate";

  export default {
    name: "Register",

    data() {
      return {
        msg: "",
        btn_msg: "获取短信验证码",
        btn_type: "primary",
        btn_disable: false,
        form: {
          phone: "",
          username: "",
          password: "",
          sex: "",
          birthday: "",
          code: ""
        },
        // 表单验证，需要在 el-form-item 元素中增加 prop 属性
        rules: {
          username: [
            {required: true, message: '账号不可为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '电话不可为空', trigger: 'blur'},
            {validator: validatePhone, message: "不合法手机号", trigger: 'blur'},
          ],
          sex: [
            {required: true, message: '性别不可为空', trigger: 'blur'}
          ],
          birthday: [
            {required: true, message: '生日不可为空', trigger: 'blur'},
            {validator: validateBirthday, message: "不是合法生日", trigger: 'blur'},
          ],
          code: [
            {required: true, message: '验证码不可为空', trigger: 'blur'}
          ]
        },
        // 对话框显示和隐藏
        dialogVisible: false
      }
    },

    methods: {
      getCode() {
        // 渲染UI
        this.btn_type = "info";
        this.btn_disable = true;
        let count_down = 5;
        this.btn_msg = "请在" + count_down + "秒后尝试";
        let i = 0;
        let vue = this;

        // 手动校验下电话号码
        if (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.phone) && this.form.phone != "") {
          // 访问后端接口要求发短信
          let params = new URLSearchParams();
          params.append('phone', this.form.phone);
          this.$axios.post("/api/sendMessage", params).then((response) => {
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
      },
      ret() {
        // router路由重定向
        this.$router.push({
          name: 'Login'
        })
      },
      register() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            // 注册逻辑
            let params = new URLSearchParams();
            params.append('phone', this.form.phone);
            params.append('username', this.form.username);
            params.append('password', this.form.password);
            params.append('sex', this.form.sex);
            params.append('birthday', this.form.birthday);
            params.append('code', this.form.code);
            this.$axios.post("/api/register", params).then((response) => {
              this.dialogVisible = true;
              this.msg = response.data.msg;
            }).catch((error) => {

            });
          } else {
            this.dialogVisible = true;
            this.msg = "校验失败";
          }
        });

      }
    }
  }
</script>

<style scoped>
  .register-box {
    border: 1px solid #b9cee6;
    width: 485px;
    height: 650px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .register-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }
</style>
