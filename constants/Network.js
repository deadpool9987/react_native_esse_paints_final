import Base64 from "Base64";

const baseUrl = "https://esdeecolourmaster.com/";
const token = 'esdeeadmin:a2b3c4d5';
    const hash = Base64.btoa(token);
    const Basic = 'Basic ' + hash;


export default {
  baseUrl: baseUrl,
  apiurl: baseUrl + "api/rest/",
  kycUrl: baseUrl + "uploads/kyc/",
  bannerUrl: baseUrl + "uploads/sliders/",
  token:Basic
};