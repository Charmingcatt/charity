<template>
  <div class="usersList">
    <div class="header">
      <!-- <el-button type="primary" @click="addDialog = true" plain>添加</el-button> -->
      <div class="search">
        <el-input type="text" placeholder="请输入申请名称、用户名" v-model="searchMsg"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="type">
        <span>根据状态搜索</span>
        <el-select v-model="status" @change="getByStatus()">
          <el-option label="全部" :value="5"></el-option>
          <el-option label="未通过" :value="1"></el-option>
          <el-option label="已通过" :value="4"></el-option>
          <el-option label="待审核" :value="0"></el-option>
        </el-select>
      </div>
    </div>
    <div class="main">
      <el-table :data="applyList" border>
        <el-table-column prop="no" label="编号" sortable>
        </el-table-column>
        <el-table-column prop="name" label="申请名称">
        </el-table-column>
        <el-table-column label="申请人">
          <!-- <template slot-scope="scope">
            <router-link :to="'/admin/center?id='+scope.row.user_no">{{scope.row.user_name}}</router-link>
          </template> -->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详细信息" placement="top-start">
              <span @click="toInfo(scope.row.user_no)">{{scope.row.user_name}}</span>
            </el-tooltip>
            <!-- <router-link :to="'/admin/center?id='+scope.row.user.no">{{scope.row.user.username}}</router-link> -->
          </template>
        </el-table-column>
        <el-table-column prop="welf_name" label="公益项目">
        </el-table-column>
        <el-table-column prop="created" label="申请时间">
        </el-table-column>
        <el-table-column prop="status" label="步骤">
          <template slot-scope="scope">
            <span v-if="scope.row.status===0" style="color:#409eff">未审核</span>
            <span v-else-if="scope.row.status===1" style="color:red">未通过审核</span>
            <span v-else-if="scope.row.status===2" style="color:orange">审核用户账号</span>
            <span v-else-if="scope.row.status===3" style="color:orange">审核账单</span>
            <span v-else style="color:green">审核通过</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="money">
        </el-table-column>
        <el-table-column label="描述" prop="description">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1" style="color:red">
              未通过
              <p style="color:black">拒绝原因：{{scope.row.res}}</p>
            </span>
            <span v-else-if="scope.row.status===4" style="color:green">已通过></span>
            <div v-else>
              <el-button type="primary" size="mini" @click="pass(scope.row)">通过</el-button>
              <el-button type="danger" size="mini" @click="toReject(scope.row)">不通过</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[4, 5, 6, 7]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog title="拒绝原因" :visible.sync="isReject" width="600px">
      <el-input type="textarea" maxlength="100" placeholder="请输入拒绝原因" show-word-limit v-model="apply.res"></el-input>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button type="primary" @click="reject()">提交</el-button>
        <el-button @click="()=>{isReject = false}">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户信息" :visible.sync="isInfo" width="700px">
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
    name: 'userList',
    data() {
      return {
        applyList: [],
        // currentPage: 1,
        addDialog: false,
        searchMsg: '',
        apply: {
          status: 0,
          res: ''
        },
        isReject: false,
        status: 5,
        userInfo: {
          thumb: ''
        },
        isInfo: false,
        global: this.global.base,
        count: 0,
        pageInfo: {
          page: 1,
          pageSize: 4,
        },
        totalPage: 0,
        isSearch: false,
        isType: false,
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (this.isSearch && !this.isType) this.search()
        else if (this.isType && !this.isSearch) this.getByStatus()
        else this.getApplyList()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (this.isSearch && !this.isType) this.search()
        else if (this.isType && !this.isSearch) this.getByStatus()
        else this.getApplyList()
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
      async getApplyList() {
        this.isSearch = false
        this.isType = false
        const res = await this.$axios.post('/apply/list', this.pageInfo)
        //console.log(res)
        if (res.status === 200) {
          this.applyList = res.data.data.list
          this.totalPage = res.data.data.total
          //console.log(res.data.data)
        } else {
          this.$message.error('获取失败!')
        }
      },
      async update(apply) {
        const res = await this.$axios.post('/apply/update', apply)
        //console.log(res)
        if (res.status === 200 && res.data.code === 200) {
          this.getApplyList()
        } else {
          this.$message(res.data.message)
        }
      },
      toReject(apply) {
        this.isReject = true
        this.apply = apply
      },
      pass(apply) {
        this.$confirm(
            "确认通过审核吗？",
            "确认通过审核吗？", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            })
          .then(() => {
            if (apply.status === 0) apply.status = 2
            else apply.status++
            this.update(apply)
            this.$message.success('已通过申请！')
          }).catch(() => {
            this.$message.warning('已取消！')
          })
      },
      reject() {
        this.isReject = false
        this.$confirm("确认不通过审核吗？",
          "确认不通过审核吗？", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
          this.apply.status = 1
          //console.log(this.welfare)
          this.update(this.apply)
          this.$message.success('已拒绝申请！')
        }).catch(() => {
          this.$message.warning('已取消！')
        })
      },
      async getByStatus() {
        this.isType = true
        this.isSearch = false
        if (this.status === 5) this.getApplyList()
        else {
          const res = await this.$axios.post('/apply/getByStatus', {
            status: this.status,
            page: this.pageInfo.page,
            pageSize: this.pageInfo.pageSize,
          })
          //console.log(res)
          if (res.status === 200 && res.data.code === 200) {
            this.applyList = res.data.data.list
            this.totalPage = res.data.data.total
            //this.$message.success('搜索成功！')
          } else {
            this.$message(res.data.message)
          }
        }
      },
      async search() {
        this.isSearch = true
        this.isType = false
        const res = await this.$axios.post('/apply/search', {
          message: this.searchMsg.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.applyList = res.data.data.list
          this.totalPage = res.data.data.total
          // console.log(res)
          // this.$message.success('搜索成功!')
          if (res.data === null) {
            this.$message.warn('没有搜索到哦~')
          }
        } else {
          this.$message.error('查询失败')
        }
      }
    },
    created() {
      this.getApplyList()
    }
  }
</script>
<style scoped lang="less">
  .usersList {
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
      padding: 5px 20px;

      .type {
        span {

          color: #009688;
          margin-right: 10px;
          font-weight: 600;
        }
      }

      .search {
        margin-right: 3rem;

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