<template>
  <div class="team-wrapper">
    <div class="header">
      <div class="image-box">
        <el-image class="image" :src="global+'upload/'+team.cover" fit="cover"></el-image>
      </div>

      <div class="info">
        <span class="name">{{team.name}}<i style="color:grey" class="el-icon-share"></i></span>
        <p>{{team.intro}}</p>
      </div>
      <div class="op">
        <el-button v-if="loginUser.team_no===team.no" class="joined" @click="quit()"><i class="el-icon-check"></i>已加入联盟
        </el-button>
        <el-button v-else @click="participate()">加入联盟</el-button>

        <span>联盟人数：{{team.count}}</span>
      </div>
    </div>
    <div class="main">
      <div class="base">
        <el-tabs v-model="activeName">
          <el-tab-pane label="动态" name="active">
            <el-card>
              <div slot="header">
                <h4>联盟动态</h4>
              </div>
              <div class="data" v-if="newsList">
                <el-button style="margin:10px 0;" v-if="loginUser.team_no===team.no || team.user_no===loginUser.no"
                  @click="post()">
                  发帖</el-button>
                <el-card v-for="news in newsList" :key="news.no" style="margin:20px 0">
                  <el-avatar size="large" :src="global+'upload/'+news.author.thumb"></el-avatar>
                  <div class="content">
                    <div class="top">
                      <span style="color:red">{{news.author.username}}</span>
                      <span style="color:gray">{{news.created}}</span>
                    </div>
                    <p>{{news.content.replace(/\&(nbsp)\;/g,'')}}</p>
                    <div class="op">
                      <el-button>
                        <router-link :to="{path:'news',query:{id:news.no}}">查看详情</router-link>
                      </el-button>
                    </div>
                  </div>
                </el-card>
                <el-pagination style="margin:0 25%" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" :current-page="pageInfo.page" :page-sizes="[3, 6, 9, 12]"
                  :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
                </el-pagination>
              </div>
              <el-empty v-else description="暂无数据" :image-size="300"></el-empty>
            </el-card>
          </el-tab-pane>

          <el-tab-pane label="盟友" name="members">
            <div class="member">
              <el-card class="member">
                <div slot="header">
                  <h4>联盟成员</h4>
                </div>
                <div v-if="member">
                  <div class="user" v-for="user in member" :key="user.no">
                    <el-avatar :src="global+'upload/'+user.thumb"></el-avatar>
                    <p style="color:red">{{user.username}}</p>
                  </div>
                </div>
                <el-empty v-else description="暂无数据" :image-size="300"></el-empty>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right-nav">
        <el-card>
          <div class="top">
            <div class="user">
              <el-avatar :src="global+'upload/'+user.thumb"></el-avatar>
              <span style="color:red">{{user.username}}</span>
            </div>
            <span class="tag">盟主</span>
          </div>
          <div class="info">
            <div>本盟创建于：{{team.created}}</div>
            <div v-if="user.team_no===team.no">你在{{user.team_join}}加入</div>
          </div>
        </el-card>
        <el-card class="member">
          <div slot="header">
            <h4>联盟成员</h4>
          </div>
          <div v-if="member">
            <div class="user" v-for="user in member" :key="user.no">
              <el-avatar :src="global+'upload/'+user.thumb"></el-avatar>
              <p style="color:red">{{user.username}}</p>
            </div>
          </div>
          <el-empty v-else description="暂无数据" :image-size="200"></el-empty>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'team',
    data() {
      return {
        team: null,
        id: '',
        global: this.global.base,
        activeName: 'active',
        newsList: null,
        user: null,
        member: null,
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
        totalPage: 0,
        loginUser: null
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        //alert(`每页 ${val} 条`);
        this.getNewsList()
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        //alert(`页 ${val}`);
        this.getNewsList()
      },
      async getTeamById() {
        const res = await this.$axios('team/getTeamById?id=' + this.id)
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.team = res.data.data
          console.log(this.team)
        } else {
          this.team = null
          this.$message.warning(res.data.message)
        }
      },
      participate() {
        const obj = {
          team_no: this.id,
          user_no: localStorage.getItem("id")
        }
        this.$confirm('每位用户只能加入一个联盟，确认加入吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$axios.post('user/participate', JSON.stringify(obj))
          console.log(res)
          if (res.status === 200 && res.data.success) {
            this.$message.success('加入成功！')
            this.getLoginUser()
            //this.getUser()
            this.getTeamById().then(() => {
              this.getMember()
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消加入'
          });
        });
      },
      quit() {
        const obj = {
          team_no: this.id,
          user_no: localStorage.getItem("id")
        }
        this.$confirm('确认退出吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$axios.post('user/quit', JSON.stringify(obj))
          // console.log(res)
          if (res.status === 200 && res.data.success) {
            this.$message.success('退出成功！')
            this.getLoginUser()
            this.getTeamById().then(() => {
              this.getMember()
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      },
      async getMember() {
        const res = await this.$axios('user/getMember?team_no=' + this.id)
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.member = res.data.data
        } else {
          this.member = null
          //this.$message.error(res.data.message)
        }
      },
      async getNewsList() {
        const res = await this.$axios.post('news/getNewsByTeamId', {
          id: this.team.no,
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize

        })
        if (res.status === 200 && res.data.success) {
          this.newsList = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
          this.newsList = null
          //this.$message.error(res.data.message)
        }
      },
      async getUser() {
        const res = await this.$axios('/user/getUserById?id=' + this.team.user_no)
        if (res.status === 200 && res.data.success) {
          this.user = res.data.data
        } else {
          this.user = null
        }
      },
      async getLoginUser() {
        const res = await this.$axios('/user/getUserById?id=' + localStorage.getItem("id"))
        if (res.status === 200 && res.data.success) {
          this.loginUser = res.data.data
        } else {
          this.loginUser = null
        }
      },
      post() {
        this.$router.push('/post/' + this.team.no)
      }
    },
    created() {
      if (!localStorage.getItem('id')) {
        this.$message.error('请登录！')
        this.$router.push('/')
      }
      this.id = this.$route.query.id
      this.getLoginUser()
      this.getTeamById()
        .then(() => {
          this.getNewsList()
          this.getMember()
          this.getUser()
        })


    },
    watch: {
      $route() {
        if (this.$route.query.id !== this.id) {
          this.id = this.$route.query.id
          this.getTeamById()
          this.getNewsList()
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .team-wrapper {
    min-height: 386px;
    margin: 20px 5rem;

    /deep/.el-pager li.active,
    /deep/.el-pager li:hover {
      color: #DD2020 !important;
    }

    /deep/.el-button {
      width: 140px;
      background-color: #DD2020;
      color: white;
      border-color: #DD2020;
      margin: 0 auto;

      a {
        color: white;
      }
    }

    /deep/.el-button:hover {
      background-color: #bd1b1b;
    }

    .joined {

      background-color: rgb(170, 168, 168);
      border-color: rgb(170, 168, 168);
    }

    .header {
      display: flex;
      padding: 20px;
      background-color: #fff;
      box-shadow: 2px 2px 5px rgb(222, 220, 220);
      justify-content: space-between;

      .info {
        padding: 0 20px;
        width: 100%;

        .name {
          font-size: 1.6rem;
        }

        p {
          color: gray;
          font-size: 14px;
          margin-top: 15px;
        }
      }

      .op {
        display: flex;
        flex-direction: column;
        justify-content: center;

        span {
          text-align: center;
          margin-top: 0.2rem;
        }



        .joined:hover {
          background-color: rgb(130, 128, 128);
        }
      }


      .image,
      .image-box {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
      }
    }

    .main {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;

      /deep/.el-avatar {
        flex-shrink: 0;
      }

      .base {
        width: 850px;

        .el-tabs {
          margin-top: 10px;

          /deep/.el-tabs__item.is-active,
          /deep/.el-tabs__item:hover {
            color: #DD2020;
          }

          /deep/.el-tabs__item {
            font-size: 1rem;
            padding: 0 30px;
          }

          /deep/.el-tabs__active-bar {

            left: -30px;
            background-color: #DD2020;
            width: 100px !important;
          }

        }

        /deep/.el-card__body {
          display: flex;

          .data {
            .content {
              display: flex;
              flex-direction: column;
              padding: 0 10px;

              p {
                text-overflow: ellipsis;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
              }

              .op {
                display: flex;
                justify-content: center;
                margin: 20px 0;
              }

              .top {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              }
            }


          }
        }
      }

      .right-nav {
        width: 300px;

        /deep/.el-card {
          margin: 20px 0;
        }

        .top {
          display: flex;
          justify-content: space-between;

          .tag {
            display: inline-block;
            background: #89cdcd;
            color: #fff;
            border-radius: 10px;
            height: 20px;
            line-height: 20px;
            padding: 0 10px;
          }
        }

        .info {
          div {
            margin: 20px 0;
          }
        }

      }

      .member {
        /deep/.el-card__body {
          display: flex;
          overflow: auto;

          .user {
            margin: 0 10px;
            width: 65px;
            display: inline-block;

            p {
              //text-align: center;
              text-overflow: ellipsis;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }
  }
</style>