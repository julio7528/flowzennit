import { Link } from 'react-router-dom'
import { Settings2 } from 'lucide-react'

const CookieConsentBanner = ({ onAcceptOptionals, onRejectOptionals, onConfigure }) => (
  <div className="fixed inset-x-0 bottom-4 z-[80] px-4">
    <div className="relative mx-auto max-w-5xl overflow-hidden border border-[#1A1D26] bg-[#050508]/96 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00F0FF]/80 via-[#BD00FF]/45 to-transparent" />
      <div className="relative z-10 grid gap-6 px-5 py-5 md:grid-cols-[1.2fr_0.8fr] md:px-7 md:py-6">
        <div>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#00F0FF]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.8)]" />
            Privacidade e cookies
          </div>
          <h2 className="mt-3 text-xl md:text-2xl font-black tracking-tight">
            Você decide se a medição da plataforma pode ser ativada.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300">
            Utilizamos cookies e tecnologias semelhantes para garantir o funcionamento do site, registrar suas preferências de privacidade e, com sua autorização, medir o uso da plataforma para melhorias contínuas.
          </p>
          <Link
            to="/privacidade"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#00F0FF] transition-colors hover:text-white"
          >
            Ler Política de Privacidade e Cookies
          </Link>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <button
            type="button"
            onClick={onAcceptOptionals}
            className="border border-[#00F0FF]/60 bg-[#00F0FF] px-5 py-3 text-left font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#050508] transition-colors hover:bg-white"
          >
            Aceitar opcionais
          </button>
          <button
            type="button"
            onClick={onRejectOptionals}
            className="border border-white/10 bg-white/5 px-5 py-3 text-left font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/20 hover:bg-white/10"
          >
            Rejeitar opcionais
          </button>
          <button
            type="button"
            onClick={onConfigure}
            className="inline-flex items-center justify-center gap-2 border border-[#BD00FF]/30 bg-[#BD00FF]/15 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#BD00FF]/25"
          >
            <Settings2 className="h-4 w-4" />
            Configurar preferências
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default CookieConsentBanner
