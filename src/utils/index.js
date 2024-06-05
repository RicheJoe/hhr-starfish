import JSEncrypt from "jsencrypt";

export const encryptPassword = function (password) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdN4fI/a/KBfVG/mZG9s6tBnGRVd5P1QpLUcZJuJn1fPZPpezoiRmUgZD0wUVIWRgvOmjCf1rYX9VtWq2gAjCg3ElVrR4R4GhzHCqjsI+AVTwnvKA6r8WOcC0FMewaWm+shuhgoRAXv0znZ8bDqVV5J27CAldLU+T5XLpUTHuw+wIDAQAB"
  );
  var data = encrypt.encrypt(password);
  return data;
};
