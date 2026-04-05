import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase.js'
import { getPrivacyContent } from '../../lib/privacy-content.js'
import { useCookieConsent } from './cookie-consent-context.js'

const initialFormState = {
  name: '',
  email: '',
  requestType: 'access_data',
  message: '',
  confirmDeletion: false,
}

const initialErrorState = {
  name: '',
  email: '',
  requestType: '',
  message: '',
  confirmDeletion: '',
}

const isMissingPrivacyTableError = (error) => {
  const message = typeof error?.message === 'string' ? error.message.toLowerCase() : ''
  return error?.code === '42P01' || message.includes('privacy_requests') || message.includes('does not exist')
}

const buildFallbackContactMessage = ({ requestLabel, requestType, confirmDeletion, message, t }) =>
  [
    t('privacy.form.fallbackHeader'),
    t('privacy.form.fallbackSelectedType', { requestLabel }),
    t('privacy.form.fallbackInternalCode', { requestType }),
    confirmDeletion ? t('privacy.form.fallbackDeletionConfirmation') : null,
    '',
    message.trim(),
  ]
    .filter(Boolean)
    .join('\n')

const PrivacyRequestForm = () => {
  const { t } = useTranslation()
  const { openPreferences } = useCookieConsent()
  const { requestTypes } = useMemo(() => getPrivacyContent(t), [t])
  const requestTypeSet = useMemo(() => new Set(requestTypes.map((item) => item.value)), [requestTypes])
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState(initialErrorState)
  const [status, setStatus] = useState('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const isDeleteRequest = formData.requestType === 'delete_data'
  const isCookieConsentRequest = formData.requestType === 'revoke_cookie_consent'

  const inputClassName = (fieldName) => `w-full border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-1 ${
    errors[fieldName]
      ? 'border-red-500 bg-red-500/10 text-white placeholder-red-200 focus:border-red-500 focus:ring-red-500'
      : 'border-[#1A1D26] bg-black/25 text-white placeholder-gray-500 focus:border-[#00F0FF] focus:ring-[#00F0FF]'
  }`

  const validate = () => {
    const nextErrors = { ...initialErrorState }

    if (!formData.name.trim()) {
      nextErrors.name = t('privacy.form.validation.nameRequired')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = t('privacy.form.validation.emailInvalid')
    }

    if (!requestTypeSet.has(formData.requestType)) {
      nextErrors.requestType = t('privacy.form.validation.requestTypeInvalid')
    }

    if (formData.message.trim().length < 12) {
      nextErrors.message = t('privacy.form.validation.messageMin')
    }

    if (formData.message.trim().length > 4000) {
      nextErrors.message = t('privacy.form.validation.messageMax')
    }

    if (isDeleteRequest && !formData.confirmDeletion) {
      nextErrors.confirmDeletion = t('privacy.form.validation.deletionConfirmation')
    }

    setErrors(nextErrors)
    return !Object.values(nextErrors).some(Boolean)
  }

  const handleChange = (event) => {
    const target = event.target
    const { name, type } = target
    const value = type === 'checkbox' ? target.checked : target.value

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === 'requestType' && value !== 'delete_data' ? { confirmDeletion: false } : {}),
    }))

    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const requestLabel = useMemo(
    () => requestTypes.find((item) => item.value === formData.requestType)?.label ?? t('privacy.form.genericRequest'),
    [formData.requestType, requestTypes, t],
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setStatus('loading')
    setFeedbackMessage('')

    try {
      if (!supabase) {
        throw new Error(t('privacy.form.errors.supabaseUnavailable'))
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        request_type: formData.requestType,
        message: formData.message.trim(),
        confirm_deletion: formData.requestType === 'delete_data' ? formData.confirmDeletion : false,
        status: 'pending',
        source: 'privacy_page',
      }

      const { error } = await supabase.from('privacy_requests').insert([payload])

      if (error) {
        if (!isMissingPrivacyTableError(error)) {
          throw new Error(error.message)
        }

        const fallbackMessage = buildFallbackContactMessage({
          requestLabel,
          requestType: formData.requestType,
          confirmDeletion: formData.confirmDeletion,
          message: formData.message,
          t,
        })

        if (fallbackMessage.length > 4000) {
          throw new Error(t('privacy.form.errors.fallbackTooLong'))
        }

        const { error: fallbackError } = await supabase.from('tbf_contato').insert([
          {
            dados_json: {
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase(),
              message: fallbackMessage,
            },
          },
        ])

        if (fallbackError) {
          throw new Error(fallbackError.message)
        }
      }

      setStatus('success')
      setFeedbackMessage(t('privacy.form.feedback.success'))
      setFormData(initialFormState)
      setErrors(initialErrorState)
    } catch (error) {
      setStatus('error')
      setFeedbackMessage(
        error instanceof Error && error.message
          ? t('privacy.form.feedback.errorWithReason', { reason: error.message })
          : t('privacy.form.feedback.error'),
      )
    }
  }

  return (
    <section id="solicitacoes" className="relative overflow-hidden border border-[#1A1D26] bg-[#0E1016] p-6 md:p-8">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00F0FF]/80 via-[#BD00FF]/45 to-transparent" />
      <div className="relative z-10">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr]">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#00F0FF]">{t('privacy.form.eyebrow')}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                {t('privacy.form.title')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                {t('privacy.form.description')}
              </p>
            </div>

            <div className="border border-[#1A1D26] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#BD00FF]">{t('privacy.form.scopeTitle')}</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
                {t('privacy.form.scopeItems', { returnObjects: true }).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border border-[#1A1D26] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#00FF41]">{t('privacy.form.immediateControlTitle')}</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                {t('privacy.form.immediateControlDescription')}
              </p>
              <button
                type="button"
                onClick={openPreferences}
                className="mt-4 inline-flex items-center gap-2 border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#00F0FF] transition-colors hover:bg-[#00F0FF]/15 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                {t('cookieConsent.actions.configure')}
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="privacy-name" className="mb-2 block text-sm font-medium text-gray-300">
                  {t('privacy.form.fields.name')}
                </label>
                <input
                  id="privacy-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClassName('name')}
                  placeholder={t('privacy.form.placeholders.name')}
                />
                {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="privacy-email" className="mb-2 block text-sm font-medium text-gray-300">
                  {t('privacy.form.fields.email')}
                </label>
                <input
                  id="privacy-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName('email')}
                  placeholder={t('privacy.form.placeholders.email')}
                />
                {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="privacy-request-type" className="mb-2 block text-sm font-medium text-gray-300">
                {t('privacy.form.fields.requestType')}
              </label>
              <select
                id="privacy-request-type"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className={inputClassName('requestType')}
              >
                {requestTypes.map((requestType) => (
                  <option key={requestType.value} value={requestType.value} className="bg-[#050508]">
                    {requestType.label}
                  </option>
                ))}
              </select>
              {errors.requestType && <p className="mt-2 text-xs text-red-400">{errors.requestType}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="privacy-message" className="block text-sm font-medium text-gray-300">
                  {t('privacy.form.fields.details')}
                </label>
                <span className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{requestLabel}</span>
              </div>
              <textarea
                id="privacy-message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className={inputClassName('message')}
                placeholder={
                  isCookieConsentRequest
                    ? t('privacy.form.placeholders.cookieDetails')
                    : t('privacy.form.placeholders.details')
                }
              />
              {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message}</p>}
            </div>

            {isDeleteRequest && (
              <div className="border border-[#BD00FF]/20 bg-[#BD00FF]/10 p-4">
                <label className="flex items-start gap-3 text-sm leading-6 text-gray-200">
                  <input
                    name="confirmDeletion"
                    type="checkbox"
                    checked={formData.confirmDeletion}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 border-white/20 bg-transparent text-[#BD00FF] focus:ring-[#BD00FF]"
                  />
                  {t('privacy.form.confirmDeletionLabel')}
                </label>
                {errors.confirmDeletion && <p className="mt-2 text-xs text-red-400">{errors.confirmDeletion}</p>}
              </div>
            )}

            {feedbackMessage && (
              <div
                role={status === 'success' ? 'status' : 'alert'}
                className={`flex items-start gap-3 border p-4 text-sm leading-6 ${
                  status === 'success'
                    ? 'border-[#00FF41]/20 bg-[#00FF41]/10 text-[#CFFFE0]'
                    : 'border-red-500/20 bg-red-500/10 text-red-200'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00FF41]" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                )}
                <p>{feedbackMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex w-full items-center justify-center gap-2 border border-[#00F0FF]/60 bg-[#00F0FF] px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#050508] transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-75"
            >
              {status === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {status === 'loading' ? t('privacy.form.actions.sending') : t('privacy.form.actions.submit')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PrivacyRequestForm
