<template>
  <!--  :to="`/detail/${article.art_id}`"-->
  <van-cell
    class="article-item"
    :to="{
      name: 'detail',
      params: {
        articleId: article.art_id,
      },
    }"
  >
    <!-- 插槽标题 -->
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>
    <!-- 插槽下方内容 -->
    <div slot="label">
      <!-- 上面 -->
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>
      <!-- 下面 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 插槽右侧图片 -->
    <van-image
      v-if="article.cover.type === 1"
      class="right-cover"
      slot="default"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>
<script>
export default {
  name: 'articleitem',
  components: {},
  props: {
    article: {
      type: Object,
      requird: true,
    },
  },

  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style scoped lang="less">
.article-item {
  // 标题
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  // 一张得的时候右侧图片
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
