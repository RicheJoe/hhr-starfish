<template>
  <div class="nice-wrapper">
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
        >
          {{ item.cgNum + " " + item.cgName }}
        </div>
      </div>

      <div class="nice-level-child" v-if="niceClassifyChild && niceClassifyChild.list.length">
        <div v-for="item in niceClassifyChild.list" :key="item.cgId" class="nice-all-level-2-name">
          <div class="l2-title" @click="changeCheckCgIdL2(item)" :class="{ active: item.isExpand }">
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
    <nut-safe-area position="bottom" />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, reactive } from "vue";
import _ from "loadsh";
import { niceAllType, queryNiceListByName, queryNiceListByFirst } from "@/server/brand.js";
import { onReady } from "@dcloudio/uni-app";

const searchValue = ref("");
const niceClassify = ref([]); //尼斯分类
const checkedCgId = ref(0); //选中的大类ID
//尼斯分类45大类
const initNiceAllType = async () => {
  let res = await niceAllType({ containThree: 1 });
  niceClassify.value = res.list;
  checkedCgId.value = res.list.length && res.list[0].cgId;
  //初始化尼斯分类 默认选择第一个
  nextTick(() => {
    changeCheckCgId(checkedCgId.value, res.list[0]);
  });
};
// watch(
//   niceClassify,
//   (newVal, oldVal) => {
//     console.log("User changed:", newVal, oldVal);
//   },
//   { deep: true }
// );
//当前选择的尼斯分类二级内容
const niceClassifyChild = computed(() => {
  if (checkedCgId.value) {
    return niceClassify.value.find(i => i.cgId == checkedCgId.value) || [];
  }
});

//关键字检索
const inputSearch = _.debounce(async () => {
  if (!searchValue.value) return;
  let res = await queryNiceListByName({
    cgName: searchValue.value,
    containOther: 0
  });
  console.log("检索：", searchValue.value, res);
}, 300);
//点击左侧一级分类 查对应的二级
const changeCheckCgId = async cgId => {
  checkedCgId.value = cgId;
  let checkedItem = niceClassify.value.find(i => i.cgId == checkedCgId.value);
  if (checkedItem.list.length) return;
  let res = await queryNiceListByFirst({
    cgId: cgId,
    containThree: 1 // 是否查询小项 0是不查询 1是查询
  });
  res.forEach(element => {
    element.isExpand = false; //是否展开二级分类
    element.cgList.forEach(ele => {
      ele.isChecked = false; //三级是否被选中
    });
  });
  checkedItem.list = res;
  console.log("下级：", res);
};
//点击二级分类
const changeCheckCgIdL2 = item => {
  //展开二级分类
  item.isExpand = !item.isExpand;
};
//点击三级分类
const changeCheckCgIdL3 = item => {
  item.isChecked = !item.isChecked;
  console.log(item, "item");
};

onReady(() => {
  initNiceAllType();
});
</script>

<style scoped lang='scss'>
.nice-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 24rpx;
}
.nice-all {
  flex: 1;
  display: flex;
  margin-top: 24rpx;

  .nice-all-level-1 {
    width: 32%;
    cursor: pointer;
    font-size: 34rpx;
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
    // color: #ff7200;
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
      padding-bottom: 24rpx;
      display: flex;
      justify-content: space-between;
      height: 40rpx;
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
</style>
