import JSEncrypt from "jsencrypt";
export const encryptPassword = function (password) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCz2R8NwOoFC1VrJmHL0rwnBrneaVIvd64HOxE3J4636iPvQDHwfJN5oHKLTf1XoSTK7p9ITVvPPaYozYvtbh/5oznVehFeEzsu0mclpiqcuEJRJ2rwXubHPebbv2//+Cfa+jXYTAy43rz7FWi+cYgVTKL9MjSQn9ngztDdJBryMQIDAQAB"
  );
  var data = encrypt.encrypt(password);
  return data;
};
