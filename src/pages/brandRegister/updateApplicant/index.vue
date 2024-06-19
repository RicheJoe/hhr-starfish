<template>
    <scroll-view class="update-applicant">
        <view class="part-title">基本信息</view>
       <nut-cell-group title="">
          <nut-cell title="书式类型" is-link @click="selectBookType">
             <template #desc>
                <view class="form-value">{{bookTypes[formData.bookType]}}</view>
              </template>
          </nut-cell>
          <nut-cell title="申请人类型">
            <template #desc>
                <nut-radio-group v-model="formData.applicantType" direction="horizontal">
                  <nut-radio :label="1">企业</nut-radio>
                  <nut-radio :label="2">自然人</nut-radio>
                </nut-radio-group>  
            </template>
          </nut-cell>
          <nut-cell title="申请人名称">
             <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="请输入与营业执照一致的公司名称" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="统一社会信用代码" v-if="formData.applicantType==1">
             <template #desc>
                <nut-input v-model="formData.a" input-align="right" max-length="18" placeholder="请输入18位信用代码或15位注册号" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="证件类型" is-link v-if="formData.applicantType==2">
            <template #desc>
                <view class="form-value">身份证</view>
              </template>
          </nut-cell>
          <nut-cell title="证件号码" v-if="formData.applicantType==2"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" type="idcard" placeholder="请输入证件号码" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
            <nut-cell title="营业执照地址"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="请输入文本" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
          <nut-cell title="详细地址"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="请输入含有省市区的详细地址" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
            <nut-cell title="邮政编码"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" type="number" placeholder="请输入邮政编码" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
            <nut-cell title="申请人联系地址"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="用于接收该商标后续商标业务的法律文件" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
            <nut-cell title="联系地址邮编"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" type="number" placeholder="请输入邮政编码" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
            <nut-cell title="申请人邮箱"> 
            <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="请输入申请人邮箱" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
            </nut-cell>
        </nut-cell-group>
          <view class="part-title">联系人信息</view>
        <nut-cell-group title="">
          <nut-cell title="联系人姓名">
             <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="请输入联系人姓名" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="联系电话">
             <template #desc>
                <nut-input v-model="formData.a" input-align="right" type="number" max-length="11" placeholder="请输入联系人电话" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="电子邮箱">
             <template #desc>
                <nut-input v-model="formData.a" input-align="right" placeholder="请输入联系人邮箱" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
        </nut-cell-group>
           <view class="part-title">材料信息</view>
           <div class="file-box">
            <div class="sub-title">营业执照复印件：<div class="show-template">查看示例</div></div>
            <div class="sub-title">委托书模板：</div>
           </div>
    </scroll-view>
</template>

<script setup>
import { ref } from 'vue'
const checkPhone = /^1[3-9]\d{9}$/
const checkEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const bookTypes = ['中国大陆', '海外', '中国台湾', '中国香港', '中国澳门']
const formData = ref({
  applicantType: 1,
  bookType: '0',
})
const selectBookType = () => {
  uni.showActionSheet({
    itemList: bookTypes,
    success: function (res) {
      formData.bookType = res.tapIndex - 1
    },
  });
}
</script>

<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
.nut-input {
  padding: 0;
}
.input-placeholder {
  color: #999;
}
:deep(.nut-cell__title) {
  width: 240rpx;
  flex: revert;
}
.update-applicant {
  width: 100vw;
  overflow-y: auto;
  box-sizing: border-box;
  .part-title {
    font-size: 28rpx;
    font-weight: bold;
    padding: 0 32rpx;
    line-height: 40rpx;
    margin-top: 40rpx;
  }
  .form-value {
    color: #333;
  }
  .file-box {
    margin-top: 20rpx;
    padding: 0 32rpx;
    .sub-title {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #666;
      .show-template {
        color: #ff7200;
        text-decoration: underline;
      }
    }
  }
}
</style>
