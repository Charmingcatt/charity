<template>
  <div class="news-wrapper">
    <left-nav />
    <div class="news-info" v-if="mynew">
      <h4>{{mynew.title}}</h4>
      <el-divider />
      <div class="bottom">
        <span><i class=el-icon-date></i>{{mynew.created}}</span>
        <span>地址：{{mynew.address}}</span>
        <span>发布人：{{mynew.username}}</span>
      </div>
      <!-- <el-image :src="global+'upload/'+mynew.cover"></el-image> -->
      <p>{{mynew.description}}</p><br />
      <div class="markdown-body" v-html="mynew.content_html" />
    </div>
    <el-empty style="margin:0 300px" v-else description="暂无数据" :image-size=300></el-empty>
  </div>
</template>

<script>
  import LeftNav from '@/components/LeftNav.vue'
  import "mavon-editor/dist/css/index.css";
  import marked from 'marked'


  export default {
    components: {
      LeftNav
    },
    name: 'news',
    data() {
      return {
        mynew: null,
        id: null,
        global: this.global.base
      }
    },
    watch: {
      $route() {
        if (this.$route.query.id !== this.id) {
          this.id = this.$route.query.id
          this.getNewInfo()
        }
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getNewInfo()
    },
    methods: {
      async getNewInfo() {
        const res = await this.$axios('/news/getNewsById?id=' + this.id)
        if (res.status === 200 && res.data.code === 200) {
          //this.$message.success(res.data.message)
          this.mynew = res.data.data
          this.mynew.content = marked(this.mynew.content)
          //console.log(res.data.data)
        } else {
          this.mynew = null
          this.$message.warning(res.data.message)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .news-wrapper {
    margin: 1rem 4rem;
    min-height: 20rem;
    display: flex;

    .not-found {
      text-align: center;
      margin: 0 auto;
    }

    .news-info {
      margin: 0 5rem;
      width: 50rem;
      display: flex;
      align-items: center;
      flex-direction: column;

      /deep/.el-image__inner {
        width: 35rem;
        height: 1r5em;
      }

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