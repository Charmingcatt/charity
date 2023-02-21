<template>
  <div class="apply">
    <el-card>
      <div slot="header">
        <div slot="header" class="header clearfix">
          <h4>我的申请</h4>
          <div class="op">
            <el-button type="primary" plain @click="toAdd()">新建申请</el-button>
          </div>
        </div>
      </div>
      <div class="introduce">
        <h4>申请说明：</h4>
        <div class="intro">
          <p>用户您好，您可以申请：<br>
            <span>1.提现公益捐款</span><br>
            <!-- <span>2.实名认证</span> -->
          </p>
          <h4>基本流程如下：</h4>
          <div class="step">
            <el-steps :space="200">
              <el-step title="管理员审核用户账号" icon="el-icon-user"></el-step>
              <el-step title="管理员审核公益账单" icon="el-icon-upload"></el-step>
              <el-step title="处理用户申请事宜" icon="el-icon-picture"></el-step>
              <el-step title="完成申请" icon="el-icon-success"></el-step>
            </el-steps>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <h4>申请列表</h4>
      </div>
      <div class="list" v-if="applyList">
        <el-table :data="applyList" stripe style="width: 100%">
          <el-table-column prop="name" label="申请名称">
          </el-table-column>
          <el-table-column label="提现金额" prop="money">
          </el-table-column>
          <el-table-column label="描述" prop="description">
          </el-table-column>
          <el-table-column label="银行卡号" prop="bank">
          </el-table-column>
          <el-table-column prop="created" label="申请时间">
          </el-table-column>
          <el-table-column prop="welf_name" label="公益项目">
          </el-table-column>
          <el-table-column prop="updated" label="状态更改时间">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===0" style="color:#409eff">未审核</span>
              <span v-else-if="scope.row.status===1" style="color:red">未通过审核</span>
              <span v-else-if="scope.row.status===2" style="color:orange">审核用户账号</span>
              <span v-else-if="scope.row.status===3" style="color:orange">审核账单</span>
              <span v-else style="color:green">审核通过</span>
            </template>
          </el-table-column>
          <el-table-column label="审核结果描述" prop="res">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <div class="op">
                <el-button size="mini" plain v-if="scope.row.status===0" type="primary" @click="toEdit(scope.row)">修改
                </el-button>
                <el-button size="mini" plain type="danger" @click="remove(scope.row.no)">删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.page" :page-sizes="[4, 5, 6, 7]" :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-card>
    <el-dialog title="修改申请" :visible.sync="isEdit" width="700px">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入申请名称"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bank">
          <el-input v-model="editForm.bank"></el-input>
        </el-form-item>
        <el-form-item label="申请描述" prop="description">
          <el-input type="textarea" v-model="editForm.description" autosize
            placeholder="请输入10-200描述，例如：xxx申请提现xxx公益项目的xxx捐赠基金" minlength="10" maxlength="200" show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button @click="()=>{isEdit=false}">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加申请" :visible.sync="isAdd" width="500px">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入申请名称"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input type="number" v-model="addForm.money" readonly></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="bank">
          <el-input v-model="addForm.bank"></el-input>
        </el-form-item>
        <el-form-item label="公益项目" prop="welf_no">
          <el-select v-model="addForm.welf_no" @change="getMoney()">
            <el-option v-for="welfare in welfareList" :key="welfare.no" :label="welfare.name" :value="welfare.no">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请描述" prop="description">
          <el-input type="textarea" v-model="addForm.description" autosize
            placeholder="请输入10-200描述，例如：xxx申请提现xxx公益项目的xxx捐赠基金" minlength="10" maxlength="200" show-word-limit>
          </el-input>
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
    name: 'apply',
    data() {
      var checkName = (rule, value, callback) => {
        const regName = /(.){4,20}/;
        if (value.length == 0) {
          callback(new Error("申请名称不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("申请名称为4到20位的字符"));
        } else {
          return callback();
        }
      };
      var checkDes = (rule, value, callback) => {
        const regName = /(.){10,200}/;
        if (value === '') {
          callback(new Error("描述不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("描述为10到20位的字符"));
        } else {
          return callback();
        }
      };
      var checkWelf = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请选择公益项目"));
        } else {
          return callback();
        }
      };
      var checkBank = (rule, value, callback) => {
        const regName = /^([1-9]{1})(\d{14}|\d{18})$/;
        if (value === '') {
          callback(new Error("请输入银行卡号"));
        } else if (!regName.test(value.replace(/\s/g, ''))) {
          callback(new Error("请输入正确的银行卡号格式！"));
        } else {
          return callback();
        }
      };
      return {
        editForm: {
          name: '',
          bank: '',
          description: ''
        },
        applyList: null,
        rules: {
          name: [{
            validator: checkName,
            trigger: 'blur'
          }],
          description: [{
            validator: checkDes,
            trigger: 'blur'
          }],

          welf_no: [{
            validator: checkWelf,
            trigger: 'blur'
          }],
          bank: [{
            validator: checkBank,
            trigger: 'blur'
          }]
        },
        isEdit: false,
        welfareList: null,
        isAdd: false,
        addForm: {
          name: '',
          money: '',
          description: '',
          welf_no: '',
          bank: '',
          user_name: localStorage.getItem('username')
        },
        pageInfo: {
          page: 1,
          pageSize: 4,
        },
        totalPage: 0,
        isSearch: false
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getApplyList()
        // else this.getByStatus()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getApplyList()
        // else this.getByStatus()
      },
      async getApplyList() {
        this.isSearch = false
        const res = await this.$axios.post('apply/getByUId', {
          user_no: localStorage.getItem('id'),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize,
        })
        if (res.status === 200 && res.data.success) {
          this.applyList = res.data.data.list
          this.totalPage = res.data.data.total
        } else {
          //this.$message.warning(res.data.message)
          this.applyList = null
        }
      },
      async getWelfaresByUId() {
        const res = await this.$axios('welfare/getEndByUId?user_no=' + localStorage.getItem('id'))
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.welfareList = res.data.data
          //console.log(this.welfareList)
        } else {
          //this.$message.error(res.data.message)
        }
      },
      async getMoney() {
        if (this.addForm.welf_no !== '') {
          const res = await this.$axios('welfare/getWelfareById?id=' + this.addForm.welf_no)
          if (res.status === 200 && res.data.success) {
            this.addForm.money = res.data.data.has
          } else {
            this.welfare = null
            //this.$message.warning(res.data.message)
          }
        }

      },
      add(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.addForm.user_no = localStorage.getItem('id')
            const res = await this.$axios.post('apply/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.isAdd = false
              this.addForm = {}
              this.getApplyList()
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
      edit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('apply/update', this.editForm)
            if (res.status === 200 && res.data.success) {
              this.isEdit = false
              this.editForm = {}
              this.getApplyList()
              this.$message.success('修改成功！')
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      toEdit(apply) {
        this.isEdit = true
        this.editForm = JSON.parse(JSON.stringify(apply))
      },
      remove(id) {
        this.$confirm("确认删除",
          "确认删除吗？操作不可逆！", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
          const res = await this.$axios('apply/delete?id=' + id)
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            this.getApplyList()
            this.$message.success('删除成功！')
          } else {
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.warning("已取消删除！");
        })
      },
      toAdd() {
        this.isAdd = true
        this.getWelfaresByUId()
      }
    },
    created() {
      this.getApplyList()
    }
  }
</script>
<style scoped lang="less">
  .apply {
    /deep/.el-card {
      margin-bottom: 10px;
    }

    .list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      /deep/.el-pager li.active,
      /deep/.el-pager li:hover {
        color: #DD2020;
      }

    }

    .header {
      display: flex;
      justify-content: space-between;
    }

    .introduce {
      .intro {
        p {
          margin: 10px 0;

          span {
            display: inline-block;
            margin: 5px;
            color: brown;
          }
        }

        .step {
          display: flex;
          justify-content: center;
          width: 800px;

          /deep/.el-step {
            flex-shrink: 0;
          }

          /deep/.el-step__head.is-wait,
          /deep/.el-step__title.is-wait {
            color: #409eff;
            border-color: #409eff;
          }

          /deep/.el-step__line {
            background-color: #409eff;
          }
        }


      }
    }
  }
</style>