import axios from 'axios'
import {
    Message
} from 'element-ui'
import router from '../router'
// import router from '@/router';

const request = axios.create({
    // //后端路径
    baseUrl: 'http://localhost:8081/charity/',
    // //超时
    timeout: 40000,
    //规定前后数据为json
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
        'token': ''
    }
})

request.interceptors.request.use(config => {
    //登录状态：进行过滤
    //未登录状态：不进行过滤

    if (localStorage.getItem("token")) {
        config.headers.token = localStorage.getItem("token");
    }

    return config;
}, err => {
    return Promise.reject(err);
})

// http response 拦截器
request.interceptors.response.use(
    response => {
        //console.log(response)
        if (response.status === 288) {
            //alert(Vue)
            localStorage.clear()
            Message.error('登录验证过期，请重新登录！')
            router.push('/login/login')
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);
export default request;