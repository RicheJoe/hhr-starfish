import { getData } from "./index.js";

export function niceAllType(params) {
  return getData(params, "common/regions", "post");
}
