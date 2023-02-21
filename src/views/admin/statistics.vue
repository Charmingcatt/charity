<template>
  <div class="wrapper">
    <h2>捐赠总金额：<span>{{total}}元</span></h2>
    <div id="statistics"></div>
  </div>
</template>

<script>
  export default {
    name: 'statistics',
    data() {
      return {
        total: 0,
        newsCount: 0,
        welfareCount: 0,
        donationCount: 0,
        userCount: 0,
        applyCount: 0,
        teamCount: 0,
        noticeCount: 0,
        myChart: null
      };
    },
    mounted() {
      this.myecharts()
    },
    methods: {
      myecharts() {
        this.myChart = this.$echarts.init(document.getElementById('statistics'), 'walden');
        // 指定图表的配置项和数据
        this.myChart.setOption({
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          title: {
            text: '爱心公益网站统计',
            subtext: '数量统计',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          series: [{
            name: '爱心公益网站统计',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            label: {
              show: true
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: [ // 数据数组，name 为数据项名称，value 为数据项值

            ]
          }]
        })
        this.myChart.showLoading()
      },
      async getTotal() {
        const res = await this.$axios('/donation/getTotal')
        if (res.status === 200 && res.data.success) {
          this.total = res.data.data
        } else {
          this.$message.error('获取捐赠总金额失败')
        }
      },
      async getAll() {
        const res = await this.$axios('/user/getAllCount')
        if (res.status === 200 && res.data.success) {
          this.myChart.setOption({
            series: [{
              data: [{
                  value: res.data.data.donationCount,
                  name: '捐赠订单'
                },
                {
                  value: res.data.data.teamCount,
                  name: '爱心联盟'
                },
                {
                  value: res.data.data.userCount,
                  name: '用户'
                },
                {
                  value: res.data.data.welfareCount,
                  name: '公益项目'
                },
                {
                  value: res.data.data.newsCount,
                  name: '新闻资讯'
                },
                {
                  value: res.data.data.noticeCount,
                  name: '系统公告'
                },
                {
                  value: res.data.data.applyCount,
                  name: '申请'
                }
              ]
            }]

          })
          // this.donationCount = res.data.data.donationCount
          // this.userCount = res.data.data.userCount
          // this.welfareCount = res.data.data.welfareCount
          // this.newsCount = res.data.data.newsCount
          // this.teamCount = res.data.data.teamCount
          // this.noticeCount = res.data.data.noticeCount
          // this.applyCount = res.data.data.applyCount
          // console.log(this.donationCount)
          this.myChart.hideLoading();
        }
      }
    },
    created() {
      this.getTotal()
      this.getAll()
    }
  };
</script>

<style scoped lang="less">
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;


    h2 {
      span {
        color: #DD2020;
        font-style: italic;
      }
    }

    #statistics {
      margin: 1rem 0;
      width: 65rem;
      height: 30rem;
    }
  }
</style>