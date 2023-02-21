<template>
  <div class="wrapper">
    <div class="main">
      <el-card class="team-wrapper">
        <div slot=" header">
          <h4>联盟广场</h4>
        </div>
        <div class="search">
          <el-input type="text" placeholder="请输入关键字" v-model="message" />
          <el-button icon="el-icon-search" @click="search()" />
        </div>
        <div class="list" v-if="teamList">
          <el-card class="team" v-for="team in teamList" :key="team.no">
            <div slot="header">
              <router-link :to="{path:'/teamInfo',query:{id:team.no}}">
                <h4>{{team.name}}</h4>
              </router-link>
            </div>
            <div class="image-box">
              <el-image class="image" :src="global+'upload/'+team.cover">
              </el-image>
            </div>
            <div class="right">
              <p>创建时间：{{team.created}}</p>
              <p>人数：{{team.count}}</p>
              <div class="op">
                <el-button>
                  <router-link style="color:white" :to="{path:'teamInfo',query:{id:team.no}
                    }">加入联盟</router-link>
                </el-button>
              </div>
            </div>
          </el-card>
          <el-pagination style="margin:0 25%" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageInfo.page" :page-sizes="[3, 6, 9, 12]" :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </el-card>
    </div>
    <div class="right-wrapper">
      <el-card class="right">
        <div slot="header">
          <h4>我加入的联盟</h4>
        </div>
        <div class="list" v-if="joinList">
          <div class="join" v-for="join in joinList" :key="join.no">
            <el-image class="images" :src="global+'upload/'+join.cover" fit="cover">
            </el-image>
            <div class=" right">
              <router-link :to="{path:'/teamInfo',query:{id:join.no}}">
                <h4>{{join.name}}</h4>
              </router-link>
              <p>创建时间：{{join.created}}</p>
              <p>人数：{{join.count}}</p>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </el-card>
      <el-card class="right">
        <div slot="header">
          <h4>热门联盟</h4>
        </div>
        <div class="list" v-if="topTeam">
          <div class="join" v-for="team in topTeam" :key="team.no">
            <el-image class="images" :src="global+'upload/'+team.cover" fit="cover">
            </el-image>
            <div class=" right">
              <router-link :to="{path:'/teamInfo',query:{id:team.no}}">
                <h4>{{team.name}}</h4>
              </router-link>
              <p>创建时间：{{team.created}}</p>
              <p>人数：{{team.count}}</p>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'list',
    data() {
      return {
        teamList: null,
        message: '',
        global: this.global.base,
        joinList: null,
        topTeam: null,
        pageInfo: {
          page: 1,
          pageSize: 6,
        },
        totalPage: 0,
        isSearch: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        //alert(`每页 ${val} 条`);
        if (!this.isSearch) this.getTeamList()
        else this.search()
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        //alert(`页 ${val}`);
        if (!this.isSearch) this.getTeamList()
        else this.search()
      },
      async gerJoin() {
        const res = await this.$axios('/team/getTeamByUId?user_no=' + localStorage.getItem('id'))
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.joinList = res.data.data
        } else {
          this.joinList = null
          this.$message.warn(res.data.message)
        }
      },
      async getTeamList() {
        this.isSearch = false
        const res = await this.$axios.post('team/list', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          this.teamList = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
          this.$message.warning(res.data.message)
        }
      },
      async getTopTeam() {
        const res = await this.$axios('team/getTopTeam')
        if (res.status === 200 && res.data.success) {
          this.topTeam = res.data.data
        } else {
          this.$message.warning(res.data.message)
        }
      },
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('team/search', {
          message: this.message.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.teamList = res.data.data.list
          this.totalPage = res.data.data.total
          //this.$message.success('查询成功！')
        } else {
          this.teamList = null
          this.$message.warning(res.data.message)
        }
      }
    },
    created() {
      this.getTeamList()
      this.gerJoin()
      this.getTopTeam()
    }
  }
</script>
<style scoped lang="less">
  .wrapper {
    min-height: 486px;
    margin: 10px 4rem;
    display: flex;
    justify-content: space-between;

    /deep/.el-card {
      margin-right: 20px;
    }

    .main {
      width: 900px;
      min-height: 386px;

      .list {

        /deep/.el-pager li.active,
        /deep/.el-pager li:hover {
          color: #DD2020;
        }

        .team {
          display: inline-block;
          margin: 0 0 20px 14px;

          .right {
            width: 200px;

            p {
              font-size: 15px;
              color: grey;
            }

            .op {
              display: flex;
              justify-content: center;
              margin: 10px 0;

              /deep/.el-button {
                background-color: rgb(184, 23, 23);
                color: white;
              }

              /deep/.el-button:hover {
                background-color: rgb(146, 4, 4);
              }
            }
          }

          .image-box,
          .image {
            width: 210px;
            border-radius: 2px;
            height: 150px;
          }
        }

      }

      .search {
        width: 400px;
        display: flex;
        justify-content: baseline;
        margin: 10px;

        /deep/.el-input__inner {
          border-radius: 20px 0 0 20px;
          border-right: 0;
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


    .right-wrapper {
      .right {
        width: 20rem;
        margin-bottom: 20px;
      }

      .list {
        .join {
          display: flex;

          .right {
            height: 80px;
            padding: 10px;
          }

          p {
            font-size: 14px;
            color: grey;
          }

          .images {
            width: 90px;
            border-radius: 80px;
            height: 90px;
            flex-shrink: 0;
          }
        }
      }
    }




  }
</style>