<template>
  <div class="login">
    <el-card class="box-card" v-show="isLogin">
      <div slot="header" class="title">
        <span>登&nbsp;&nbsp;&nbsp;&nbsp;陆</span>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item class="login-input" prop="userName">
          <el-input placeholder="用户名" prefix-icon="el-icon-user" v-model="loginForm.username">
          </el-input>
        </el-form-item>
        <el-form-item class="login-input" prop="password">
          <el-input type="password" placeholder="密码" prefix-icon="el-icon-key" v-model="loginForm.password"
            show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm('loginForm')">登&nbsp;&nbsp;陆</el-button>
      <el-button type="text" @click="()=>{isLogin=false}">还未加入爱心公益网站？点击注册！</el-button>
    </el-card>
    <el-card class="box-card" v-show="!isLogin">
      <div slot="header" class="title">
        <span>注&nbsp;&nbsp;&nbsp;&nbsp;册</span>
      </div>
      <el-form :model="regisForm" ref="regisForm" label-width="80px" :rules="rules1">
        <el-form-item label="头像" prop="thumb" class="thumb">
          <el-avatar :src="this.global+'upload/'+regisForm.thumb"></el-avatar>
          <el-upload style="display: inline-block;" class="value upload-demo" ref="upload"
            :action="global+'/FileUpload/upLoading'" name="file" list-type="picture" :on-change="handleChange"
            :on-success="handleSuccess" :file-list="fileList" :show-file-list="false">
            <el-button size="mini" type="primary" plain style="margin-left:10px;">上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" prop="username">

          <el-input v-model="regisForm.username" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="regisForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="regisForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button class="login-btn" type="primary" @click="register('regisForm')">注册</el-button>
      <el-button type="text" @click="()=>{isLogin=true}">已有账号？去登陆！</el-button>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
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
      var checkUname = (rule, value, callback) => {
        const regName = /^((?!\\|\/|:|\*|\?|<|>|\||'|%).){2,10}$/;
        if (value.length == 0) {
          callback(new Error("账户名不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("账户名为2到10位，不含特殊字符"));
        } else {
          return callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!regPass.test(value)) {
          callback(new Error('密码为6到16位的数字和字母的组合'));
        } else if (this.regisForm.checkPass !== '') {
          this.$refs.regisForm.validateField('checkPass');
        }
        callback();
      };
      var validatePass2 = (rule, value, callback) => {
        const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (!regPass.test(value)) {
          callback(new Error('密码为6到16位的数字和字母的组合'));
        } else if (value !== this.regisForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        isLogin: false,
        fileList: [],
        global: this.global.base,
        loginForm: {
          username: "Benteli",
          password: "lay123456",
        },
        regisForm: {
          username: '',
          type: 2,
          sex: '男',
          password: 'lay123456',
          thumb: 'bad8ca28-dc6d-4d10-b75d-48743044518a.jpg',
          checkPass: 'lay123456'
        },
        rules: {
          username: [{
            validator: checkUname,
            trigger: "blur",
          }, ],
          password: [{
            validator: validatePass,
            trigger: "blur",
          }, ],
        },
        rules1: {
          username: [{
            validator: checkUname,
            trigger: "blur",
          }, ],
          password: [{
            validator: validatePass,
            trigger: "blur",
          }, ],
          tel: [{
            validator: checkPhone,
            trigger: "blur",
          }, ],
          checkPass: [{
            validator: validatePass2,
            trigger: "blur",
          }, ],
        },
      };
    },
    methods: {
      async register(formName) {
        //console.log(this.addForm)
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('/user/insert', this.regisForm)
            if (res.status === 200 && res.data.success) {
              this.$message.success('注册成功！')
              this.isLogin = true
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        this.regisForm.thumb = response.data
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (localStorage.getItem("username")) {
              this.$message.error('请勿重复登录！')
              this.$router.push('/')
              return false
            }
            const res = await this.$axios.post('/user/login',
              JSON.stringify(this.loginForm)
            )
            //console.log(res.data)
            if (res.data.code === 201 && res.status === 200) {
              //保存用户信息
              localStorage.setItem("username", this.loginForm.username);
              //localStorage.setItem('avatar', res.data.data.thumb)
              localStorage.setItem('id', res.data.data.user_no)
              //保存token
              localStorage.setItem("token", res.data.token)
              localStorage.setItem("type", res.data.data.type)
              this.$store.commit("setToken", res.data.token)
              this.$store.commit("setIsLogin", true)
              this.$store.commit("setUser", {
                username: this.loginForm.username,
                avatar: res.data.data.thumb
              })
              this.$message.success(res.data.message)
              // this.$store.commit('setIsLogin',true)
              if (res.data.data.type == 1) {
                this.$router.push("/admin");
              } else {
                this.$router.push("/");
              }
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error("请输入正确的用户名和密码");
            return false;
          }
        });
      },
    },
    created() {
      if (this.$route.params.type === 'login') this.isLogin = true
    }
  };
</script>

<style scoped lang="less">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/bg1.jpeg");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    /deep/.el-card__body,
    .box-card {
      width: 28rem;
      border: none !important;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .title {
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
      }
    }

    .thumb {
      /deep/.el-form-item__content {
        line-height: 0;
      }
    }

    .el-input {
      width: 18rem !important;
    }

  }
</style>