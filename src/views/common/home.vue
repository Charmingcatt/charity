<template>
  <div class="home">
    <el-backtop target=".home" :bottom="100" :visibility-height="50">
      <div style="{
        height: 100%;
        width: 100%;
        background-color: #DD2020;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: white;
        border-radius:10px;
      }">
        UP
      </div>
    </el-backtop>
    <Header />
    <div class="main">
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue'
  import Footer from '@/components/Footer.vue'

  export default {
    name: "Home",
    components: {
      Header,
      Footer
    }
  }
</script>

<style scoped lang="less">
  .home {
    width: 100%;
    height: 100%;
    overflow: auto;

    // .main {
    //   width: 100%;
    //   height: 100%;
    // }
  }
</style>