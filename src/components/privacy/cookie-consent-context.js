import { createContext, useContext } from 'react'

const noop = () => {}

const defaultContextValue = {
  consent: null,
  hasDecision: false,
  isModalOpen: false,
  openPreferences: noop,
  closePreferences: noop,
  acceptOptionals: noop,
  rejectOptionals: noop,
  savePreferences: noop,
}

export const CookieConsentContext = createContext(defaultContextValue)

export const useCookieConsent = () => useContext(CookieConsentContext)
