import { ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { COOKIE_CATEGORIES } from '../../lib/privacy-content.js'
import CookieCategoryRow from './CookieCategoryRow.jsx'

const CookiePreferencesModal = ({
  analyticsEnabled,
  isOpen,
  onClose,
  onAnalyticsChange,
  onSavePreferences,
  onAcceptOptionals,
  onRejectOptionals,
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6">
      <div className="relative w-full max-w-3xl overflow-hidden border border-[#1A1D26] bg-[#050508] text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00F0FF]/80 via-[#BD00FF]/45 to-transparent" />
        <div className="relative z-10 border-b border-[#1A1D26] bg-[#050508]/95 px-6 py-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#00F0FF]">
                <SlidersHorizontal className="h-4 w-4" />
                Preferências de cookies
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight">
                Configure o que pode ser ativado na sua navegação.
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Os cookies necessários ficam sempre ativos. Analytics permanece desligado até que você autorize.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-[#00F0FF]/40 hover:text-white"
              aria-label="Fechar preferências de cookies"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative z-10 px-6 py-6 md:px-8 md:py-8">
          <div className="mb-6 border border-[#00F0FF]/20 bg-[#00F0FF]/8 p-4 text-sm leading-6 text-gray-200">
            <div className="flex items-center gap-3 text-[#00F0FF]">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-bold uppercase tracking-[0.22em] text-xs">Privacidade por padrão</span>
            </div>
            <p className="mt-3 text-gray-300">
              Esta preferência é salva localmente no seu navegador com versionamento para futuras revisões da política.
            </p>
          </div>

          <div className="space-y-4">
            {COOKIE_CATEGORIES.map((category) => (
              <CookieCategoryRow
                key={category.key}
                title={category.title}
                description={category.description}
                accent={category.accent}
                checked={category.key === 'necessary' ? true : analyticsEnabled}
                disabled={category.alwaysOn}
                onToggle={category.key === 'analytics' ? onAnalyticsChange : undefined}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#1A1D26] pt-6 md:flex-row md:items-center md:justify-between">
            <div className="text-xs uppercase tracking-[0.24em] text-gray-500">
              Necessários ativos • Analytics {analyticsEnabled ? 'autorizado' : 'bloqueado'}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={onRejectOptionals}
                className="border border-white/10 bg-white/5 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/20 hover:bg-white/10"
              >
                Rejeitar opcionais
              </button>
              <button
                type="button"
                onClick={onAcceptOptionals}
                className="border border-[#BD00FF]/30 bg-[#BD00FF]/15 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#BD00FF]/25"
              >
                Aceitar opcionais
              </button>
              <button
                type="button"
                onClick={() => onSavePreferences({ analytics: analyticsEnabled })}
                className="border border-[#00F0FF]/60 bg-[#00F0FF] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#050508] transition-colors hover:bg-white"
              >
                Salvar preferências
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePreferencesModal
