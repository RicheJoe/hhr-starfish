import { getData } from "./index.js";

// 查看协议文档接口
export function queryAgreementsFile(data) {
  return getData(data, "user/queryAgreements", "post");
}
