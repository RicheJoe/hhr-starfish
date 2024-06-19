<template>
  <view class="content">
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <img src="/static/images/icon/pay-success.png" alt="" />
    </view>

    <nut-button type="default" @click="toPage('/pages/brandRegister/applicantList/index')"
      >申请人编辑</nut-button
    >

    <nut-button type="success" @click="toPage('/pages/brandRegister/niceClassify/index')"
      >尼斯分类选择</nut-button
    >
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
const title = ref("HHR INDex");
const toPage = url => {
  wx.navigateTo({
    url
  });
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
