<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>
<script>
  export default {
    name: 'App',
    mounted() {
      //刷新页面时也会执行
      /*区分关闭和刷新，关闭退出登录 start*/
      window.onload = function () {
        if (!window.sessionStorage["tempFlag"]) {
          localStorage.clear()
          location.reload(); //不能省，强制跳到登陆页
        } else {
          window.sessionStorage.removeItem("tempFlag");
        }
      }
      window.onunload = function () {
        window.sessionStorage["tempFlag"] = true;
      }
      window.onbeforeunload = function () {
        window.sessionStorage["tempFlag"] = true;
      }
    }

  }
</script>
<style lang="less">
  #app {
    background-image: url('./assets/eg1.webp');
    // border-bottom:1px solid rgb(233, 230, 230);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    min-width: 1366px;

    /deep/.el-pager li.active,
    /deep/.el-pager li:hover {
      color: #DD2020 !important;
    }

    * {
      box-sizing: border-box;
    }

    .form {
      .el-input {
        width: 16rem !important;
      }

      .el-form {
        margin: 0 !important;
        padding: 0 !important;
      }

      .el-textarea {
        width: 20rem;
      }
    }

    .el-table__cell {
      text-align: center !important;
      ;
    }

    .image-box {
      overflow: hidden;
    }

    .image:hover {
      transform: scale(1.2);
      transition: all 0.7s;
    }

    .el-menu-item,
    .el-submenu__title {
      text-align: center !important;
    }

    .el-card__header {
      h4:before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: #ff6547;
        left: 10px;
        top: 20px;
        margin-right: 3px;
      }
    }

  }
</style>