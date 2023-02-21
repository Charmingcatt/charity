<template>
  <div class="noticeList">
    <div class="header">
      <el-button type="primary" @click="()=>{this.$router.push('notice/add')}" plain>添加</el-button>
      <div class="search">
        <el-input type="text" placeholder="请输入公告地址、标题、用户名" v-model="searchMsg"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="noticeList" border>
        <el-table-column fixed prop="no" label="编号" sortable>
        </el-table-column>
        <el-table-column fixed prop="username" label="创建人" sortable>
        </el-table-column>
        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column label="创建时间" prop="created">
        </el-table-column>
        <el-table-column label="更新时间" prop="updated">
        </el-table-column>
        <el-table-column prop="cover" label="封面">
          <template slot-scope="scope">
            <el-popover class="value" placement="top-start" trigger="hover">
              <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="global+'upload/'+scope.row.cover" target="_blank" title="查看最大化图片">
                <img :src="global+'upload/'+scope.row.cover" style="width: 400px;height: 260px">
              </a>
              <el-image slot="reference" :src="global+'upload/'+scope.row.cover"
                style="cursor:pointer;width:120px;height:80px"></el-image>
            </el-popover>
            <!-- <el-image :src="global+'upload/'+scope.row.url" style="width:140px;height:80px"></el-image> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row.no)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteNew(scope.row.no)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[3, 4, 5, 6]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'noticeList',
    data() {
      return {
        noticeList: [],
        addDialog: false,
        searchMsg: '',
        global: this.global.base,
        fileList: [],
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
        totalPage: 0,
        isSearch: false,
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getNoticeList()
        else this.search()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getNoticeList()
        else this.search()
      },
      async getNoticeList() {
        this.isSearch = false
        const res = await this.$axios.post('/notice/list', this.pageInfo)
        //console.log(res)
        if (res.status === 200 && res.data.code === 200) {
          this.noticeList = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
          this.noticeList = null
          this.$message(res.data.message)
        }
      },
      toEdit(no) {
        this.$router.push('notice/edit/' + no)
      },
      //删除
      deleteNew(no) {
        this.$confirm(
          '确定删除吗？', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(async () => {
          const res = await this.$axios('/notice/delete?id=' + no)
          if (res.status === 200) {
            this.$message.success('删除成功')
            this.getNoticeList()
          } else {
            this.$message.error('删除失败！')
          }
        })

      },
      //搜索
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('/notice/search', {
          message: this.searchMsg.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.noticeList = res.data.data.list
          this.totalPage = res.data.data.total
          //this.$message.success('搜索成功')
          if (res.data === null) {
            this.$message.warn('没有搜索到哦~')
          }
        } else {
          this.$message.error('查询失败')
        }
      }
    },
    created() {
      this.getNoticeList()
    }
  }
</script>
<style scoped lang="less">
  .noticeList {
    .main {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      /deep/.el-pager li.active,
      /deep/.el-pager li:hover {
        color: #DD2020;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;


      .search {
        // margin-right: 3rem;

        /deep/.el-button {
          border-radius: 0 5rem 5rem 0;
          background-color: #009688;
        }

        /deep/.el-input {
          width: 16rem;
        }

        /deep/.el-input__inner {
          border-radius: 5rem 0 0 5rem;
          width: 16rem;
        }

      }
    }
  }
</style>