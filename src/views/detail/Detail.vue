<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 

            @updata-followed="article.is_followed = $event"
   :is-followed="article.is_followed"
           -->
          <follow-user
            :value.sync="article.is_followed"
            class="follow-btn"
            :id="article.aut_id"
          ></follow-user>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            :loading="followLoading"
            size="small"
            @click="onFollow"
            >已关注</van-button
          >
          <van-button
            v-else
            :loading="followLoading"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          ref="article-content"
          class="article-content markdown-body"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <comment-list
          :source="article.art_id"
          @onload-success="totalCommentCount = $event"
          :list="commentList"
          @reply-click="onReplyClick"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
          <!-- 收藏 -->
          <collect-article
            v-model="article.is_collected"
            :id="article.art_id"
            class="btn-item"
          ></collect-article>
          <!-- 点赞 -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
          <!-- 发布评弹窗 -->
          <van-popup v-model="isPostShow" position="bottom">
            <comment-post
              :target="article.art_id"
              @post-success="onPostSuccess"
            />
          </van-popup>
          <!-- 发布评论 -->
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 没有资源时的错误 就是请求不到数据的时候-->
      <div v-else-if="errStatus == 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络慢原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="getArticleById"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- 评论回复弹出层 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant' //预览图片组件   需要单独引用
import FollowUser from '../../components/follow-user/index.vue' //关注取消用户组件
import CollectArticle from '../../components/shoucwz/index.vue' //收藏文章组件
import LikeArticle from '../../components/like-article/index.vue' //点赞组件
import CommentList from './components/comment-list' //文章评论列表
import CommentPost from './components/comment-post' //发布评论弹窗组件
import CommentReply from './components/comment-reply'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId,
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, // 文章详情数据
      loading: true, //加载中的loading状态
      errStatus: 0, //网络慢 或者服务器失败的原因
      followLoading: false, //关注 取消 时的按钮触发
      totalCommentCount: 0, //评论条数
      isPostShow: false, // 控制发布评论弹窗的显示状态
      commentList: [], // 评论列表
      isReplyShow: false, //回复弹窗
      currentComment: {}, //当前点击回复评论的回复项
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getArticleById()
  },
  mounted() {},
  methods: {
    // 获取文章详情数据
    async getArticleById() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        console.log(data)
        this.article = data.data
        // 请求成功  关闭loding
        this.loading = false

        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
          console.log(this.$refs['article-content'])
        }, 0)

        // this.$nextTick(() => {
        //   //当页面渲染完毕执行
        //   // console.log(this.$refs['article-content'])
        //   // this.previewImage()
        // })
      } catch (err) {
        console.log(err)
        if (err.response && err.response.status == 404) {
          this.errStatus = 404
        }
        // 请求失败  关闭loding
        this.loading = false
      }
    },
    // 预览图片
    previewImage() {
      // 得到所有的img节点
      const div = this.$refs['article-content']
      const imags = div.querySelectorAll('img')
      console.log(imags)
      const images = []
      imags.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览图片地址数组
            images: images,
            // 预览起始位置从0 开始
            startPosition: index,
          })
        }
      })
    },
    // 发布评论成功处理
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },

    onReplyClick(comment) {
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    },
  },
}
</script>

<style scoped lang="less">
@import url('../article/github-markdown.css');
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
