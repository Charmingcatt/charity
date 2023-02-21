<template>
  <div class="new-wrapper">
    <div class="new">
      <span class="title active">新闻资讯</span>
      <el-menu router :default-active="this.$router.path" active-text-color="#dd202">
        <el-menu-item v-for="item in menu" :index="item.url" :key="item.url">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <div class="welfare">
      <span class="title active">项目推荐</span>
      <div class="wrapper">
        <div class="item" v-for="welfare in welfareList" :key="welfare.no">
          <router-link :to="{path:'/welfare',query:{
          id:welfare.no
        }}">
            <h4>{{welfare.name}}</h4>
            <el-image :src="global+'upload/'+welfare.photo"></el-image>

          </router-link>
        </div>
      </div>
    </div>
    <div class="donation">
      <span class="title active">我要捐赠</span>
      <router-link to="/donation/add">在线捐赠</router-link>
      <router-link to="/donation">捐赠查询</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'leftNav',
    data() {
      return {
        menu: [{
            name: '全部',
            url: '/news/0'
          }, {
            name: '信息公开',
            url: '/news/1'
          },
          {
            name: '慈善新闻',
            url: '/news/2'
          },
          {
            name: '法律法规',
            url: '/news/3'
          }
        ],
        welfareList: null,
        global: this.global.base
      }
    },
    methods: {
      async getTopWelfares() {
        const res = await this.$axios('welfare/getTopWelfare')
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.welfareList = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    created() {
      this.getTopWelfares()
    }
  }
</script>

<style scoped lang="less">
  .new-wrapper {
    width: 15rem;

    .title {
      position: relative;
      width: 13rem;
      display: block;
      height: 2.8rem;
      text-align: center;
      padding: 1rem;
      border-radius: 0.4rem;
      border-bottom: 1px solid rgb(204, 201, 201);
    }

    .active {
      background-color: #dd2020;
      color: white;
    }

    .donation,
    .news,
    .welfare {
      margin: 4rem 0;
    }

    .donation {
      padding: 1rem;

      a {
        position: relative;
        width: 13rem;
        display: block;
        height: 2.8rem;
        text-align: center;
        padding: 2rem;
        border-bottom: 1px solid rgb(204, 201, 201);
      }

      a:before {
        width: 6px;
        height: 14px;
        border-radius: 4px;
        content: " ";
        background: #dd2020;
        color: #dd2020;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        left: 16px;
      }
    }

    .new {
      padding: 1rem;

      /deep/.el-menu {
        background-color: transparent;
      }

      /deep/.el-menu-item {
        font-size: 1rem;
      }

      /deep/.el-menu-item.is-active {
        color: #dd2020;
      }

      /deep/.el-menu-item::before {
        width: 6px;
        font-size: 1rem;
        height: 14px;
        border-radius: 4px;
        content: " ";
        background: #dd2020;
        color: #dd2020;
        position: absolute;
        top: 50%;
        margin-top: -7px;
        left: 16px;
      }

      /deep/.el-menu-item:hover {
        color: #dd2020;
      }
    }

    .welfare {
      padding: 1rem;

      .wrapper {
        text-align: center;
        font-size: 14px;
        height: 20rem;
        overflow-y: auto;
        width: 13rem;
        padding: 0 0.5rem;
      }

    }
  }
</style>