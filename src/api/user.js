import { request } from "./request";
// 登录请求
export const login = data => request({ method: 'POST', url: '/v1_0/authorizations', data: data })
// 发送短信验证码
export const sendSms = mobile => request({ method: 'GET', url: `/v1_0/sms/codes/${mobile}` })
// 获取用户自己的信息
export const getUserInfo = () => request({ method: 'GET', url: '/v1_0/user' })
// 获取用户标签页频道
export const getUserChannels = () => request({ method: 'GET', url: '/v1_0/user/channels' })

// 关注用户
export const addFollow = (target) => request({ method: 'POST', url: '/v1_0/user/followings', data: { target } })
// 取消用户关注
export const deletFollow = (target) => request({ method: 'DELETE', url: `/v1_0/user/followings/${target}` })

/**
 * 获取当前登录用户的个人资料
 */
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

/**
 * 更新用户资料
 */
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

/**
 * 更新用户照片资料
 */
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}