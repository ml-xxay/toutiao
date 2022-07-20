<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlightText(item)"></div>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestion } from '@/api/search'
// lodash 支持按需加载，有利于打包结果优化
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [], //联想建议数据结果
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生变化之后 就会调用 handle 函数
      // 注意  handle 函数名称是固定的
      // async handler(value) {
      //   //value 是变化之后的最新数据
      //   console.log(value)
      //   this.loadSearchSuggestion(value)
      // },
      // 优化  使用防抖
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 200),
      // 首次监视触发
      immediate: true,
    },
  },
  created() {},
  methods: {
    // 联想建议请求
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        console.log(data)
        this.suggestions = data.data.options
      } catch {
        this.$toast('获取失败')
      }
    },
    // 替换
    // highlightText(text) {
    //   console.log(text)
    //   const highlightStr = `<span class="active">${this.searchText}</span>` //搜索框输入的值
    //   const reg = new RegExp(this.searchText, 'gi') //以搜索框输入的值来匹配
    //   // return text.replace(reg, highlightStr) //匹配到的  变颜色
    //   const str = text.replace(reg, highlightStr) //匹配到的  变颜色
    //   var arr = str.split(' ')
    //   arr = arr.map(function (i) {
    //     return i.slice(0, 1).toUpperCase() + i.slice(1)
    //   }) //注意此处要有return 并且map方法将返回一个新数组
    //   return arr.join(' ')
    // },
    // highlightText(text) {
    //   console.log(text) //每一项请求的结果
    //   // 这种方式也行  $&
    //   // const highlightStr = `<span class="active">$&</span>` //搜索框输入的值
    //   const reg = new RegExp(this.searchText, 'gi') //以搜索框输入的值来匹配
    //   // return text.replace(reg, highlightStr) //匹配到的  变颜色
    //   return text.replace(reg, function (f) {
    //     return `<span class="active">${f}</span>`
    //   }) //匹配到的  变颜色
    // },
    highlightText(text) {
      // console.log(text)
      const reg = new RegExp(this.searchText, 'gi')
      //  获取正则匹配到的所有内容
      const res = text.match(reg)
      console.log(res)
      console.log('-------------------')
      // 根据正则分割字符串
      const strArr = text.split(reg)
      console.log(strArr)
      let strRes = ''
      for (let i = 0; i < res.length; i++) {
        strRes += strArr[i] + `<span class="active">${res[i]}</span>`
      }
      strRes += strArr.pop()
      return strRes
    },
  },
  mounted() {},
}
</script>
<style scoped lang="less">
.search-suggestion {
  /deep/.active {
    color: #3296fa;
  }
}
</style>
