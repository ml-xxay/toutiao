<template>
  <van-button
    :loading="loading"
    :icon="value ? 'star' : 'star-o'"
    :class="{ aaaa: value }"
    @click="onCollect"
  />
</template>
<script>
import { addCollect, deleCollect } from '../../api/article'
export default {
  name: 'Shoucwz',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    id: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 取消收藏
          await deleCollect(this.id)
        } else {
          //添加收藏
          await addCollect(this.id)
        }
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败,请重试')
      }
      this.loading = false
    },
  },
  mounted() {},
}
</script>
<style scoped lang="less">
.aaaa {
  .van_icon {
    color: #ffa500;
  }
}
</style>
