<template>
  <div class="rotationList">
    <div class="header">
      <el-button type="primary" @click="()=>{isAdd = true}" plain>添加</el-button>
      <div class="search">
        <el-input type="text" placeholder="请输入用户名或轮播图描述" v-model="searchMsg"></el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="rotationList" border>
        <el-table-column fixed prop="no" label="编号" sortable width="80">
        </el-table-column>
        <el-table-column prop="username" label="创建人" width="120">
        </el-table-column>
        <el-table-column prop="url" label="图片">
          <template slot-scope="scope">
            <el-popover class="value" placement="top-start" trigger="hover">
              <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="global+'upload/'+scope.row.url" target="_blank" title="查看最大化图片">
                <img :src="global+'upload/'+scope.row.url" style="width: 400px;height: 260px">
              </a>
              <el-image slot="reference" :src="global+'upload/'+scope.row.url"
                style="cursor:pointer;width:120px;height:80px"></el-image>
            </el-popover>
            <!-- <el-image :src="global+'upload/'+scope.row.url" style="width:140px;height:80px"></el-image> -->
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="140">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row)" type="primary" icon="el-icon-edit" circle>
            </el-button>
            <el-button @click="remove(scope.row.no)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.page"
        :page-sizes="[3, 4, 5, 6]" :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
    <el-dialog title="添加轮播图" :visible.sync="isAdd" width="600px">
      <el-form :model="addForm" ref="addForm" label-width="100px" :rules="rules">
        <el-form-item label="图片描述" prop="description">
          <el-input v-model="addForm.description" type="text"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <el-image :src="global+'upload/'+addForm.url" style="width:100px;height:50px"></el-image>
          <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button type="primary" @click="add('addForm')">添加</el-button>
        <el-button @click="()=>{isAdd = false}">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加轮播图" :visible.sync="isEdit" width="600px">
      <el-form :model="editForm" ref="editForm" label-width="100px" :rules="rules">
        <el-form-item label="图片描述" prop="description">
          <el-input v-model="editForm.description" type="text"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <el-image :src="global+'upload/'+editForm.url" style="width:100px;height:50px"></el-image>
          <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button type="primary" @click="edit('editForm')">修改</el-button>
        <el-button @click="()=>{isEdit = false}">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'userList',
    data() {
      var checkdes = (rule, value, callback) => {
        if (value.length == 0) {
          callback(new Error("描述不能为空"));
        }
        return callback();
      };
      return {
        rotationList: [],
        isAdd: false,
        searchMsg: '',
        addForm: {
          created: '',
          user_no: localStorage.getItem('id'),
          description: '',
          url: '',
        },
        editForm: {
          created: '',
          user_no: '',
          description: '',
          url: '',
        },
        fileList: [],
        global: this.global.base,
        rules: {
          description: [{
            validator: checkdes,
            trigger: "blur",
          }, ]
        },
        isEdit: false,
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
        if (this.isSearch) this.search()
        else this.getRotateList()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (this.isSearch) this.search()
        else this.getRotateList()
      },
      async getRotateList() {
        this.isSearch = false
        const res = await this.$axios.post('/rotate/list', {
          isPage: 2,
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        //console.log(res)
        if (res.status === 200) {
          this.rotationList = res.data.data.list
          this.totalPage = res.data.data.total
          //console.log(res.data.data)
        } else {
          this.rotationList = null
          this.$message.error('获取失败!')
        }
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        if (this.isEdit) this.editForm.url = response.data
        this.addForm.url = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      remove(id) {
        this.$confirm("确认删除",
          "确认删除吗？操作不可逆！", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
          }).then(async () => {
          const res = await this.$axios('/rotate/delete?id=' + id)
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            this.$message.success('删除成功')
            this.getRotateList()
          } else {
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.warning("已取消删除!");
        })
      },
      async search() {
        this.isSearch = true
        const res = await this.$axios.post('/rotate/search?', {
          message: this.searchMsg.replace(/\s/g, ''),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.rotationList = res.data.data.list
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
      async add(formName) {
        console.log(this.addForm)
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('/rotate/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.$message.success('添加成功！')
              this.getRotateList()
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
      toEdit(rotate) {
        this.editForm = JSON.parse(JSON.stringify(rotate))
        this.isEdit = true
      },
      edit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('/rotate/update', this.editForm)
            if (res.status === 200 && res.data.success) {
              this.$message.success('修改成功！')
              this.getRotateList()
              this.isEdit = false
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }

        })
      }
    },
    created() {
      this.getRotateList()
    }
  }
</script>
<style scoped lang="less">
  .rotationList {
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