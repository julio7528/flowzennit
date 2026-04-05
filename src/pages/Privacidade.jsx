import { Fingerprint, LockKeyhole, ShieldCheck, SlidersHorizontal, Users } from 'lucide-react'
import Header from '../components/header.jsx'
import Footer from '../components/footer.jsx'
import PrivacyRequestForm from '../components/privacy/PrivacyRequestForm.jsx'
import { useCookieConsent } from '../components/privacy/cookie-consent-context.js'
import {
  COOKIE_CATEGORIES,
  PRIVACY_DATA_GROUPS,
  PRIVACY_GOVERNANCE_ITEMS,
  PRIVACY_HERO_POINTS,
  PRIVACY_LAST_UPDATED,
  PRIVACY_PURPOSES,
  PRIVACY_RETENTION_RULES,
  PRIVACY_RIGHTS,
  PRIVACY_STATUS_BADGES,
  PRIVACY_THIRD_PARTIES,
} from '../lib/privacy-content.js'

const iconBySection = {
  dados: Fingerprint,
  finalidades: LockKeyhole,
  terceiros: Users,
  cookies: SlidersHorizontal,
  direitos: ShieldCheck,
}

const sectionWrapperClass = 'border border-[#1A1D26] bg-[#0E1016] p-6 md:p-8 relative overflow-hidden'
const squareActionPrimaryClass =
  'inline-flex items-center justify-center gap-2 border border-[#00F0FF]/60 bg-[#00F0FF] px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#050508] transition-colors hover:bg-white'
const squareActionSecondaryClass =
  'inline-flex items-center justify-center gap-2 border border-[#BD00FF]/30 bg-[#BD00FF]/12 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#BD00FF]/20'

const PolicySection = ({ id, eyebrow, title, description, children, iconKey }) => {
  const Icon = iconBySection[iconKey]

  return (
    <section id={id} className={sectionWrapperClass}>
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-500/60 via-[#00F0FF]/35 to-transparent" />
      <div className="relative z-10">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5 text-[#00F0FF]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#00F0FF]">{eyebrow}</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">{title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

const PrivacyPage = () => {
  const { openPreferences } = useCookieConsent()

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white antialiased selection:bg-[#00F0FF] selection:text-black overflow-x-hidden font-[Public_Sans,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');

        .privacy-display { font-family: 'Public Sans', sans-serif; }
        .privacy-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes privacyShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .privacy-shimmer { animation: privacyShimmer 2.6s infinite; }

        .privacy-crt {
          background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.18) 50%),
                      linear-gradient(90deg, rgba(255,0,0,0.04), rgba(0,255,0,0.02), rgba(0,0,255,0.04));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .privacy-shimmer { animation: none !important; }
        }
      `}</style>

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-10">
        <div className="border-b border-[#1A1D26] bg-[#050508]/90 backdrop-blur-sm sticky top-20 z-30">
          <div className="h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F0FF] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00F0FF]" />
              </div>
              <h2 className="privacy-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] font-bold">
                PRIVACIDADE // LGPD // CONTROLE ATIVO
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3 privacy-mono text-xs text-gray-400">
              {['Dados', 'Cookies', 'Solicitações LGPD'].map((item, index) => (
                <div key={item} className="flex items-center gap-2 px-3 py-1.5 bg-[#0E1016] border border-[#1A1D26]">
                  <span style={{ color: index === 0 ? '#00F0FF' : index === 1 ? '#BD00FF' : '#00FF41' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden border border-[#1A1D26] p-8 bg-[#0E1016]">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 via-transparent to-[#BD00FF]/10" />
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00F0FF]/80 via-[#BD00FF]/45 to-transparent" />
                <div className="relative z-10">
                  <p className="privacy-mono text-xs text-[#00F0FF] uppercase tracking-[0.28em]">
                    Política de Privacidade e Cookies
                  </p>
                  <h1 className="privacy-display mt-5 text-4xl md:text-5xl font-black tracking-tight text-white leading-tight uppercase">
                    Privacidade com
                    <br />
                    controle real
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">
                      para o usuário.
                    </span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm md:text-base leading-7 text-gray-300">
                    Esta página resume como a FlowZenit trata dados de conta, registros inseridos pelo próprio usuário, cookies e preferências de privacidade, além de abrir um canal direto para solicitações ligadas à LGPD.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {PRIVACY_STATUS_BADGES.map((badge) => (
                      <span
                        key={badge}
                        className="privacy-mono border border-white/10 bg-black/20 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-gray-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={openPreferences}
                      className={squareActionPrimaryClass}
                    >
                      Gerenciar cookies
                    </button>
                    <a
                      href="#solicitacoes"
                      className={squareActionSecondaryClass}
                    >
                      Abrir formulário LGPD
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {PRIVACY_HERO_POINTS.map((point, index) => (
                  <div key={point.label} className="border border-[#1A1D26] bg-[#0E1016] p-4">
                    <p className="privacy-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">{point.label}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-200">{point.value}</p>
                    <div className="mt-4 h-0.5 w-full bg-[#1A1D26] overflow-hidden">
                      <div
                        className="privacy-shimmer h-full"
                        style={{
                          width: `${68 + index * 8}%`,
                          backgroundColor: index === 0 ? '#00F0FF' : index === 1 ? '#BD00FF' : '#00FF41',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden border border-[#1A1D26] bg-[#0E1016] p-6 md:p-8">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#BD00FF]/70 via-[#00F0FF]/25 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 border-b border-[#1A1D26] pb-3 mb-5 privacy-mono text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="ml-2">privacy_runtime.log</span>
                </div>

                <div className="privacy-mono text-xs md:text-sm leading-7 text-gray-300">
                  <span className="text-[#BD00FF]">const</span> <span className="text-[#00F0FF]">privacyScope</span> = {'{'}<br />
                  {'  '}<span className="text-gray-500">controller:</span> <span className="text-[#00FF41]">'FlowZenit'</span>,<br />
                  {'  '}<span className="text-gray-500">legalBasisFocus:</span> <span className="text-[#00FF41]">'LGPD / Brasil'</span>,<br />
                  {'  '}<span className="text-gray-500">thirdParties:</span> [<span className="text-[#00FF41]">'Supabase'</span>, <span className="text-[#00FF41]">'Google Analytics'</span>, <span className="text-[#00FF41]">'YouTube embed'</span>],<br />
                  {'  '}<span className="text-gray-500">cookies:</span> {'{'} necessary: <span className="text-blue-400">true</span>, analytics: <span className="text-blue-400">consent_based</span> {'}'},<br />
                  {'  '}<span className="text-gray-500">requestChannel:</span> <span className="text-[#00FF41]">'formulario_privacidade'</span>,<br />
                  {'  '}<span className="text-gray-500">policyVersion:</span> <span className="text-[#00FF41]">'1.0'</span>,<br />
                  {'};'}
                  <br />
                  <br />
                  <span className="text-gray-500">// Ultima revisao:</span> <span className="text-white">{PRIVACY_LAST_UPDATED}</span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="border border-[#1A1D26] bg-black/20 p-5">
                    <p className="privacy-mono text-[11px] uppercase tracking-[0.24em] text-[#00F0FF]">Controlador / projeto</p>
                    <p className="mt-3 text-sm leading-6 text-gray-300">
                      A FlowZenit trata dados pessoais na medida necessária para operar a autenticação, manter a área logada e armazenar os registros criados pelo próprio usuário dentro da plataforma.
                    </p>
                  </div>
                  <div className="border border-[#1A1D26] bg-black/20 p-5">
                    <p className="privacy-mono text-[11px] uppercase tracking-[0.24em] text-[#BD00FF]">Canal de privacidade</p>
                    <p className="mt-3 text-sm leading-6 text-gray-300">
                      O canal principal para solicitações LGPD nesta fase é o formulário disponível nesta página. Ele foi preparado para integração real com o stack atual do projeto.
                    </p>
                  </div>
                  <div className="border border-[#1A1D26] bg-black/20 p-5">
                    <p className="privacy-mono text-[11px] uppercase tracking-[0.24em] text-[#00FF41]">Atualizações desta política</p>
                    <p className="mt-3 text-sm leading-6 text-gray-300">
                      Esta política pode evoluir conforme o produto amadurece. Mudanças relevantes podem exigir uma nova confirmação de consentimento para cookies opcionais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PolicySection
          id="dados"
          eyebrow="Quais dados tratamos"
          title="Inventário mínimo de dados desta versão"
          description="A política reflete apenas o que já foi confirmado no projeto, sem ampliar escopo com categorias inexistentes."
          iconKey="dados"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {PRIVACY_DATA_GROUPS.map((group) => (
              <article key={group.title} className="border border-[#1A1D26] bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: group.accent, boxShadow: `0 0 10px ${group.accent}` }}
                  />
                  <h3 className="text-lg font-bold text-white">{group.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">{group.description}</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-200">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: group.accent }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </PolicySection>

        <PolicySection
          id="finalidades"
          eyebrow="Finalidades do tratamento"
          title="Por que esses dados são tratados"
          description="As finalidades abaixo seguem o uso real da plataforma e deixam claro quando depende de consentimento."
          iconKey="finalidades"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {PRIVACY_PURPOSES.map((purpose, index) => (
              <div key={purpose} className="border border-[#1A1D26] bg-black/20 p-5">
                <span className="privacy-mono text-xs text-gray-500">[{String(index + 1).padStart(2, '0')}]</span>
                <p className="mt-3 text-sm leading-6 text-gray-200">{purpose}</p>
              </div>
            ))}
          </div>
        </PolicySection>

        <PolicySection
          id="terceiros"
          eyebrow="Compartilhamento com terceiros"
          title="Terceiros relevantes nesta fase"
          description="O compartilhamento e suporte externo considerados nesta política se limitam aos serviços realmente identificados no projeto."
          iconKey="terceiros"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {PRIVACY_THIRD_PARTIES.map((party) => (
              <article key={party.name} className="border border-[#1A1D26] bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: party.accent, boxShadow: `0 0 10px ${party.accent}` }}
                  />
                  <h3 className="text-lg font-bold text-white">{party.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">{party.summary}</p>
              </article>
            ))}
          </div>
        </PolicySection>

        <PolicySection
          id="cookies"
          eyebrow="Política de Cookies"
          title="Categorias usadas no site"
          description="Nesta versão, o site trabalha apenas com cookies estritamente necessários e com medição opcional para analytics. Nenhuma categoria adicional foi criada sem uso real."
          iconKey="cookies"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {COOKIE_CATEGORIES.map((category) => (
              <article key={category.key} className="border border-[#1A1D26] bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: category.accent, boxShadow: `0 0 10px ${category.accent}` }}
                  />
                  <h3 className="text-lg font-bold text-white">{category.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">{category.description}</p>
                <div className="mt-4 privacy-mono text-xs uppercase tracking-[0.22em] text-gray-500">
                  {category.alwaysOn ? 'Sempre ativo' : 'Desligado por padrão até consentimento'}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 border border-[#00F0FF]/20 bg-[#00F0FF]/8 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-3xl text-sm leading-6 text-gray-200">
                Você pode revisar sua preferência a qualquer momento. O Google Analytics só é carregado após consentimento explícito para a categoria de medição/analytics.
              </p>
              <button
                type="button"
                onClick={openPreferences}
                className={squareActionPrimaryClass}
              >
                Gerenciar cookies
              </button>
            </div>
          </div>
        </PolicySection>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <PolicySection
            id="direitos"
            eyebrow="Direitos do titular"
            title="Como o usuário pode agir sobre seus dados"
            description="Os direitos abaixo podem ser exercidos pelo formulário desta página, sem depender de uma área jurídica externa para o primeiro contato."
            iconKey="direitos"
          >
            <div className="space-y-3">
              {PRIVACY_RIGHTS.map((right, index) => (
                <div key={right} className="border border-[#1A1D26] bg-black/20 p-4 flex gap-3">
                  <span className="privacy-mono text-xs text-[#00F0FF] mt-1">{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-sm leading-6 text-gray-200">{right}</p>
                </div>
              ))}
            </div>
          </PolicySection>

          <PolicySection
            id="retencao"
            eyebrow="Retenção e eliminação"
            title="Como tratamos permanência e descarte"
            description="A governança inicial foi escrita para o cenário real do projeto, sem prometer automações que ainda não existem."
            iconKey="dados"
          >
            <div className="space-y-4">
              {PRIVACY_RETENTION_RULES.map((rule) => (
                <article key={rule.title} className="border border-[#1A1D26] bg-black/20 p-5">
                  <h3 className="text-base font-bold text-white">{rule.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-300">{rule.text}</p>
                </article>
              ))}
            </div>
          </PolicySection>
        </div>

        <section id="governanca" className={sectionWrapperClass}>
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#00FF41]">Governança mínima</p>
              <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">
                Base inicial para evolução futura da privacidade.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                Esta entrega já organiza o inventário mínimo, o ponto de coleta de consentimento e a trilha inicial para evoluções futuras sem retrabalho estrutural grande.
              </p>
            </div>

            <div className="space-y-3">
              {PRIVACY_GOVERNANCE_ITEMS.map((item) => (
                <div key={item} className="border border-[#1A1D26] bg-black/20 p-4 flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.6)]" />
                  <p className="text-sm leading-6 text-gray-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PrivacyRequestForm />

        <section className="relative overflow-hidden border border-[#1A1D26] bg-[#0E1016] p-6 md:p-8">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#1A1D26_1px,transparent_1px),linear-gradient(90deg,#1A1D26_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00FF41]/70 via-[#00F0FF]/30 to-transparent" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#00F0FF]">Última atualização</p>
              <h2 className="mt-2 text-2xl font-black text-white">{PRIVACY_LAST_UPDATED}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Esta política poderá ser revista para refletir novas integrações, novas bases de tratamento ou melhorias de governança.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openPreferences}
                className="border border-[#00F0FF]/30 bg-[#00F0FF]/12 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#00F0FF] transition-colors hover:bg-[#00F0FF]/18 hover:text-white"
              >
                Gerenciar cookies
              </button>
              <a
                href="#solicitacoes"
                className="border border-[#BD00FF]/30 bg-[#BD00FF]/15 px-5 py-3 text-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#BD00FF]/22"
              >
                Ir para solicitações LGPD
              </a>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-20 privacy-crt" />

      <Footer />
    </div>
  )
}

export default PrivacyPage
