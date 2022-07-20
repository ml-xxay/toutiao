<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResult = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result :searchText="searchText" v-if="isResult" />
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />
    <!-- 历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @updata="updata"
      @search="onSearch"
    />
  </div>
</template>
<script>
import SearchHistory from './components/Search-history.vue'
import SearchSuggestion from './components/Search-suggestion.vue'
import SearchResult from './components/Search-result.vue'
import { setItem, getItem } from '../../utils/storage'
export default {
  name: 'search',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResult: false, //控制搜索结果的展示
      searchHistories: getItem('serach-histories') || [], //搜索历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories() {
      // 同步到本地存储
      setItem('serach-histories', val)
    },
  },
  created() {},
  methods: {
    // 搜索
    onSearch(val) {
      console.log('我搜索了')
      // 更新文本框内容
      this.searchText = val
      // 存储历史记录
      const index = this.searchHistories.indexOf(val)
      // 搜索记录里面有这个搜索值   删掉 重新覆盖
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      } 
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResult = true
    },
    onCancel() {
      // 返回上一层
      this.$router.back()
    },
    // 子组件事件
    updata(arr) {
      this.searchHistories = arr
    },
  },
  mounted() {},
}
</script>
<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .search-from {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
