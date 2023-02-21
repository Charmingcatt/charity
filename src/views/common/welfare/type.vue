<template>
  <div class="welfare">
    <div class="menu">
      <el-menu :default-active="this.$route.path" router class="el-menu-demo" mode="horizontal">
        <el-menu-item index="/welfare/0">全部</el-menu-item>
        <el-menu-item index="/welfare/1">扶贫救灾</el-menu-item>
        <el-menu-item index="/welfare/2">助医扶残</el-menu-item>
        <el-menu-item index="/welfare/3">支教助学</el-menu-item>
        <el-menu-item index="/welfare/4">安老助孤</el-menu-item>
        <el-menu-item index="/welfare/5">专项基金</el-menu-item>
        <el-menu-item index="/welfare/6">重大灾难</el-menu-item>
      </el-menu>
      <div class="search">
        <el-input type="text" placeholder="请输入关键字" v-model="message" />
        <el-button icon="el-icon-search" @click="search()" />
      </div>
    </div>
    <div v-if="welfareList" class="main">
      <div class="item" v-for="welfare in welfareList" :key="welfare.no">
        <div class="image-box">
          <router-link :to="{
                path:'/welfare',
                query:{
                  id:welfare.no
                }
              }">
            <el-image class="image" :src="global+'upload/'+welfare.photo"></el-image>
          </router-link>
        </div>
        <div class="info">
          <div class="top">
            <div class="left">
              <router-link :to="{
                path:'/welfare',
                query:{
                  id:welfare.no
                }
              }">
                <h2 class="name">{{welfare.name}}</h2>
              </router-link>
              <div class="donation">
                <p>
                  爱心人次：
                  <span style="color:red">{{welfare.donationCount}}</span>
                  次
                </p>
                <p>
                  已筹金额：
                  <span style="color:red">{{welfare.has}}</span>元
                </p>
              </div>
              <div class="type">
                <p>
                  项目类别：
                  <span>{{types[welfare.type]}}</span>
                </p>
                <p>
                  开始日期
                  <span>{{welfare.created}}</span>
                </p>
              </div>
            </div>
            <div class=" right">
              <el-button>
                <router-link :to="{path:'/donation/add',query:{
                welf_no:welfare.no,
                welf_name:welfare.name}}" style=" color:white">我要捐赠</router-link>
              </el-button>
            </div>
          </div>
          <div class="bottom">
            <p>{{welfare.content.replace(/\&(nbsp)\;/g,'')}}</p>
          </div>
        </div>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[3, 5, 10, 15]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-empty style="text-align:center" class="not-found" v-else description="暂无数据" :image-size=300></el-empty>

  </div>
</template>
<script>
  export default {
    name: 'welfare',
    data() {
      return {
        type: this.$route.params.type,
        welfareList: null,
        global: this.global.base,
        types: [
          "其他", "扶贫救灾", "助医扶残", "支教助学", "安老助孤", "专项基金", "重大灾难"
        ],
        message: '',
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
        totalPage: 0,
        isSearch: false
      }
    },
    watch: {
      $route() {
        if (this.type !== this.$route.params.type) {
          this.type = this.$route.params.type
          this.getWelfareList()
        }
      }
    },
    created() {
      this.getWelfareList()
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        //alert(`每页 ${val} 条`);
        if (!this.isSearch) this.getWelfareList()
        else this.search()
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        //alert(`页 ${val}`);
        if (this.isSearch === false) this.getWelfareList()
        else this.search()
      },
      async getWelfareList() {
        this.isSearch = false
        const res = await this.$axios.post('welfare/getWelfaresByType', {
          type: this.type,
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.welfareList = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
          this.welfareList = null
          //this.$message.warning(res.data.message)
        }
      },
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('/welfare/search', {
          message: this.message.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          //this.$message.success('查詢成功！')
          this.welfareList = res.data.data.list
          this.totalPage = res.data.data.total
          //console.log(res.data.data)
        } else {
          this.welfareList = null
          //this.$message.warning(res.data.message)
        }
        //this.isSearch = false
      }
    }
  }
</script>
<style scoped lang="less">
  .welfare {
    min-height: 386px;

    .menu {
      border-bottom: 1px solid rgb(203, 198, 198);
      padding-bottom: 60px;
      margin-bottom: 10px;

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

    .main {
      padding: 0 6rem;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;

      /deep/.el-pager li.active,
      /deep/.el-pager li:hover {
        color: #DD2020;
      }

      .item {
        height: 210px;
        margin-bottom: 10px;
        width: 100%;
        display: flex;

        .info {
          .top {
            display: flex;
            justify-content: space-between;
            padding: 10px;

            .left {
              width: 80%;

              .donation,
              .type {
                display: flex;
                margin: 20px 20px 20px 0;
                display: flex;
                justify-content: space-between;

                p {
                  width: 50%;
                }
              }
            }

            .right {

              /deep/.el-button {
                background-color: #DD2020;
                width: 130px;
                color: white;
                margin-top: 15px;
              }

              /deep/.el-button:hover {
                background-color: #b70f0f;
              }
            }
          }

          .bottom {
            padding: 10px;

            p {
              color: grey;
              text-overflow: ellipsis;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }

        }

        .image,
        .image-box {
          width: 380px;
          height: 210px;
          flex-shrink: 0;
        }
      }
    }
  }
</style>