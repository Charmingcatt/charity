<template>
  <div class="usersList">
    <div class="header">
      <el-button type="primary" @click="()=>{isAdd = true}" plain>添加</el-button>
      <div class="search">
        <el-input type="text" placeholder="请输入联盟名称" v-model="searchMsg"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="teamList" border>
        <el-table-column prop="no" label="编号" sortable>
        </el-table-column>
        <el-table-column prop="name" label="联盟名称">
        </el-table-column>
        <el-table-column label="创建人">
          <!-- <template slot-scope="scope">
            <router-link :to="'/admin/center?id='+scope.row.user_no">{{scope.row.user_name}}</router-link>
          </template> -->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详细信息" placement="top-start">
              <span @click="toInfo(scope.row.user.no)">{{scope.row.user.username}}</span>
            </el-tooltip>
            <!-- <router-link :to="'/admin/center?id='+scope.row.user.no">{{scope.row.user.username}}</router-link> -->
          </template>
        </el-table-column>
        <el-table-column prop="count" label="人数">
        </el-table-column>
        <el-table-column label="描述" prop="intro">
          <template slot-scope="scope">
            {{scope.row.intro.slice(0,15)}}...
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="mini" @click="toEdit(scope.row)">修改</el-button> -->
            <el-button type="danger" size="mini" @click="remove(scope.row.no)">解散</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[5, 6, 7, 8]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
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
    <el-dialog title="新建联盟" :visible.sync="isAdd" width="600px">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入联盟名称"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="intro">
          <el-input type="textarea" autosize placeholder="请输入内容" minlength="10" maxlength="200" show-word-limit
            v-model="addForm.intro">
          </el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload ref="upload" class="upload-demo" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList">
            <el-button size="small" type="primary" plain>上传封面</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button @click="()=>{isAdd = false}">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'userList',
    data() {
      var checkName = (rule, value, callback) => {
        const regName = /(.){4,15}/;
        if (value === '') {
          callback(new Error("名称不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("昵称为4到15位的字符"));
        } else {
          return callback();
        }
      };
      var checkIntro = (rule, value, callback) => {
        const regName = /(.){10,200}/;
        if (value === '') {
          callback(new Error("介绍不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("介绍为10到20位的字符"));
        } else {
          return callback();
        }
      };
      var checkCover = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("封面不能为空！"));
        } else {
          return callback();
        }
      };
      return {
        teamList: [],
        // currentPage: 1,
        addDialog: false,
        searchMsg: '',
        status: 5,
        userInfo: {
          thumb: ''
        },
        addForm: {
          user_no: '',
          name: '',
          intro: '',
          cover: ''
        },
        rules: {
          name: [{
            validator: checkName,
            trigger: 'blur'
          }],
          intro: [{
            validator: checkIntro,
            trigger: 'blur'
          }],
          cover: [{
            validator: checkCover,
            trigger: 'blur'
          }],
        },
        isAdd: false,
        global: this.global.base,
        count: 0,
        pageInfo: {
          page: 1,
          pageSize: 5,
        },
        totalPage: 0,
        isSearch: false,
        fileList: [],
        isInfo: false

      }
    },
    methods: {
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        this.addForm.cover = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      add(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.addForm.user_no = localStorage.getItem("id")
            const res = await this.$axios.post('team/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.isAdd = false
              this.$message.success('添加成功！')
              this.getTeamList()
              this.addForm = {}
              this.fileList = []
            } else {
              this.$message.error('添加失败！')
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })

      },
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (this.isSearch && !this.isType) this.search()
        else this.getTeamList()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (this.isSearch && !this.isType) this.search()
        else this.getTeamList()
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
      async getTeamList() {
        this.isSearch = false
        const res = await this.$axios.post('/team/list', this.pageInfo)
        console.log(res)
        if (res.status === 200) {
          this.teamList = res.data.data.list
          this.totalPage = res.data.data.total
          //console.log(res.data.data)
        } else {
          this.$message.error('获取失败!')
        }
      },
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('/team/search', {
          message: this.searchMsg.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.teamList = res.data.data.list
          this.totalPage = res.data.data.total
          // console.log(res)
          //this.$message.success('搜索成功!')
          if (res.data === null) {
            this.$message.warn('没有搜索到哦~')
          }
        } else {
          this.teamList = null
          this.$message.error('查询失败')
        }
      },
      async remove(id) {
        this.$confirm(
          '确定解散吗？', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(async () => {
          const res = await this.$axios('/team/delete?id=' + id)
          if (res.status === 200 && res.data.success) {
            this.$message.success('解散成功!')
            this.getTeamList()
          } else {
            this.teamList = null
            this.$message.error('解散失败')
          }
        }).catch(() => {
          this.$message.warning("已取消!");
        });
      }
    },
    created() {
      this.getTeamList()
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