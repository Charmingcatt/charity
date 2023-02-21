<template>
  <div class="notice-wrapper">
    <div class="notice-info" v-if="notice">
      <h4>{{notice.title}}</h4>
      <el-divider />
      <div class="bottom">
        <span><i class=el-icon-date></i>{{notice.created}}</span>
        <span>发布人：{{notice.username}}</span>
      </div>
      <el-image :src="global+'upload/'+notice.cover" style="width:300px;height:160px"></el-image>
      <p>{{notice.description}}</p><br />
      <div class="markdown-body" v-html="notice.content_html" />
    </div>
    <el-empty class="not-found" style="margin:0 300px" v-else description="暂无数据" :image-size="280"></el-empty>
  </div>
</template>

<script>
  import "mavon-editor/dist/css/index.css";
  export default {
    name: 'notice',
    data() {
      return {
        notice: null,
        id: null,
        global: this.global.base
      }
    },
    watch: {
      $route() {
        if (this.$route.query.id !== this.id) {
          this.id = this.$route.query.id
          this.getNoticeInfo()
        }
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getNoticeInfo()
    },
    methods: {
      async getNoticeInfo() {
        const res = await this.$axios('/notice/getNoticeById?id=' + this.id)
        if (res.status === 200 && res.data.code === 200) {
          //this.$message.success(res.data.message)
          this.notice = res.data.data
          //console.log(res.data.data)
        } else {
          this.notice = null
          this.$message.warning(res.data.message)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .notice-wrapper {
    margin: 1rem 4rem;
    min-height: 22rem;
    display: flex;
    justify-content: center;

    .el-empty {
      margin: 0 !important;
    }

    .markdown-body {
      width: 80%;
    }

    .not-found {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 20rem;
      width: 100%;
    }

    .notice-info {
      // margin: 0 5rem;
      // width: 50rem;
      margin: 0 5rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 100%;

      /deep/.v-show-content,
      .scroll-style,
      .scroll-style-border-radius {
        background-color: rgba(123, 200, 241, 0.1) !important;
      }

      .bottom {
        span {
          display: inline-block;
          margin: 0 1rem 1rem 1rem;
        }

        color: gray !important;
        font-size: 0.9rem;
      }
    }
  }
</style>