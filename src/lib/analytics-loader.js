const GA_SCRIPT_ID = 'flowzenit-ga-script'

const getMeasurementId = () => {
  const value = import.meta.env.VITE_GA_MEASUREMENT_ID
  return typeof value === 'string' ? value.trim() : ''
}

const getDisableKey = (measurementId) => `ga-disable-${measurementId}`

const ensureDataLayer = () => {
  window.dataLayer = window.dataLayer || []

  if (!window.gtag) {
    window.gtag = function gtag(...args) {
      window.dataLayer.push(args)
    }
  }
}

const injectAnalyticsScript = (measurementId) => {
  if (document.getElementById(GA_SCRIPT_ID)) {
    return
  }

  const script = document.createElement('script')
  script.id = GA_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export const isAnalyticsConfigured = () => Boolean(getMeasurementId())

export const enableAnalytics = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false
  }

  const measurementId = getMeasurementId()

  if (!measurementId) {
    return false
  }

  window[getDisableKey(measurementId)] = false
  ensureDataLayer()
  injectAnalyticsScript(measurementId)

  if (!window.__flowzenitAnalyticsConfigured) {
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: false,
    })
    window.__flowzenitAnalyticsConfigured = true
  }

  window.gtag('consent', 'update', { analytics_storage: 'granted' })

  return true
}

export const disableAnalytics = () => {
  if (typeof window === 'undefined') {
    return
  }

  const measurementId = getMeasurementId()

  if (!measurementId) {
    return
  }

  window[getDisableKey(measurementId)] = true

  if (window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'denied' })
  }
}

export const trackPageView = ({ pagePath, pageTitle }) => {
  if (typeof window === 'undefined') {
    return false
  }

  const measurementId = getMeasurementId()

  if (!measurementId || window[getDisableKey(measurementId)] || !window.gtag) {
    return false
  }

  window.gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
  })

  return true
}
