import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encrypt = (value: string): string => {
  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
};

export const decrypt = (ciphertext: string | null): string => {
  if (!ciphertext) return "";
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const encryptJSON = <T>(obj: T): string => {
  return encrypt(JSON.stringify(obj));
};

export const decryptJSON = <T>(ciphertext: string | null): T | null => {
  if (!ciphertext) return null;
  try {
    return JSON.parse(decrypt(ciphertext)) as T;
  } catch {
    return null;
  }
};


//Como pegar o token e o user depois  Exemplo em qualquer página/serviço:

// import { decrypt, decryptJSON } from "../utils/crypto";
// import type { Usuario } from "../types/User";

// const token = decrypt(localStorage.getItem("token"));
// const usuario = decryptJSON(localStorage.getItem("usuario"));

// console.log("Token:", token);
// console.log("Usuario:", usuario);

