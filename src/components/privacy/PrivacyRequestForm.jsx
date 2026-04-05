import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { PRIVACY_REQUEST_TYPES } from '../../lib/privacy-content.js'
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

const requestTypeSet = new Set(PRIVACY_REQUEST_TYPES.map((item) => item.value))

const isMissingPrivacyTableError = (error) => {
  const message = typeof error?.message === 'string' ? error.message.toLowerCase() : ''
  return error?.code === '42P01' || message.includes('privacy_requests') || message.includes('does not exist')
}

const buildFallbackContactMessage = ({ requestLabel, requestType, confirmDeletion, message }) =>
  [
    '[LGPD] Solicitação recebida pela página de privacidade',
    `Tipo selecionado: ${requestLabel}`,
    `Código interno: ${requestType}`,
    confirmDeletion ? 'Confirmação de exclusão: sim' : null,
    '',
    message.trim(),
  ]
    .filter(Boolean)
    .join('\n')

const PrivacyRequestForm = () => {
  const { openPreferences } = useCookieConsent()
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
      nextErrors.name = 'Informe seu nome.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.'
    }

    if (!requestTypeSet.has(formData.requestType)) {
      nextErrors.requestType = 'Selecione um tipo de solicitação válido.'
    }

    if (formData.message.trim().length < 12) {
      nextErrors.message = 'Descreva sua solicitação com pelo menos 12 caracteres.'
    }

    if (formData.message.trim().length > 4000) {
      nextErrors.message = 'Limite de 4000 caracteres excedido.'
    }

    if (isDeleteRequest && !formData.confirmDeletion) {
      nextErrors.confirmDeletion = 'Confirme que deseja solicitar a exclusão antes de enviar.'
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
    () => PRIVACY_REQUEST_TYPES.find((item) => item.value === formData.requestType)?.label ?? 'Solicitação',
    [formData.requestType],
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
        throw new Error('Configuração do Supabase indisponível.')
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
        })

        if (fallbackMessage.length > 4000) {
          throw new Error('Detalhe da solicitação excede o limite suportado no canal de fallback atual.')
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
      setFeedbackMessage('Solicitação enviada com sucesso. Nossa equipe analisará o pedido e retornará pelo e-mail informado.')
      setFormData(initialFormState)
      setErrors(initialErrorState)
    } catch (error) {
      setStatus('error')
      setFeedbackMessage(
        error instanceof Error && error.message
          ? `Não foi possível registrar sua solicitação agora: ${error.message}`
          : 'Não foi possível registrar sua solicitação agora.',
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
              <p className="text-xs uppercase tracking-[0.28em] text-[#00F0FF]">Solicitações LGPD</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                Canal atual de privacidade da plataforma.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                Enquanto o projeto não possui um e-mail dedicado para privacidade, este formulário é o canal oficial para pedidos ligados à LGPD.
              </p>
            </div>

            <div className="border border-[#1A1D26] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#BD00FF]">Escopo do atendimento</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-300">
                <li>Dados de conta e autenticação.</li>
                <li>Registros inseridos pelo próprio usuário na plataforma.</li>
                <li>Informações sobre tratamento, correção, acesso e exclusão.</li>
              </ul>
            </div>

            <div className="border border-[#1A1D26] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#00FF41]">Controle imediato</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Para revogar cookies opcionais, você também pode ajustar sua preferência diretamente agora.
              </p>
              <button
                type="button"
                onClick={openPreferences}
                className="mt-4 inline-flex items-center gap-2 border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#00F0FF] transition-colors hover:bg-[#00F0FF]/15 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                Gerenciar cookies
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="privacy-name" className="mb-2 block text-sm font-medium text-gray-300">
                  Nome
                </label>
                <input
                  id="privacy-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClassName('name')}
                  placeholder="Seu nome"
                />
                {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="privacy-email" className="mb-2 block text-sm font-medium text-gray-300">
                  E-mail
                </label>
                <input
                  id="privacy-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName('email')}
                  placeholder="voce@empresa.com"
                />
                {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="privacy-request-type" className="mb-2 block text-sm font-medium text-gray-300">
                Tipo de solicitação
              </label>
              <select
                id="privacy-request-type"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className={inputClassName('requestType')}
              >
                {PRIVACY_REQUEST_TYPES.map((requestType) => (
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
                  Detalhes
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
                    ? 'Descreva se deseja revogar apenas analytics ou receber retorno adicional sobre a preferência.'
                    : 'Explique o contexto da solicitação para agilizar a análise.'
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
                  Confirmo que desejo registrar um pedido de exclusão de dados e entendo que a solicitação será analisada antes da execução.
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
              {status === 'loading' ? 'Enviando solicitação...' : 'Enviar solicitação'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PrivacyRequestForm
