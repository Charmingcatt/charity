import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    token: '',
    userInfo: {
      username: '',
      avatar: 'cloud.jpg',
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    setUser(state, user) {
      state.userInfo = user;
    }
  },
  actions: {},
  modules: {}
})