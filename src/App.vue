<script setup >
import { onLoad } from "@dcloudio/uni-app";
import { onMounted } from "vue";
onLoad(() => {});
onMounted(() => {
  setTimeout(() => {
    const currentPage = getCurrentPages().pop();
    const currentRoute = currentPage ? currentPage.route : "";

    const userInfo = uni.getStorageSync("userInfo");
    // 排除登录页面，避免循环跳转
    if (currentRoute !== "pages/login-auth/login" && !userInfo) {
      uni.navigateTo({
        url: "/pages/login-auth/login" // 登录页面的路径
      });
    }
  });
});
</script>

<style lang="scss">
/*每个页面公共css */
@import "./uni.scss";
@import "nutui-uniapp/styles/index.scss";
uni-page-body,
html,
body {
  height: 100%;
}
</style>
