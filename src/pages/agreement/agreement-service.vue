<template>
  <view class="container" v-html="agreementContent"> </view>
</template>


<script setup>
import { queryAgreementsFile } from "@/server/login.js";
import { ref } from "vue";
const agreementContent = ref("");
onLoad(() => {
  getAgreements();
});
const getAgreements = async () => {
  let res = await queryAgreementsFile({
    type: 1
  });
  agreementContent.value = res.content;
};
</script>

<style lang='scss' scoped>
.container {
  padding: 32px 28px 0;
}
</style>