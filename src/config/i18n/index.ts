import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/translation.json'
import vi from './locales/vi/translation.json'
import { getLanguageFromLocalStorage } from '../../utils/language'

i18n.use(initReactI18next).init({
  lng: getLanguageFromLocalStorage(),
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