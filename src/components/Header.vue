<template>
  <div class="header">
    <div class="title">
      <router-link to="/" class="chinese">爱心公益网</router-link><br>
      <span class="eng">Charity website</span>
    </div>
    <div class="header-right">
      <div class="header-menu">
        <el-menu :default-active="this.$route.path" class="el-menu-demo" mode="horizontal" active-text-color="#D61E1E"
          :router="true">
          <el-menu-item index="/">首页</el-menu-item>
          <!-- <el-menu-item index="/echart">中国地图</el-menu-item> -->
          <el-submenu index="/news">
            <template slot="title">新闻资讯</template>
            <el-menu-item index="/news/1">信息公开</el-menu-item>
            <el-menu-item index="/news/2">慈善新闻</el-menu-item>
            <el-menu-item index="/news/3">法律法规</el-menu-item>
          </el-submenu>
          <el-submenu index="/donation">
            <template slot="title">我要捐赠</template>
            <el-menu-item index="/donation/add">在线捐赠</el-menu-item>
            <el-menu-item index="/donation">捐赠查询</el-menu-item>
          </el-submenu>
          <el-menu-item index="/team">联盟广场</el-menu-item>
          <el-submenu index="/welfare/0">
            <template slot="title">公益项目</template>
            <el-menu-item index="/welfare/1">扶贫救灾</el-menu-item>
            <el-menu-item index="/welfare/2">助医扶残</el-menu-item>
            <el-menu-item index="/welfare/3">支教助学</el-menu-item>
            <el-menu-item index="/welfare/4">安老助孤</el-menu-item>
            <el-menu-item index="/welfare/5">专项基金</el-menu-item>
            <el-menu-item index="/welfare/6">重大灾难</el-menu-item>
          </el-submenu>
          <el-menu-item index="/user">个人中心</el-menu-item>
          <el-menu-item index="/notice">网站公告</el-menu-item>
          <el-submenu index="help">
            <template slot="title">帮助中心</template>
            <el-menu-item index="/help/introduce">网站概况</el-menu-item>
            <el-menu-item index="/help/contact">联系方式</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="toLogin">
        <el-dropdown v-if="this.isLogin">
          <span class="el-dropdown-link">
            <el-avatar :src="global+'upload/'+user.thumb" circle></el-avatar>
            <span style=" border-bottom:1px solid grey;text-align:center">{{user.username}}
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to='/user'>个人中心</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="logout">退出登录</a>
            </el-dropdown-item>
            <el-dropdown-item v-if="user.type===1">
              <router-link to='/admin'>管理中心</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="login" v-else>
          <router-link :to="{name:'login',params:{type:'login'}}">登录&nbsp;&nbsp;|</router-link>
          <router-link :to="{name:'login',params:{type:'register'}}">&nbsp;&nbsp;注册</router-link>
        </div>
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
        global: this.global.base,
        username: localStorage.getItem('username'),
        avatar: localStorage.getItem('avatar'),
        user: {
          thumb: '',
          username: '',
          type: ''
        }
      }
    },
    methods: {
      logout() {
        localStorage.clear()
        this.$store.state.isLogin = false
        this.isLogin = false
        this.user = null
        this.$message.success('退出成功！')
        this.$router.push('/')
      },
      async getUser() {
        const res = await this.$axios('user/getUserByName?username=' + localStorage.getItem('username'))
        if (res.status === 200 && res.data.success) {
          this.user = res.data.data
          //console.log(res)
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    created() {
      if (localStorage.getItem('username')) {
        this.getUser()
      }
    }
  }
</script>

<style scoped lang="less">
  .header {
    height: 7rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 4rem;
    margin-bottom: 0;
    background-image: url('../assets/eg1.jpg');
    // border-bottom:1px solid rgb(233, 230, 230);
    background-repeat: no-repeat;

    .title {
      color: #D61E1E;
      font-style: italic;

      .chinese {
        font-size: 2.8rem;
        font-weight: 500;
        color: #D61E1E;
      }

      .eng {
        font-size: 1.2rem;
        font-weight: 400;
      }
    }

    .header-right {
      display: flex;
      justify-content: space-between;



      /deep/.el-menu.el-menu--horizontal {
        border: none;
      }

      .toLogin {
        display: flex;
        align-items: center;
        margin-left: 12px;

        /deep/.el-dropdown-link {
          display: flex;
          flex-direction: column;
        }
      }

      .header-menu {

        /deep/ .el-menu--horizontal,
        /deep/.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus {
          background-color: transparent;
        }

        /deep/ .el-submenu__title,
        .el-menu-item {
          font-size: 1rem;
          color: black;
        }

        /deep/ .el-submenu__title:hover,
        .el-menu-item:hover {
          color: #D61E1E;
          background-color: transparent;
        }
      }
    }
  }

  // @media only screen and (max-width:1100px){
  //   .header{
  //     display:none;
  //   }
  // }
</style>