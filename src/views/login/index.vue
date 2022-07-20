<template>
  <div class="login-container">
    <!-- 头部导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- /头部导航栏 -->

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <!-- 用户名框 -->
      <van-field
        :rules="userFormRules.mobile"
        v-model="user.mobile"
        name="mobile"
        type="number"
        placeholder="请输入手机号"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <!-- 密码框 -->
      <van-field
        :rules="userFormRules.code"
        v-model="user.code"
        type="password"
        name="code"
        placeholder="请输入验证码"
        maxlength="6"
      >
        <!-- 左侧图标 -->
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>

        <!-- 右侧发送短信 -->
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="flag"
            :time="time"
            format=" ss 秒"
            @finish="flag = false"
          />
          <van-button
            v-else
            @click="onSendSms"
            native-type="button"
            class="send-sms-btn"
            round
            size="small"
            type="default"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button round block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>
<script>
import { login, sendSms } from "@/api/user";
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      // 表单数据
      user: {
        mobile: "17756736187", //手机号
        code: "246810", //验证码
      },
      // 表单验证规则
      userFormRules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          { required: true, message: "请填写用户名" },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      time: 1000 * 5, //发送短信时长
      flag: false, //控制发送短信显示与隐藏
    };
  },
  created() {},
  methods: {
    // 表单登录
    async onSubmit() {
      // 1. 展示登陆中 loading
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true, // 禁用背景点击
        duration: 0, // 持续时间，默认 2000，0 表示持续展示不关闭
      });
      // 2. 请求登录
      try {
        const { data } = await login(this.user);
        console.log(data);
        this.$store.commit("setUser", data.data);
        this.$toast.success("登录成功");
        // 登录成功，跳转回原来页面
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.back()
      } catch (err) {
        console.log(err);
        if (err.response.status === 400) {
          this.$toast.fail("手机号或验证码错误");
        } else {
          this.$toast.fail("登录失败，请稍后重试");
        }
      }
    },
    //发送短信
    async onSendSms() {
      // 1. 校验手机号
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (error) {
        return console.log("验证失败", error);
      }
      // 2. 验证通过，显示倒计时
      this.flag = true;
      // 3. 请求发送验证码

      try {
        await sendSms(this.user.mobile);
        this.$toast("发送成功");
      } catch (err) {
        // 发送失败，关闭倒计时
        this.flag = false;
        if (err.response.status === 429) {
          this.$toast("发送太频繁了，请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
        }
      }
    },
  },
};
</script>
<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>