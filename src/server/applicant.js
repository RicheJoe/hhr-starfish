import { getData } from "./index.js"

export function getRegions(params) {
  return getData(params, "common/regions", "post")
}

export function editApplicant(params) {
  return getData(params, "common/editApplicant", "post")
}

export function createApplicant(params) {
  return getData(params, "common/createApplicant", "post")
}

export function updateOrderUserOwner(params) {
  return getData(params, "common/updateOrderUserOwner", "post")
}

export function brandSearch(params) {
  return getData(params, "brand/brandSearch", "post")
}

export function queryBlackListApi(params) {
  return getData(params, "common/queryBlackListApi", "post")
}

export function queryBrandRegisterCountryList(params) {
  return getData(params, "order/queryBrandRegisterCountryList", "post")
}