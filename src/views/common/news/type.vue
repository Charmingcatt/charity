<template>
  <div class="news-wrapper">
    <left-nav />
    <div class="news">
      <div class="search">
        <el-input type="text" placeholder="请输入关键字" v-model="message" />
        <el-button icon="el-icon-search" @click="search()" />
      </div>
      <div class="info" v-if="newsList">
        <div class="item" v-for="item in newsList" :key="item.no">
          <div class="image-box">
            <el-image class="image" :src="global+'upload/'+item.cover"></el-image>
          </div>
          <div class="right">
            <router-link :to="{
                path:'/news',
                query:{
                  id:item.no
                }
              }">
              <h4 class="name">{{item.title}}</h4>
            </router-link>
            <div class="date">
              <span>{{item.created}}</span>
              <span>来源：{{item.address}}</span>
            </div>
            <p>{{item.description}}</p>
          </div>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.page" :page-sizes="[5, 10, 15, 20]" :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
      <el-empty style="margin:0 300px" v-else description="暂无数据" :image-size=300></el-empty>
    </div>

  </div>
</template>

<script>
  import LeftNav from '@/components/LeftNav.vue'

  export default {
    components: {
      LeftNav
    },
    name: 'news',
    data() {
      return {
        newsList: null,
        global: this.global.base,
        type: this.$route.params.type,
        message: '',
        pageInfo: {
          page: 1,
          pageSize: 5,
        },
        totalPage: 0,
        isSearch: false
      }
    },
    created() {
      this.getNewsByType()
    },
    watch: {
      $route() {
        if (this.$route.params.type !== this.type) {
          this.type = this.$route.params.type
          this.getNewsByType()
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getNewsByType()
        else this.search()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getNewsByType()
        else this.search()
      },
      async getNewsByType() {
        this.isSearch = false
        const res = await this.$axios.post('/news/getNewsByType', {
          type: this.type,
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          //this.$message.success(res.data.message)
          this.newsList = res.data.data.list
          this.totalPage = res.data.data.total
          //this.pageInfo.page = 1
          //console.log(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
      },
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('/news/search', {
          message: this.message.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          //this.$message.success('查詢成功！')
          this.newsList = res.data.data.list
          this.totalPage = res.data.data.total
          //this.pageInfo.page = 1
          //console.log(res.data.data)
        } else {
          this.newsList = null
          this.$message.warning(res.data.message)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .news-wrapper {
    // min-height: 386px;
    margin: 1rem 4rem;
    display: flex;

    /deep/.el-pager li.active,
    /deep/.el-pager li:hover {
      color: #DD2020;
    }

    .news {
      padding: 0 1rem;


      .search {
        width: 400px;
        display: flex;
        justify-content: baseline;
        margin: 1rem;

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

      .info {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;

        .not-found {
          text-align: center;
          margin: 0 auto;
        }

        .item {
          display: flex;
          justify-content: space-between;
          margin: 1rem;

          .image-box,
          .image {
            width: 16rem;
            height: 10rem;
            flex-shrink: 0;
          }

          .right {
            padding: 0 0.5rem;
            width: 45rem;

            .date {
              margin: 1rem 0;
              font-size: 14px;
              color: grey;

              span {
                margin-right: 10px;
              }
            }
          }

          p {
            text-overflow: ellipsis;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
</style>