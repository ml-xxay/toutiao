import { request } from "./request";
/* 新闻模块 */
// 获取文章新闻推荐
export const getArticles = (params) => request({ url: '/v1_0/articles', params: params })

/* // 获取文章新闻详情 */
export const getArticleById = (article_id) => request({ url: `/v1_0/articles/${article_id}` })

// 收藏文章
export const addCollect = (target) => request({ method: 'POST', url: '/v1_0/article/collections', data: { target } })
// 取消收藏
export const deleCollect = (target) => request({ method: 'DELETE', url: `/v1_0/article/collections/${target}` })

/**
 * 点赞文章
 */
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}

/**
 * 取消点赞文章
 */
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}