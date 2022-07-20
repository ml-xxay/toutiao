<template>
  <div class="home-container">
    <!-- 头部导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /头部导航栏 -->

    <!-- 标签页 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 文章列表组件 -->
        <article-list :channels="item"></article-list>
      </van-tab>
      <!-- 右侧占位符 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 右侧面包 -->
      <div slot="nav-right" class="hamburger-btn" @click="show = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /标签页 -->

    <!-- 弹出层组件 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 组件内容 -->
      <channel-edit
        @update-active="updateActive"
        :mychannel="channels"
        :active="active"
      ></channel-edit>
    </van-popup>
    <!-- /弹出层 -->
  </div>
</template>
<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue' //文章列表组件
import ChannelEdit from './components/channel-edit.vue' //弹窗组件
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit,
  },
  props: {},
  data() {
    return {
      active: 0, //默认显示的标签页
      channels: [], //频道列表
      show: false, //控制弹出层显示与隐藏
    }
  },
  computed: {
    ...mapState(['user']),
  },

  created() {
    this.getUserChannels()
  },
  methods: {
    // 获取频道列表
    async getUserChannels() {
      try {
        let channers = []
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channers = data.data.channels
        } else {
          // 未登录 判断是否有本地频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            // 有拿来使用
            channers = localChannels
          } else {
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channers = data.data.channels
          }
        }
        this.channels = channers
      } catch (error) {
        // this.$toast('获取频道数据失败')
      }
    },
    // 子组件事件
    updateActive(index, f = true) {
      this.active = index
      this.show = f
    },
  },
}
</script>
<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  // 头部搜索样式
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  // 标签页样式
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    // 选中时的颜色
    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
