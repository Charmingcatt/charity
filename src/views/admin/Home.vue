<template>
  <div class="home">
    <el-backtop target=".home" :bottom="100" :visibility-height="50">
      <div style="{
        height: 100%;
        width: 100%;
        background-color: #DD2020;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: white;
        border-radius:10px;
      }">
        UP
      </div>
    </el-backtop>
    <div class="header">
      <div class="title">
        <router-link style=" color: #009688;" to="/" class="chinese">爱心公益网站管理系统</router-link><br>
        <!-- <span>爱心公益网站管理系统</span> -->
      </div>
      <div class="user">
        <el-dropdown v-if="isLogin">
          <span class="el-dropdown-link">
            <el-avatar :src="global+'upload/'+user.thumb" circle></el-avatar>
            <span style="border-bottom:1px solid white">{{user.username}}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="logout">退出登录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="main">
      <div class="nav">
        <el-menu :default-active="activeUrl" background-color="#393D49" text-color="#fff" active-text-color="#009688"
          :router="true">
          <el-menu-item index="/admin">
            <i class="el-icon-s-data"></i>
            <span slot="title">运营一览</span>
          </el-menu-item>
          <el-menu-item index="/admin/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/news">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">新闻管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/notice">
            <i class="el-icon-s-management"></i>
            <span slot="title">公告管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/welfare">
            <i class="el-icon-sunrise"></i>
            <span slot="title">公益管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/team">
            <i class="el-icon-house"></i>
            <span slot="title">联盟管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/donation">
            <i class="el-icon-bank-card"></i>
            <span slot="title">捐赠管理</span>
          </el-menu-item>
          <el-submenu index="/admin/system">
            <template slot="title">
              <i class="el-icon-setting"></i>
              系统管理
            </template>
            <el-menu-item index="/admin/apply">
              <i class="el-icon-document-checked"></i>
              审核申请
            </el-menu-item>
            <el-menu-item index="/admin/rotation">
              <i class="el-icon-c-scale-to-original"></i>
              轮播图管理
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="content">
        <router-view />
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'adminHome',
    data() {
      return {
        isLogin: localStorage.getItem('username'),
        avatar: localStorage.getItem('avatar'),
        global: this.global.base,
        user: null,
        activeUrl: this.$route.path.substring(
          0,
          this.$route.path.indexOf("/", 7) === -1 ?
          this.$route.path.length :
          this.$route.path.indexOf("/", 7)
        ),
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      logout() {
        localStorage.clear()
        this.$store.state.isLogin = false
        this.isLogin = false
        this.$message.success('退出成功！')
        this.$router.push('/')
      },
      async getUser() {
        const res = await this.$axios('/user/getUserByName?username=' + localStorage.getItem('username'))
        if (res.status === 200 && res.data.success) {
          this.user = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    watch: {
      $route() {
        this.activeUrl = this.$route.path.substring(
          0,
          this.$route.path.indexOf("/", 7) === -1 ?
          this.$route.path.length :
          this.$route.path.indexOf("/", 7)
        );
      },
    },
    created() {
      if (localStorage.getItem("type") != 1) {
        this.$message.error('非管理员！无权限')
        this.$router.push('/')
      } else {
        this.getUser()
      }
    }
  }
</script>

<style scoped lang="less">
  .home {
    // background-color: #100C2A;
    height: 100%;
    overflow: auto;

    .header {
      height: 80px;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px 40px;
      justify-content: space-between;
      background-color: #23262E;
      color: #009688;

      .title {
        font-size: 1.3rem;
      }

      .user {
        /deep/.el-dropdown-link {
          display: flex;
          flex-direction: column;
          color: white;
        }


      }
    }

    .nav {
      flex-shrink: 0;

      .el-menu {
        width: 13rem;
        height: 100%;
      }

      /deep/.el-submenu .el-menu-item {
        min-width: 190px;
      }
    }

    .main {
      display: flex;
      min-height: 580px;

      .content {
        //box-sizing: content-box;
        width: 1140px;
        padding: 20px;
        // margin: 10px;
      }
    }
  }
</style>