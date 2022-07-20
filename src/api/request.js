import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
//处理id过长  丢失精度的问题
import jsonBig from 'json-bigint'
export function request(config) {
  // 1. 创建axios实例
  const instance = axios.create({
    baseURL: "http://localhost:8000", // 基础路径
    timeout: 5000,
    // transformResponse 允许自定义原始的响应数据（字符串）
    //  data 后端返回的原始数据  说白了就是JSON格式的字符串
    transformResponse: [function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return data
      }
      // 默认axios  会这样处理后端返回过来的数据   后端返回过来的数据都是json格式的字符串
      // return JSON.parse(data)
    }]

  })


  // 2. axios的请求拦截器
  // 2.1 请求拦截
  instance.interceptors.request.use(config => {
    // console.log(config);
    // 设置请求头
    const { user } = store.state //把vuex里面的user解构出来  方便操作
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  }, error => {
    console.log(error);
    throw (err)
  })
  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    return res
  }, async err => {
    console.log(err);
    // token过期处理
    if (err.response && err.response.status === 401) {
      const refresh_token = store.state.user.refresh_token;
      // 校验是否有 refresh_token
      if (!store.state.user || !refresh_token) {
        router.push("/login");
        // 代码不要往后执行了
        return;
      }
      try {
        //发送请求之前  把token干掉  防止请求新的token 请求拦截器重新覆盖token
        store.commit('setUser', { refresh_token })
        const { data } = await instance({
          method: 'put',
          url: '/v1_0/authorizations',
          headers: {
            Authorization: 'Bearer ' + refresh_token
          }
        })
        // 发送请求之后 再把获取到的新的token 放到vuex中   因为所有的有权限接口  携带token都是从vuex中取到的
        store.commit('setUser', { token: data.data.token, refresh_token })
        // 重新发起因为token过期导致请求失败的请求 err.config
        return instance(err.config)
      } catch (error) {
        // 跳转到登录页
        router.push('/login')
      }
    } else {

      throw (err)
    }

  })

  // 3. 发送真正的网络请求
  return instance(config)

}