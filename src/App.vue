<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="navi" mode="horizontal">
      <el-col :span="2">
        <el-button style="margin-top: 7px" type="info" icon="el-icon-view"
                   @click="jump('Info')" round>主界面
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="1" @click="jump('Main')">首页</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="2" @click="jump('Login')"><i class="el-icon-user-solid"></i>登录</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="3" @click="jump('Register')"><i class="el-icon-user"></i>注册</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="4" @click="jump('Statistics')">出入统计</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="5"><a href="https://www.baidu.com/s?wd=%E7%96%AB%E6%83%85">疫情信息</a></el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="6"><a href="https://voice.baidu.com/act/newpneumonia/newpneumonia/">疫情地图</a></el-menu-item>
      </el-col>
    </el-menu>
    <router-view/>
    <el-container>
      <el-footer class="el-footer footer">
        <el-row>疫情时期的社区出入管理系统</el-row>
        <el-row>联系作者&nbsp;&nbsp;<a href="https://github.com/tearsforyears">tearsforyears@github.com</a>&nbsp;1027664894@qq.com
        </el-row>
        <el-row>Copyright@2020 http://www.example.com/</el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        activeIndex: 1,
      }
    }, methods: {
      jump(url) {
        this.$router.push({
          name: url
        })
      }
    }

  }
</script>

<style>
  .footer {
    margin-bottom: 30px;
    padding: 10px;
    margin-top: 50px;
    font-size: 13px;
    color: #409eff;
  }

  .navi {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif, "微软雅黑";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
  }
</style>
