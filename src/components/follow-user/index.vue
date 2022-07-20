<template>
  <van-button
    v-if="value"
    class="follow-btn"
    round
    :loading="loading"
    size="small"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    :loading="loading"
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
</template>
<script>
import { addFollow, deletFollow } from '@/api/user' //关注用户  取消关注
export default {
  name: 'FollowUser',
  components: {},
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    id: {
      type: [Number, String, Object],
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
    // 关注 取消关注
    async onFollow() {
      this.loading = true
      try {
        if (this.value) {
          // 已关注,取消关注
          await deletFollow(this.id)
          // this.article.is_followed = false
        } else {
          //没有关注,关注
          await addFollow(this.id)
          // this.article.is_followed = true
        }
        this.$emit('update:value', !this.value)
        // this.$emit('input', !this.value)
      } catch (err) {
        let message = '请求失败,请重试'
        if (err.response && err.response.status == 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false
    },
  },
  mounted() {},
}
</script>
<style scoped></style>
