import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/translation.json'
import vi from './locales/vi/translation.json'

const preferredLanguage = navigator.language === 'vi' ? 'vi' : 'en';
const storedLanguage = localStorage.getItem('user');
let lang;

if (storedLanguage) {
  const storageUser = JSON.parse(storedLanguage)
  lang = storageUser.settings[0].languages;
}

i18n.use(initReactI18next).init({
  lng: lang || preferredLanguage,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    vi: {
      translation: vi,
    },
  },
  debug: false,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n