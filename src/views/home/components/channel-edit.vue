<template>
  <!-- 弹窗组件 -->
  <div class="channel-edit">
    <!-- 1我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 下方内容 -->
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channels, index) in mychannel"
        :key="index"
        @click="onMyChennelsClick(channels, index)"
      >
        <!-- 插槽图标 -->
        <van-icon
          v-show="isEdit && !fixdChannels.includes(channels.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span :class="{ active: index == active }" class="text" slot="text">{{
          channels.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!--2频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <!-- 下方内容 -->
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(allChannels, index) in recommendChannels"
        icon="plus"
        :key="index"
        :text="allChannels.name"
        @click="addMyChannel(allChannels)"
      />
    </van-grid>
  </div>
</template>
<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from '@/api/channel' //网络请求
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js' //
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    // 我的频道内容
    mychannel: {
      type: Array,
      required: true,
    },
    // 默认显示高亮的索引
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [], //所有频道
      isEdit: false, //控制编辑状态的显示与隐藏
      fixdChannels: [0], //固定频道不允许删除
    }
  },
  computed: {
    //映射vuex里的user
    ...mapState(['user']),
    // 全部频道-我的频道   剩下的就是频道推荐的
    // recommendChannels() {
    //   const channels = []
    //   this.allChannels.forEach((item) => {
    //     //item  全部频道的每一项
    //     //find 遍历数组,找到妈妈组条件的元素项
    //     const ret = this.mychannel.find((mychannel) => {
    //       //mychannel  我的频道的每一项
    //       // 全部频道的那一项  包不包含  我的频道的那一项
    //       return item.id == mychannel.id //返回那一项
    //     })
    //     console.log(ret)
    //     //如果我的频道中不包括该频道的项,把该项则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(item)
    //     }
    //   })
    //   return channels
    // },
    // 简化版
    recommendChannels() {
      return this.allChannels.filter((item) => {
        return !this.mychannel.find((mychannel) => {
          return item.id == mychannel.id
        })
      })
    },
  },
  created() {
    console.log(this.mychannel)
    this.getAllChannels()
  },
  methods: {
    // 获取所有频道
    async getAllChannels() {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    // 添加频道 到 我的频道
    async addMyChannel(allChannels) {
      console.log(allChannels)
      this.mychannel.push(allChannels)
      // 数据持久化处理
      if (this.user) {
        // 已登录  把数据放到线上的数据库
        try {
          await addUserChannel({
            id: allChannels.id, //频道id
            seq: this.mychannel.length, //序号
          })
        } catch (error) {
          this.$toast('添加失败，请稍后重试')
        }
      } else {
        // 没有登录  把数据存到本地
        setItem('TOUTIAO_CHANNELS', this.mychannel)
      }
    },
    // 点击我的频道下方的内容 删除  切换 操作
    onMyChennelsClick(channels, index) {
      console.log(channels, index)
      if (this.isEdit) {
        // 如果点击的是固定的哪一个推荐  则不操作
        if (this.fixdChannels.includes(channels.id)) {
          return
        }
        if (index < this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        //编辑状态  则执行删除频道
        this.mychannel.splice(index, 1)

        // 处理持久化  删除操作
        this.deleteChannel(channels)
      } else {
        // 非编辑状态,执行切换状态
        this.$emit('update-active', index, false)
      }
    },

    async deleteChannel(channels) {
      try {
        if (this.user) {
          //已登录，将数据更新到线上
          await deleteUserChannel(channels.id)
        } else {
          //未登录将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.mychannel)
        }
      } catch (error) {
        this.$toast('操作失败，请稍后重试')
      }
    },
  },
}
</script>
<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  // 上方图标
  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  //公共样式
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: #f85959;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  // 下方图标
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
