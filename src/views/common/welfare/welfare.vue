<template>
  <div class="welfare">
    <div class="menu">
      <el-menu :default-active="this.$router.path" class="el-menu-demo" mode="horizontal" router>
        <el-menu-item index="/welfare/0">全部</el-menu-item>
        <el-menu-item index="/welfare/1">扶贫救灾</el-menu-item>
        <el-menu-item index="/welfare/2">助医扶残</el-menu-item>
        <el-menu-item index="/welfare/3">支教助学</el-menu-item>
        <el-menu-item index="/welfare/4">安老助孤</el-menu-item>
        <el-menu-item index="/welfare/5">专项基金</el-menu-item>
        <el-menu-item index="/welfare/6">重大灾难</el-menu-item>
      </el-menu>
    </div>

    <div class="main" v-if="welfare!==null">
      <div class="top">
        <div class="left">
          <el-image :src="global+'upload/'+welfare.photo"></el-image>
        </div>
        <div class="right">
          <div class="header">
            <p>{{welfare.name}}</p>
            <span class=" count">
              已筹金额：<span class="times">￥{{welfare.has}}</span>元
            </span>
          </div>
          <div class="bottom">
            <span>
              爱心人次：{{welfare.donationCount}}次
            </span>
            <span>
              目标金额：￥{{welfare.aim}}元
            </span>
            <span>
              开始时间：{{welfare.created}}
            </span>
            <span>
              项目类型：{{types[welfare.type]}}
            </span>
            <span>
              状态：
              <span v-if="welfare.status===2" style="color:darkorange">进行中...</span>
              <span v-else style="color:red">未开放</span>
            </span>
            <div class="donation" v-if="welfare.status===1">
              <div class="content">
                金额
                <span :class="money===20?'money active':'money'" @click="money=20">20</span>
                <span :class="money===50?'money active':'money'" @click="money=50">50</span>
                <span :class="money===100?'money active':'money'" @click="money=100">100</span>
                <span>其他
                  <el-input v-model="money" style="width:80px;"></el-input>元
                </span>
              </div>
            </div>
            <el-button v-if="welfare.status===2">
              <router-link :to="{path:'/donation/add',query:{
                welf_no:welfare.no,
                welf_name:welfare.name}}" style=" color:white">我要捐赠</router-link>
            </el-button>
          </div>
        </div>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="information">
          <div class="intro">
            <span class="markdown-body" v-html="welfare.content_html"></span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目收支" name="receipt">
          <div class="receipt">
            <div class="header">
              <span style="color:#DD2020">项目进展</span>
              <router-link to="/">查看更多>>>></router-link>
            </div>
            <div class="content" v-if="donationList!==null">
              <el-table :data="donationList" stripe style="width: 100%">
                <el-table-column prop="created" label="时间">
                </el-table-column>
                <el-table-column prop="money" label="金额">
                  <template slot-scope="scope">
                    <span style="color:green">{{scope.row.money}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="捐赠人">
                  <template slot-scope="scope">
                    {{scope.row.isHide?scope.row.username:'爱心人士'}}
                  </template>
                </el-table-column>
                <el-table-column prop="bank" label="捐赠银行">
                </el-table-column>
                <el-table-column prop="way" label="捐赠方式">
                </el-table-column>
                <el-table-column prop="comment" label="爱心留言">
                </el-table-column>
              </el-table>
            </div>
            <el-empty v-else description="期待您的帮助"></el-empty>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目互动" name="reaction">
          <div class="reaction">
            <div class="header">
              <span style="color:#DD2020">项目互动</span>
              <router-link to="/donation">查看更多>>>></router-link>
            </div>
            <div class="content" v-if="donationList!==null">
              <div class="item" v-for="donation in donationList" :key="donation.no">
                <el-avatar v-if="donation.user!=null" :src="global+'upload/'+donation.user.thumb"></el-avatar>
                <el-avatar v-else :src="global+'upload/7603bb2b-bca8-4bc6-b716-f7f175e66c4d.jpg'"></el-avatar>
                <div class="right">
                  <div class="left">
                    <p v-if="donation.user!=null">{{donation.isHide?donation.user.username:'爱心人士'}}</p>
                    <p v-else>爱心人士</p>
                    <p>{{donation.comment}}</p>
                  </div>
                  <span style="color:grey">{{donation.created}}</span>
                </div>
              </div>
            </div>
            <el-empty v-else description="期待您的帮助"></el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-empty v-else description="暂无数据"></el-empty>
  </div>
</template>
<script>
  import "mavon-editor/dist/css/index.css";
  // import marked from 'marked'
  export default {
    name: 'welfare',
    data() {
      return {
        id: this.$route.query.id,
        welfare: null,
        global: this.global.base,
        types: [
          "其他", "扶贫救灾", "助医扶残", "支教助学", "安老助孤", "专项基金", "重大灾难"
        ],
        money: 50,
        activeName: 'information',
        donationList: null
      }
    },
    created() {
      this.getWelfare()
      this.getDonations()
    },
    methods: {
      async getWelfare() {
        const res = await this.$axios('welfare/getWelfareById?id=' + this.id)
        if (res.status === 200 && res.data.success) {
          this.welfare = res.data.data
          //this.welfare.content = marked(this.mynew.content)
        } else {
          this.welfare = null
          //this.$message.warning(res.data.message)
        }
      },
      async getDonations() {
        const res = await this.$axios.post('donation/getByWelfareId?welf_no=' + this.id)
        if (res.status === 200 && res.data.success) {
          this.donationList = res.data.data
        } else {
          //this.$message.warning(res.data.message)
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .welfare {
    .menu {
      border-bottom: 1px solid rgb(203, 198, 198);

      /deep/.el-menu {
        display: flex;
        justify-content: space-around;
        background-color: transparent;
      }

      /deep/.el-menu-item {
        font-size: 1rem;
        height: 50px;
        line-height: 50px;
        border-radius: 3px;
      }

      /deep/.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
      /deep/.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
      /deep/.el-menu--horizontal>.el-menu-item.is-active {
        background-color: #DD2020;
        color: white;
        border-bottom: none;
      }

      .search {
        width: 400px;
        display: flex;
        float: right;
        justify-content: baseline;
        margin: 10px 80px 0 0;

        /deep/.el-input__inner {
          border-radius: 20px 0 0 20px;
        }

        /deep/.el-button {
          border-radius: 0 20px 20px 0;
          background-color: #DD2020;
          color: white;
        }

        /deep/.el-input.is-active .el-input__inner,
        /deep/.el-input__inner:focus {
          border-color: #DD2020;
          outline: 0;
        }

        /deep/.el-button:hover {
          background-color: #c41515;
        }
      }
    }

    .main {
      margin: 10px 4rem;

      .top {
        height: 430px;
        display: flex;

        .left {
          .el-image {
            width: 780px;
            height: 430px;
          }
        }

        .right {
          height: 430px;
          width: 500px;
          background-color: #70777D;
          color: white;
          padding: 30px;

          .header {
            border-bottom: 1px solid white;
            padding-bottom: 20px;
            margin-bottom: 20px;

            p {
              font-size: 1.5rem;
              text-align: center;
              margin-bottom: 15px;
            }

            .count {
              .times {
                font-style: italic;
                font-size: 1.5rem;
              }
            }
          }

          .bottom {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 245px;

            span {
              margin: 5px 0;
            }

            .donation {
              .content {
                margin: 20px 0;

                .money {
                  padding: 10px;
                  background-color: #fff;
                  margin: 10px;
                  color: black;
                  border: 2px solid white;
                }

                .active {
                  border-color: red;
                }
              }
            }

            /deep/.el-button {
              width: 200px;
              background-color: #DD2020;
              color: white;
              border-color: #DD2020;
              margin: 0 auto;
            }

            /deep/.el-button:hover {
              background-color: #bd1b1b;
            }
          }
        }
      }

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
          width: 125px !important;
        }

        .reaction,
        .receipt {
          margin: 0 1rem;

          .header {
            padding: 10px 3px;
            display: flex;
            justify-content: space-between;
            background-color: #F5F4F3;
            margin-bottom: 10px;

            a {
              font-size: 14px;
            }
          }
        }

        .intro {
          margin: 1rem 8rem;
        }

        .reaction {
          .content {
            .item {
              display: flex;
              padding: 20px;
              border-bottom: 1px solid rgb(219, 214, 214);

              .right {
                width: 100%;
                display: flex;
                justify-content: space-between;

                p {
                  margin: 10px;
                }
              }
            }
          }
        }
      }

    }
  }
</style>