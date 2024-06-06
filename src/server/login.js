import { getData } from "./index.js";
import { encryptPassword } from "@/utils/index.js";
// 查看协议文档接口
export function queryAgreementsFile(data) {
  return getData(data, "user/queryAgreements", "post");
}

//老版合伙人登录接口 getData
export function getCookies() {
  let params = {
    userPhone: "15811079252", //15667290318   7 9  15811079252 18103518662 15612345678 LXN@123456 Lxn123456
    userPwd: encryptPassword("123456"),
    drivetoken: "21342",
    ip: "",
    terminalType: 1,
    types: "1,2,3"
  };
  return getData(params, "user/tuser/login", "post");
}

//账号密码登录
export function loginByPassword(data) {
  return getData(
    data,
    import.meta.env.VITE_HOST + "/uaa/auth/mini/saLoginByPwd",
    "post"
  );
}

//获取手机验证码
export function getVerCode(data) {
  return getData(
    data,
    import.meta.env.VITE_HOST + "/uaa/auth/user/sendCode",
    "post"
  );
}

//手机验证码登录
export function loginByVerCode(data) {
  return getData(
    data,
    import.meta.env.VITE_HOST + "/uaa/auth/mini/saLoginByVerCode",
    "post"
  );
}

//微信授权手机号登录
export function loginByWechat(data) {
  return getData(
    data,
    import.meta.env.VITE_HOST + "/uaa/auth/mini/saLoginByAuth",
    "post"
  );
}

/**
 * @description 用户ID登录  这个接口直接用户id登录 可以实现永久登录不退登
 * @param {*} data source 17 userIde
 * @returns
 */
export function loginByUserId(data) {
  return getData(
    data,
    import.meta.env.VITE_HOST + "/uaa/auth/sap/loginById",
    "post"
  );
}
