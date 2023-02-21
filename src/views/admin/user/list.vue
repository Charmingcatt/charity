<template>
  <div class="usersList">
    <div class="header">
      <el-button type="primary" @click="()=>{isAdd = true}" plain>添加</el-button>
      <div class="search">
        <el-input type="text" placeholder="请输入地址、用户名" v-model="searchMsg"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <!-- <span style="color:red">点击用户名查看详细信息</span> -->
    <div class="main">
      <el-table :data="usersList" border>
        <el-table-column fixed prop="username" label="用户名">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击查看详细信息" placement="top-start">
              <span @click="toInfo(scope.row.no)">{{scope.row.username}}</span>
            </el-tooltip>
            <!-- <router-link :to="'/admin/center?id='+scope.row.no">{{scope.row.username}}</router-link> -->
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===0" style="color:green">正常</span>
            <span v-else-if="scope.row.status===1" style="color:red">已冻结</span>
            <span v-else style="color:orange">认证中...</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.type===1" style="color:skyblue">管理员</span>
            <span v-else-if="scope.row.type===2" style="color:grey">普通用户</span>
            <span v-else style="color:orange">创建者</span>
          </template>
        </el-table-column>
        <el-table-column prop="real_name" label="真实姓名">
        </el-table-column>
        <!-- <el-table-column label="密码" prop="password" width="160">
        </el-table-column> -->
        <el-table-column label="捐赠次数" prop="times">
        </el-table-column>
        <el-table-column prop="id" label="身份证号" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="140">
        </el-table-column>
        <el-table-column prop="tel" label="电话号码" width="120">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <div v-if="scope.row.status!==2 && scope.row.type!==1">
              <el-button v-if="scope.row.status===0" @click="frozen(scope.row.no)" type="primary"
                icon="el-icon-ice-cream-round" circle></el-button>
              <el-button v-else-if="scope.row.status===1" @click="noFrozen(scope.row)" type="primary"
                icon="el-icon-sunny" circle>
              </el-button>
              <el-button @click="deleteUser(scope.row.no)" type="danger" icon="el-icon-delete" circle></el-button>
            </div>

            <div v-else-if="scope.row.status===2" class="justify">
              <el-button @click="pass(scope.row)" type="primary" size="mini">通过</el-button>
              <el-button @click="toReject(scope.row)" type="danger" size="mini">拒绝</el-button>
            </div>
            <div v-else>
              无权限操作
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[5, 6, 7, 8]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog title="添加用户" :visible.sync="isAdd" width="600px">
      <el-form :model="addForm" ref="addForm" label-width="100px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="thumb">
          <el-avatar :src="this.global+'upload/'+addForm.thumb"></el-avatar>
          <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>上传头像</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="addForm.type">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="创建者" :value="2"></el-option>
            <el-option label="普通用户" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button type="primary" @click="add('addForm')">添加</el-button>
        <el-button @click="()=>{isAdd = false}">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="拒绝原因" :visible.sync="isReject" width="600px">
      <el-input type="textarea" maxlength="100" placeholder="请输入拒绝原因" show-word-limit v-model="user.res"></el-input>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button type="primary" @click="reject()">提交</el-button>
        <el-button @click="()=>{isReject = false}">取 消</el-button>
      </span>
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
    name: 'userList',
    data() {
      var validatePass = (rule, value, callback) => {
        const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!regPass.test(value)) {
          callback(new Error('密码为6到16位的数字和字母的组合'));
        }
        callback();
      };
      var checkUname = (rule, value, callback) => {
        const regName = /^((?!\\|\/|:|\*|\?|<|>|\||'|%).){2,10}$/;
        if (value.length == 0) {
          callback(new Error("账户名不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("账户名为2到10位，不含特殊字符"));
        } else {
          return callback();
        }
      };
      return {
        isReject: false,
        usersList: [],
        isAdd: false,
        pageInfo: {
          page: 1,
          pageSize: 5,
        },
        totalPage: 0,
        isSearch: false,
        searchMsg: '',
        userInfo: {
          thumb: ''
        },
        isInfo: false,
        count: 0,
        global: this.global.base,
        user: {
          res: ""
        },
        addForm: {
          username: '',
          type: 1,
          sex: '男',
          password: 'lay123456',
          thumb: 'a79b2c0a-48de-4d18-8ef2-15519b4f3635.jpg',
        },
        fileList: [],
        rules: {
          username: [{
            validator: checkUname,
            trigger: "blur",
          }, ],
          password: [{
            validator: validatePass,
            trigger: "blur",
          }, ],
        },
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getUsersList()
        else this.search()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getUsersList()
        else this.search()
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
      toReject(user) {
        this.isReject = true
        this.user = user
        console.log('user---', this.user)
      },
      async getUsersList() {
        this.isSearch = false
        const res = await this.$axios.post('/user/list', {
          id: localStorage.getItem('id'),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
        })
        //console.log(res)
        if (res.status === 200) {
          this.usersList = res.data.data.list
          this.totalPage = res.data.data.total
          this.usersList.map(x => {
            this.count[x.no] = 0
          })
          //console.log(this.count)
          //console.log(res.data.data)
        } else {
          this.$message.error('获取失败!')
        }
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        this.addForm.thumb = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      deleteUser(id) {
        this.$confirm("确认删除",
          "确认删除吗？操作不可逆！", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
          const res = await this.$axios('/user/delete?id=' + id)
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            this.$message.success('删除成功')
            this.getUsersList()
          } else {
            this.usersList = null
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.warning("已取消删除!");
        })
      },
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('/user/search', {
          message: this.searchMsg.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200) {
          this.usersList = res.data.data.list
          this.totalPage = res.data.data.total
          //console.log(res.data)
          //this.$message.success('搜索成功!')
          if (res.data === null) {
            this.$message.warn('没有搜索到哦~')
          }
        } else {
          this.$message.error('查询失败')
        }
      },
      async frozen(id) {
        const res = await this.$axios('/user/frozen?id=' + id)
        if (res.status === 200 && res.data.success) {
          this.$message.success('冻结成功！')
          this.getUsersList()
        } else {
          this.$message.error(res.data.message)
        }
      },
      async noFrozen(user) {
        user.status = 0
        const res = await this.$axios.post('/user/update', user)
        if (res.status === 200 && res.data.success) {
          this.$message.success('解冻成功！')
          this.getUsersList()
        } else {
          this.$message.error(res.data.message)
        }
      },
      async add(formName) {
        //console.log(this.addForm)
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('/user/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.$message.success('添加成功！')
              this.getUsersList()
              this.isAdd = false
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      async update(user) {
        const res = await this.$axios.post('user/update', user)
        if (res.status === 200 && res.data.success) {
          this.getUsersList()
          this.$message.success('审核成功！')
        } else {
          this.$message.error(res.data.message)
        }
      },
      pass(user) {
        var user1 = JSON.parse(JSON.stringify(user))
        user1.type = 3
        user1.status = 0
        this.update(user1)
      },
      reject() {
        this.isReject = false
        this.$confirm("确认不通过审核吗？",
          "确认不通过审核吗？", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
          this.user.status = 0
          //console.log(this.welfare)
          this.update(this.user)
          this.$message.success('已拒绝申请！')
        }).catch(() => {
          this.$message.warning('已取消！')
        })
      },
    },
    created() {
      this.getUsersList()
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

      .justify {
        display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        margin-bottom: 1px;
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