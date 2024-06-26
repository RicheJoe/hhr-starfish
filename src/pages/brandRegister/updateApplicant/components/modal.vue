<template>
  <view class="modalBg" v-if="config.ifShowModal" ref="modalRef">
    <view class="modalWrap">
      <view class="modalTit" :style="{ color: config.modalTitColor }">{{ config.modalTit }}</view>
      <view v-if="config.modalTip" class="modalItem modalTip">
        <text
          class="modalTipText"
          :style="{ 'text-align': config.modalTipLeft ? 'left' : 'center' }"
          >{{ config.modalTip }}</text
        >
      </view>
      <block v-for="item in config.modalKVArr" :key="item.id">
        <view class="modalItem modalKV">
          <text class="modalKVKey">{{ item.key }}</text>
          <text class="modalKVValue">{{ item.value }}</text>
        </view>
      </block>
      <view class="modalItem modalInp" v-if="config.modalInp">
        <text class="modalInpKey" v-if="config.modalInp.name">{{ config.modalInp.name }}</text>
        <input
          class="modalInpCont"
          :focus="true"
          :placeholder="config.modalInp.placeholder"
          v-model="inpValue"
        />
      </view>
      <view class="modalBtnWrap" v-if="config.ifShowBigBtn">
        <view class="modalBtn modalBtnBig" @click="clickFn(2)">
          {{ config.bigSureBtnText ? config.bigSureBtnText : "更换申请人" }}</view
        >
      </view>
      <view class="modalBtnWrap" v-else>
        <view class="modalBtn modalBtnCancel" @click="clickFn(0)" v-if="!config.cancelBtnHidden">
          {{ config.cancelBtnText ? config.cancelBtnText : "取消" }}</view
        >
        <view class="modalBtn" @click="clickFn(1)">{{
          config.sureBtnText ? config.sureBtnText : "确定"
        }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 配置信息

// ifShowModal:false    是否显示

// modalTit: ''         标题

//modalTitColor:''      标题颜色

// modalTip:''          提示内容

// modalTipLeft:false  提示内容是否居中

// modalKVArr: []       展示信息列表 如：[{key:'发票抬头',value:'李帅星科技公司'},{key:'发票抬头2',value:'李帅星科技公司2'}]

// modalInp:{}          输入的内容 如： {name:'纳税号',placeholder:'请输入纳税号'}

// ifShowBigBtn:false   是否显示大按钮

// bigSureBtnText:''    大按钮内容

// cancelBtnText:''     取消按钮内容

// cancelBtnHidden:false 是否隐藏取消按钮

// sureBtnText:''       确定按钮内容

//appendToBody    是否插入body wx不可用
import { ref, watch, nextTick } from "vue";
const modalRef = ref(null);
const props = defineProps({
  config: {
    type: Object,
    value: {}
  }
});
watch(
  () => props.config.ifShowModal,
  newVal => {
    if (newVal) {
      nextTick(() => {
        if (newVal.appendToBody) document.body.appendChild(modalRef.value.$el);
      });
    }
  }
);
const emits = defineEmits(["handleClick"]);
const inpValue = ref("");
const clickFn = type => {
  //0是取消按钮 1确定按钮 2点击大按钮
  const data = {
    type: type,
    value: inpValue.value
  };

  emits("handleClick", data);
};

const resolve = ref(null);
const reject = ref(null);
const showModal = options => {
  props.config.ifShowModal = true;
  props.config.modalTit = options.title || "提示";
  props.config.modalTip = options.content || "";
  return new Promise((resolve, reject) => {
    resolve.value = resolve;
    reject.value = reject;
  });
};
const handleCancel = () => {
  props.config.ifShowModal = false;
  reject.value({ cancel: true });
};
const handleConfirm = () => {
  props.config.ifShowModal = false;
  resolve.value({ confirm: true });
};
</script>

<style lang="scss" scoped>
.modalBg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modalWrap {
  padding: 40rpx;
  width: 590rpx;
  border-radius: 8rpx;
  background: #fff;
}
.modalTit {
  margin-bottom: 48rpx;
  font-size: 36rpx;
  line-height: 36rpx;
  text-align: center;
  font-weight: bold;
}
.modalItem {
  margin-top: 32rpx;
  display: flex;
  align-items: center;
}
.modalTip {
  font-size: 0;
}
.modalTipText {
  display: block;
  width: 100%;
  font-size: 28rpx;
  line-height: 48rpx;
  text-align: center;
}
.modalTip.center {
  display: flex;
  font-size: 28rpx;
  line-height: 48rpx;
  justify-content: center;
}
.modalKVKVKey {
  line-height: 32rpx;
  color: #666;
}
.modalKVValue {
  margin-left: 32rpx;
  line-height: 30rpx;
}
.modalInp {
  display: flex;
  flex-direction: row;
}
.modalInpKey {
  line-height: 32rpx;
  color: #666;
  margin-right: 32rpx;
}
.modalInpCont {
  padding-left: 20rpx;
  width: 1px;
  flex: 1;
  height: 80rpx;
  background: #f6f6f6;
  border-radius: 4rpx;
}
.modalBtnWrap {
  margin-top: 50rpx;
  display: flex;
  align-content: center;
  justify-content: center;
}
.modalBtn {
  margin: 0 15rpx;
  width: 280rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #ff9900;
  font-size: 30rpx;
  color: #fff;
  text-align: center;
  line-height: 80rpx;
}
.modalBtnCancel {
  background: #ffc266;
}
.modalBtnBig {
  width: 580rpx;
}
</style>