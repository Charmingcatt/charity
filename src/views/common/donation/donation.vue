<template>
  <div class="donation">
    <div class="header">
      <el-card class="box-card">
        <div slot="header">
          <h4>输入搜索条件</h4>
        </div>
        <el-form ref="searchForm" :model="searchForm" label-width="180px">
          <el-form-item label="时间范围">
            <el-date-picker v-model="range" type="daterange" align="right" unlink-panels range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="捐赠人/企业" prop="username" style="width:450px;">
            <el-input v-model="searchForm.username" placeholder="请输入姓名/企业名称"></el-input>
          </el-form-item>
          <el-form-item label="捐赠项目" prop="welf_no" style="width:450px;">
            <el-input v-model="searchForm.welf_name" placeholder="请输入公益名称"></el-input>
          </el-form-item>
          <el-form-item label="金额范围" style="width:450px;">
            <el-input type="number" v-model="searchForm.startMoney" placeholder="请输入开始金额">
            </el-input>至
            <el-input type="number" v-model="searchForm.endMoney" placeholder="请输入结束金额"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="result">
        <div slot="header">
          <h4>搜索结果</h4>
        </div>
        <div v-if="donationList">
          <span class="total">在线捐赠共：<span class="money">{{total}}元</span></span>
          <div class="data" style="display:flex;flex-direction:column;align-items: center;">
            <el-table :data="donationList" stripe style="width: 100%">
              <el-table-column prop="created" label="时间">
              </el-table-column>
              <el-table-column prop="money" label="金额">
                <template slot-scope="scope">
                  <span style="color:green">{{scope.row.money}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="username" label="捐赠人">
                <template slot-scope="scope">
                  {{scope.row.isHide?scope.row.username:'爱心人士'}}
                </template>
              </el-table-column>
              <el-table-column prop="bank" label="捐赠银行">
              </el-table-column>
              <el-table-column prop="way" label="捐赠方式">
              </el-table-column>
              <el-table-column label="捐赠公益" prop="welfare_name">
              </el-table-column>
              <el-table-column prop="comment" label="爱心留言">
              </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="pageInfo.page" :page-sizes="[5, 10, 15, 20]" :page-size="pageInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>
          </div>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'donation',
    data() {
      return {
        donationList: null,
        range: ['1997-01-01', '2022-05-07'],
        total: 0,
        searchForm: {
          startTime: '',
          endTime: '',
          startMoney: 0,
          endMoney: 1000,
          username: '',
          welf_name: '',
          page: 1,
          pageSize: 5
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.searchForm.endTime;
            if (endDateVal) {
              return (time.getTime() > new Date(endDateVal).getTime() - 1 * 24 * 60 * 60 * 1000);
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.searchForm.startTime;
            if (beginDateVal) {
              return (time.getTime() < new Date(beginDateVal).getTime() + 1 * 24 * 60 * 60 * 1000);
            }
          }
        },
        pageInfo: {
          page: 1,
          pageSize: 5
        },
        totalPage: 0,
        isSearch: false
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        if (!this.isSearch) this.getDonationList()
        else this.search()
        //console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageInfo.page = val
        if (!this.isSearch) this.getDonationList()
        else this.search()
      },
      async getDonationList() {
        this.isSearch = false
        this.total = 0
        const res = await this.$axios.post('/donation/list', this.pageInfo)
        if (res.status === 200 && res.data.success) {
          this.donationList = res.data.data.list
          this.totalPage = res.data.data.total
          // console.log(res)
          this.donationList.map((donation) => {
            this.total += donation.money
            //console.log(this.total)
          })
        } else {
          this.$message.error(res.data.message)
        }
      },
      async search() {
        this.isSearch = true
        this.total = 0
        this.searchForm.startTime = this.range[0]
        this.searchForm.endTime = this.range[1]
        this.searchForm.username = this.searchForm.username.replace(/\s/g, '')
        this.searchForm.welf_name = this.searchForm.welf_name.replace(/\s/g, '')
        this.searchForm.page = this.pageInfo.page
        this.searchForm.pageSize = this.pageInfo.pageSize
        const res = await this.$axios.post('donation/search', this.searchForm)
        if (res.status === 200 && res.data.success) {
          console.log(res)
          this.donationList = res.data.data.list
          this.totalPage = res.data.data.total
          this.donationList.map((donation) => {
            this.total += donation.money
            //console.log(this.total)
          })
          //console.log(this.donationList)
        } else {
          this.donationList = null
          this.total = 0
          //this.$message.error(res.data.message)
        }
      }
    },
    created() {
      this.getDonationList()
    }
  }
</script>
<style scoped lang="less">
  .donation {
    margin: 20px 4rem;

    /deep/.el-pager li.active,
    /deep/.el-pager li:hover {
      color: #DD2020;
    }

    .result {
      .total {
        font-size: 1.6rem;

      }

      .money {
        color: #b70f0f;
        font-style: italic;
      }
    }

    /deep/.el-input__inner:focus {
      border-color: #DD2020 !important;
    }

    /deep/.el-button {
      background-color: #DD2020;
      width: 150px;
      color: white;
      margin-top: 15px;
      border-color: #DD2020;
    }

    /deep/.el-button:hover {
      background-color: #b70f0f;
    }

    /deep/.el-card {
      margin: 20px 0;
    }
  }
</style>