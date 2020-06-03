<template>
  <div style="margin-top: 100px;height: 600px;">
    <el-container style="height: 400px">
      <el-header>
        <h3 class="title">
          欢迎来到疫情管理系统首页<br>
          welcome to the manage system index
        </h3>
        <el-carousel indicator-position="outside" height="400px">
          <el-carousel-item v-for="item in 4" :key="item">
            <img :src="require('@/assets/'+item+'.jpg')" style="width: 700px;height: 400px;"/>
          </el-carousel-item>
        </el-carousel>
      </el-header>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: ""
  }
</script>

<style scoped>
  .el-carousel__item h3 {
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }
</style>
