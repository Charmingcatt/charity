<template>
  <div class="edit">
    <el-card>
      <div slot="header">
        <h4>修改公告内容</h4>
      </div>
      <el-form :model="noticeForm" ref="noticeForm" label-width="40px" label-position="left" class="form">
        <el-form-item label="标题" prop="title">
          <el-input v-model="noticeForm.title" type="text"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-image :src="global+'upload/'+noticeForm.cover" style="width:255px;height:130px;"></el-image>
          <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>上传封面</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item prop="content" class="center">
          <mavon-editor ref="md" placeholder="请输入公告内容..." :boxShadow="false"
            style="z-index:1;border: 1px solid #d9d9d9;height:35rem" v-model="noticeForm.content" @imgAdd="$imgAdd"
            @change="change" />
        </el-form-item>
        <el-form-item class="center">
          <el-button type="primary" @click="edit()">修改</el-button>
          <el-button @click="()=>{this.$router.go(-1)}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>
<script>
  export default {
    name: 'editNotice',
    data() {
      return {
        noticeForm: {
          content: '',
          content_html: '',
          title: '',
          cover: ''
        },
        global: this.global.base,
        fileList: []
      }
    },
    methods: {
      async getNotice() {
        const res = await this.$axios('/notice/getNoticeById?id=' + this.$route.params.id)
        console.log(res)
        if (res.status === 200 && res.data.code === 200) {
          this.noticeForm = res.data.data
          //console.log(res)
        } else {
          this.$message.error(res.data.message)
        }
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        this.noticeForm.cover = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      async edit() {
        //console.log(this.newForm)
        const res = await this.$axios.post('/notice/update', this.noticeForm)
        if (res.status === 200 && res.data.success) {
          this.$message.success(res.data.message)
          this.$router.push('/admin/notice')
          //this.$router.push('/admin/news')
        } else {
          this.$message.error('修改失败！')
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
        this.noticeForm.content_html = render;
        //console.log(this.newForm.content)
      },
    },
    created() {
      this.getNotice()
    }
  }
</script>
<style scoped lang="less">
  .edit {
    .center {
      display: flex;
      justify-content: center;
    }

    /deep/.el-form-item__content {
      margin: 0 !important;
    }
  }
</style>