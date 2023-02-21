<template>
  <div class="newsList">
    <div class="header">
      <div class="left">
        <el-button type="primary" size="small" @click="()=>{this.$router.push('news/add')}" plain>添加</el-button>
        <div class="search">
          <el-input type="text" placeholder="请输入新闻地址、标题、用户名" v-model="searchMsg"></el-input>
          <el-button type="primary" class="search=btn" @click="search">搜索</el-button>
        </div>
      </div>
      <div class="type">
        <span>根据类型搜索</span>
        <el-select v-model="type" @change="getNewsByType()">
          <el-option label="全部" :value="4"></el-option>
          <el-option label="信息公开" :value="1"></el-option>
          <el-option label="慈善新闻" :value="2"></el-option>
          <el-option label="法律法规" :value="3"></el-option>
        </el-select>
      </div>
    </div>
    <div class="main">
      <el-table :data="news" border>
        <el-table-column fixed prop="no" label="编号" width="80" sortable>
        </el-table-column>
        <el-table-column fixed prop="username" label="创建人" width="100" sortable>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详细信息" placement="top-start">
              <span @click="toInfo(scope.row.user_no)">{{scope.row.username}}</span>
            </el-tooltip>
            <!-- <router-link :to="'/admin/center?id='+scope.row.user_no">{{scope.row.username}}</router-link> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="240">
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            <i v-if=" scope.row.created" class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.created }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="160">
          <template slot-scope="scope">
            <i v-if=" scope.row.updated" class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.updated }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            {{types[scope.row.type-1]}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteNew(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[5, 6, 7, 8]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog title="修改新闻" :visible.sync="isEdit" width="600px">
      <el-form :model="newForm" ref="newForm" label-width="100px">
        <el-form-item label="内容" prop="description">
          <el-button type="primary" plain @click="editContent()">
            修改内容
          </el-button>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="newForm.title" type="text"></el-input>
        </el-form-item>
        <el-form-item label="新闻地址" prop="address">
          <el-input v-model="newForm.address" type="text"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-image :src="this.global+'upload/'+newForm.cover" style="width:350px;height:200px;"></el-image>
          <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>上传封面</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="newForm.type" placeholder="新闻类型">
            <el-option label="信息公开" :value="1"></el-option>
            <el-option label="慈善新闻" :value="2"></el-option>
            <el-option label="法律法规" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="description">
          <el-input v-model="newForm.description" type="textarea" autosize maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit()">修改</el-button>
          <el-button @click="()=>{isEdit=false}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="详细信息" :visible.sync="isInfo" width="700px">
      <div class="center">
        <div class="box-card">
          <div slot="header" class="header clearfix">
            <div class="user-info">
              <el-avatar :src="global+'upload/'+userInfo.thumb"></el-avatar>
              <span style="margin-right:1rem">{{userInfo.username}}</span>
              <span class="money">捐赠金额：<span>{{userInfo.money}}</span>元</span>
              <span class="count">捐助次数：<span>{{userInfo.times}}</span>次</span>
            </div>
          </div>
          <div class="info">
            <div class="base">
              <div class="item">
                <span class="label">违规次数：</span>
                <span class="value" style="color:red">{{count}}</span>
              </div>
              <div class="item">
                <span class="label">公开募捐资格证书：</span>
                <el-popover class="value" v-if="userInfo.certification!==null" placement="top-start" trigger="hover">
                  <!--trigger属性值：hover、click、focus 和 manual-->
                  <a :href="global+'upload/'+userInfo.certification" target="_blank" title="查看最大化图片">
                    <img :src="global+'upload/'+userInfo.certification" style="width: 400px;height: 260px">
                  </a>
                  <el-image slot="reference" :src="global+'upload/'+userInfo.certification"
                    style="width: 200px;height: 100px; cursor:pointer"></el-image>
                </el-popover>
                <span class="value" v-else style="color:red">未上传</span>
              </div>
              <div class="item">
                <span class="label">身份证照片</span>
                <el-popover class="value" v-if="userInfo.idImage!==null" placement="top-start" trigger="hover">
                  <!--trigger属性值：hover、click、focus 和 manual-->
                  <a :href="global+'upload/'+userInfo.idImage" target="_blank" title="查看最大化图片">
                    <img :src="global+'upload/'+userInfo.idImage" style="width: 400px;height: 260px">
                  </a>
                  <el-image slot="reference" :src="global+'upload/'+userInfo.idImage"
                    style="width: 200px;height: 100px; cursor:pointer"></el-image>
                </el-popover>
                <span class="value" v-else style="color:red">未上传</span>
              </div>
              <div class="item">
                <span class="label">昵称：</span>
                <span class="value">{{userInfo.username}}</span>
              </div>
              <div class="item">
                <span class="label">性别：</span>
                <span class="value">{{userInfo.sex}}</span>
              </div>
              <div class="item">
                <span class="label">地址：</span>
                <span class="value">{{userInfo.address}}</span>
              </div>
              <div class="item">
                <span class="label">微信：</span>
                <span class="value">{{userInfo.wechat}}</span>
              </div>
              <div class="item">
                <span class="label">邮箱：</span>
                <span class="value">{{userInfo.email}}</span>
              </div>
              <div class="item">
                <span class="label">真实姓名：</span>
                <span class="value">{{userInfo.real_name}}</span>
              </div>
              <div class="item">
                <span class="label">联系电话：</span>
                <span class="value">{{userInfo.tel}}</span>
              </div>
              <div class="item">
                <span class="label">出生日期：</span>
                <span class="value">{{userInfo.birthday}}</span>
              </div>
              <div class="item">
                <span class="label">身份证号：</span>
                <span class="value">{{userInfo.id}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'newsList',
    data() {
      return {
        news: [],
        addDialog: false,
        searchMsg: '',
        newForm: {
          title: '',
          content: '',
          address: '',
          no: '',
          cover: '',
          type: '',
          description: '',
          content_html: ''
        },
        userInfo: {
          thumb: ''
        },
        isInfo: false,
        isEdit: false,
        global: this.global.base,
        fileList: [],
        type: 4,
        pageInfo: {
          page: 1,
          pageSize: 5,
        },
        totalPage: 0,
        isSearch: false,
        isType: false,
        types: ['信息公开', '慈善新闻', '法律法规']
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (this.isSearch && !this.isType) this.search()
        else if (this.isType && !this.isSearch) this.getNewsByType()
        else this.getNewsList()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (this.isSearch && !this.isType) this.search()
        else if (this.isType && !this.isSearch) this.getNewsByType()
        else this.getNewsList()
      },
      toInfo(id) {
        this.getUser(id)
        this.getCount(id)
        this.isInfo = true
      },
      async getUser(id) {
        const res = await this.$axios('user/getUserById?id=' + id)
        if (res.status === 200 && res.data.success) {
          this.userInfo = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      async getCount(id) {
        const res = await this.$axios('/welfare/getNotWelfareCount?user_no=' + id)
        //console.log(res)
        if (res.status === 200) {
          //this.count[id] = res.data.data
          this.count = res.data.data
          // console.log(this.count[id])
          // this.$forceUpdate()

        } else {
          this.$message.error('获取失败!')
        }
      },
      async getNewsByType() {
        this.isType = true
        this.isSearch = false
        if (this.type === 4) this.getNewsList()
        else {
          const res = await this.$axios.post('/news/getNewsByType', {
            type: this.type,
            page: this.pageInfo.page,
            pageSize: this.pageInfo.pageSize,
          })
          if (res.status === 200 && res.data.success) {
            //this.$message.success('搜索成功！')
            this.news = res.data.data.list
            this.totalPage = res.data.data.total
            //console.log(res.data.data)
          } else {
            this.$message.error(res.data.message)
          }
        }
      },
      async getNewsList() {
        this.isSearch = false
        this.isType = false
        const res = await this.$axios.post('/news/list', this.pageInfo)
        //console.log(res)
        if (res.status === 200 && res.data.code === 200) {
          this.news = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
          this.news = null
          this.$message(res.data.message)
        }
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        this.newForm.cover = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      toEdit(row) {
        this.newForm = JSON.parse(JSON.stringify(row))
        this.isEdit = true
      },
      //修改内容
      editContent() {
        this.edit()
        this.$router.push('news/edit/' + this.newForm.no)
      },
      //删除
      deleteNew(row) {
        this.$confirm(
          '确定删除吗？', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(async () => {
          const res = await this.$axios('/news/delete?id=' + row.no)
          if (res.status === 200) {
            this.$message.success('删除成功！')
            this.getNewsList()
          } else {
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.warning("已取消!");
        });

      },
      //搜索
      async search() {
        this.isSearch = true
        this.isType = false
        const res = await this.$axios.post('/news/search', {
          message: this.searchMsg.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.news = res.data.data.list
          this.totalPage = res.data.data.total
          //this.$message.success('搜索成功')
          if (res.data === null) {
            this.$message.warn('没有搜索到哦~')
          }
        } else {
          this.$message.error('查询失败')
        }
      },
      async edit() {
        //console.log(this.newForm)
        const news = JSON.stringify(this.newForm)
        const res = await this.$axios.post('/news/update', news)
        if (res.status === 200 && res.data.code === 202) {
          this.isEdit = false
          this.$message.success(res.data.message)
          this.getNewsList()
          //this.$router.push('/admin/news')
        } else {
          this.$message.error('修改失败！')
          return false
        }
      },
    },
    created() {
      this.getNewsList()
    }
  }
</script>
<style scoped lang="less">
  .newsList {
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

    .center {
      .header {
        display: flex;
        justify-content: space-between;

        .op {
          .item {
            font-size: 1rem;
            margin: 0 30px;
          }

        }

        .user-info {
          display: flex;
          align-items: baseline;

          .count,
          .money {
            margin-left: 1rem;

            span {
              color: orangered;
            }
          }
        }
      }

      .info {
        .base {
          padding-bottom: 10px !important;

          .item {
            margin-top: 12px;

            .label {
              color: #333;
              display: inline-block;
              text-align: right;
              width: 150px;
            }

            .value {
              color: #666;
              padding-left: 50px;
            }

            /deep/.upload-demo {
              display: inline-block !important;
            }
          }
        }
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;

      .type {
        span {
          color: #009688;
          margin-right: 10px;
          font-weight: 600;
        }
      }

      .left {
        display: flex;
      }

      .search {
        margin: 0 1rem;

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