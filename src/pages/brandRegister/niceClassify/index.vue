<template>
  <view class="nice-wrapper">
    <nut-safe-area position="top" />
    <nut-steps :current="2">
      <nut-step> 1 </nut-step>
      <nut-step>2</nut-step>
      <nut-step>3</nut-step>
      <nut-step>4</nut-step>
    </nut-steps>

    <nut-searchbar
      v-model="searchValue"
      placeholder="请输入商品或服务名称、关键词进行查询"
      @change="inputSearch"
    >
      <template #leftin>
        <nut-icon name="search2" />
      </template>
    </nut-searchbar>

    <view class="noMsgTip" v-if="noSearchRes">
      <nut-icon name="issue" custom-color="#fa2c19"></nut-icon>
      <text>没有包含上述关键词的商品或服务</text>
    </view>

    <!-- 尼斯分类-->
    <div class="nice-all">
      <div class="nice-all-level-1">
        <div
          v-for="item in niceClassify"
          :key="item.cgId"
          :class="{ active: item.cgId == checkedCgId }"
          class="nice-all-level-1-name"
          @click="changeCheckCgId(item.cgId)"
          v-show="item.show"
        >
          <nut-badge :value="l3CheckedNum(item)">
            <view> {{ item.cgNum + " " + item.cgName }} </view>
          </nut-badge>
          <view class="ifSearch" v-show="searchResult.length"></view>
        </div>
      </div>

      <div class="nice-level-child">
        <next-tree
          :selectParent="false"
          :checkStrictly="true"
          funcMode="checkbox"
          ref="nextTreeAsyncRef"
          :treeData="treeData"
          :ifSearch="false"
          valueKey="cgId"
          labelKey="cgName"
          childrenKey="cgList"
          @change="niceChange"
        >
          <template v-slot:label="{ data: { cgName, cgNum, dirLevel } }">
            <view class="line-block" style="width: 90%">
              <view
                class="ifSearch"
                v-if="searchResult.length && dirLevel == 1"
                style="position: relative; top: 18rpx; left: -48rpx"
              ></view>
              <text>{{ cgNum }} {{ cgName }}</text>
            </view>
          </template>
        </next-tree>
      </div>
    </div>
    <view class="footerWrap">
      <view class="fileWrap">
        <image
          src="@/static/images/brandRegister/clickNum1.png"
          v-if="chooseAllList.length"
          @click="showChooseWrap"
        />
        <image src="@/static/images/brandRegister/clickNum0.png" v-else />
        <!-- <text wx:if="{{chooseList.length}}"></text> -->
      </view>
      <view class="clickNumWrap">
        <view class="clickNum">
          <view
            >合计：<text>￥{{ totalMoney }}</text></view
          >
          <view
            >已选<text>{{ totalNum01 }}</text
            >个类别，共<text>{{ chooseAllList.length }}</text
            >个小项</view
          >
        </view>
        <view class="nextBtn" @click="saveNiceClassify">保存</view>
      </view>
    </view>
    <nut-safe-area position="bottom" />
    <chosenModal
      :showChooseWrap="showChooseWrapVisible"
      @closeChooseFn="showChooseWrapVisible = false"
      :niceClassifyListFormat="niceClassifyListFormat"
      @clearChooseAll="clearChooseAll"
      @clearChooseOne="clearChooseOne"
      @clearChooseL2="clearChooseL2"
      @clearChooseL3="clearChooseL3"
    />

    <nut-dialog
      title="温馨提示"
      content="确定清空文件夹吗"
      v-model:visible="confirmPopVisible"
      @ok="modalClickOk"
    />

    <nut-dialog
      title="温馨提示"
      v-model:visible="submitPopVisible"
      custom-class="submit-pop"
      text-align="left"
      no-footer
    >
      <view class="submit-tips">以下类别选择的商品/服务项 不足 10 项，请确认是否需要修改?</view>
      <view class="color">注:不足 10 项时按 10 项收费</view>
      <scroll-view class="viewLackGoodsDialogScroll" scroll-y>
        <view v-for="nice in niceClassify" :key="nice.cgId">
          <view class="lack-item" v-if="l3CheckedNum(nice) && l3CheckedNum(nice) < 10">
            第{{ nice.cgNum }}类{{ nice.cgName }},已选择
            <text class="orange"> {{ l3CheckedNum(nice) }}</text>
            个项目;
          </view>
        </view>
      </scroll-view>
      <view class="tvLackGoodsDialogEdit" @click="submitPopVisible = false">重新修改</view>
      <view class="tvLackGoodsDialogNext" @click="nextStep">继续下一步</view>
    </nut-dialog>
  </view>
</template>

<script setup>
import { ref, computed, nextTick, reactive } from "vue";
import _ from "loadsh";
import {
  niceAllType,
  queryNiceListByName,
  queryNiceListByFirst,
  benefitsRemain
} from "@/server/brand.js";
import { getUserInfo } from "@/utils/index.js";
import { onReady, onLoad } from "@dcloudio/uni-app";
import nextTree from "./components/next-tree/next-tree.vue";
import chosenModal from "./components/chosenModal.vue";

const searchValue = ref("");
const noSearchRes = ref(false);
const niceClassify = ref([]); //尼斯分类
const checkedCgId = ref(0); //选中的大类ID
const treeData = ref([]);
const searchResult = ref([]); //检索的结果
const starfishDiscountNumber = ref(0); //优惠下单数量
const showChooseWrapVisible = ref(false); //已经选的弹窗
const chooseListL2 = ref([]);

//海星会员剩余优惠下单数量
const queryDiscountNumber = async () => {
  let res = await benefitsRemain({
    userId: getUserInfo().userId,
    productNo: "QPC10324",
    productAttributeId: 0
  });
  starfishDiscountNumber.value = res.remain;
  console.log("海星会员剩余优惠下单数量:", res.remain);
};
//尼斯分类45大类
const initNiceAllType = async () => {
  let res = await niceAllType({ containThree: 1 });
  res.list.forEach(e => {
    e.checkList = []; //选中的数据
    e.show = true; //是否展示 后面筛选用到
  });
  niceClassify.value = res.list;
  checkedCgId.value = res.list.length && res.list[0].cgId;
  //初始化尼斯分类 默认选择第一个
  nextTick(() => {
    changeCheckCgId(checkedCgId.value);
  });
};
// watch(
//   niceClassify,
//   (newVal, oldVal) => {
//     console.log("User changed:", newVal, oldVal);
//   },
//   { deep: true }
// );

//当前大类已经选中的三级数量
const l3CheckedNum = computed(item => {
  return item => (item.checkList && item.checkList.length) || 0;
});
//当前大类已经选中的一级数量
const totalNum01 = computed(() => {
  return niceClassify.value.filter(i => i.checkList.length).length;
});
//所有大类已经选中的三级数量
const chooseAllList = computed(() => niceClassify.value.map(i => i.checkList).flat());
//格式化后的 只保留选择的
const niceClassifyListFormat = ref([]);
//所有大类的选中总价
const totalMoney = computed(() => {
  //无海星优惠数量没个大类320
  let eachProductPrice = 32; //每个小件32元
  //有海星优惠数量每个大类270
  if (starfishDiscountNumber.value && starfishDiscountNumber.value >= chooseAllList.value) {
    eachProductPrice = 27;
  }
  return niceClassify.value.reduce((pre, cur) => {
    if (cur.checkList.length > 0) {
      let num = cur.checkList.length >= 10 ? cur.checkList.length : 10;
      return pre + num * eachProductPrice;
    } else {
      return pre;
    }
  }, 0);
});
//关键字检索
const inputSearch = _.debounce(async () => {
  if (!searchValue.value) {
    niceClassify.value.forEach(i => {
      i.show = true; //全部展开
    });
    searchResult.value = [];
    noSearchRes.value = false;
    //清空筛选 默认选一
    nextTick(() => {
      changeCheckCgId(niceClassify.value[0].cgId);
    });
    return;
  }
  let res = await queryNiceListByName({
    cgName: searchValue.value,
    containOther: 0
  });
  if (!res.cgList.length) {
    noSearchRes.value = true;
  } else {
    noSearchRes.value = false;
    treeData.value = [];
    searchResult.value = res.cgList;
    console.log("检索：", searchValue.value, searchResult.value);
    echoChecked();
  }

  // return res;
}, 300);
//根据检索结果 或者 保存的结果回显
const echoChecked = res => {
  res = searchResult.value;
  //res 是检索的结果
  niceClassify.value.forEach(e => {
    e.show = false; //默认隐藏一级
  });
  res.forEach(ele => {
    niceClassify.value.forEach(e => {
      if (e.cgId == ele.cgId) {
        e.show = true; //查询到的一级显示
      }
    });
  });
  nextTick(() => {
    if (niceClassify.value.find(i => i.show))
      changeCheckCgId(niceClassify.value.find(i => i.show).cgId);
  });
};
/**
 * 点击左侧一级分类 查对应的二级
 * searchRes 选填 为检索的结果 如果没有传 就是点击一级分类
 */
const changeCheckCgId = async cgId => {
  try {
    uni.showLoading({
      mask: true
    });
    checkedCgId.value = cgId;

    let res = await queryNiceListByFirst({
      cgId: cgId,
      containThree: 1 // 是否查询小项 0是不查询 1是查询
    });

    //将查询结果挂载到当前选中的一级下
    treeData.value = searchResult.value.length
      ? searchResult.value.find(item => item.cgId === cgId).cgList
      : res;

    let checkedItem = niceClassify.value.find(i => i.cgId == checkedCgId.value);
    checkedItem.checkList.forEach(item => {
      treeData.value.forEach(ele => {
        ele.cgList.forEach(e => {
          if (e.cgId == item.cgId) {
            e.checked = true;
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  } finally {
    nextTick(() => {
      uni.hideLoading();
      // console.log("选择的id  ", cgId);
      // console.log("下级treeData", treeData.value);
    });
  }
};
//点击二级分类
const changeCheckCgIdL2 = item => {
  //展开二级分类
  item.isExpand = !item.isExpand;
};
//点击三级分类
const changeCheckCgIdL3 = item => {
  item.isChecked = !item.isChecked;
  nextTick(() => {
    if (item.isChecked) {
      //选中时 将三级数据挂载在一级下
      niceClassify.value.find(i => i.cgId == checkedCgId.value).checkList.push(item);
    } else {
      //取消选中
      let nowCheckedList = niceClassify.value.find(i => i.cgId == checkedCgId.value).checkList;
      nowCheckedList.splice(
        nowCheckedList.findIndex(i => i.cgId == checkedCgId.value),
        1
      );
    }
    console.log(niceClassify.value.find(i => i.cgId == checkedCgId.value).checkList);
  });
};
const showChooseWrap = () => {
  if (showChooseWrapVisible.value) return;
  //清空筛选
  searchValue.value = "";
  inputSearch();
  niceClassifyListFormat.value = niceClassify.value.filter(i => i.checkList.length);
  console.log("niceClassifyListFormat", niceClassifyListFormat.value);

  showChooseWrapVisible.value = true;
};
//确认清空弹窗
const confirmPopVisible = ref(false);
//清空所有选中的
const clearChooseAll = () => {
  confirmPopVisible.value = true;
};
const modalClickOk = e => {
  //清空当前所有
  initNiceAllType();
  niceClassifyListFormat.value = [];
  nextTick(() => {
    confirmPopVisible.value = false;
  });
};
//清空某一大类
const clearChooseOne = item => {
  let handleNice = niceClassify.value.find(i => i.cgId == item.cgId);
  handleNice.checkList = [];
  changeCheckCgId(item.cgId);
};
//清空某一大类下的二级
const clearChooseL2 = (classL1, classL2) => {
  let handleNice = niceClassify.value.find(i => i.cgId == classL1.cgId);
  handleNice.checkList = handleNice.checkList.filter(i => i.cgParent != classL2.cgId);
  changeCheckCgId(classL1.cgId);
};
//清空某一大类下的三级
const clearChooseL3 = (classL1, classL2, classL3) => {
  let handleNice = niceClassify.value.find(i => i.cgId == classL1.cgId);
  handleNice.checkList = handleNice.checkList.filter(i => i.cgId != classL3.cgId);
  changeCheckCgId(classL1.cgId);
};

//保存前确认弹窗
const submitPopVisible = ref(false);
//保存尼斯分类
const saveNiceClassify = () => {
  if (!totalNum01.value)
    return uni.showToast({
      title: "至少选择一个分类",
      icon: "none",
      mask: true
    });

  if (niceClassify.value.find(i => i.checkList.length < 10)) {
    submitPopVisible.value = true;
  } else {
    nextStep();
  }
};
//继续下一步
const nextStep = () => {
  console.log(chooseAllList.value, "选中的数据");
};

//树选择 res只有当前大类的数据
const niceChange = res => {
  console.log("当前大类选中的数据", res);
  niceClassify.value.find(i => i.cgId == checkedCgId.value).checkList = res.filter(
    i => i.dirLevel == 2
  );
};

onReady(() => {
  initNiceAllType();
  queryDiscountNumber();
});
</script>

<style scoped lang='scss'>
.nice-wrapper {
  height: calc(100vh - 24rpx);
  display: flex;
  flex-direction: column;
  padding-top: 24rpx;
  overflow: hidden;
}
.nice-all {
  flex: 1;
  display: flex;
  margin-top: 24rpx;
  overflow: hidden;
  padding-bottom: 140rpx;
  .nice-all-level-1 {
    overflow-y: auto;
    width: 32%;
    cursor: pointer;
    font-size: 34rpx;
    :deep .nut-badge__content {
      right: 0rpx;
      top: 0rpx;
    }
  }
  .nice-all-level-1-name {
    padding: 24rpx;
    overflow-y: auto;
    position: relative;
  }
  .nice-all-level-1-name.active {
    color: #ff7200;
    background-color: #f5f5f5;
  }
  .ifSearch {
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    background: #ff9900;
    position: absolute;
    left: 10rpx;
    top: 42rpx;
  }

  // 右侧
  .nice-level-child {
    overflow-y: auto;
    width: 68%;
    background-color: #f5f5f5;
    padding-top: 18rpx;
  }
  .l2-title {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24rpx;
    font-size: 32rpx;
    flex: 1;
    padding: 12rpx 0;
    position: relative;
    :deep .nut-icon {
      font-size: 24rpx;
      transform: rotate(90deg);
      transition: transform 0.3s ease;
      display: inline-block;
      width: 64rpx;
    }
    :v-deep.ifSearch {
      position: relative;
      top: 24rpx;
      left: -10rpx;
    }
  }
  .l2-title.active {
    color: #ff7200;
    :deep .nut-icon {
      color: #ff7200 !important;
    }
  }
  .l2-title.expand {
    :deep .nut-icon {
      transform: rotate(180deg);
    }
  }
  .nice-all-level-2-name {
    display: flex;
    flex-wrap: wrap;
    padding: 12rpx;
  }
  .nice-all-level-3 {
    margin-left: 64rpx;
    width: 90%;
    font-size: 28rpx;

    .nice-all-level-3-name {
      color: #999999;
      padding: 20rpx 0;
      display: flex;
      justify-content: space-between;
      min-height: 50rpx;
      :deep .nut-icon {
        color: transparent;
      }
    }
    .nice-all-level-3-name.checked {
      color: #ff7200 !important;
      :deep .nut-icon {
        color: #ff7200 !important;
      }
    }
  }
}
.footerWrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 120rpx;
  background: #fff;
  border-top: 2rpx solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 12;

  image {
    display: block;
    width: 116rpx;
    height: 96rpx;
    margin-left: 32rpx;
  }
}
.fileWrap text {
  position: absolute;
  right: 4rpx;
  top: 4rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ff4422;
}

.clickNumWrap {
  margin-right: 28rpx;
  display: flex;
  align-items: center;
}

.clickNum view:nth-child(1) {
  text-align: right;
  font-size: 28rpx;
  line-height: 32rpx;
}

.clickNum view:nth-child(1) text {
  color: #ff4422;
}

.clickNum view:nth-child(2) {
  margin-top: 8rpx;
  text-align: right;
  font-size: 24rpx;
  line-height: 32rpx;
  color: #666;
}

.clickNum view:nth-child(2) text {
  font-size: 24rpx;
  color: #222;
}

.nextBtn {
  margin-left: 28rpx;
  width: 200rpx;
  height: 80rpx;
  border-radius: 4rpx;
  background: #ff9900;
  font-size: 32rpx;
  text-align: center;
  line-height: 80rpx;
  color: #fff;
}

.noMsgTip {
  margin: 4rpx auto 0;
  width: 680rpx;
  height: 48rpx;
  background: #ffece8;
  display: flex;
  align-items: center;
}

.noMsgTip text {
  margin-left: 15rpx;
  font-size: 24rpx;
  color: #ff4422;
}
:deep {
  .submit-pop {
    .submit-tips {
      font-size: 28rpx;
      color: #222222;
      margin-top: 10rpx;
      line-height: 42rpx;
    }
    .color {
      font-size: 28rpx;
      color: #ff4422;
      margin-top: 8rpx;
    }
    .orange {
      color: #ff9900;
    }
    .lack-item {
      margin: 12rpx 0;
    }
    .viewLackGoodsDialogScroll {
      flex: 1 1 1px;
      overflow-y: auto;
    }
    .tvLackGoodsDialogEdit {
      border-radius: 40rpx;
      height: 80rpx;
      background-color: #ff9900;
      text-align: center;
      line-height: 80rpx;
      color: white;
      font-size: 32rpx;
      margin-top: 40rpx;
    }

    .tvLackGoodsDialogNext {
      color: #cccccc;
      font-size: 28rpx;
      line-height: 60rpx;
      margin-top: 15rpx;
      text-align: center;
      text-decoration-line: underline;
    }
  }
}
</style>
