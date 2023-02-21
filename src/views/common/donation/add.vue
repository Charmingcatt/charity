<template>
  <div class="donation">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="选择捐款项目">
      </el-step>
      <el-step title="在线支付"></el-step>
      <el-step title="完成捐款"></el-step>
    </el-steps>
    <div class="main">
      <div class="step1" v-show="active===0">
        <div class="notice">
          请正确填写捐款人信息。标注（<span style="color:red">*</span>）为必填项目。
        </div>
        <el-form ref="donationForm" :model="donationForm" label-width="100px" :rules="rules">
          <el-form-item label="金额" prop="money">
            <span style="color:red">*</span>
            <span :class="donationForm.money===20?'money active':'money'" @click="donationForm.money=20">20</span>
            <span :class="donationForm.money===50?'money active':'money'" @click="donationForm.money=50">50</span>
            <span :class="donationForm.money===100?'money active':'money'" @click="donationForm.money=100">100</span>
            <el-input type="number" v-model="donationForm.money" style="width:200px;"><template
                slot="prepend">其他</template></el-input>元
          </el-form-item>
          <el-form-item label="捐赠项目" prop="welf_no">
            <span style="color:red">*</span>
            <el-select v-model="donationForm.welf_no" v-if="welfareList!==null">
              <el-option v-for="welfare in welfareList" :key="welfare.no" :label="welfare.name" :value="welfare.no">
              </el-option>
            </el-select>
            <el-input v-else :placeholder="welf_name" style="width:350px;" disabled></el-input>
          </el-form-item>
          <el-form-item label="捐赠人/企业" prop="username" style="width:450px;">
            <el-input v-model="donationForm.username" placeholder="请输入您的姓名/企业名称"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contact" style="width:450px;">
            <el-input v-model="donationForm.contact" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="是否匿名" prop="isHide">
            <el-radio-group v-model="donationForm.isHide">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="爱心留言" prop="comment">
            <el-input type="textarea" v-model="donationForm.comment" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center">
            <el-button type="primary" @click="donation('donationForm')">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="step2" v-show="active===1">
        <div class="pay">
          <span>请支付</span>
        </div>
      </div>
      <div class="step3" v-show="active===2">
        <div class="pay">
          <span>完成捐赠</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'add',
    data() {
      var checkUname = (rule, value, callback) => {
        const regName = /(.){2,10}/;
        if (value.length == 0) {
          callback(new Error("用户名不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("用户名为2到10位的字符"));
        } else {
          return callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57]|19[0-9])[0-9]{8}$/;
        if (value.length == 0) {
          callback(new Error("手机号不能为空"));
        } else if (!regPhone.test(value)) {
          callback(new Error("请输入合法的手机号"));
        } else {
          return callback();
        }
      };
      var checkWelfare = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请选择公益！"));
        } else {
          return callback();
        }
      };
      return {
        donationForm: {
          money: 50,
          isHide: '1',
          contact: '18381986725',
          username: localStorage.getItem('username') === null ? '' : localStorage.getItem('username'),
          user_no: localStorage.getItem('id'),
          way: '线上捐赠',
          bank: '中国银行',
          no: '',
          welf_no: '',
          comment: '加油！渡过难关！'
        },
        welfareList: null,
        rules: {
          contact: [{
            validator: checkPhone,
            trigger: "blur",
          }, ],

          username: [{
            validator: checkUname,
            trigger: "blur",
          }, ],
          welf_no: [{
            validator: checkWelfare,
            trigger: "blur",
          }, ],
        },
        active: 0,
        welf_no: '',
        welf_name: '',
        pay: {}
      }
    },
    methods: {
      async getWelfares() {
        const res = await this.$axios.post('/welfare/getIngWelfare', {
          isPage: false
        })
        //console.log(res)
        if (res.status === 200 && res.data.success) {
          this.welfareList = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      async donation(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            //console.log(this.donationForm)
            const res = await this.$axios.post('donation/insert', this.donationForm)
            if (res.status === 200 && res.data.success) {
              this.donationForm = res.data.data
              this.$message.warning('请支付！')
              this.toPay()
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      async toPay() {
        sessionStorage.clear();
        //进这个页面直接获取支付宝表单，保持页面计时和支付宝超时时间 一致
        const res = await this.$axios.post("Alipay/PayPage", this.donationForm);
        if (res.status !== 200) return this.$message.error("获取支付宝表单失败！");
        //将支付宝返回的表单信息写入sessionStorage，再打开新标签页，读取支付宝二维码
        sessionStorage.setItem("payaction", res.data.data);
        const res1 = await this.$axios.get("donation/getById?no=" + this.donationForm.no);
        if (res1.status === 200 && res1.data.data.status === 2) {
          this.$message.success("付款成功！");
          setTimeout(() => {
            this.$router.push("/");
          }, 1000);
        } else if (res1.data.data.status == 3) {
          this.$message.warning("订单已失效，请重新选择!");
          this.$router.push("/donation/add");
          return;
        }
        if (this.minutes == 0 && this.seconds == 0) {
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
              const res2 = await this.$axios.get("donation/getById?no=" + this.donationForm.no);
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
    },
    created() {
      if (this.$route.query.welf_no === undefined) this.getWelfares()
      else {
        this.welf_name = this.$route.query.welf_name
        this.donationForm.welf_no = this.$route.query.welf_no
      }
    }
  }
</script>
<style scoped lang="less">
  .donation {
    padding: 30px 5rem;

    /deep/.el-step__icon {
      width: 30px;
      height: 30px;
    }

    /deep/.el-step__head.is-process,
    /deep/.el-step__title.is-process,
    /deep/.el-radio__inner:hover {
      color: #DD2020;
      border-color: #DD2020;
    }

    .main {
      margin: 3rem 4rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .pay {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 1000px;
        height: 500px;
        background-image: url('../../../assets/zfb.jpg');
        //color: #DD2020;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
      }

      .notice {
        padding: 1rem;
        border: 1px solid rgb(225, 221, 221);
        text-align: center;
        width: 800px;
        margin: 20px 0;
      }

      .el-form {
        width: 800px;

        .money {
          padding: 10px;
          background-color: #fff;
          margin: 10px;
          color: black;
          border: 2px solid white;
        }

        .active {
          border-color: red;
        }

        /deep/.el-radio__input.is-checked .el-radio__inner {
          border-color: #DD2020;
          background: #DD2020;
        }

        /deep/.el-radio__input.is-checked+.el-radio__label {
          color: #DD2020;
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
      }
    }
  }
</style>