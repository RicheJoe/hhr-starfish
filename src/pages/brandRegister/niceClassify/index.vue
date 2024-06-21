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
        </div>
      </div>

      <!-- <div class="nice-level-child">
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
        />
      </div> -->

      <div class="nice-level-child" v-if="treeData">
        <div v-for="item in treeData" :key="item.cgId" class="nice-all-level-2-name">
          <div
            class="l2-title"
            @click="changeCheckCgIdL2(item)"
            :class="{
              active: item.cgList.find(i => i.isChecked),
              expand: item.isExpand
            }"
          >
            <nut-icon name="triangle-up" custom-color="#e4e4e4"></nut-icon>
            <view style="flex: 1">{{ item.cgNum + " " + item.cgName }}</view>
          </div>

          <div class="nice-all-level-3" v-show="item.isExpand">
            <div
              class="nice-all-level-3-name"
              v-for="item3 in item.cgList"
              :key="item3.cgId"
              :class="{ checked: item3.isChecked }"
              @click="changeCheckCgIdL3(item3)"
            >
              <view>{{ item3.cgNum + " " + item3.cgName }}</view>
              <view v-show="item3.isChecked"> <nut-icon name="checklist"></nut-icon> </view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <view class="footerWrap">
      <view class="fileWrap">
        <!-- <image src="/images/clickNum1.png" /> -->
        <image src="@/static/images/brandRegister/clickNum0.png" />
        <!-- <text wx:if="{{chooseList.length}}"></text> -->
      </view>
      <view class="clickNumWrap">
        <view class="clickNum">
          <view
            >合计：<text>￥{{ 1 }}</text></view
          >
          <view
            >已选<text>{{ 2 }}</text
            >个类别，共<text>{{ 3 }}</text
            >个小项</view
          >
        </view>
        <view class="nextBtn {{1}}">保存</view>
      </view>
    </view>
    <nut-safe-area position="bottom" />
  </view>
</template>

<script setup>
import { ref, computed, nextTick, reactive } from "vue";
import _ from "loadsh";
import { niceAllType, queryNiceListByName, queryNiceListByFirst } from "@/server/brand.js";
import { onReady } from "@dcloudio/uni-app";
import nextTree from "./components/next-tree/next-tree.vue";
const searchValue = ref("");
const niceClassify = ref([]); //尼斯分类
const checkedCgId = ref(0); //选中的大类ID
const treeData = ref([]);
const searchResult = ref([]); //检索的结果
//尼斯分类45大类
const initNiceAllType = async () => {
  let res = await niceAllType({ containThree: 1 });
  res.list.forEach(e => {
    e.checkList = [];
    e.show = true;
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
const l3CheckedNum = computed(() => {
  return item => (item.checkList && item.checkList.length) || 0;
});

//关键字检索
const inputSearch = _.debounce(async () => {
  if (!searchValue.value) {
    niceClassify.value.forEach(i => {
      i.show = true; //全部展开
    });
    searchResult.value = [];
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
  console.log("检索：", searchValue.value, res);
  treeData.value = [];
  searchResult.value = res;

  echoChecked();
  // return res;
}, 300);
//根据检索结果 或者 保存的结果回显
const echoChecked = res => {
  res = searchResult.value;
  //res 是检索的结果
  niceClassify.value.forEach(e => {
    e.show = false; //默认隐藏一级
  });
  res.cgList.forEach(ele => {
    niceClassify.value.forEach(e => {
      if (e.cgId == ele.cgId) {
        e.show = true; //查询到的一级显示
      }
    });
  });
  nextTick(() => {
    if (niceClassify.value.find(i => i.show))
      changeCheckCgId(niceClassify.value.find(i => i.show).cgId, res);
  });
};
/**
 * 点击左侧一级分类 查对应的二级
 * searchRes 选填 为检索的结果 如果没有传 就是点击一级分类
 */
const changeCheckCgId = async cgId => {
  console.log("选择的id  ", cgId);
  try {
    uni.showLoading({
      mask: true
    });
    checkedCgId.value = cgId;
    let checkedItem = niceClassify.value.find(i => i.cgId == checkedCgId.value);

    let res = await queryNiceListByFirst({
      cgId: cgId,
      containThree: 1 // 是否查询小项 0是不查询 1是查询
    });

    //将查询结果挂载到当前选中的一级下
    if (searchResult.value.cgList) {
      treeData.value = searchResult.value.cgList.find(i => i.cgId == checkedCgId.value).cgList; //TODO:
    } else {
      treeData.value = res;
    }

    //如果当前选择一级有之前选中的 还要默认选中
    if (checkedItem.checkList.length) {
      checkedItem.checkList.forEach(item => {
        treeData.value
          .map(i => i.cgList.flat())
          .flat()
          .forEach(i => {
            if (i.cgId == item.cgId) {
              i.isChecked = true;
            }
          });
      });
    }

    console.log("下级：", res);
  } catch (error) {
    console.log(error);
  } finally {
    uni.hideLoading();
    console.log(treeData.value, "treeData");
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

onReady(() => {
  initNiceAllType();
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
  }
  .nice-all-level-1-name.active {
    color: #ff7200;
    background-color: #f5f5f5;
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
    :deep .nut-icon {
      font-size: 24rpx;
      transform: rotate(90deg);
      transition: transform 0.3s ease;
      display: inline-block;
      width: 64rpx;
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
  z-index: 3;

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
</style>
