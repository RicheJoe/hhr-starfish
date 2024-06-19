<template>
  <div class="nice-wrapper">
    <nut-safe-area position="top" />
    <nut-steps :current="2">
      <nut-step> 1 </nut-step>
      <nut-step>2</nut-step>
      <nut-step>3</nut-step>
      <nut-step>4</nut-step>
    </nut-steps>

    <nut-input
      v-model="searchValue"
      type="text"
      clearable
      placeholder="请输入商品或服务名称、关键词进行查询"
      @input="inputSearch"
    >
      <template #left> <nut-icon name="search"></nut-icon> </template>
    </nut-input>

    <!-- 尼斯分类-->
    <div class="nice-all">
      <div class="nice-all-level-1">
        <scroll-view scroll-y="true" class="scroll-Y">
          <div
            v-for="item in niceClassify"
            :key="item.cgId"
            :class="{ active: item.cgId == checkedCgId }"
            class="nice-all-level-1-name"
            @click="changeCheckCgId(item.cgId)"
          >
            {{ item.cgNum + " " + item.cgName }}
          </div></scroll-view
        >
      </div>

      <div class="nice-level-child"></div>
    </div>
    <nut-safe-area position="bottom" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import _ from "loadsh";
import { niceAllType, queryNiceListByName, queryNiceListByFirst } from "@/server/brand.js";
import { onReady } from "@dcloudio/uni-app";

const searchValue = ref("");
const niceClassify = ref([]); //尼斯分类
const checkedCgId = ref(""); //选中的大类ID
const treeData = ref([]); //尼斯分类下级
//尼斯分类45大类
const initNiceAllType = async () => {
  let res = await niceAllType();
  niceClassify.value = res.list;
  checkedCgId.value = res.list.length && res.list[0].cgId;
  //初始化尼斯分类
};
//关键字检索
const inputSearch = _.debounce(async () => {
  if (!searchValue.value) return;
  let res = await queryNiceListByName({
    cgName: searchValue.value,
    containOther: 0
  });
  console.log("检索：", searchValue.value, res);
}, 300);
//点击左侧一级分类
const changeCheckCgId = async cgId => {
  checkedCgId.value = cgId;
  let res = await queryNiceListByFirst({
    cgId: cgId,
    containThree: 1 // 是否查询小项 0是不查询 1是查询
  });
  treeData.value = res;
  console.log("下级：", res);
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
  overflow-y: auto;

  .nice-all-level-1 {
    width: 32%;
    cursor: pointer;
  }
  .nice-all-level-1-name {
    padding: 24rpx;
    font-size: 28rpx;
  }
  .nice-all-level-1-name.active {
    color: #ff7200;
    background-color: #e4e4e4;
  }
}
</style>
