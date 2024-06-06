import JSEncrypt from "jsencrypt";

export const encryptPassword = function (password) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdN4fI/a/KBfVG/mZG9s6tBnGRVd5P1QpLUcZJuJn1fPZPpezoiRmUgZD0wUVIWRgvOmjCf1rYX9VtWq2gAjCg3ElVrR4R4GhzHCqjsI+AVTwnvKA6r8WOcC0FMewaWm+shuhgoRAXv0znZ8bDqVV5J27CAldLU+T5XLpUTHuw+wIDAQAB"
  );
  var data = encrypt.encrypt(password);
  return data;
};

export const getUserInfo = function () {
  let userInfo = uni.getStorageSync("userInfo");
  // {
  //   tokenName: "qdsToken";
  //   tokenValue: "8275a805-c848-4ae8-b122-d334bd981e9a";
  //   userId: "507a78793872326f56523073752f755956754e3351513d3d";
  //   userName: "qds0517144";
  //   userPhone: "18829068598";
  // }
  return userInfo;
};
