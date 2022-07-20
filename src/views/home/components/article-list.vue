<template>
  <!-- 文章列表组件 -->
  <!--
      List 列表组件：瀑布流滚动加载，用于展示长列表。

      List 组件通过 loading 和 finished 两个变量控制加载状态，
      当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 自动设置成 true，此时可以发起异步操作并更新数据，
      数据更新完毕后，将 loading 设置成 false 即可。
      若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

      - load 事件：
        + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

      - loading 属性：控制加载中的 loading 状态
        + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

      - finished 属性：控制加载结束的状态
        + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->

  <div class="artcile-list">
    <!-- van-pull-refresh 下拉刷新组件 -->
    <van-pull-refresh
      v-model="isLoading"
      :success-duration="1500"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/article-item.vue'
export default {
  name: '',
  components: {
    ArticleItem,
  },
  props: {
    channels: {
      type: Object,
      required: true, //必传
      timestamp: null, //请求回去下一页数据得时间戳
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false, //控制失败得提示状态
      isLoading: false, //控制下拉刷新
      refreshSuccessText: '刷新成功', // 下拉刷新成功提示文本
    }
  },
  created() {},
  methods: {
    // 加载更多事件
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channels.id, //频道ID
          timestamp: this.timestamp || Date.now(), //页码   当前时间毫秒数
        })
        // console.log(data)
        // 模拟随即失败情况
        // if (Math.random() > 0.5) {
        //   JSON.parse("shuifha");
        // }
        const { results } = data.data
        this.list.push(...results)
        this.loading = false //控制下次加载更多

        if (results.length) {
          //本次请求到的数据有长度   更新获取下一页数据
          // console.log(11111)
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了   停止加载更多
          this.finished = true
        }
      } catch (error) {
        console.log('请求失败')
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading 也需要关闭  不能让他一直转圈圈
        this.loading = false
      }
    },
    // 下拉刷新事件
    async onRefresh() {
      try {
        //1.下拉刷新时  请求获取刷新数据
        const { data } = await getArticles({
          channel_id: this.channels.id, //频道ID
          timestamp: Date.now(), //下拉刷新每次请求获取最新数据
        })
        const { results } = data.data
        // 2.获取到的数据放到页面顶部
        this.list.unshift(...results)
        //3.关闭下拉刷新
        this.isLoading = false
        // 4.更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
        console.log('我刷新了')
      } catch (error) {
        this.refreshSuccessText = '刷新失败'
        //  刷新失败关闭下拉刷新  下次触发下拉刷新  会自动设置成true
        this.isLoading = false
      }
    },
  },
}
</script>
<style scoped>
.artcile-list {
  height: 79vh;
  overflow: auto;
}
</style>
