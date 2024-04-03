<template>
  <view class="container" :style="{ 'min-height': windowHeight }">
    <view class="logo-name">欢迎使用<span class="logo-title">权大师合伙人</span> </view>

    <view class="login-type-box">
      <span :class="{ active: loginType == 1 }" @click="changeLoginType(1)"> 手机号登录 </span>
      <div class="line-vertical"></div>
      <span :class="{ active: loginType == 2 }" @click="changeLoginType(2)"> 短信验证码登录 </span>
    </view>
    <uni-forms-item label="账号" name="username">
      <uni-easyinput
        v-model="username"
        :placeholderStyle="placeholderStyle"
        placeholder="请输入手机号码"
        @input="input"
      ></uni-easyinput>
    </uni-forms-item>

    <div class="line-horizontal"></div>
    <view v-if="loginType == 1">
      <uni-forms-item label="密码" name="password">
        <uni-easyinput
          type="password"
          v-model="password"
          :placeholderStyle="placeholderStyle"
          placeholder="请输入登录密码"
        ></uni-easyinput>
      </uni-forms-item>
      <div class="line-horizontal"></div>
    </view>

    <view v-if="loginType == 2">
      <uni-forms-item label="验证码" name="verificationCode">
        <uni-easyinput
          v-model="verificationCode"
          placeholder="请输入验证码"
          :placeholderStyle="placeholderStyle"
        ></uni-easyinput>

        <span class="get-code" @click="getCode()">{{ getCodeText }}</span>
      </uni-forms-item>
      <div class="line-horizontal"></div
    ></view>

    <view class="check-agreement">
      <nut-checkbox v-model="isChecked">
        <span class="check-agreement-text">我已阅读并同意 </span>
      </nut-checkbox>
      <span class="agreement-service" @click="checkAgreement(1)">服务协议</span>
      <span class="check-agreement-text">和</span>
      <span class="agreement-policy" @click="checkAgreement(2)">隐私政策</span>
    </view>

    <button class="btn-login" @click="loginIn">
      <view class="text">立即登录</view>
    </button>

    <view class="wx-user-profile" @click="getUserProfile()">
      <image
        style="width: 50px; height: 50px"
        src="/static/images/icon/wx.png"
        @error="imageError"
      ></image>
    </view>

    <nut-toast></nut-toast>
  </view>
</template>


<script setup>
import { reactive, ref } from "vue";
import { onReady, onLoad } from "@dcloudio/uni-app";
const title = ref("Hello");
const loginType = ref(1);
const changeLoginType = type => {
  loginType.value = type;
};
const placeholderStyle = ref("color: #999; font-size: 14px");
const username = ref("");
const password = ref("");
const verificationCode = ref("");
const getCodeText = ref("获取验证码");
const getCode = () => {
  if (getCodeText.value === "获取验证码") {
    console.log("getCode...");
    // 发送验证码
    getCodeText.value = "发送中...";
    let count = 60;
    let interval = setInterval(() => {
      if (count <= 0) {
        getCodeText.value = "获取验证码";
        clearInterval(interval);
        return;
      }
      getCodeText.value = count + "秒后重新获取";
      count--;
    }, 1000);
  }
};
const isChecked = ref(false);
const windowHeight = ref(750);

onReady(() => {});
onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  windowHeight.value = systemInfo.windowHeight;
  console.log("skill Launch", wx, systemInfo.windowHeight);
  wx.onAppShow(options => {
    console.log("skill AppShow");
  });
});

const getUserProfile = () => {
  let that = this;
  let code = "";
  wx.login({
    success: res => {
      code = res.code;
    }
  });
  // 获取用户信息
  wx.getUserProfile({
    lang: "zh_CN",
    desc: "用户登录",
    success: res => {
      let loginParams = {
        code: code,
        app: 3,
        encryptedData: res.encryptedData,
        iv: res.iv,
        rawData: res.rawData,
        signature: res.signature
      };
      //TODO: 处理登录
      console.log("loginParams", loginParams);
      //存储个人信息
      // wx.setStorageSync("userInfo", res.data.userInfo);
      // wx.setStorageSync("token", res.data.token);
      // wx.switchTab({
      //   url: "/pages/index/index"
      // });
    },
    // 失败回调
    fail: () => {
      // 弹出错误
      App.showError("已拒绝小程序获取信息");
    }
  });
};

const checkAgreement = type => {
  switch (type) {
    case 1:
      wx.navigateTo({
        url: "/pages/agreement/agreement-service"
      });
      break;
    case 2:
      wx.navigateTo({
        url: "/pages/agreement/agreement-policy"
      });
      break;
    default:
      break;
  }
};
const toast = useToast();
const loginIn = () => {
  if (!username.value) return toast.text("请输入手机号码");
  if (loginType.value == 1) {
    if (!password.value) return toast.text("请输入登录密码");
  } else {
    if (!verificationCode.value) return toast.text("请输入验证码");
  }
  if (!isChecked.value) return toast.text("请先同意用户协议");
};
</script>

<style lang='scss' scoped>
.container {
  background-color: #fff;
  align-items: stretch;
  overflow-x: hidden;
  position: relative;
  padding: 32px 28px 0;
}

.logo-name {
  width: 100%;
  height: 50rpx;
  line-height: 50rpx;
  font-size: 24px;
  margin-top: 40rpx;
  .logo-title {
    color: #ff7200;
  }
}
.login-type-box {
  display: flex;
  align-items: center;
  color: #999999;
  font-size: 15px;
  margin: 40px 0;

  .line-vertical {
    width: 1px;
    height: 12px;
    background-color: #e4e4e4;
    margin: 0 16px;
  }
  .active {
    font-weight: 600;
    color: #222222;
  }
}

.login {
  width: 100%;
  height: 80rpx;
  margin-top: 80rpx;
  font-size: 28rpx;
  color: #999;
  text-align: center;
}

.btn-login {
  display: flex;
  justify-content: center;
  height: 40px;
  background: #ff7200;
  align-items: center;
  border-radius: 4px;
  font-size: 16px;
  .text {
    font-size: 30rpx;
    color: #fff;
    margin-left: 10rpx;
  }
}

.img-w {
  height: 40rpx;
  width: 40rpx;
}

:deep(.uni-forms-item__label) {
  font-weight: 600 !important;
  font-size: 14px !important;
  color: #222222 !important;
}
:deep(.uni-forms-item__content) {
  .get-code {
    cursor: pointer;
    color: #ff9900;
    position: absolute;
    right: 0px;
    top: 8px;
  }
}
:deep(.uni-easyinput__content) {
  border: none;
}
:deep(.uni-easyinput__content.is-focused) {
  .uni-icons:before {
    color: #ff7200 !important;
  }
}

:deep(.uni-forms-item) {
  margin-bottom: 12px !important;
  margin-top: 12px !important;
}
.line-horizontal {
  height: 1px;
  background: #dddddd;
  border-radius: 2px;
}

:deep(.nut-checkbox) {
  margin-right: 2px;
}
.check-agreement {
  margin-top: 100px;
  margin-bottom: 16px;
  .check-agreement-text {
    font-size: 11px;
    color: #666666;
  }
  .agreement-service,
  .agreement-policy {
    font-size: 11px;
    color: #ff7200;
    text-decoration: underline;
  }
}
.wx-user-profile {
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%);
  img {
    width: 50px;
    height: 50px;
  }
}
</style>
