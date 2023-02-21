<template>
  <div class="center">
    <el-card class="box-card">
      <div slot="header" class="header clearfix">
        <div class="user-info">
          <el-popover class="value" placement="top-start" trigger="hover">
            <!--trigger属性值：hover、click、focus 和 manual-->
            <a :href="global+'upload/'+user.thumb" target="_blank" title="查看最大化图片">
              <img :src="global+'upload/'+user.thumb" style="width: 400px;height: 400px">
            </a>
            <el-avatar shape="square" :size="50" slot="reference" :src="global+'upload/'+user.thumb"
              style="cursor:pointer"></el-avatar>
          </el-popover>
          <span class="name">
            {{user.username}}
            <span class="type" style="background-color:coral" v-if="user.type===1">管理员</span>
            <span class="type" style="background-color:deepskyblue" v-else-if="user.type===2">普通用户</span>
            <span class="type" v-else>创建者</span>
          </span>
          <el-upload ref="upload" class="upload-demo" :action="global+'/FileUpload/upLoading'" name="file"
            list-type="picture" :on-change="handleChange" :on-success="handleSuccess" :file-list="fileList"
            :show-file-list="false">
            <el-button size="small" type="primary">更换头像</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <span class="money">捐赠金额：<span>{{user.money}}</span>元</span>
          <span class="count">捐助次数：<span>{{user.times}}</span>次</span>
        </div>
        <div class="op">
          <el-tooltip class="item" effect="dark" content="代办事项" placement="top-start">
            <el-badge :value="work" :max=10>
              <router-link to='/user/work'> <i class="el-icon-message-solid"></i></router-link>
            </el-badge>
          </el-tooltip>

          <el-button v-if="user.type===2 && user.status!==2" type="warning" size="small" @click="beCreator()">创建者认证
          </el-button>
          <el-button type="danger" size="small" disabled v-else-if="user.type===2 && user.status===2">审核中</el-button>
          <el-button type="primary" size="small" @click="isEdit=true">修改信息</el-button>
          <el-button type="primary" size="small" @click="EditPwd=true" plain>修改密码</el-button>
        </div>
      </div>
      <div class="info">
        <div class="base">
          <div class="item" v-if="user.type===2 && user.status!==2 && user.res">
            <span class="label">申请认证拒绝原因：</span>
            <span style="color:red" class="value">{{user.res}}</span>
          </div>

          <div class="item">
            <span class="label">公开募捐资格证书：</span>
            <el-popover class="value" v-if="user.certification!==null" placement="top-start" trigger="hover">
              <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="global+'upload/'+user.certification" target="_blank" title="查看最大化图片">
                <img :src="global+'upload/'+user.certification" style="width: 400px;height: 260px">
              </a>
              <el-image slot="reference" :src="global+'upload/'+user.certification"
                style="width: 40px;height: 40px; cursor:pointer"></el-image>
            </el-popover>

            <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
              list-type="picture" :on-change="handleChange" :on-success="handleSuccess1" :file-list="fileList"
              :show-file-list="false">
              <el-button size="small" type="primary" plain>上传证书</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
          <div class="item">
            <span class="label">身份证照片</span>
            <el-popover class="value" v-if="user.idImage!==null" placement="top-start" trigger="hover">
              <!--trigger属性值：hover、click、focus 和 manual-->
              <a :href="global+'upload/'+user.idImage" target="_blank" title="查看最大化图片">
                <img :src="global+'upload/'+user.idImage" style="width: 400px;height: 260px">
              </a>
              <el-image slot="reference" :src="global+'upload/'+user.idImage"
                style="width: 40px;height: 40px; cursor:pointer"></el-image>
            </el-popover>

            <el-upload class="value upload-demo" ref="upload" :action="global+'/FileUpload/upLoading'" name="file"
              list-type="picture" :on-change="handleChange" :on-success="handleSuccess2" :file-list="fileList"
              :show-file-list="false">
              <el-button size="small" type="danger" plain>上传身份证照片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
        <el-dialog title="修改个人信息" :visible.sync="isEdit" width="600px">
          <el-form ref="userForm" :model="userForm" label-width="100px" :rules="rules2">
            <el-form-item label="昵称" prop="username">
              <el-input v-model="userForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="userForm.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="userForm.birthday" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="userForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="微信" prop="wechat">
              <el-input v-model="userForm.wechat"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="id">
              <el-input v-model="userForm.id"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="userForm.address"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="real_name">
              <el-input v-model="userForm.real_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
            <el-button @click="isEdit = false">取 消</el-button>
            <el-button type="primary" @click="edit('userForm')">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="EditPwd" width="420px">
          <el-form ref="pwdForm" :model="pwdForm" label-width="80px" :rules="rules1">
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="pwdForm.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="pwdForm.checkPass" autocomplete="off" show-password></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer" style="display:flex;justify-content:center">
            <el-button @click="EditPwd = false">取 消</el-button>
            <el-button type="primary" @click="changePwd('pwdForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    name: 'center',
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
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (value.length == 0) {
          callback(new Error("邮箱不能为空"));
        } else if (!regEmail.test(value)) {
          callback(new Error("请输入合法的邮箱"));
        } else {
          return callback();
        }
      };
      var checkId = (rule, value, callback) => {
        const regId = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (value.length == 0) {
          callback(new Error("身份证号不能为空"));
        } else if (!regId.test(value)) {
          callback(new Error("请输入合法的身份证号"));
        } else {
          return callback();
        }
      };
      var checkUname = (rule, value, callback) => {
        const regName = /^[A-z]{2,20}$|^[\u4E00-\u9FA5]{2,20}$/
        //^[\u4E00-\u9FA5]{2,20}(·[\u4E00-\u9FA5]{2,20}){0,2}$/;
        if (value.length == 0) {
          callback(new Error("真实姓名不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("真实姓名为2到20位的纯中文或纯英文"));
        } else {
          return callback();
        }
      };
      var checkWeixin = (rule, value, callback) => {
        const regName = /^[a-zA-Z]([-_a-zA-Z0-9]{6,20})$/;
        if (value.length == 0) {
          callback(new Error("微信号不能为空"));
        } else if (!regName.test(value)) {
          callback(new Error("以字母或下划线开头，6-20位数字,字母,下划线,减号或它们的组合"));
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
        } else if (this.pwdForm.checkPass !== '') {
          this.$refs.pwdForm.validateField('checkPass');
        }
        callback();
      };
      var validatePass2 = (rule, value, callback) => {
        const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/;
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (!regPass.test(value)) {
          callback(new Error('密码为6到16位的数字和字母的组合'));
        } else if (value !== this.pwdForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        user: null,
        isEdit: false,
        global: this.global.base,
        userForm: null,
        fileList: [],
        EditPwd: false,
        pwdForm: {
          password: '111111',
          checkPass: '111111',
          username: ''
        },
        rules1: {
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
        },
        rules2: {
          email: [{
            validator: checkEmail,
            trigger: "blur",
          }, ],
          tel: [{
            validator: checkPhone,
            trigger: "blur",
          }, ],
          id: [{
            validator: checkId,
            trigger: "blur",
          }, ],
          real_name: [{
            validator: checkUname,
            trigger: "blur",
          }, ],
          wechat: [{
            validator: checkWeixin,
            trigger: "blur",
          }, ],
        },
        work: 0
      }
    },
    methods: {
      async beCreator() {
        this.userForm.status = 2
        this.update()
      },
      async getUser() {
        const res = await this.$axios('user/getUserByName?username=' + localStorage.getItem('username'))
        if (res.status === 200 && res.data.success) {
          this.user = res.data.data
          this.userForm = JSON.parse(JSON.stringify(res.data.data))
          this.pwdForm.password = res.data.data.password
          this.pwdForm.checkPass = res.data.data.password
          this.pwdForm.username = res.data.data.username
          //console.log(res)
        } else {
          this.$message.error(res.data.message)
        }
      },
      edit(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.isEdit = false
            this.userForm.birthday = this.$moment(this.userForm.birthday).format(
              "YYYY-MM-DD"
            );
            this.update()
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })
      },
      async update() {
        const res = await this.$axios.post('user/update', this.userForm)
        if (res.status === 200 && res.data.success) {
          this.getUser()
          this.$message.success('修改成功！')
        } else {
          this.$message.error(res.data.message)
        }
      },
      //上传图片
      handleSuccess(response) {
        //console.log(response)
        localStorage.setItem('avatar', response.data)
        this.userForm.thumb = response.data
        this.update()
      },
      //上传证书
      handleSuccess1(response) {
        //console.log(response)
        this.userForm.certification = response.data
        this.update()
      },
      //上传身份证
      handleSuccess2(response) {
        //console.log(response)
        this.userForm.idImage = response.data
        this.update()
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      },
      changePwd(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await this.$axios.post('/user/updatePassword', this.pwdForm)
            if (res.status === 200 && res.data.success) {
              this.$message.success('修改成功！')
              this.EditPwd = false
              setTimeout(() => this.$message.error('请重新登录！'), 1000)
              localStorage.clear()
              this.$router.push({
                name: 'login',
                params: {
                  type: 'login'
                }
              })
            } else {
              this.$message.error(res.data.message)
            }
          } else {
            this.$message.error('请完整填写正确信息！')
            return false
          }
        })

      },
      //获取代办
      async getNotWelfare() {
        const res = await this.$axios('welfare/getNotWelfare?user_no=' + localStorage.getItem('id'))
        if (res.status === 200 && res.data.success) {
          this.work = res.data.data.length
          //console.log(res)
        } else {
          this.work = 0
          console.log('获取未提交审计报告公益数量失败')
        }
      },
    },
    created() {
      // if (localStorage.getItem('username') === null) {
      //   //this.$router.push('/')
      //   this.$message.error('请登录')
      // }
      this.getUser()
      this.getNotWelfare()
    }
  }
</script>
<style scoped lang="less">
  .center {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;

      .op {
        .item {
          font-size: 1rem;
          margin: 0 12px;
        }

      }

      .user-info {
        display: flex;
        align-items: baseline;

        .name {
          display: flex;
          margin-right: 2px;

          .type {
            display: inline-block;
            font-size: 12px;
            background-color: rgb(22, 12, 49);
            color: white;
            padding: 5px;
            border-radius: 10px;
            margin: 0 1px;
          }
        }

        .count,
        .money {
          margin-left: 8px;

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