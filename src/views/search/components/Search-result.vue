<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>
<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, //页码
      perPage: 20, //每页数据条数
      error: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.searchText, // 搜索关键字
      })

      // 2. 将数据添加到列表中
      const { results } = data.data
      this.list.push(...results)

      // 3. 设置加载状态结束
      this.loading = false

      // 4. 判断数据是否加载完毕
      if (results.length) {
        this.page++ // 更新获取下一页数据的页码
      } else {
        this.error = true
        this.loading = false
        this.finished = true // 没有数据了，将加载状态设置结束，不再 onLoad
      }
    },
  },
  mounted() {},
}
</script>
<style scoped></style>
