<template>
  <div class="login-container">
    <van-nav-bar title="登录" />
    <!-- ref获取form表单实例 -->
    <van-form @submit="onSubmit" ref="form">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="rules.mobile"
        required
      >
        <template #left-icon>
          <toutiao-icon icon="shouji"></toutiao-icon>
        </template>
      </van-field>
      <!-- type:指定输入框的类型 -->
      <!-- maxlength:指定输入的最大位数 -->
      <!-- required:是否显示必填的* -->
      <van-field
        type="number"
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="rules.code"
        required
        :maxlength="6"
      >
        <template #left-icon>
          <toutiao-icon icon="yanzhengma"></toutiao-icon>
        </template>
        <template #button>
          <van-count-down
            :time="5000"
            v-if="isShowCountDown"
            format="ss s"
            @finish="isShowCountDown = false"
          />
          <van-button
            round
            native-type="button"
            class="send-sms-btn"
            type="default"
            size="mini"
            @click="SendSmsCode"
            v-else
            :loading="isDisabled"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, getSmsCode } from "@/api/user";
import ToutiaoIcon from "@/components/ToutiaoIcon.vue";
import { Toast } from "vant";
export default {
  components: { ToutiaoIcon },
  name: "LoginPage",
  data() {
    return {
      user: {
        mobile: "13888888888",
        code: "246810",
      },
      rules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码只能为6位",
          },
        ],
      },
      isShowCountDown: false,
      isDisabled: false,
    };
  },
  created() {},
  methods: {
    async onSubmit() {
      try {
        const res = await login(this.user);
        console.log(res);
        Toast.success("登录成功");
      } catch (e) {
        Toast.fail(e?.response?.data?.message || "服务器端错误");
      }
    },
    async SendSmsCode() {
      // 不同的try处理不同的错误
      // 1. 校验mobile表单
      try {
        await this.$refs.form.validate("mobile");
      } catch (e) {
        console.log(e);
        return;
      }
      // 2.校验通过
      // 2-1：按钮禁用 >> 发送请求
      // 发送成功 >> 倒计时 >> 成功的提示
      // 发送失败 >> 错误的提示
      // 拿到结果 >> 解除结果
      try {
        this.isDisabled = true;
        await getSmsCode(this.user.mobile);
        this.isShowCountDown = "true";
        this.$toast.success("发送验证码成功");
      } catch (e) {
        this.$toast.fail(e.response.data.message || "出错了");
      } finally {
        this.isDisabled = false;
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
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
}
</style>
