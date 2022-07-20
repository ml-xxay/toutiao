/* 频道请求模块 */
import { request } from "./request";

// 获取所有频道列表
export const getAllChannels = () => request({ url: '/v1_0/channels' })
// 添加用户频道
export const addUserChannel = (channels) => request({
  method: 'PATCH',
  url: '/v1_0/user/channels',
  data: {
    channels: [channels]
  },
})

// 删除用户频道
export const deleteUserChannel = (id) => request({
  method: 'DELETE',
  url: `/v1_0/user/channels/${id}`,
})