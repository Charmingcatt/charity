<template>
  <div class="news-wrapper">
    <el-card>
      <div slot="header" class="header">
        <h4>我的审计报告</h4>
      </div>
      <div class="news" v-if="newsList">
        <el-table :data="newsList" stripe style="width: 100%">
          <el-table-column prop="title" label="报告标题">
          </el-table-column>
          <el-table-column prop="created" label="提交时间">
          </el-table-column>
          <el-table-column prop="address" label="捐赠地区">
          </el-table-column>
          <el-table-column prop="cover" label="报告单">
            <template slot-scope="scope">
              <el-popover class="value" placement="top-start" trigger="hover">
                <!--trigger属性值：hover、click、focus 和 manual-->
                <a :href="global+'upload/'+scope.row.cover" target="_blank" title="查看最大化图片">
                  <img :src="global+'upload/'+scope.row.cover" style="width: 400px;height: 260px">
                </a>
                <el-image slot="reference" :src="global+'upload/'+scope.row.cover"
                  style="width: 40px;height: 40px; cursor:pointer"></el-image>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===0" style="color:orange">审核中</span>
              <span v-else style="color:green">通过</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="op">
                <el-button type="primary" v-if="scope.row.status===0" size="mini" plain @click="toEdit(scope.row)">
                  修改
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.page" :page-sizes="[5, 6,7, 8]" :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-card>
    <el-dialog title="修改审计报告" :visible.sync="isEdit" width="700px">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="名称" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入报告名称"></el-input>
        </el-form-item>
        <el-form-item label="捐赠地区" prop="address">
          <el-input type="address" v-model="editForm.address" placeholder="请输入捐赠地区"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="editForm.description" autosize placeholder="请输入描述，应说明筹集金额和具体花费"
            minlength="10" maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="修改报告单">
          <el-image :src="global+'upload/'+editForm.cover" style="width:240px;height:160px;"></el-image>
          <el-upload ref="upload" class="upload-demo" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList">
            <el-button size="small" type="primary" plain>上传报告单</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button @click="()=>{isEdit=false}">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'work',
    data() {
      var checkTitle = (rule, value, callback) => {
        const regName = /(.){4,20}/;
        if (value.length == 0) {
          callback(new Error("报告名称不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("报告名称为4到20位的字符"));
        } else {
          return callback();
        }
      };
      var checkDesc = (rule, value, callback) => {
        const regName = /(.){10,200}/;
        if (value === '') {
          callback(new Error("描述不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("描述为10到20位的字符"));
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
      var checkCover = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("报告不能为空！"));
        } else {
          return callback();
        }
      };
      return {
        newsList: null,
        editForm: {
          title: '',
          address: '',
          description: '',
          cover: '',
        },
        fileList: [],
        rules: {
          title: [{
            validator: checkTitle,
            trigger: 'blur'
          }],
          description: [{
            validator: checkDesc,
            trigger: 'blur'
          }],
          address: [{
            validator: checkAddress,
            trigger: 'blur'
          }],
          cover: [{
            validator: checkCover,
            trigger: 'blur'
          }],
        },
        isEdit: false,
        global: this.global.base,
        pageInfo: {
          page: 1,
          pageSize: 6,
        },
        totalPage: 0,
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        this.getNewsListByUId()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        this.getNewsListByUId()
      },
      async getNewsListByUId() {
        const res = await this.$axios('news/getMyNews', {
          user_no: localStorage.getItem('id'),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.newsList = res.data.data
          //console.log(res)
        } else {
          this.newsList = null
          this.$message.warning(res.data.message)
        }
      },
      edit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('news/update', this.editForm)
            if (res.status === 200 && res.data.success) {
              this.isEdit = false
              this.getNewsListByUId()
              this.$message.success('更新成功！管理员将会进行审核！')
              this.$alert('管理员将会在三个工作日内审核完成！请保持关注')
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      toEdit(news) {
        this.isEdit = true
        this.editForm = JSON.parse(JSON.stringify(news))
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        this.editForm.cover = response.data
      },

      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
    },
    created() {
      this.getNewsListByUId()
    }
  }
</script>
<style scoped lang="less">
  .news-wrapper {
    .news {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      /deep/.el-pager li.active,
      /deep/.el-pager li:hover {
        color: #DD2020;
      }
    }
  }
</style>