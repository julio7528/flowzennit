import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CookieConsentBanner from './CookieConsentBanner.jsx'
import CookiePreferencesModal from './CookiePreferencesModal.jsx'
import { disableAnalytics, enableAnalytics, trackPageView } from '../../lib/analytics-loader.js'
import { createConsentRecord, readConsentRecord, saveConsentRecord } from '../../lib/consent-storage.js'
import { CookieConsentContext } from './cookie-consent-context.js'

const CookieConsentProvider = ({ children }) => {
  const location = useLocation()
  const [consent, setConsent] = useState(() => readConsentRecord())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draftAnalytics, setDraftAnalytics] = useState(Boolean(readConsentRecord()?.analytics))

  useEffect(() => {
    if (consent?.analytics) {
      enableAnalytics()
      trackPageView({
        pagePath: `${location.pathname}${location.search}`,
        pageTitle: document.title,
      })
      return
    }

    disableAnalytics()
  }, [consent?.analytics, location.pathname, location.search])

  const openPreferences = () => {
    setDraftAnalytics(Boolean(consent?.analytics))
    setIsModalOpen(true)
  }

  const persistConsent = ({ analytics, consentMethod }) => {
    const record = saveConsentRecord({ analytics, consentMethod })
    setConsent(record)
    setDraftAnalytics(Boolean(record.analytics))
    setIsModalOpen(false)
    return record
  }

  const acceptOptionals = () => persistConsent({ analytics: true, consentMethod: 'accepted_optionals' })

  const rejectOptionals = () => persistConsent({ analytics: false, consentMethod: 'rejected_optionals' })

  const savePreferences = ({ analytics }) => persistConsent({ analytics, consentMethod: 'custom_preferences' })

  const value = {
    consent,
    hasDecision: Boolean(consent),
    isModalOpen,
    openPreferences,
    closePreferences: () => setIsModalOpen(false),
    acceptOptionals,
    rejectOptionals,
    savePreferences,
    createDefaultConsent: createConsentRecord,
  }

  return (
    <CookieConsentContext.Provider value={value}>
      {children}

      {!consent && (
        <CookieConsentBanner
          onAcceptOptionals={acceptOptionals}
          onRejectOptionals={rejectOptionals}
          onConfigure={openPreferences}
        />
      )}

      <CookiePreferencesModal
        analyticsEnabled={draftAnalytics}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAnalyticsChange={setDraftAnalytics}
        onSavePreferences={savePreferences}
        onAcceptOptionals={acceptOptionals}
        onRejectOptionals={rejectOptionals}
      />
    </CookieConsentContext.Provider>
  )
}

export default CookieConsentProvider
