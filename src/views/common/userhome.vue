<template>
  <div class="userhome">
    <div class="main">
      <el-carousel :interval="4000" height="380px">
        <el-carousel-item v-for="item in rotationList" :key="item.no">
          <el-image style="width: 100%; height: 380px" :src="global+'upload/'+item.url" fit="cover"></el-image>
        </el-carousel-item>
      </el-carousel>
      <div class="content">
        <div class="notice">
          <span class="title">本站公告</span>
          <span class="content">
            <p class="text">注意！最新公告！注意！最新公告！注意！
              最新公告！注意！最新公告！注意！最新公告！注意！最新公告！注意！最新公告！注意！最新公告！</p>
          </span>
          <span class="title">本站公告</span>
        </div>
        <!-- 新闻 -->
        <div class="news">
          <div class="head">
            <span class="title">新闻资讯</span>
            <span class="eng">News</span>
            <span class="more">
              <router-link to="/news/0">
                <i class="el-icon-plus"></i>更多
              </router-link>
            </span>
          </div>
          <div class="list">
            <div v-for="news in newsList" :key="news.no">
              <NewsItem :mynew="news"></NewsItem>
            </div>
          </div>
        </div>
        <!-- 公益 -->
        <div class="welf">
          <div class="head">
            <span class="title">公益项目</span>
            <span class="eng">Welfare</span>
            <span class="more">
              <router-link to="/welfare/0">
                <i class="el-icon-plus"></i>更多
              </router-link>
            </span>
          </div>
          <div class="list">
            <div v-for="welfare in welfList" :key="welfare.no">
              <el-card class="box-card">
                <div class="image-box">
                  <el-image class="image" :src="global+'upload/'+welfare.photo"></el-image>
                </div>
                <div slot="header" class="clearfix">
                  <router-link :to="{
                    path:'welfare',
                    query:{
                      id:welfare.no
                    }
                  }">
                    <h4>{{welfare.name}}</h4>
                  </router-link>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        <!--捐赠 -->
        <div class="donation">
          <div class="head">
            <span class="title">捐赠名单</span>
            <span class="eng">Donation</span>
            <span class="more">
              <router-link to="/donation">
                <i class="el-icon-plus"></i>更多
              </router-link>
            </span>
          </div>
          <div class="list">
            <el-table :data="donationList" style="width: 100%" stripe height="260">
              <el-table-column label="捐赠人">
                <template slot-scope="scope">
                  {{scope.row.isHide?scope.row.username:'爱心人士'}}
                </template>
              </el-table-column>
              <el-table-column class="money" label="捐赠金额">
                <template slot-scope="scope">
                  <span style="color:green">{{scope.row.money}}元</span>
                </template>
              </el-table-column>
              <el-table-column prop="welfare_name" label="捐赠项目">
              </el-table-column>
              <el-table-column prop="created" label="捐赠时间">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 爱心联盟 -->
        <div class="team">
          <div class="head">
            <span class="title">爱心联盟</span>
            <span class="eng">Love&nbsp;Union</span>
            <span class="more">
              <router-link to="/team">
                <i class="el-icon-plus"></i>更多
              </router-link>
            </span>
          </div>
          <div class="list">
            <div class="team-item" v-for="team in teamList" :key="team.no">
              <el-card class="box-card">
                <div class="header clearfix" slot="header">
                  <router-link :to="{path:'teamInfo',query:{id:team.no}
                    }">
                    <el-avatar :src="global+'upload/'+team.cover"></el-avatar>
                    <span class="name">{{team.name}}</span>
                  </router-link>
                  <span>联盟人数：
                    <span style="color:rgb(184, 23, 23)">{{team.count}}</span>
                  </span>
                </div>
                <div class="intro">
                  <span style="color:black;display:inline-block;">联盟介绍：</span>
                  {{team.intro}}
                </div>
                <div class="footer">
                  <el-button>
                    <router-link style="color:white" :to="{path:'teamInfo',query:{id:team.no}
                    }">加入联盟</router-link>
                  </el-button>
                </div>
              </el-card>
            </div>
          </div>
        </div>
        <!-- 公告 -->
        <div class="notices">
          <div class="head">
            <span class="title">网站公告</span>
            <span class="eng">Notice</span>
            <span class="more">
              <router-link to="/notice">
                <i class="el-icon-plus"></i>更多
              </router-link>
            </span>
          </div>
          <div class="list">
            <div v-for="notice in noticeList" :key="notice.no">
              <div class="notices">
                <router-link :to="{path:'notice',query:{
                    id:notice.no
                  }}">
                  <div class="image-box">
                    <el-image class="image" :src="global+'upload/'+notice.cover" fit="cover"></el-image>
                  </div>
                </router-link>
                <div class="contents">
                  <router-link :to="{
                path:'/noticeInfo',
                query:{
                  id:notice.no
                }
              }">
                    <h4>{{notice.title}}</h4>
                  </router-link>
                  <p class="text"> &nbsp; &nbsp;{{notice.content.replace(/\&(nbsp)\;/g,'')}}</p>
                  <div class='bottom'>
                    <span><i class=el-icon-date></i>{{notice.created}}</span>
                    <router-link to="">发布人：{{notice.username}}</router-link>
                    <span>四川省成都市</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NewsItem from '@/components/News-item.vue'
  export default {
    name: "Home",
    data() {
      return {
        rotationList: [],
        newsList: null,
        welfList: null,
        donationList: null,
        teamList: null,
        noticeList: null,
        global: this.global.base,
        pageInfo: {
          page: 1,
          pageSize: 8,
        },
      }
    },
    created() {
      this.getNewsList()
      this.getWelfList()
      this.getDonationList()
      this.getTeamList()
      this.getRotateList()
      this.getNoticeList()
    },
    methods: {
      async getRotateList() {
        const res = await this.$axios.post('/rotate/list', this.pageInfo)
        //console.log(res)
        if (res.status === 200) {
          this.rotationList = res.data.data.list
          //console.log(res.data.data)
        } else {
          this.$message.error('获取失败!')
        }
      },
      async getNewsList() {
        const res = await this.$axios.post('/news/list', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          //console.log(res.data)
          this.newsList = res.data.data.list.length >= 4 ?
            res.data.data.list.slice(0, 4) : res.data.data.list
          //console.log(this.newsList)
        }
      },
      async getNoticeList() {
        const res = await this.$axios.post('/notice/list', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          //console.log(res.data)
          this.noticeList = res.data.data.list.length >= 4 ?
            res.data.data.list.slice(0, 4) : res.data.data.list
          //console.log(this.newsList)
        }
      },
      async getWelfList() {
        const res = await this.$axios.post('/welfare/getIngWelfare', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          this.welfList = res.data.data.list.length >= 3 ?
            res.data.data.list.slice(0, 3) : res.data.data.list
          //console.log(this.welfList)
        } else {
          this.$message.error(res.data.message)
        }
      },
      async getDonationList() {
        const res = await this.$axios.post('/donation/list', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          this.donationList = res.data.data.list
          //console.log(this.welfList)
        } else {
          this.$message.error(res.data.message)
        }
      },
      async getTeamList() {
        const res = await this.$axios.post('/team/list', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          this.teamList = res.data.data.list.length >= 3 ?
            res.data.data.list.slice(0, 3) : res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    components: {
      NewsItem
    }
  }
</script>

<style scoped lang="less">
  .userhome {

    //height: auto;
    .main {
      /deep/.el-carousel__button {
        height: 8px;
        width: 40px;
        border-radius: 10px;
      }

      /deep/.is-active .el-carousel__button {
        background-color: #DD2020;
        height: 15px;
        width: 40px;
      }


      .content {
        margin: 0 4rem 1rem 4rem;

        .notice {
          display: flex;
          justify-content: center;
          align-items: center;

          .title {
            display: block;
            padding: 1rem;
            background-color: rgb(184, 23, 23);
            box-shadow: -4px 2px 5px #0705057e;
            color: white;
          }

          .content {
            color: gray;
            display: block;
            height: 3rem;
            padding: 1rem;
            background-color: rgb(246, 243, 243);
            overflow: hidden;
            width: 50rem;

            .text {
              white-space: nowrap;
              overflow: eclipse;
              animation: trans 20s linear infinite normal;
            }
          }

          @keyframes trans {
            0% {
              transform: translateX(0px);
              -webkit-transform: translateX(0px);
            }

            100% {
              transform: translateX(-100%);
              -webkit-transform: translateX(-100%);
            }
          }
        }

        .news,
        .welf,
        .team,
        .donation,
        .notices {
          .head {
            margin: 2rem 0;

            .more {
              font-size: 1rem;
              margin-left: 2rem;
            }

            .title {
              display: inline-block;
              font-size: 1.2rem;
              background-color: rgb(184, 23, 23);
              box-shadow: -4px 2px 5px #0705057e;
              padding: 1rem;
              color: white;
            }

            .eng {
              font-size: 3.6rem;
              font-style: italic;
              /* position: relative;
            bottom:-1rem; */
              margin-left: 0.2rem;
              border-bottom: 2px solid rgb(155, 16, 16);
            }
          }

          .list {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin: 0.6rem 0.35rem;
          }
        }

        .welf {
          .list {
            .box-card {
              margin-bottom: 1rem;

              .el-image,
              .image-box {
                width: 19rem;
                height: 10rem;
              }

              a {
                text-align: center !important;
                ;
              }
            }
          }
        }

        .donation {
          .money {
            color: green !important;
          }
        }

        .team {
          .list .team-item {
            width: 20rem;
            margin-bottom: 1rem;

            .header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
            }

            .intro {
              width: 18rem;
              color: grey;
              text-overflow: ellipsis;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
            }
          }

          .footer {
            display: flex;
            justify-content: center;
            margin-top: 1rem;

            /deep/.el-button {
              background-color: rgb(184, 23, 23);
              color: white;
            }

            /deep/.el-button:hover {
              background-color: rgb(146, 4, 4);
            }
          }
        }

        .notices {
          .list {
            .notices {
              width: 37rem;
              height: 12rem;
              margin: 0.2rem;
              position: relative;
              //overflow: hidden;

              .contents {
                padding: 0 1rem;

                .text {
                  margin: 1rem 0 1rem 0;
                  width: 23rem;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 5;
                  -webkit-box-orient: vertical;
                }

                .bottom {
                  position: absolute;
                  bottom: 0;
                  display: flex;
                  justify-content: space-around;
                  width: 24rem;
                  margin-left: 11rem;
                  color: gray !important;
                }
              }

              .image-box {
                width: 12rem;
                height: 12rem;
                float: left;
                margin-right: 0.4rem;
              }

              /deep/.el-image {
                width: 12rem;
                height: 12rem;
                border-radius: 0.3rem;
              }
            }
          }
        }

      }
    }
  }
</style>