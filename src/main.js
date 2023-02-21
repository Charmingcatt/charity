import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {
  Message
} from 'element-ui'

import Axios from './api/axios'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import * as echarts from 'echarts';

import moment from "moment"
Vue.prototype.$moment = moment;

import global_variable from '@/components/global_variable'

Vue.prototype.global = global_variable

Vue.prototype.$echarts = echarts
Vue.use(mavonEditor)
// step2：把axios挂载到vue的原型中，在vue中每个组件都可以使用axios发送请求,
// 不需要每次都 import一下 axios了，直接使用 $axios 即可
Vue.prototype.$axios = Axios
// step3：使每次请求都会带一个 /api 前缀 
Axios.defaults.baseURL = 'http://localhost:8443/charity/'

Vue.use(ElementUI)
Vue.prototype.$message = Message;
Vue.config.productionTip = false

// const originalPush = router.prototype.push
// router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')