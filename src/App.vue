<script setup >
onLaunch(() => {
  console.log("app onLaunch");
  wx &&
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

  //手动触发
  // uni.share({
  //   provider: "weixin",
  //   scene: "WXSceneSession",
  //   type: 5,
  //   imageUrl: "图片地址",
  //   title: "欢迎体验uniapp",
  //   miniProgram: {
  //     id: "gh_abcdefg",
  //     path: "pages/index/index",
  //     type: 0,
  //     webUrl: "http://uniapp.dcloud.io"
  //   },
  //   success: ret => {
  //     console.log(JSON.stringify(ret));
  //   }
  // });

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
