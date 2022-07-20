import { setItem } from '@/utils/storage'
export default {
  // token保存到state里
  setUser(state, token) {
    //点击登陆时把token存到vuex的state里
    state.user = token
      //数据持久化  为了防止刷新丢失，我们需要把数据备份到本地存储 
      // window.localStorage.setItem('TOKEN_KEY', JSON.stringify(state.user))
    setItem('TOKEN_KEY', state.user)
  }
}