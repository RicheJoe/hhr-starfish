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
