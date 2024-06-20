import JSEncrypt from "jsencrypt"

export const encryptPassword = function (password) {
  var encrypt = new JSEncrypt()
  encrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdN4fI/a/KBfVG/mZG9s6tBnGRVd5P1QpLUcZJuJn1fPZPpezoiRmUgZD0wUVIWRgvOmjCf1rYX9VtWq2gAjCg3ElVrR4R4GhzHCqjsI+AVTwnvKA6r8WOcC0FMewaWm+shuhgoRAXv0znZ8bDqVV5J27CAldLU+T5XLpUTHuw+wIDAQAB"
  )
  var data = encrypt.encrypt(password)
  return data
}

export const getUserInfo = function () {
  let userInfo = uni.getStorageSync("userInfo")
  // {
  //   tokenName: "qdsToken";
  //   tokenValue: "8275a805-c848-4ae8-b122-d334bd981e9a";
  //   userId: "507a78793872326f56523073752f755956754e3351513d3d";
  //   userName: "qds0517144";
  //   userPhone: "18829068598";
  // }
  return userInfo
}

export const imgUrl = "https://files.quandashi.com/"
export const fileUrl = "https://tm-files.oss-cn-beijing.aliyuncs.com/"
export const appKey = "quandashi3673856991"

// 上传图片到服务器
export const uploadFile = (data) => {
  const apiData = {
    ...data,
    type: data.type || 1,
    appKey: appKey,
    signMethod: "md5",
    v: "1.0",
    timestamp: new Date().getTime(),
    sign: Math.random() * 10000,
  }
  uni.showLoading({
    title: "上传中",
  })
  if (data.filePath.indexOf(".unknown") > 0) {
    uni.hideLoading()
    uni.showToast({
      title: "文件格式异常,请取消勾选原图",
      icon: "none",
    })
    return
  } else if (
    data.filePath.indexOf(".png") > 0 ||
    data.filePath.indexOf(".PNG") > 0
  ) {
    uni.hideLoading()
    uni.showToast({
      title: "不支持PNG格式图片",
      icon: "none",
    })
    return
  }
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${import.meta.env.VITE_QDS}` + "/upload/upload",
      filePath: data.filePath,
      formData: apiData,
      name: "file",
      method: "POST",
      success: (res) => {
        let tmpData = JSON.parse(res.data)
        if (tmpData.code == 9091 && tmpData.subCode == 10002) {
          uni.hideLoading()
          resolve(tmpData.data.urls[0])
        } else {
          uni.hideLoading()
          uni.showToast({
            title: tmpData.subMessage + "",
            icon: "none",
            duration: 2000,
          })
        }
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}
