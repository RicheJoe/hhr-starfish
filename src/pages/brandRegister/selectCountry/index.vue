<template>
  <div>
    <nut-elevator v-if="!loading" :index-list="countryList" :is-sticky="true" height="100vh"  @click-item="clickItem" @click-index="clickIndex"></nut-elevator>
  </div>
</template>

<script setup>
import { queryBrandRegisterCountryList, } from '@/server/applicant'
import {
  ref, onMounted, getCurrentInstance
} from 'vue'
const loading = ref(true)
const countryList = ref([])
const getList = () => {
  loading.value = true
  uni.showLoading({
    title: '加载中'
  });
  queryBrandRegisterCountryList({}).then(res => {
    countryList.value = groupByFirstLetter(res.list)
    loading.value = false
    uni.hideLoading();
  })
}
const groupByFirstLetter = (countries) => {
  // 创建一个空对象来存储分组  
  const groupedByLetter = {};

  // 遍历每个国家  
  countries.forEach(country => {
    // 获取国家名称的首字母（转换为大写）  
    const firstLetter = country.countryCode.charAt(0).toUpperCase();

    // 如果该首字母的分组还不存在，则创建一个  
    if (!groupedByLetter[firstLetter]) {
      groupedByLetter[firstLetter] = {
        title: firstLetter,
        list: []
      };
    }

    // 将国家添加到对应的分组列表中  
    groupedByLetter[firstLetter].list.push({
      name: country.countryName, // 或者使用 codeSpaceName  
      id: country.countryCode + groupedByLetter[firstLetter].list.length // 或者使用其他唯一标识符  
    });
  });

  // 将分组对象转换为数组（按字母顺序排序）  
  const dataList = Object.keys(groupedByLetter)
    .sort() // 如果需要的话，对首字母进行排序  
    .map(letter => groupedByLetter[letter]);
  return dataList;
}
const clickItem = (key, item) => {
  eventChannel.value.emit('setCountry', item.name)
  uni.navigateBack()
}
onLoad(() => {
  getList()
})
const eventChannel = ref(null)
onMounted(() => {
  const instance = getCurrentInstance().proxy
  eventChannel.value = instance.getOpenerEventChannel();
})
</script>

<style lang="scss" scoped>
</style>
