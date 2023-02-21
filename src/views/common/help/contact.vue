<template>
  <div class="contact-wrapper">
    <div class="contact-info">
      <h4>联系我们</h4>
      <el-divider />
      <div class="bottom">
        <span><i class=el-icon-date></i>2022-05-10</span>
        <span>地址：四川省成都市</span>
        <span>发布人：爱心公益网</span>
      </div>
      <el-image :src="global+'upload/'+'466cbdc3-37d4-4eb3-bc24-789bda607b2d.jpg'"></el-image>
      <div class="content">
        <div>爱心公益网站 </div>
        <div><span>合作捐赠：</span>xxx-xxxxxx</div>
        <div><span>事务咨询：</span>xxx-xxxxxx</div>
        <div><span>地 址：</span>四川省成都市xxxxxxx </div>
        <div><span>邮 编：</span>xxxxxx </div>
        <div><span>传 真：</span>xxx-xxxxxxx</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'contact',
    data() {
      return {
        global: this.global.base
      }
    }
  }
</script>

<style scoped lang="less">
  .contact-wrapper {
    margin: 1rem 4rem;
    min-height: 20rem;
    display: flex;

    .not-found {
      text-align: center;
      margin: 0 auto;
    }

    .contact-info {
      margin: 0 auto;
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .content {
        width: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        //justify-content: center;
        // align-items: center;

        div {
          margin: 15px 0;
          width: 100%;

          span {
            color: gray;
          }
        }
      }

      /deep/.el-image__inner {
        width: 46rem;
        height: 20rem;
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