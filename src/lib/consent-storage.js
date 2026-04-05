export const COOKIE_CONSENT_STORAGE_KEY = 'flowzenit_cookie_consent'
export const COOKIE_CONSENT_VERSION = '1.0'

const CONSENT_METHODS = new Set(['accepted_optionals', 'rejected_optionals', 'custom_preferences'])

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isValidTimestamp = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value))

export const createConsentRecord = ({
  analytics = false,
  consentMethod = 'custom_preferences',
  consentGivenAt = new Date().toISOString(),
} = {}) => ({
  version: COOKIE_CONSENT_VERSION,
  necessary: true,
  analytics: Boolean(analytics),
  consentMethod: CONSENT_METHODS.has(consentMethod) ? consentMethod : 'custom_preferences',
  consentGivenAt,
})

export const sanitizeConsentRecord = (value) => {
  if (!isRecord(value)) {
    return null
  }

  if (value.version !== COOKIE_CONSENT_VERSION) {
    return null
  }

  if (value.necessary !== true || typeof value.analytics !== 'boolean' || !isValidTimestamp(value.consentGivenAt)) {
    return null
  }

  return createConsentRecord({
    analytics: value.analytics,
    consentMethod: value.consentMethod,
    consentGivenAt: value.consentGivenAt,
  })
}

export const readConsentRecord = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return sanitizeConsentRecord(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export const writeConsentRecord = (record) => {
  if (typeof window === 'undefined') {
    return record
  }

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
  return record
}

export const saveConsentRecord = (partialRecord) => writeConsentRecord(createConsentRecord(partialRecord))
