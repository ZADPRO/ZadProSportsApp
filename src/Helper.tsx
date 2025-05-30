import CryptoJS from "crypto-js";

export const decrypt = (
  encryptedData: string,
  iv: string,
  key: string
): any => {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
  });

  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};