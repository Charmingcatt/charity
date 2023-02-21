<template>
  <div class="center">
    <el-card class="box-card">
      <div slot="header" class="header clearfix">
        <div class="user-info">
          <el-avatar :src="global+'upload/'+user.thumb"></el-avatar>
          <span style="margin-right:1rem">{{user.username}}</span>
          <span class="money">捐赠金额：<span>{{user.money}}</span>元</span>
          <span class="count">捐助次数：<span>{{user.times}}</span>次</span>
        </div>
      </div>
      <div class="info">
        <div class="base">
          <div class="item">
            <span class="label">违规次数：</span>
            <span class="value" style="color:red">{{count}}</span>
          </div>
          <div class="item">
            <span class="label">公开募捐资格证书：</span>
            <el-popover class="value" v-if="user.certification!==null" placement="top-start" trigger="hover">
              <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="global+'upload/'+user.certification" target="_blank" title="查看最大化图片">
                <img :src="global+'upload/'+user.certification" style="width: 400px;height: 260px">
              </a>
              <el-image slot="reference" :src="global+'upload/'+user.certification"
                style="width: 200px;height: 100px; cursor:pointer"></el-image>
            </el-popover>
            <span class="value" v-else style="color:red">未上传</span>
          </div>
          <div class="item">
            <span class="label">身份证照片</span>
            <el-popover class="value" v-if="user.idImage!==null" placement="top-start" trigger="hover">
              <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="global+'upload/'+user.idImage" target="_blank" title="查看最大化图片">
                <img :src="global+'upload/'+user.idImage" style="width: 400px;height: 260px">
              </a>
              <el-image slot="reference" :src="global+'upload/'+user.idImage"
                style="width: 200px;height: 100px; cursor:pointer"></el-image>
            </el-popover>
            <span class="value" v-else style="color:red">未上传</span>
          </div>
          <div class="item">
            <span class="label">昵称：</span>
            <span class="value">{{user.username}}</span>
          </div>
          <div class="item">
            <span class="label">性别：</span>
            <span class="value">{{user.sex}}</span>
          </div>
          <div class="item">
            <span class="label">地址：</span>
            <span class="value">{{user.address}}</span>
          </div>
          <div class="item">
            <span class="label">微信：</span>
            <span class="value">{{user.wechat}}</span>
          </div>
          <div class="item">
            <span class="label">邮箱：</span>
            <span class="value">{{user.email}}</span>
          </div>
          <div class="item">
            <span class="label">真实姓名：</span>
            <span class="value">{{user.real_name}}</span>
          </div>
          <div class="item">
            <span class="label">联系电话：</span>
            <span class="value">{{user.tel}}</span>
          </div>
          <div class="item">
            <span class="label">出生日期：</span>
            <span class="value">{{user.birthday}}</span>
          </div>
          <div class="item">
            <span class="label">身份证号：</span>
            <span class="value">{{user.id}}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'center',
    data() {
      return {
        id: '',
        user: null,
        global: this.global.base,
        count: 0
      }
    },
    methods: {
      async getUser() {
        const res = await this.$axios('user/getUserById?id=' + this.id)
        if (res.status === 200 && res.data.success) {
          this.user = res.data.data
          console.log(this.user.thumb)
        } else {
          this.$message.error(res.data.message)
        }
      },
      async getCount() {
        const res = await this.$axios('/welfare/getNotWelfareCount?user_no=' + this.user.no)
        //console.log(res)
        if (res.status === 200) {
          //this.count[id] = res.data.data
          this.count = res.data.data
          // console.log(this.count[id])
          // this.$forceUpdate()

        } else {
          this.$message.error('获取失败!')
        }
      },
    },
    created() {
      //console.log(this.$route)
      this.id = this.$route.query.id
      this.getUser()
    }
  }
</script>
<style scoped lang="less">
  .center {
    .header {
      display: flex;
      justify-content: space-between;

      .op {
        .item {
          font-size: 1rem;
          margin: 0 30px;
        }

      }

      .user-info {
        display: flex;
        align-items: baseline;

        .count,
        .money {
          margin-left: 1rem;

          span {
            color: orangered;
          }
        }
      }
    }

    .info {
      .base {
        padding-bottom: 10px !important;

        .item {
          margin-top: 30px;

          .label {
            color: #333;
            display: inline-block;
            text-align: right;
            width: 150px;
          }

          .value {
            color: #666;
            padding-left: 50px;
          }

          /deep/.upload-demo {
            display: inline-block !important;
          }
        }
      }
    }
  }
</style>