<template>
  <div class="welfare">
    <el-card class="box-card">
      <div slot="header" class="header clearfix">
        <h4>我的公益</h4>
        <div class="operation">
          <div class="type">
            <span>根据状态搜索</span>
            <el-select v-model="status" @change="getByStatus()">
              <el-option label="全部" :value="8"></el-option>
              <el-option label="待审核" :value="0"></el-option>
              <el-option label="未通过" :value="1"></el-option>
              <el-option label="已通过" :value="2"></el-option>
              <el-option label="已结束" :value="3"></el-option>
              <el-option label="提现中" :value="4"></el-option>
              <el-option label="已提现" :value="5"></el-option>
              <el-option label="提交审计报告" :value="6"></el-option>
              <el-option label="已提交" :value="7"></el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="()=>{isAdd=true}" plain>新建公益</el-button>
        </div>
      </div>
      <div class="list" v-if="welfareList">
        <div class="data" v-if="!isAdd && !isEdit">
          <el-table :data="welfareList" stripe style="width: 100%">
            <el-table-column prop="name" label="公益名称">
            </el-table-column>
            <el-table-column prop="type" label="公益类型">
              <template slot-scope="scope">
                <span>{{type[scope.row.type].label}}</span>
              </template>
            </el-table-column>
            <el-table-column label="目标金额">
              <template slot-scope="scope">
                <span style="color:green">{{scope.row.aim}}元</span>
              </template>
            </el-table-column>
            <el-table-column label="已筹金额">
              <template slot-scope="scope">
                <span style="color:green">{{scope.row.has}}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="created" label="创建时间">
            </el-table-column>
            <el-table-column prop="address" label="地址">
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status===0" style="color:orange">审核中</span>
                <span v-else-if="scope.row.status===1" style="color:red">审核不通过<p>原因：{{scope.row.res}}</p></span>
                <span v-else-if="scope.row.status===2" class="ing">进行中</span>
                <span v-else-if="scope.row.status===3" style="color:gray">已结束</span>
                <span v-else-if="scope.row.status===4" style="color:darkcyan">提现中</span>
                <span v-else-if="scope.row.status===5" class="end">已提现<span>（注意：请在结束10天内提交审计报告）</span></span>
                <span v-else-if="scope.row.status===6">提交审计报告中</span>
                <span v-else class="ok">已提交审计报告</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <div class="op">
                  <el-button size="mini" v-if="scope.row.status===2" type="danger" @click="end(scope.row)">结束
                  </el-button>
                  <el-button size="mini" v-if="scope.row.status===0" type="primary" @click="toEdit(scope.row)">修改
                  </el-button>
                  <el-button size="mini" v-if="scope.row.status===3" type="primary" @click="cash()">提现
                  </el-button>
                  <el-button size="mini" v-if="scope.row.status===1" type="danger" @click="remove(scope.row.no)">删除
                  </el-button>
                  <el-button type="primary" plain size="mini">
                    <router-link :to="{path:'/welfare',query:{id:scope.row.no}}">详情</router-link>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageInfo.page" :page-sizes="[3, 4, 5, 6]" :page-size="pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
          </el-pagination>
        </div>
        <div v-show="isEdit" width="700px">
          <h4 style="margin:10px">修改公益信息</h4>
          <el-form ref="welfareForm" class="form" :model="welfareForm" label-width="80px" :rules="rules">
            <el-form-item label="名称" prop="name">
              <el-input v-model="welfareForm.name" placeholder="请输入公益名称"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="welfareForm.type">
                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目标金额" prop="aim">
              <el-input type="number" v-model="welfareForm.aim" placeholder="请输入目标金额"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="welfareForm.address" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="intro">
              <!-- <el-input type="textarea" v-model="welfareForm.intro" autosize placeholder="请输入内容" minlength="10"
                maxlength="500" show-word-limit></el-input> -->
              <mavon-editor ref="md" placeholder="请输入公益介绍..." :boxShadow="false"
                style="z-index:1;border: 1px solid #d9d9d9;height:30rem" v-model="welfareForm.content" @imgAdd="$imgAdd"
                @change="change" />
            </el-form-item>
            <el-form-item label="封面">
              <el-image :src="global+'upload/'+welfareForm.photo" style="width:240px;height:160px;"></el-image>
              <el-upload ref="upload" class="upload-demo" :action="global+'/FileUpload/upLoading'" name="file"
                list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :show-file-lis="false"
                :file-list="fileList" :show-file-list="false">
                <el-button size="small" type="primary" plain>上传封面</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
            <el-button @click="()=>{isEdit=false}">取 消</el-button>
            <el-button type="primary" @click="edit('welfareForm')">确 定</el-button>
          </span>
        </div>
        <div v-show="isAdd" width="700px">
          <h4 style="margin:10px">添加公益</h4>
          <el-form class="form" ref="addForm" :model="addForm" label-width="80px" :rules="rules">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入公益名称"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="addForm.type">
                <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目标金额" prop="aim">
              <el-input type="number" v-model="addForm.aim" placeholder="请输入目标金额"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input type="address" v-model="addForm.address" placeholder="请输入地址"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="intro">
              <mavon-editor ref="md1" placeholder="请输入公益介绍..." :boxShadow="false"
                style="z-index:1;border: 1px solid #d9d9d9;height:30rem" v-model="addForm.content" @imgAdd="$imgAdd"
                @change="change" />
              <!-- <el-input type="textarea" v-model="addForm.intro" autosize placeholder="请输入内容" minlength="10"
                maxlength="200" show-word-limit></el-input> -->
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
            <el-button @click="()=>{isAdd=false}">取 消</el-button>
            <el-button type="primary" @click="add('addForm')">确 定</el-button>
          </span>
        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-card>

  </div>
</template>
<script>
  export default {
    name: 'welfare',
    data() {
      var checkName = (rule, value, callback) => {
        const regName = /(.){4,20}/;
        if (value.length == 0) {
          callback(new Error("公益名称不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("公益名称为4到20位的字符"));
        } else {
          return callback();
        }
      };
      var checkIntro = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("介绍不能为空"));
        } else {
          return callback();
        }
      };
      var checkType = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请选择类型！"));
        } else {
          return callback();
        }
      };
      var checkAddress = (rule, value, callback) => {
        const regName = /(.){3,10}/;
        if (value === '') {
          callback(new Error("地址不能为空！"));
        } else if (!regName.test(value)) {
          callback(new Error("地址为3到10位的字符"));
        } else {
          return callback();
        }
      };
      var checkAim = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("目标金额不能为空！"));
        } else {
          return callback();
        }
      };
      return {
        welfareList: null,
        isEdit: false,
        status: 8,
        welfareForm: {
          address: '',
          content: '',
          content_html: '',
          type: 1,
          name: '',
          aim: ''
        },
        addForm: {
          address: '',
          intro: '',
          type: 1,
          name: '',
          aim: '',
          content: '',
          content_html: '',
        },
        isAdd: false,
        global: this.global.base,
        fileList: [],
        type: [{
            value: 0,
            label: "其他",
          }, {
            value: 1,
            label: "扶贫救灾",
          }, {
            value: 2,
            label: "助医扶残",
          },
          {
            value: 3,
            label: "支教助学",
          },
          {
            value: 4,
            label: "安老助孤",
          },
          {
            value: 5,
            label: "专项基金",
          }, {
            value: 6,
            label: "重大灾难",
          }
        ],
        rules: {
          name: [{
            validator: checkName,
            trigger: 'blur'
          }],
          content: [{
            validator: checkIntro,
            trigger: 'blur'
          }],
          type: [{
            validator: checkType,
            trigger: 'blur'
          }],
          address: [{
            validator: checkAddress,
            trigger: 'blur'
          }],
          aim: [{
            validator: checkAim,
            trigger: 'blur'
          }]
        },
        pageInfo: {
          page: 1,
          pageSize: 3,
        },
        totalPage: 0,
        isSearch: false
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getWelfares()
        else this.getByStatus()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getWelfares()
        else this.getByStatus()
      },
      // 将图片上传到服务器，返回地址替换到md中
      async $imgAdd(pos, $file) {
        var formdata = new FormData();
        formdata.append('file', $file);
        const res = await this.$axios({
          url: '/FileUpload/upLoading',
          method: 'post',
          data: formdata,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        //console.log(res)
        if (res.status === 200 && res.data.code == 200) {
          this.$message.success(res.data.message)
          //console.log(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
        if (this.isEdit) this.$refs.md.$img2Url(pos, this.global + '/upload/' + res.data.data);
        else this.$refs.md1.$img2Url(pos, this.global + '/upload/' + res.data.data);
      },
      change(value, render) {
        // render 为 markdown 解析后的结果
        if (this.isAdd) this.addForm.content_html = render;
        else this.welfareForm.content_html = render;
        //console.log(this.newForm.content)
      },
      async getByStatus() {
        this.isAdd = false
        this.isEdit = false
        this.isSearch = true
        if (this.status === 8) this.getWelfares()
        else {
          const res = await this.$axios.post('/welfare/getByUStatus', {
            status: this.status,
            user_no: localStorage.getItem('id'),
            page: this.pageInfo.page,
            pageSize: this.pageInfo.pageSize,
          })
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            ///console.log(res.data.data)
            this.welfareList = res.data.data.list
            this.totalPage = res.data.data.total
            //this.$message.success('搜索成功！')
          } else {
            this.$message.warning(res.data.message)
          }
        }
      },
      async getWelfares() {
        const res = await this.$axios.post('/welfare/getWelfaresByUid', {
          user_no: localStorage.getItem('id'),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
        })
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.welfareList = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
           this.welfareList = null
          this.$message.error(res.data.message)
        }
      },
      toEdit(welfare) {
        //console.log(welfare)
        this.welfareForm = JSON.parse(JSON.stringify(welfare))
        this.isEdit = true
      },
      edit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.update()
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      async update() {
        const res = await this.$axios.post('welfare/update', this.welfareForm)
        if (res.status === 200 && res.data.success) {
          this.isEdit = false
          this.getWelfares()
          this.$message.success('修改成功！')
        } else {
          this.$message.error(res.data.message)
        }
      },
      add(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.addForm.user_no = localStorage.getItem('id')
            const res = await this.$axios.post('welfare/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.isAdd = false
              //this.addForm = {}
              this.getWelfares()
              this.$message.success('添加成功！')
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      cash() {
        this.$confirm(
            "提现公益需提交申请！",
            "提现公益需提交申请！", {
              confirmButtonText: "去申请",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
          .then(() => {
            this.$router.push('/user/apply')
          })
          .catch(() => {
            this.$message.warning("已取消!");
          });
      },
      end(welfare) {
        this.welfareForm = JSON.parse(JSON.stringify(welfare))
        this.welfareForm.status = 3
        //console.log(this.welfareForm)
        this.update()
      },
      remove(id) {
        this.$confirm("确认删除",
          "确认删除吗？操作不可逆！", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
          const res = await this.$axios('/welfare/delete?id=' + id)
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            this.$message.success('删除成功')
            this.getWelfares()
          } else {
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.warning("已取消删除!");
        })
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        if (this.isEdit) this.welfareForm.photo = response.data
        else this.addForm.photo = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      async getUser() {
        const res = await this.$axios('user/getUserByName?username=' + localStorage.getItem('username'))
        if (res.status === 200 && res.data.success) {
          if (res.data.data.type === 2) {
            this.$message.error('普通用户无权限操作！')
            this.$router.push('/user')
          }
        } else {
          this.$message.error(res.data.message)
          this.$router.push('/user')
        }
      },
    },
    created() {
      this.getUser()
      this.getWelfares()
    }
  }
</script>
<style scoped lang="less">
  .welfare {
    .data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      /deep/.el-pager li.active,
      /deep/.el-pager li:hover {
        color: #DD2020;
      }

    }

    a {
      color: #409EFF;
    }

    /deep/.el-button:hover a {
      color: white;
    }

    .header {
      display: flex;
      justify-content: space-between;

      .operation {
        display: flex;
      }

      .type {
        margin: 0 20px;

        span {
          color: #009688;
          margin: 0 10px;
          font-weight: 600;
        }
      }
    }

    .list {
      /deep/.el-table {
        .op {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      }

      /deep/.el-button {
        margin: 2px 3px !important;
      }

      .ing {
        color: rgb(93, 183, 216);
      }

      .end {
        span {
          color: red;
        }
      }

      .ok {
        color: green;
      }
    }
  }
</style>