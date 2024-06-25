<template>
  <view class="applicant-list">
    <view class="header">
      <nut-searchbar v-model="keyword" placeholder="请输入申请人名称查找，或点击右侧新建">
        <template #rightout>新建</template>
      </nut-searchbar>
    </view>
    <scroll-view class="scroll-view" scroll-y>
     <div class="scroll-content-box">
       <div class="card-box" v-for="item in 10" :key="item">
        <div class="top">
          <div class="row">
            <div class="name">半空中</div>
            <div class="btn">
              <nut-icon name="rect-right"></nut-icon>
            </div>
          </div>
          <div class="row">
            <div class="type">个人-中国大陆</div>
          </div>
        </div>
        <div class="hr"></div>
        <div class="bottom">
          <div class="row">
            <div class="contact-name">半空中</div>
            -
            <div class="contact-name">130000000</div>
          </div>
          <div class="row">
            <div class="contact-email">1@qq.com</div>
            <div class="order">为他下单</div>
          </div>
        </div>
      </div>
     </div>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from "vue"
const keyword = ref('')
</script>

<style lang="scss" scoped>
view {
  box-sizing: border-box;
  line-height: 1.4;
}
.applicant-list {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: rgb(249, 249, 249);
  .header {
    background-color: #fff;
  }
  .scroll-view {
    flex: 1 1 1px;
    overflow-y: auto;
    box-sizing: border-box;
    .scroll-content-box {
      padding: 26rpx;
      .card-box {
        background-color: #fff;
        border-radius: 6rpx;
        padding: 24rpx;
        box-shadow: 0 2rpx 12rpx 0 rgba(100, 100, 100, 0.1);
        &+.card-box{
          margin-top: 24rpx;
        }
        .row {
          display: flex;
          align-items: center;
          font-size: 22rpx;
          color: #666;
          & + .row {
            margin-top: 10rpx;
          }
          .name {
            font-size: 24rpx;
            font-weight: bold;
            color: #333;
            flex: 1;
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .btn {
            margin-left: 20rpx;
          }
          .type {
            font-size: 20rpx;
          }
          .contact-email {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .order {
            margin-left: 20rpx;
          }
        }
        .hr {
          width: 100%;
          height: 1px;
          background: #ddd;
          margin: 16rpx 0;
        }
      }
    }
  }
}
</style>
