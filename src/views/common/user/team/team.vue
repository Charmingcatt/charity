<template>
  <div class="team">
    <el-card class="box-card">
      <h4>我的联盟</h4>
      <el-button type="primary" @click="()=>{isAdd=true}">创建联盟</el-button>
    </el-card>
    <el-card class="create">
      <div slot="header" class="clearfix">
        <h4>我创建的</h4>
      </div>
      <div class="info" v-if="createList!==null">
        <div class="item" v-for="team in createList" :key="team.no">
          <div class="image-box">
            <el-image class="image" :src="global+'upload/'+team.cover"></el-image>
          </div>
          <div class="right">
            <router-link :to="{path:'/teamInfo',query:{id:team.no}}">
              <h4>{{team.name}}</h4>
            </router-link>
            <span>创建时间：{{team.created}}</span>
            <span>人数：{{team.count}}</span>
            <div class="op">
              <el-button type="primary" icon="el-icon-edit" circle @click="toEdit(team)"> </el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="release(team.no)"></el-button>
            </div>
          </div>

        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-card>
    <el-card class="join">

      <div slot="header" class="clearfix">
        <h4>我加入的</h4>
      </div>
      <div class="info" v-if="joinList">
        <div class="item" v-for="team in joinList" :key="team.no">
          <div class="image-box">
            <el-image class="image" :src="global+'upload/'+team.cover"></el-image>
          </div>
          <div class="right">
            <router-link :to="{path:'/teamInfo',query:{id:team.no}}">
              <h4>{{team.name}}</h4>
            </router-link>
            <span><i class="el-icon-timer"></i>加入时间：{{user.join}}</span>
            <div class="op">
              <el-button @click="quit(team.no)">退出联盟</el-button>
            </div>
          </div>
        </div>
      </div>
      <router-link v-else to='/team'>还没有加入联盟哦！去联盟大厅看看>>></router-link>
    </el-card>
    <el-dialog title="修改联盟信息" :visible.sync="isEdit" width="600px">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入联盟名称"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="intro">
          <el-input type="textarea" autosize v-model="editForm.intro" placeholder="请输入内容" maxlength="200"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-image :src="global+'upload/'+editForm.cover" style="width:240px;height:160px;"></el-image>
          <el-upload ref="upload" class="upload-demo" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>上传封面</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
        <el-button @click="()=>{isEdit = false}">取 消</el-button>
        <el-button type="primary" @click="edit('editForm')">确 定</el-button>
      </span>
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
    name: 'team',
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
        createList: null,
        global: this.global.base,
        joinList: null,
        user: null,
        editForm: {
          user_no: '',
          name: '',
          intro: '',
          cover: ''
        },
        addForm: {
          user_no: '',
          name: '',
          intro: '',
          cover: ''
        },
        isEdit: false,
        isAdd: false,
        fileList: [],
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
        }
      }
    },
    methods: {
      async getCreate() {
        const res = await this.$axios('/team/getMyTeamByUId?user_no=' + localStorage.getItem('id'))
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.createList = res.data.data
        } else {
          this.createList = null
          this.$message.warning(res.data.message)
        }
      },
      async gerJoin() {
        const res = await this.$axios('/team/getTeamByUId?user_no=' + localStorage.getItem('id'))
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.joinList = res.data.data
        } else {
          this.joinList = null
          this.$message.warning(res.data.message)
        }
      },
      async getUser() {
        const res = await this.$axios('/user/getUserById?id=' + localStorage.getItem('id'))
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.user = res.data.data
          //console.log(new Date() - this.user.team_join)
          this.user.join = this.$moment(this.user.team_join, "YYYY-MM-DD").fromNow()
          //console.log(this.user.join)
        } else {
          this.createList = null
          this.$message.error(res.data.message)
        }
      },
      quit(team_no) {
        const obj = {
          team_no: team_no,
          user_no: this.user.no
        }
        this.$alert('确认退出吗？', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async () => {
          const res = await this.$axios.post('user/quit', JSON.stringify(obj))
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            this.$message.success('退出成功！')
            this.gerJoin()
          } else {
            this.$message.error(res.data.message)
          }
        })
      }, //上传图片
      handleSuccess(response) {
        //console.log(response)
        if (this.isEdit) this.editForm.cover = response.data
        else this.addForm.cover = response.data
      },

      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      edit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.isEdit = false
            const res = await this.$axios.post('team/update', this.editForm)
            if (res.status === 200 && res.data.success) {
              this.$message.success('修改成功！')
              this.getCreate()
              this.editForm = {}
              this.fileList = []
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      toEdit(team) {
        this.editForm = JSON.parse(JSON.stringify(team))
        this.isEdit = true
      },
      async release(no) {
        this.$confirm(
            "确定删除吗？", "确定删除吗？", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
          .then(async () => {
            const res = await this.$axios('team/delete?id=' + no)
            if (res.status === 200 && res.data.success) {
              this.$message.success('删除成功！')
              this.getCreate()
            } else {
              this.$message.error('删除失败！')
            }
          }).catch(() => {
            this.$message.warning('已取消删除！')
          })

      },
      add(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('team/insert', this.addForm)
            if (res.status === 200 && res.data.success) {
              this.isAdd = false
              this.$message.success('添加成功！')
              this.getCreate()
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

      }
    },
    created() {
      this.getUser()
      this.getCreate()
      this.gerJoin()
    }
  }
</script>
<style scoped lang="less">
  .team {
    .box-card {
      /deep/.el-card__body {
        display: flex;
        justify-content: space-between;
      }
    }

    .join {
      /deep/.el-button {
        width: 100px;
        background-color: #DD2020;
        color: white;
      }

      /deep/.el-button:hover {
        background-color: #b70f0f;
      }

    }

    .create,
    .join {
      margin: 10px 0;

      .info {

        .item {
          display: inline-block;
          margin: 8px 0;

          .right {
            padding: 0 5px;
            height: 110px;
            width: 175px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            span {
              font-size: 15px;
              color: grey;
            }
          }

          .image-box,
          .image {
            width: 151px;
            border-radius: 2px;
            height: 110px;
          }

          .image-box {
            float: left;
          }
        }
      }
    }
  }
</style>