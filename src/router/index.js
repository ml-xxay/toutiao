import Vue from 'vue'
import VueRouter from 'vue-router'

// const Login = () =>import ('@/views/login')
Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
},
{
  path: '/',
  redirect: '/layout',
},
{
  // 一访问layout页面 就到layout页面   一到layout页面 就重定向到home子页面
  path: '/layout',
  name: 'layout',
  component: () => import('@/views/layout'),
  redirect: '/home',
  children: [{
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('@/views/my/My.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/views/video/Video.vue')
  }, {
    path: '/qa',
    name: 'qa',
    component: () => import('@/views/qa/qa.vue')
  }
  ]
},
{
  path: '/search',
  name: 'search',
  component: () => import('@/views/search/Search.vue')
},
{
  path: '/detail/:articleId',
  name: 'detail',
  component: () => import('@/views/detail/Detail.vue'),
  // 说白了就是将路由动态参数映射到组件的 props 中，更推荐这种做法
  props: true
},
{
  path: '/user/profile',
  name: 'user-profile',
  component: () => import('@/views/user-profile')
}
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router