<template>
  <div class="work-wrapper">
    <el-card>
      <div slot="header" class="header">
        <h4>我的待办</h4>
        <span style="color:red">请及时提交审计报告哦！否则将会冻结账户！</span>
      </div>
      <div class="works" v-if="workList">
        <el-table :data="workList" stripe style="width: 100%">
          <el-table-column prop="name" label="公益名称">
          </el-table-column>
          <el-table-column label="目标金额">
            <template slot-scope="scope">
              <span style="color:green">{{scope.row.aim}}元</span>
            </template>
          </el-table-column>
          <el-table-column label="已筹金额">
            <template slot-scope="scope">
              <span style="color:green">{{scope.row.aim}}元</span>
            </template>
          </el-table-column>
          <el-table-column prop="updated" label="提现时间">
          </el-table-column>
          <el-table-column prop="rest" label="剩余时间（天）">
            <template slot-scope="scope">
              <span style="color:red">{{scope.row.rest}}天</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="op">
                <el-button type="danger" size="mini" plain @click="submitNew(scope.row)">提交审计报告
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-card>
    <el-dialog title="提交审计报告" :visible.sync="isAdd" width="700px">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="title">
          <el-input v-model="addForm.title" placeholder="请输入报告名称"></el-input>
        </el-form-item>
        <el-form-item label="捐赠地址" prop="address">
          <el-input type="address" v-model="addForm.address" placeholder="请输入捐赠地址"></el-input>
        </el-form-item>
        <el-form-item label="公益项目" prop="welf_name">
          <el-input type="text" v-model="addForm.welf_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="addForm.description" autosize placeholder="简述报告要点" minlength="0"
            maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addForm.content" autosize placeholder="描述报告基本内容" minlength="10"
            maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="报告单">
          <el-upload ref="upload" class="upload-demo" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList">
            <el-button size="small" type="primary" plain>上传报告单</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button @click="()=>{isAdd=false}">取 消</el-button>
        <el-button type="primary" @click="add('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'work',
    data() {
      return {
        workList: null,
        addForm: {
          title: '测试报告',
          welf_no: '',
          address: '测试地址',
          description: '测试描述',
          cover: '"3dc92456-9532-4056-9c40-a10f16bee344.jpg"',
          type: 1,
          welf_name: '',
          content: '测试内容'
        },
        fileList: [],
        rules: {},
        isAdd: false,
        global: this.global.base
      }
    },
    methods: {
      //获取未提交报告的公益
      async getNotWelfare() {
        const res = await this.$axios('welfare/getNotWelfare?user_no=' + localStorage.getItem('id'))
        if (res.status === 200 && res.data.success) {
          this.workList = res.data.data
          //console.log(res)
        } else {
          this.workList = null
          //this.$message.warning(res.data.message)
        }
      },
      add(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.addForm.user_no = localStorage.getItem('id')
            console.log(this.addForm)
            const res = await this.$axios.post('news/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.isAdd = false
              //this.addForm = {}
              this.getNotWelfare()
              this.$message.success('上传成功')
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
      submitNew(welfare) {
        this.isAdd = true
        this.addForm.welf_no = welfare.no
        this.addForm.welf_name = welfare.name
      },
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
    },
    created() {
      this.getNotWelfare()
    }
  }
</script>
<style scoped lang="less">
  .work-wrapper {
    .header {
      display: flex;
      justify-content: space-between;
    }
  }
</style>