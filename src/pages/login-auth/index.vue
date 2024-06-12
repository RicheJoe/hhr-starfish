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

    <view class="wx-user-profile">
      <button
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        type="default"
        v-if="isChecked"
      >
        <image style="width: 50px; height: 50px" src="/static/images/icon/wx.png"></image>
      </button>
      <button type="default" v-else @click="checkFirst">
        <image style="width: 50px; height: 50px" src="/static/images/icon/wx.png"></image>
      </button>
    </view>

    <nut-toast></nut-toast>
  </view>
</template>


<script setup>
import { reactive, ref } from "vue";
import { onReady, onLoad } from "@dcloudio/uni-app";
import { loginByPassword, getVerCode, loginByVerCode, loginByWechat } from "@/server/login.js";
import { encryptPassword } from "@/utils/index.js";

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

const isChecked = ref(false);
const windowHeight = ref(750);
const toast = useToast(); //提示

onReady(() => {});
onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  windowHeight.value = systemInfo.windowHeight;
  // console.log("skill Launch", wx, systemInfo.windowHeight);
  // wx.onAppShow(options => {
  //   console.log("skill AppShow");
  // });
  console.log("环境：", import.meta.env.MODE, import.meta.env.VITE_QDS);
});

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
const loginIn = async () => {
  if (!username.value) return toast.text("请输入手机号码");
  if (!isChecked.value) return toast.text("请同意用户协议");
  if (loginType.value == 1) {
    if (!password.value) return toast.text("请输入登录密码");
    login2Password();
  } else {
    if (!verificationCode.value) return toast.text("请输入验证码");
    login2VerCode();
  }
};
// 账号密码登录
const login2Password = async () => {
  //登录接口
  uni.showLoading({
    title: "正在登录",
    mask: true
  });
  try {
    let res = await loginByPassword({
      loginAccount: username.value,
      password: encryptPassword(password.value),
      source: 17,
      agreeSelected: 1
    });
    console.log(res, "账号密码登录信息");
    if (res.tokenValue) {
      //存储个人信息
      uni.setStorageSync("userInfo", res);
      //跳转
      wx.switchTab({
        url: "/pages/index/index"
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    uni.hideLoading();
  }
};
//获取验证码
const getCode = () => {
  if (!username.value) return;
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
    queryVerCode();
  }
};
const queryVerCode = async () => {
  //登录接口
  let res = await getVerCode({
    phone: username.value,
    type: 1
  });
  console.log(res, "获取验证码信息");
};
//验证码登录
const login2VerCode = async () => {
  //登录接口
  uni.showLoading({
    title: "正在登录",
    mask: true
  });
  try {
    let res = await loginByVerCode({
      phone: username.value,
      code: verificationCode.value,
      source: 17,
      agreeSelected: 1,
      autoFlag: 0
    });
    console.log(res, "验证码登录信息");
    if (res.tokenValue) {
      //     {
      //     "tokenName": "qdsToken",
      //     "tokenValue": "475efeaa-3382-4c94-a986-c9a00743135f",
      //     "userId": "6c7057467444384f346944576968664b582b486436513d3d",
      //     "userName": "杨增勋",
      //     "userPhone": "15811079252"
      // }
      //存储个人信息
      uni.setStorageSync("userInfo", res);
      //跳转
      wx.switchTab({
        url: "/pages/index/index"
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    uni.hideLoading();
  }
};
//微信授权登录
const getPhoneNumber = async e => {
  isChecked.value = true;
  if (e.detail.code) {
    login2Wechat(e.detail.code);
  } else {
    toast.error("微信授权失败");
  }
};
const login2Wechat = async code => {
  let res = await loginByWechat({
    agreeSelected: 1,
    appId: "wxb88350bcb03296d5",
    code: code,
    loginType: 2,
    source: 17
  });
  console.log(res, "微信授权登录信息");
  if (res.tokenValue) {
    toast.success("登录成功");
    //存储个人信息
    uni.setStorageSync("userInfo", res);
    //跳转
    wx.switchTab({
      url: "/pages/index/index"
    });
  }
};
const checkFirst = () => {
  toast.text("请同意用户协议");
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
    right: 28px;
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
  button:after {
    border: none;
  }
  button[type="default"] {
    background-color: #fff;
    border-radius: 0;
  }
}
</style>
