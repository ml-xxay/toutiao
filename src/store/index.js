import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"
import { getItem } from '@/utils/storage'
Vue.use(Vuex)

const store = new Vuex.Store({
  // 一个对象，存储当前登录用户信息（token等数据）
  state: {
    // user: null,
    // 因为vuex里面的数据是响应式的  当页面刷新的时候 vuex会从新初始化
    // 原来点击登陆时赋值给vuex里面的state的token值 刷新之后就没了
    // 所以初始化的时候 从缓存去取 为了数据持久化
    // user: JSON.parse(localStorage.getItem('TOKEN_KEY'))
    user: getItem('TOKEN_KEY') //使用封装的获取token的方法
  },
  //记录修改状态的  主修改
  mutations: mutations,
  // actions 是行为  是操作异步的  context 默认参数
  actions: actions,
  // 类似于组件里面的计算属性
  getters: getters,
  modules: {}
})


// 3.导出store对象
export default store