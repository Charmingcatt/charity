<template>
  <div class="add">
    <el-card>
      <div slot="header">
        <h4>添加新闻</h4>
      </div>
      <!-- 添加 -->
      <div class="main">
        <el-form :model="newForm" ref="ruleForm" label-width="80px" label-position="left" class="form">
          <el-form-item label="标题" prop="title">
            <el-input v-model="newForm.title" type="text"></el-input>
          </el-form-item>
          <el-form-item label="新闻地址" prop="address">
            <el-input v-model="newForm.address" type="text"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <!-- <el-image :src="this.global+'upload/'+newForm.cover" style="width:300px;height:200px;"></el-image> -->
            <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
              list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList">
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
        </el-form>
        <mavon-editor ref="md" placeholder="请输入新闻内容..." :boxShadow="false"
          style="z-index:1;border: 1px solid #d9d9d9;height:35rem" v-model="newForm.content" @imgAdd="$imgAdd"
          @change="change" />
      </div>
      <div style="display:flex;justify-content:center">
        <el-button type="primary" @click="add()">添加</el-button>
        <el-button type="primary" plain @click="()=>{this.$router.go(-1)}">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'addNew',
    data() {
      return {
        newForm: {
          content: '',
          content_html: '',
          user_no: localStorage.getItem('id'),
          cover: '',
          team_no: '',
          welf_no: '',
          address: '',
          description: ''
        },
        global: this.global.base,
        fileList: []
      }
    },
    methods: {
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
      async add() {
        //console.log(this.newForm)
        const res = await this.$axios.post('/news/insert', this.newForm)
        if (res.status === 200 && res.data.success) {
          this.$message.success(res.data.message)
          this.$router.push('/admin/news')
          //this.$router.push('/admin/news')
        } else {
          this.$message.error('添加失败！')
          return false
        }
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
          console.log(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }

        this.$refs.md.$img2Url(pos, this.global + '/upload/' + res.data.data);
      },
      change(value, render) {
        // render 为 markdown 解析后的结果
        this.newForm.content_html = render;
        //console.log(this.newForm.content)
      },
    },
    created() {}
  }
</script>
<style scoped lang="less">
  .add {
    padding: 10px;

    .header {
      text-align: center;
      margin-bottom: 20px;
      color: #009688;
    }

    .main {
      .el-form {
        margin-right: 10px;
      }

      display: flex;
      justify-content: space-between;
    }
  }
</style>