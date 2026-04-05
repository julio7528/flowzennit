import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  readConsentRecord,
  saveConsentRecord,
} from '../lib/consent-storage.js'

describe('consent-storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('salva e recupera um consentimento versionado', () => {
    const record = saveConsentRecord({ analytics: true, consentMethod: 'accepted_optionals' })

    expect(record.version).toBe(COOKIE_CONSENT_VERSION)
    expect(record.necessary).toBe(true)
    expect(record.analytics).toBe(true)
    expect(readConsentRecord()).toEqual(record)
    expect(JSON.parse(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))).toEqual(record)
  })

  it('ignora consentimento inválido ou com versão divergente', () => {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: '0.9',
        necessary: true,
        analytics: false,
        consentGivenAt: new Date().toISOString(),
      }),
    )

    expect(readConsentRecord()).toBeNull()
  })
})
