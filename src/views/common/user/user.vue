<template>
  <div class="user">
    <div class="left-nav">
      <el-menu :default-active="this.$route.path" router active-text-color="#D61E1E">
        <el-menu-item index="/user">
          <i class="el-icon-user-solid"></i>
          <span slot="title">个人中心</span>
        </el-menu-item>
        <el-menu-item index="/user/team">
          <i class="el-icon-s-home"></i>
          <span slot="title">我的联盟</span>
        </el-menu-item>
        <el-menu-item index="/user/welfare">
          <i class="el-icon-s-management"></i>
          <span slot="title">我的公益</span>
        </el-menu-item>
        <el-menu-item index="/user/donation">
          <i class="el-icon-s-order"></i>
          <span slot="title">我的捐赠</span>
        </el-menu-item>
        <el-menu-item index="/user/apply">
          <i class="el-icon-s-claim"></i>
          <span slot="title">我的申请</span>
        </el-menu-item>
        <el-menu-item index="/user/work">
          <i class="el-icon-message-solid"></i>
          <span slot="title">我的代办</span>
        </el-menu-item>
        <el-menu-item index="/user/news">
          <i class="el-icon-document"></i>
          <span slot="title">我的报告</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'user'
  }
</script>
<style scoped lang="less">
  .user {
    height: 100%;
    padding: 20px 4rem;
    display: flex;

    .left-nav {
      .el-menu {
        width: 12rem;
        height: 100%;
      }

      margin-right: 0.4rem;
    }

    .main {
      min-width: 1020px;
      min-height: 385px;
    }
  }
</style>