<template>
  <view class="chooseBg" v-if="showChooseWrap">
    <div class="custom-content">
      <view class="chooseHead">
        <view>已选择类别服务项</view>
        <view @click="clearChooseAll">
          <image mode="widthFix" src="@/static/images/brandRegister/clear.png"></image>
          <text>清空文件夹</text>
        </view>
        <image
          class="chooseClose"
          src="@/static/images/brandRegister/closeW.png"
          @click="closeChooseFn"
        ></image>
      </view>

      <view class="chooseList">
        <view class="choose01Item" v-for="(item, ind) in chooseList" :key="item.cgId">
          <view class="chooseTitle" v-if="item.cgList.length">
            <view class="chooseTitleLeft" @click="changeExpand(item)">
              <view>
                <image
                  class="c2"
                  src="@/static/images/brandRegister/tipR.png"
                  v-if="!item.propsExpand"
                ></image>
                <image
                  class="c1"
                  src="@/static/images/brandRegister/tipRAct.png"
                  v-if="item.propsExpand"
                ></image>
              </view>
              <text>{{ item.cgNum }} {{ item.cgName }}</text>
            </view>
            <view class="chooseTitleRight" @click="clearChooseOne(item, ind)">
              <image src="@/static/images/brandRegister/delete.png"></image>
              <text>清空</text>
            </view>
          </view>
          <view class="chooseList-l2" v-if="item.propsExpand">
            <block v-for="(item2, ind2) in item.cgList" :key="item2.cgId">
              <view class="chooseList-l2-item" v-if="item2.cgList.length">
                <text></text>
                <text>{{ item2.cgNum + item2.cgName }}</text>
                <text>({{ item2.cgList.length }})</text>
                <image
                  src="@/static/images/brandRegister/closeG.png"
                  @click="clearChooseL2(item, item2, ind2)"
                ></image>
              </view>

              <view
                class="chooseList-l3-item"
                v-for="(item3, ind3) in item2.cgList"
                :key="item3.cgId"
              >
                <text>{{ item3.cgNum + item3.cgName }}</text>
                <image
                  src="@/static/images/brandRegister/closeG.png"
                  @click="clearChooseL3(item, item2, ind2, item3, ind3)"
                ></image>
              </view>
            </block>
          </view>
        </view>
      </view>
    </div>

    <Modal @handleClick="modalClick" :config="confirmPopConfig" />
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Modal from "@/pages/brandRegister/updateApplicant/components/modal";

const props = defineProps({
  showChooseWrap: { type: Boolean, default: false },
  niceClassifyListFormat: { type: Array, default: [] }, //选中数据的格式化
  chooseAllList: { type: Array, default: [] }, //三级所有
  chooseListL1: { type: Array, default: [] }, //一级分类
  chooseListL2: { type: Array, default: [] }
});

const isVisible = computed(() => {
  return props.showChooseWrap;
});

const chooseList = ref([]);
watch(
  () => props.niceClassifyListFormat,
  n => {
    //处理传入的选中值 为三级结构
    n.map(item => {
      let res = JSON.parse(JSON.stringify(item));
      //获取二级数据
      let resL2List = res.checkList.map(i => i.parents).flat(Infinity);
      const resL2ListUnique = resL2List.reduce((accumulator, currentValue) => {
        if (!accumulator.some(item => item.cgNum === currentValue.cgNum)) {
          accumulator.push(currentValue);
        }
        return accumulator;
      }, []);

      resL2ListUnique.forEach(element => {
        res.checkList.forEach(i => {
          delete i.parents;
        });
        element.cgList = res.checkList.filter(i => i.cgParent == element.cgId);
      });

      item.cgList = resL2ListUnique;
      item.propsExpand = true;
      console.log(item, "format item");
    });
    chooseList.value = JSON.parse(JSON.stringify(n));
  }
);

//关闭页面
const closeChooseFn = () => {
  emits("closeChooseFn");
};
const confirmPopConfig = ref({});
//清空所有
const clearChooseAll = () => {
  confirmPopConfig.value = {
    ifShowModal: true,
    modalTit: "温馨提示",
    modalTip: "确定清空文件夹吗"
  };
};
const modalClick = e => {
  if (e.type == 1) {
    //清空当前所有
    chooseList.value = [];
    emits("clearChooseAll");
    confirmPopConfig.value = { ifShowModal: false };
  } else {
    confirmPopConfig.value = { ifShowModal: false };
  }
};
//清空一大类
const clearChooseOne = (item, ind) => {
  chooseList.value.splice(ind, 1);
  emits("clearChooseOne", item);
};
//清空二级类别
const clearChooseL2 = (item, item2, ind2) => {
  item.cgList.splice(ind2, 1);
  emits("clearChooseL2", item, item2);
};
//清空三级类别
const clearChooseL3 = (item, item2, ind2, item3, ind3) => {
  item2.cgList.splice(ind3, 1);
  if (item2.cgList.length == 0) {
    item.cgList.splice(ind2, 1);
  }
  emits("clearChooseL3", item, item2, item3);
};
const emits = defineEmits([
  "closeChooseFn",
  "clearChooseAll",
  "clearChooseOne",
  "clearChooseL2",
  "clearChooseL3"
]);
const changeExpand = item => {
  item.propsExpand = !item.propsExpand;
};
</script>

<style scoped lang="scss">
.chooseBg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 11;
}

.custom-content {
  padding: 34rpx;
  margin-bottom: 120rpx;
  background: #fff;
  border-radius: 28rpx 28rpx 0 0;
  width: 100%;
  position: relative;
  box-sizing: border-box;
}
.chooseClose {
  position: absolute;
  right: 30rpx;
  top: -50rpx;
  width: 26rpx;
  height: 26rpx;
  padding: 12rpx;
}

.chooseHead {
  display: flex;
  justify-content: space-between;
}
.chooseHead view:nth-child(1) {
  font-size: 28rpx;
  font-weight: bold;
  line-height: 40rpx;
}

.chooseHead view:nth-child(2) {
  display: flex;
  align-items: center;
}
.chooseHead view image {
  width: 34rpx;
}

.chooseHead view:nth-child(2) text {
  margin-left: 20rpx;
  font-size: 24rpx;
  color: #999;
}
.chooseList {
  margin-top: 30rpx;
  height: 760rpx;
  overflow-y: scroll;
}

.choose01Item {
  margin-top: 24rpx;
}
.chooseTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  background: #f8f8f8;
  padding: 0 16rpx;
}
.chooseTitleLeft {
  display: flex;
  align-items: center;
  flex: 1;
  view {
    width: 22rpx;
    height: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
  }
  .c1 {
    width: 20rpx;
    height: 14rpx;
  }

  .c2 {
    width: 14rpx;
    height: 20rpx;
  }
}
.chooseTitleRight {
  display: flex;
  justify-content: space-between;
  align-items: center;

  image {
    width: 24rpx;
    height: 28rpx;
    margin-right: 12rpx;
  }
}

.chooseList-l2-item {
  display: flex;
  padding: 24rpx 0 12rpx 24rpx;
  position: relative;
  image {
    width: 22rpx;
    height: 22rpx;
    position: absolute;
    right: 0px;
    top: 28rpx;
    right: 42rpx;
    padding: 12rpx;
  }
}
.chooseList-l2-item text:nth-child(1) {
  width: 8rpx;
  height: 28rpx;
  background: #ff9900;
}
.chooseList-l2-item text:nth-child(2) {
  margin-left: 20rpx;
  max-width: 450rpx;
  font-size: 24rpx;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.chooseList-l2-item text:nth-child(3) {
  margin-left: 10rpx;
  font-size: 24rpx;
  font-weight: bold;
  overflow: hidden;
}
.chooseList-l3-item {
  padding: 24rpx 0;
  position: relative;
  image {
    width: 22rpx;
    height: 22rpx;
    position: absolute;
    right: 0px;
    top: 34rpx;
    right: 42rpx;
    padding: 12rpx;
  }
}
.chooseList-l3-item text {
  margin-left: 52rpx;
  display: inline-block;
  width: 560rpx;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #333;
}
</style>