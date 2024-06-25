<template>
  <view class="applicant-detail">
    <scroll-view class="scroll-view" scroll-y>
       <div class="scroll-content-box">
         <view class="part-box applicant-info">
          <view class="part-title">
            <view class="name">半空中</view>
            <view class="btn">
              <nut-icon name="edit" ></nut-icon>
            </view>
          </view>
          <view class="row">
            <view class="type">个人-中国大陆</view>
            <view class="code">10000000000</view>
          </view>
          <view class="row">
            <view class="address">中国xxx</view>
          </view>
            <view class="hr"></view>
          <view class="row">
              <view class="label">联系人：</view>
              <view class="value">半空中</view>
          </view>
          <view class="row">
              <view class="label">联系电话：</view>
              <view class="value">1000000000</view>
          </view>
          <view class="row">
              <view class="label">电子邮箱：</view>
              <view class="value">1@qq.com</view>
          </view>
        </view>
        <view class="part-box file-box">
          <view class="part-title">
            <view class="name">材料信息</view>
          </view>
           <template v-if="formData.applicantType==0">
            <view class="sub-title">{{formData.bookType==1?'身份证复印件：':'身份证明中文：'}}<view class="show-file-template" @click="showIdFileTemplate">查看示例</view></view>
            <view class="file-box-item">
              <view class="file-item">
                <image class="ivfileItemImageShow" v-if="formData.applicantIdCardImg" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </view>
            </view>
          </template>
          <template v-if="formData.applicantType==0 && (formData.bookType==2 || (formData.bookType!=1 && formData.subjectType==0))">
            <view class="sub-title">身份证明英文：<view class="show-file-template" @click="showIdFileTemplate">查看示例</view></view>
            <view class="file-box-item">
             <view class="file-item">
                <image class="ivfileItemImageShow" v-if="formData.idCardEnglishPic" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </view>
            </view>
          </template>
          <template v-if="formData.applicantType==1||formData.bookType==1">
            <view class="sub-title">{{formData.bookType==1?'营业执照复印件：':'主体资格证明中文：'}}<view class="show-file-template" @click="showLicenseTemplate">查看示例</view></view>
            <view class="file-box-item">
              <view class="file-item">
                <image class="ivfileItemImageShow" v-if="formData.applicantQualification" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </view>
            </view>
          </template>
          <template v-if="formData.applicantType==1 && (formData.bookType==2 || (formData.bookType!=1 && formData.subjectType==0))">
            <view class="sub-title">主体资格证明英文：<view class="show-file-template" @click="showLicenseTemplate">查看示例</view></view>
            <view class="file-box-item">
              <view class="file-item">
                <image class="ivfileItemImageShow" v-if="formData.licenseEnglishPic" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </view>
            </view>
          </template>
          <view class="sub-title">委托书模板：</view>
          <view class="file-box-item">
              <view class="file-item">
                <image class="ivfileItemImageShow" v-if="formData.applicantProxy" mode="widthFix" :src="formData.applicantProxyUrl"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_proxy.png"></image>
              </view>
              <view class="file-item">
                <image class="ivfileItemImageShow" v-if="formData.applicantProxyStatement" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_statement.png"></image>
              </view>
          </view>
        </view>
        <view class="part-box nice-type">
          <view class="part-title">
            <view class="name">预置类别</view>
            <view class="btn">
              <nut-icon name="edit"></nut-icon>
            </view>
          </view>
          <view class="preList" v-if="preList.length">
              <template v-for="(item) in preList" :key='item.id'>
                  <view class="preItem">
                      <view class="preTit">
                          <text>{{item.cgNum}} {{item.cgName}}</text>
                          <text>（共{{item.list.length}}项）</text>
                      </view>
                      <view class="preCont">
                          <template v-for="(item2,index2) in item.list" :key="item2.id">
                              <text v-if="!(!item.ifOpen && index2 > 6)">{{item2.cgNum}} {{item2.cgName}}</text>
                          </template>
                          <text style="color: #ff9900;" v-if="!item.ifOpen && item.list.length > 8">...</text>
                      </view>
                  </view>
              </template>
          </view>
          <view class="no-data" v-else>
            <image class="img" src="@/static/images/applicant/noPre.png" mode="widthFix"></image>
            <div class="text">点击编辑添加常用类及商品/服务项</div>
          </view>
        </view>
       </div>
    </scroll-view>
    <view class="footer">
      为他下单
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
const formData = ref({
  bookValue: '中国大陆',
  bookType: 1,
  applicantType: 1,
  applicantName: '',
  applicantEnglishName: '',
  certificatesType: 1,
  certificatesValue: '身份证',
  idCard: '',
  country: '中国',
  applicantAddress: '',
  applicantEnglishAddress: '',
  contactName: '',
  contactTel: '',
  contactEmail: '',
  code: '',
  applicantQualification: '',
  licenseEnglishPic: '',
  applicantIdCardImg: '',
  idCardEnglishPic: '',
  applicantProxy: '',
  applicantProxyOrder: '',
  applicantProxyStatement: '',
  subjectType: 1,
  area: 0, //区域id
  city: 0, //城市id
  prov: 0, //省会id
})
const preList = ref([])
const showIdFileTemplate = () => {
  uni.previewImage({
    current: 'https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-sfz.jpg',
    urls: ['https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-sfz.jpg']
  })
}
const showLicenseTemplate = () => {
  uni.previewImage({
    current: 'https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-yyzz.jpg',
    urls: ['https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-yyzz.jpg']
  })
}
</script>

<style lang="scss" scoped>
view {
  box-sizing: border-box;
  line-height: 1.4;
}
.applicant-detail {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .scroll-view {
    flex: 1 1 1px;
    overflow-y: auto;
    box-sizing: border-box;
    .scroll-content-box{
       padding: 0 26rpx 30rpx;
    }
    .part-box {
      .part-title {
        display: flex;
        align-items: center;
        margin-bottom: 26rpx;
        .name {
          flex: 1;
          min-width: 0;
          font-size: 30rpx;
          color: #333;
          font-weight: bold;
        }
        .btn {
          margin-left: 40rpx;
        }
      }
      & + .part-box {
        margin-top: 60rpx;
      }
    }
    .applicant-info {
      .row {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 26rpx;
        &:first-of-type {
          margin-bottom: 15rpx;
        }
        & + .row {
          margin-top: 10rpx;
        }
        .name {
          font-size: 30rpx;
          color: #333;
          font-weight: bold;
        }
        .label {
        }
      }
      .hr {
        width: 100%;
        height: 1px;
        background-color: #eee;
        margin: 20rpx 0;
      }
    }
    .file-box {
      .sub-title {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #666;
        margin: 24rpx 0 26rpx;
        .show-file-template {
          color: #ff7200;
          text-decoration: underline;
        }
      }
      .file-box-item {
        display: grid;
        grid-template-columns: repeat(auto-fill, 128rpx);
        grid-gap: 30rpx;
        .file-item {
          width: 128rpx;
          height: 180rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4rpx;
          background: #f7f7f7;
          overflow: hidden;
          .ivfileItemImageShow {
            width: 100rpx;
          }
          .ivfileItemImageUpload {
            height: 80rpx;
          }
        }
      }
    }
    .nice-type {
      .preList {
        margin-top: 30rpx;
      }
      .preTit text {
        display: inline-block;
      }

      .preTit text:nth-child(1) {
        font-size: 26rpx;
        font-weight: bold;
        line-height: 36rpx;
      }

      .preTit text:nth-child(2) {
        font-size: 24rpx;
        line-height: 36rpx;
        color: #999;
      }
      .preItem {
        margin-top: 40rpx;
      }
      .preCont {
        margin-top: 14rpx;
        padding: 12rpx 20rpx;
        background: #f8f8f8;
        border-radius: 4rpx;
      }
      .preCont text {
        display: inline-block;
        margin-top: 8rpx;
        width: 50%;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #666;
      }
      .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        .img {
          width: 440rpx;
        }
        .text {
          margin-top: 10rpx;
          font-size: 26rpx;
          color: #ddd;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 90rpx;
    background: #ff9900;
    border-top: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #fff;
  }
}
</style>