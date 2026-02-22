import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      selectLanguage: "Select Language",
      selectDistrict: "Select District",
      selectMunicipality: "Select Municipality",
      next: "Next"
    }
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      login: "लॉगिन",
      selectLanguage: "भाषा चुनें",
      selectDistrict: "जिला चुनें",
      selectMunicipality: "नगर पालिका चुनें",
      next: "आगे बढ़ें"
    }
  },
  bn: {
    translation: {
      welcome: "স্বাগতম",
      login: "লগইন",
      selectLanguage: "ভাষা নির্বাচন করুন",
      selectDistrict: "জেলা নির্বাচন করুন",
      selectMunicipality: "পৌরসভা নির্বাচন করুন",
      next: "পরবর্তী"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;