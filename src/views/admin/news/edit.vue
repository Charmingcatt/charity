<template>
  <div class="edit">
    <el-card>
      <div slot="header">
        <h4>修改新闻内容</h4>
      </div>
      <el-form :model="newForm" ref="newForm" label-width="100px">
        <el-form-item prop="content">
          <mavon-editor ref="md" placeholder="请输入新闻内容..." :boxShadow="false"
            style="z-index:1;border: 1px solid #d9d9d9;height:35rem" v-model="newForm.content" @imgAdd="$imgAdd"
            @change="change" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit()">修改</el-button>
          <el-button type="primary" plain @click="()=>{this.$router.go(-1)}">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>
<script>
  export default {
    name: 'newsList',
    data() {
      return {
        newForm: {
          content: '',
          content_html: ''
        },
        global: this.global.base
      }
    },
    methods: {
      async getNew() {
        const res = await this.$axios('/news/getNewsById?id=' + this.$route.params.id)
        //console.log(res)
        if (res.status === 200 && res.data.code === 200) {
          this.newForm = res.data.data
          console.log(res)
        } else {
          this.$message.error(res.data.message)
        }
      },
      async edit() {
        //console.log(this.newForm)
        const res = await this.$axios.post('/news/update', this.newForm)
        if (res.status === 200 && res.data.success) {
          this.$message.success(res.data.message)
          this.$router.push('/admin/news')
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
        this.newForm.content_html = render;
        //console.log(this.newForm.content)
      },
    },
    created() {
      this.getNew()
    }
  }
</script>
<style scoped lang="less">
  .edit {
    .el-form-item {
      display: flex;
      justify-content: center;
    }

    /deep/.el-form-item__content {
      margin: 0 !important;
    }
  }
</style>