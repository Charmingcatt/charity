<template>
  <div class="news">
    <router-link :to="{path:'news',query:{
          id:news.no
        }}">
      <div class="image-box">
        <el-image class="image" :src="global+'upload/'+news.cover" fit="cover"></el-image>
      </div>
    </router-link>
    <div class="content">
      <router-link :to="{path:'news',query:{
          id:news.no
        }}">
        <h4>{{news.title}}</h4>
      </router-link>
      <p class="text"> &nbsp; &nbsp;{{news.description}}</p>
      <div class='bottom'>
        <span><i class=el-icon-date></i>{{news.created}}</span>
        <router-link to="">发布人：{{news.username}}</router-link>
        <span>{{news.address}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "News-item",
    props: ['mynew'],
    data() {
      return {
        news: this.mynew,
        global: this.global.base
      }
    }
  }
</script>

<style scoped lang="less">
  .news {
    width: 37rem;
    height: 12rem;
    margin: 0.4rem;
    position: relative;
    overflow: hidden;

    .content {
      padding: 0 1rem;

      .text {
        margin: 1rem 0 1rem 0;
        width: 23rem;
        text-overflow: ellipsis;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }

      .bottom {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        width: 24rem;
        margin-left: 11rem;
        color: gray !important;
      }
    }

    .image-box {
      width: 12rem;
      height: 12rem;
      float: left;
      margin-right: 0.4rem;
    }

    /deep/.el-image {
      width: 12rem;
      height: 12rem;
      border-radius: 0.3rem;
    }
  }
</style>