import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/common/home.vue'
import adminHome from '@/views/admin/Home.vue'
import userhome from '@/views/common/userhome.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    component: Home,
    children: [{
        path: '/',
        name: 'userhome',
        component: userhome,
      },
      {
        path: 'news/:type',
        name: 'newType',
        component: resolve => require(['@/views/common/news/type'], resolve),
      },
      {
        path: 'echart',
        name: 'echart',
        component: resolve => require(['@/views/Echart'], resolve),
      },
      {
        path: 'post/:team_no',
        name: 'post',
        component: resolve => require(['@/views/common/post/add'], resolve),
      },
      {
        path: 'news',
        name: 'newsInfo',
        component: resolve => require(['@/views/common/news/newsInfo'], resolve),
      },
      {
        path: 'notice',
        name: 'notice',
        component: resolve => require(['@/views/common/notice/list'], resolve),
      }, {
        path: 'noticeInfo',
        name: 'noticeInfo',
        component: resolve => require(['@/views/common/notice/noticeInfo'], resolve),
      },
      {
        path: 'help/contact',
        name: 'help',
        component: resolve => require(['@/views/common/help/contact'], resolve),
      },
      {
        path: 'help/introduce',
        name: 'introduce',
        component: resolve => require(['@/views/common/help/introduce'], resolve),
      },
      {
        path: 'donation/add',
        name: 'donationAdd',
        component: resolve => require(['@/views/common/donation/add'], resolve),
      },
      {
        path: 'donation',
        name: 'donation',
        component: resolve => require(['@/views/common/donation/donation'], resolve),
      },
      {
        path: 'welfare/:type',
        name: 'welfareType',
        component: resolve => require(['@/views/common/welfare/type'], resolve),
      },
      {
        path: 'welfare',
        name: 'welfareInfo',
        component: resolve => require(['@/views/common/welfare/welfare'], resolve),
      },
      {
        path: 'teamInfo',
        name: 'teamInfo',
        component: resolve => require(['@/views/common/team/team'], resolve),
      },
      {
        path: 'team',
        name: 'team',
        component: resolve => require(['@/views/common/team/list'], resolve),
      },
      {
        path: 'pay',
        name: 'pay',
        component: resolve => require(['@/views/common/donation/pay'], resolve),
      },
      {
        path: 'user',
        component: resolve => require(['@/views/common/user/user'], resolve),
        meta: {
          auth: true
        },
        children: [{
            path: '/',
            name: 'center',
            component: resolve => require(['@/views/common/user/center'], resolve),
          },
          {
            path: 'team',
            name: 'userTeam',
            component: resolve => require(['@/views/common/user/team/team'], resolve),
          },
          {
            path: 'welfare',
            name: 'userWelfare',
            component: resolve => require(['@/views/common/user/welfare/welfare'], resolve),
          },
          {
            path: 'donation',
            name: 'userDonation',
            component: resolve => require(['@/views/common/user/donation/donation'], resolve),
          },
          {
            path: 'apply',
            name: 'userApply',
            component: resolve => require(['@/views/common/user/apply/apply'], resolve),
          },
          {
            path: 'work',
            name: 'userWork',
            component: resolve => require(['@/views/common/user/work/work'], resolve),
          },
          {
            path: 'news',
            name: 'userNews',
            component: resolve => require(['@/views/common/user/news/news'], resolve),
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: adminHome,
    meta: {
      auth: true
    },
    children: [{
        path: '/',
        name: 'statistics',
        component: resolve => require(['@/views/admin/statistics'], resolve),
      },
      {
        path: 'news',
        name: 'adminNews',
        component: resolve => require(['@/views/admin/news/list'], resolve),
      },
      {
        path: 'news/edit/:id',
        name: 'adminNewsEdit',
        component: () => import( /* webpackChunkName: "news" */ '@/views/admin/news/edit')
      },
      {
        path: 'news/add',
        name: 'adminNewsAdd',
        component: () => import( /* webpackChunkName: "news" */ '@/views/admin/news/add')
      },
      {
        path: 'user',
        name: 'adminUsers',
        component: () => import( /* webpackChunkName: "user" */ '@/views/admin/user/list')
      },
      {
        path: 'donation',
        name: 'adminDonation',
        component: () => import( /* webpackChunkName: "donation" */ '@/views/admin/donation/list')
      },
      {
        path: 'welfare',
        name: 'adminWelfare',
        component: () => import( /* webpackChunkName: "welfare" */ '@/views/admin/welfare/list')
      },
      {
        path: 'apply',
        name: 'adminApply',
        component: () => import( /* webpackChunkName: "apply" */ '@/views/admin/apply/list')
      },
      {
        path: 'team',
        name: 'adminTeam',
        component: () => import( /* webpackChunkName: "team" */ '@/views/admin/team/list')
      },
      {
        path: 'rotation',
        name: 'rotation',
        component: () => import( /* webpackChunkName: "rotation" */ '@/views/admin/rotation/list')
      }, {
        path: 'notice',
        name: 'adminNotice',
        component: resolve => require(['@/views/admin/notice/list'], resolve),
      },
      {
        path: 'notice/edit/:id',
        name: 'adminNoticeEdit',
        component: () => import( /* webpackChunkName: "notice" */ '@/views/admin/notice/edit')
      },
      {
        path: 'notice/add',
        name: 'adminNoticeAdd',
        component: () => import( /* webpackChunkName: "noticeAdd" */ '@/views/admin/notice/add')
      },
      {
        path: 'center',
        name: 'center',
        component: () => import( /* webpackChunkName: "center" */ '@/views/admin/user/personal')
      },
    ]
  },
  {
    path: '/login/:type',
    name: 'login',
    component: () => import( /* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import( /* webpackChunkName: "test" */ '@/views/common/test.vue')
  },
  {
    path: "/404",
    name: "notFound",

    component: () => import( /* webpackChunkName: "404" */ '@/views/404.vue')
  },
  {
    path: "*", // 此处需特别注意置于最底部
    redirect: "/404"
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    const username = localStorage.getItem('username')
    if (username) {
      next()
    } else {
      //防止无限循环
      if (to.name === 'login') {
        next();
        return
      }
      Vue.prototype.$message.error('请登录')
      next('/login/login')
    }
  }
  next()
})

export default router