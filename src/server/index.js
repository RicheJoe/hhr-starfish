import Axios from "axios";
import uniAdapter from "axios-adapter-uniapp";
import { getUserInfo } from "@/utils/index.js";
const axios = Axios.create({
  adapter: uniAdapter,
  baseURL: `${import.meta.env.VITE_QDS}`,
  timeout: 30000
});

//获取服务器时间
function getTimestamp() {
  // return Axios.request({
  //   baseURL: `${import.meta.env.VITE_QDS}`,
  //   url: "/common/getTimestamp",
  //   method: "post",
  //   adapter: uniAdapter
  // });
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${import.meta.env.VITE_QDS}` + "/common/getTimestamp",
      method: "post",
      success: res => {
        resolve(res.data.data);
      },
      fail: err => {
        uni.showToast({
          title: `系统异常`,
          icon: "error"
        });
      }
    });
  });
}
//公共参数
const requestParams = {
  appKey: "quandashi4940841937",
  signMethod: "md5"
};

//请求拦截注入公共参数
axios.interceptors.request.use(
  async config => {
    config.data = { ...requestParams, ...config.data };
    config.data.timestamp = (await getTimestamp()).timestamp;
    config.data.sign =
      new Date().getTime() + "" + Math.floor(Math.random() * 10000 + 1);
    config.headers["qdsToken"] = getUserInfo().tokenValue;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
//返回拦截
axios.interceptors.response.use(
  res => {
    if (res.data.code == 9091 && res.data.subCode == 10002) {
      return res.data;
    } else if (res.data.subCode == 10004) {
      //token过期 重新登录
      uni.removeStorageSync("userInfo");
      wx.navigateTo({
        url: "/pages/login-auth/index"
      });
    } else {
      uni.showToast({
        title: res.data.subMessage || "系统异常",
        icon: "error",
        mask: true,
        duration: 2000
      });
      return Promise.reject(new Error(res.data.subMessage));
    }
  },
  error => {
    return Promise.reject(error);
  }
);
export async function getData(data, url, method = "post", tips) {
  let res = await axios({
    url,
    method,
    data
  });
  if (res.code == "ok" || res.subCode == 10002) {
    if (tips) {
      uni.showToast({
        title: `${tips}成功！`,
        icon: "success"
      });
    }
    return res.data;
  } else if (res.subCode == 10004) {
    wx.navigateTo({
      url: "/pages/login-auth/index"
    });
  } else if (res.subCode != 10002) {
    throw res;
  }
}

// export function getData(data, url, method, tips) {
//   return new Promise((resolve, reject) => {
//     let params = {
//       ...data,
//       appKey: "quandashi4940841937",
//       timestamp: new Date().getTime(),
//       signMethod: "md5",
//       sign: new Date().getTime() + "" + Math.floor(Math.random() * 10000 + 1)
//     };
//     let res = uni.request({
//       url: `${import.meta.env.VITE_QDS}/` + url,
//       data: params,
//       method,
//       success: res => {
//         resolve(res.data.data);
//       },
//       fail: err => {
//         uni.showToast({
//           title: `系统异常`,
//           icon: "error"
//         });
//         reject(err);
//       }
//     });
//   });
// }
