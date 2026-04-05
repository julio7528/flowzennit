import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const SUPPORTED_LANGUAGES = ['pt-BR', 'en']
export const DEFAULT_LANGUAGE = 'pt-BR'
export const LANGUAGE_STORAGE_KEY = 'i18n_language'

const normalizeLanguage = (language) => {
  if (!language || typeof language !== 'string') {
    return DEFAULT_LANGUAGE
  }

  const normalized = language.toLowerCase()

  if (normalized.startsWith('pt')) {
    return 'pt-BR'
  }

  if (normalized.startsWith('en')) {
    return 'en'
  }

  return DEFAULT_LANGUAGE
}

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      supportedLngs: SUPPORTED_LANGUAGES,
      fallbackLng: DEFAULT_LANGUAGE,
      lng: DEFAULT_LANGUAGE,
      load: 'currentOnly',
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ['localStorage'],
        convertDetectedLanguage: normalizeLanguage,
      },
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
      },
    })

  i18n.on('languageChanged', (language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = normalizeLanguage(language)
    }
  })
}

export const setAppLanguage = async (language) => {
  const nextLanguage = normalizeLanguage(language)
  await i18n.changeLanguage(nextLanguage)
  return nextLanguage
}

export const getAppLanguage = () => normalizeLanguage(i18n.resolvedLanguage || i18n.language)

export default i18n
