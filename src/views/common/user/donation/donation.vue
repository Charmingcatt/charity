<template>
  <div class="donation">
    <el-card class="list" v-show="!isInfo">
      <div class="header" slot="header">
        <h4>我的捐赠</h4>
        <div class="operation">
          <div class="type">
            <span>根据状态搜索</span>
            <el-select v-model="status" @change="getByStatus()">
              <el-option label="全部" :value="5"></el-option>
              <el-option label="未支付" :value="1"></el-option>
              <el-option label="已支付" :value="2"></el-option>
              <el-option label="已投入项目使用" :value="3"></el-option>
              <el-option label="已取消" :value="4"></el-option>
            </el-select>
          </div>
          <el-button type="primary" plain size="medium">
            <router-link to='/donation/add'>去捐赠</router-link>
          </el-button>
        </div>
      </div>
      <div class="data">
        <el-table :data="donations" style="width: 100%" stripe>
          <el-table-column prop="money" class="money" label="捐赠金额" sortable>
            <template slot-scope="scope">
              <span style="color:green">{{scope.row.money}}元</span>
            </template>
          </el-table-column>
          <el-table-column prop="welfare_name" label="捐赠项目">
          </el-table-column>
          <el-table-column prop="created" label="捐赠时间" sortable>
          </el-table-column>
          <el-table-column prop="comment" label="爱心留言">
          </el-table-column>
          <el-table-column prop="bank" label="捐赠银行">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span style="color:red" v-if="scope.row.status===1">未支付</span>
              <span style="color:#409EFF" v-else-if="scope.row.status===2">已支付</span>
              <span style="color:green" v-else-if="scope.row.status===3">已投入项目使用</span>
              <span style="color:#E6A23C" v-else-if="scope.row.status===4">已取消</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <div class="nopay" v-if="scope.row.status===1">
                <el-button size="mini" type="danger" plain @click="pay(scope.row)">支付
                </el-button>
                <el-button size="mini" type="primary" plain @click="cancel(scope.row)">取消
                </el-button>
              </div>
              <el-button v-if="scope.row.status===4" size="mini" type="danger" @click="remove(scope.row.no)">删除
              </el-button>
              <el-button size="mini" v-if="scope.row.status!==1" type="primary" plain @click="info(scope.row)">详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pageInfo.page" :page-sizes="[4, 5, 6, 7]" :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
        </el-pagination>
      </div>
    </el-card>
    <el-card class="info-wrapper" v-show="isInfo">
      <div slot="header" class="header">
        <h4>订单详情</h4>
        <el-button @click="back()" type="primary" size="medium" plain>全部订单</el-button>
      </div>
      <div class="info" v-if="donation">
        <div class="top">
          <h2>支付金额：{{donation.money}}</h2>
          <el-button class="welfare" type="warning" plain size="medium">
            <router-link :to="{path:'/welfare',query:{id:donation.welf_no}}">项目信息</router-link>
          </el-button>
        </div>
        <div class="main">
          <p><span>当前状态：</span>已支付</p>
          <p><span>收款机构：</span>爱心公益网站</p>
          <p><span>支付银行：</span>{{donation.bank}}</p>
          <p><span>支付时间：</span>{{donation.created}}</p>
          <p><span>支付方式：</span>{{donation.way}}</p>
          <p><span>订单号：</span>{{donation.no}}</p>
          <p><span>留言：</span>{{donation.comment}}</p>
        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'donation',
    data() {
      return {
        donations: null,
        isInfo: false,
        donation: null,
        status: 5,
        pageInfo: {
          page: 1,
          pageSize: 4,
        },
        totalPage: 0,
        isSearch: false
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getDonations()
        else this.getByStatus()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getDonations()
        else this.getByStatus()
      },
      back() {
        this.isInfo = false
      },
      async getByStatus() {
        this.isSearch = true
        if (this.status === 5) this.getDonations()
        else {
          const res = await this.$axios.post('/donation/getByUStatus', {
            status: this.status,
            user_no: localStorage.getItem('id'),
            page: this.pageInfo.page,
            pageSize: this.pageInfo.pageSize,
          })
          //console.log(res)
          if (res.status === 200 && res.data.success) {
            ///console.log(res.data.data)
            this.donations = res.data.data.list
            this.totalPage = res.data.data.total
            //this.$message.success('搜索成功！')
          } else {
            this.$message(res.data.message)
          }
        }
      },
      async getDonations() {
        this.isSearch = false
        const res = await this.$axios.post('donation/getByUid', {
          user_no: localStorage.getItem('id'),
          page: this.pageInfo.page,
          pageSize: this.pageInfo.pageSize
        })
        if (res.status === 200 && res.data.success) {
          this.donations = res.data.data.list
          this.totalPage = res.data.data.total
          //console.log(this.welfList)
        } else {
          this.donations = null
          this.$message.warning(res.data.message)
        }
      },
      remove(id) {
        this.$confirm(
            "确定删除吗：",
            "确定删除吗：", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
          .then(async () => {
            const res = await this.$axios('donation/delete?no=' + id)
            if (res.status === 200 && res.data.success) {
              this.$message.success('删除成功！')
              this.getDonations()
              //console.log(this.welfList)
            } else {
              //this.donations = null
              this.$message.warning(res.data.message)
            }
          }).catch(() => {
            this.$message.warning('已取消删除！')
          })
      },
      async pay(donation) {
        sessionStorage.clear();
        //进这个页面直接获取支付宝表单，保持页面计时和支付宝超时时间 一致
        console.log(donation)
        const res = await this.$axios.post("Alipay/PayPage", donation);
        if (res.status !== 200) return this.$message.error("获取支付宝表单失败！");
        //将支付宝返回的表单信息写入sessionStorage，再打开新标签页，读取支付宝二维码
        sessionStorage.setItem("payaction", res.data.data);
        const res1 = await this.$axios.get("donation/getById?no=" + donation.no);
        if (res1.status === 200 && res1.data.data.status === 2) {
          this.$message.success("付款成功！");
          setTimeout(() => {
            this.$router.push("/");
          }, 1000);
        } else if (res1.data.data.status === 3) {
          this.$message.warning("订单已失效，请重新选择!");
          this.$router.push("/donation/add");
          return;
        }
        if (this.minutes === 0 && this.seconds === 0) {
          console.log("失败");
        } else {
          this.active++
          window.open("/pay", "_blank");
          this.$confirm(
              "付款完成前请不要关闭此窗口，完成付款后请根据您的情况点击下面的按钮：",
              "请您在新打开的页面上完成付款。", {
                confirmButtonText: "已完成付款",
                cancelButtonText: "付款遇到问题",
                type: "warning",
              }
            )
            .then(async () => {
              const res2 = await this.$axios.get("donation/getById?no=" + donation.no);
              if (res2.status == 200 && res2.data.data.status === 2) {
                this.active++
                setTimeout(() => {}, 1000);
                this.$alert(
                  "感谢您的捐赠！!", {
                    confirmButtonText: "我知道了",
                    callback: () => {
                      this.$router.push("/");
                    },
                  }
                );
              } else {
                this.$message.error("支付失败，请重新支付！");
              }
            })
            .catch(() => {
              this.$message.warning("已取消支付!");
            });
        }
      },
      async info(donation) {
        this.donation = donation
        this.isInfo = true
      },
      async cancel(row) {
        const donation = JSON.parse(JSON.stringify(row))
        donation.status = 4
        const res = await this.$axios.post('/donation/update', donation)
        if (res.status === 200 && res.data.success) {
          this.$message.success('取消成功！')
          this.getDonations()
        } else {
          this.$message.error('取消失败')
        }
      }
    },
    created() {
      this.getDonations()
    }
  }
</script>
<style scoped lang="less">
  .donation {
    .data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      /deep/.el-pager li.active,
      /deep/.el-pager li:hover {
        color: #DD2020;
      }

    }

    .header {
      display: flex;
      justify-content: space-between;

      .operation {
        display: flex;
      }

      .type {
        margin: 0 20px;

        span {
          color: #009688;
          margin: 0 10px;
          font-weight: 600;
        }
      }

      a {
        color: #409EFF;
      }

      /deep/.el-button:hover a {
        color: white;
      }
    }

    .info-wrapper {

      .info {
        margin: 20px;

        .top {
          display: flex;
          width: 300px;
          justify-content: space-between;
        }

        p {
          margin: 20px 0;
          color: gray;

          span {
            margin-right: 50px;
          }
        }
      }
    }
  }
</style>