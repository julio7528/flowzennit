import {
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  CheckCircle2,
  Cpu,
  GitBranch,
  KanbanSquare,
  Layers,
  Lightbulb,
  MonitorPlay,
  PlayCircle,
  RefreshCw,
  Route,
  Search,
  Target,
  Terminal,
  Users,
  Zap,
  Brain,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './header.jsx'
import Footer from './footer.jsx'

const pillarIcons = [Brain, Layers, RefreshCw]
const flowIcons = [Lightbulb, BookOpen, KanbanSquare, Target]
const modalityIcons = [Users, MonitorPlay]

const TrainingPage = () => {
  const { t } = useTranslation()
  const statusItems = useMemo(() => t('training.statusBar.items', { returnObjects: true }), [t])
  const highlights = useMemo(() => t('training.highlights', { returnObjects: true }), [t])
  const pillars = useMemo(() => t('training.pillars', { returnObjects: true }), [t])
  const modules = useMemo(() => t('training.modules', { returnObjects: true }), [t])
  const flowSteps = useMemo(() => t('training.flowSteps', { returnObjects: true }), [t])
  const modalities = useMemo(() => t('training.modalities', { returnObjects: true }), [t])
  const benefits = useMemo(() => t('training.benefits', { returnObjects: true }), [t])
  const journey = t('training.journey', { returnObjects: true })
  const cta = t('training.cta', { returnObjects: true })

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white antialiased selection:bg-[#00F0FF] selection:text-black overflow-x-hidden font-[Public_Sans,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');

        .trn-display { font-family: 'Public Sans', sans-serif; }
        .trn-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes trnShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .trn-shimmer { animation: trnShimmer 2.4s infinite; }
        .trn-shimmer-d1 { animation: trnShimmer 2.4s infinite 0.6s; }
        .trn-shimmer-d2 { animation: trnShimmer 2.4s infinite 1.2s; }

        @keyframes trnScan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .trn-scanline { animation: trnScan 4s linear infinite; }

        .trn-crt {
          background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.22) 50%),
                      linear-gradient(90deg, rgba(255,0,0,0.05), rgba(0,255,0,0.02), rgba(0,0,255,0.05));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .trn-grid {
          background-image: linear-gradient(#1a1d26 1px, transparent 1px),
                            linear-gradient(90deg, #1a1d26 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .trn-card-hover { transition: border-color 0.2s, transform 0.2s; }
        .trn-card-hover:hover { transform: translateY(-3px); }

        @media (prefers-reduced-motion: reduce) {
          .trn-shimmer, .trn-shimmer-d1, .trn-shimmer-d2, .trn-scanline { animation: none !important; }
        }
      `}</style>

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-14">
        <div className="border-b border-[#1A1D26] bg-[#050508]/90 backdrop-blur-sm sticky top-20 z-30">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]" />
              </div>
              <h2 className="trn-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] font-bold">
                {t('training.statusBar.title')}
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3 trn-mono text-xs text-gray-400">
              {[Terminal, Cpu, Zap].map((Icon, index) => (
                <div key={statusItems[index]} className="flex items-center gap-2 px-3 py-1.5 bg-[#0E1016] border border-[#1A1D26]">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{statusItems[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <div className="flex flex-col gap-6">
              <div className="relative w-full aspect-video overflow-hidden border border-[#1A1D26] group">
                <div className="absolute inset-0 trn-grid opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/8 via-transparent to-[#BD00FF]/8" />
                <div className="trn-scanline absolute left-0 right-0 h-8 bg-gradient-to-b from-[#00F0FF]/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="trn-mono text-xs text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-2 py-1 mb-4 inline-block">
                    {t('training.hero.badge')}
                  </span>
                  <h1 className="trn-display text-4xl md:text-5xl font-black tracking-tight text-white leading-tight uppercase mt-3">
                    {t('training.hero.titleLine1')}
                    <br />
                    {t('training.hero.titleLine2')}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">
                      {t('training.hero.titleAccent')}
                    </span>
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {highlights.map((highlight) => (
                  <div key={highlight.label} className="bg-[#0E1016] border border-[#1A1D26] p-4 trn-card-hover group hover:border-[#00F0FF]/40">
                    <p className="trn-mono text-[0.6rem] text-gray-500 uppercase tracking-widest">{highlight.label}</p>
                    <p className="trn-display text-2xl font-black text-white mt-1">{highlight.value}</p>
                    <p className="trn-mono text-[0.6rem] text-[#00F0FF]">{highlight.unit}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a href="#modulos" className="flex-1 bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors trn-mono font-bold py-3 px-5 text-sm uppercase flex items-center justify-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  {t('training.hero.exploreAction')}
                </a>
                <Link to="/login" className="flex-1 bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors trn-mono font-bold py-3 px-5 text-sm uppercase flex items-center justify-center gap-2">
                  <CalendarCheck2 className="h-4 w-4" />
                  {t('training.hero.startAction')}
                </Link>
              </div>
            </div>

            <div className="bg-[#0E1016] border border-[#1A1D26] p-6 flex flex-col gap-0 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 opacity-5 trn-grid" />
              <div className="flex items-center gap-2 border-b border-[#1A1D26] pb-3 mb-5 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="trn-mono text-xs text-gray-500 ml-2">{journey.fileName}</span>
              </div>
              <div className="relative z-10 trn-mono text-xs text-gray-300 leading-relaxed mb-5">
                <span className="text-[#BD00FF]">const</span>{' '}
                <span className="text-[#00F0FF]">jornada</span> = {'{'}<br />
                {'  '}<span className="text-gray-400">{journey.goalLabel}:</span>{' '}
                <span className="text-[#00FF41]">'{journey.goalValue}'</span>,<br />
                {'  '}<span className="text-gray-400">{journey.methodologiesLabel}:</span>{' '}[
                <span className="text-[#00FF41]">'GUT'</span>,{' '}
                <span className="text-[#00FF41]">'GTD'</span>,{' '}
                <span className="text-[#00FF41]">'PDCA'</span>,{' '}
                <span className="text-[#00FF41]">'MASP'</span>],<br />
                {'  '}<span className="text-gray-400">{journey.platformLabel}:</span>{' '}
                <span className="text-[#00FF41]">'{journey.platformValue}'</span>,<br />
                {'  '}<span className="text-gray-400">{journey.formatLabel}:</span>{' '}
                <span className="text-[#00FF41]">'{journey.formatValue}'</span>,<br />
                {'};'}<br />
                <br />
                <span className="text-gray-500">{journey.loading}</span><br />
                <span className="animate-pulse text-[#00F0FF]">_</span>
              </div>

              <div className="relative z-10 flex flex-col gap-0 border-l border-[#1A1D26] ml-2 pl-4 flex-1">
                {flowSteps.map((step, index) => {
                  const Icon = flowIcons[index]
                  const colors = ['#00F0FF', '#BD00FF', '#00FF41', '#00F0FF']
                  return (
                    <div key={step.tag} className="relative group pb-5 last:pb-0">
                      <div
                        className="absolute -left-[21px] top-1 h-2.5 w-2.5 border transition-colors"
                        style={{
                          backgroundColor: '#050508',
                          borderColor: index === 0 ? colors[index] : '#333',
                          boxShadow: index === 0 ? `0 0 8px ${colors[index]}88` : 'none',
                        }}
                      />
                      <div className="flex items-start gap-3 p-3 hover:bg-[#1A1D26]/30 transition-colors">
                        <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${colors[index]}15`, color: colors[index] }}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="trn-mono text-[0.6rem] font-bold block" style={{ color: colors[index] }}>
                            [{step.tag}]
                          </span>
                          <h4 className="trn-display font-bold text-sm text-white">{step.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-5">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1A1D26] pt-10">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="h-5 w-5 text-[#BD00FF]" />
            <p className="trn-mono text-xs font-bold text-gray-400 uppercase tracking-widest">{t('training.pillarsSection.eyebrow')}</p>
          </div>
          <h2 className="trn-display text-3xl md:text-4xl font-black text-white mb-8 max-w-2xl">{t('training.pillarsSection.title')}</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {pillars.map((pillar, index) => {
              const Icon = pillarIcons[index]
              const colors = ['#00F0FF', '#BD00FF', '#00FF41']
              return (
                <article key={pillar.title} className="bg-[#0E1016] border border-[#1A1D26] p-6 trn-card-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: colors[index], opacity: 0.5 }} />
                  <div className="w-9 h-9 flex items-center justify-center mb-4" style={{ backgroundColor: `${colors[index]}15`, color: colors[index] }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="trn-display font-bold text-white text-lg mb-2">{pillar.title}</h3>
                  <p className="text-sm text-gray-400 leading-6">{pillar.description}</p>
                  <div className="h-0.5 w-full bg-[#1A1D26] mt-5 overflow-hidden">
                    <div className="h-full w-2/3 trn-shimmer" style={{ backgroundColor: colors[index] }} />
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="modulos" className="border-t border-[#1A1D26] pt-10">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-5 w-5 text-[#00F0FF]" />
            <p className="trn-mono text-xs font-bold text-gray-400 uppercase tracking-widest">{t('training.modulesSection.eyebrow')}</p>
          </div>
          <h2 className="trn-display text-3xl md:text-4xl font-black text-white mb-8 max-w-3xl">{t('training.modulesSection.title')}</h2>

          <div className="flex flex-col gap-5">
            {modules.map((module, index) => (
              <article key={module.id} className="bg-[#0E1016] border border-[#1A1D26] relative overflow-hidden trn-card-hover group" style={{ borderLeftColor: ['#00F0FF', '#BD00FF', '#00FF41'][index], borderLeftWidth: 3 }}>
                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-0">
                  <div className="p-7 border-b lg:border-b-0 lg:border-r border-[#1A1D26]">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="trn-mono text-xs border border-[#1A1D26] px-3 py-1 text-gray-400">{module.id}</span>
                      <span className="trn-mono text-xs px-3 py-1 border" style={{ color: ['#00F0FF', '#BD00FF', '#00FF41'][index], borderColor: `${['#00F0FF', '#BD00FF', '#00FF41'][index]}40`, backgroundColor: `${['#00F0FF', '#BD00FF', '#00FF41'][index]}10` }}>
                        {module.badge}
                      </span>
                    </div>
                    <h3 className="trn-display text-2xl font-black text-white mb-5">{module.title}</h3>
                    <p className="trn-mono text-[0.65rem] text-gray-500 uppercase tracking-widest mb-1">Objetivo do aprendizado</p>
                    <p className="text-sm text-gray-200 leading-6 mb-5">{module.objective}</p>
                    <div className="bg-black/30 border border-[#1A1D26] p-4">
                      <p className="trn-mono text-[0.65rem] text-gray-500 uppercase tracking-widest mb-1">Relacao com a plataforma</p>
                      <p className="text-sm text-gray-300 leading-6">{module.relation}</p>
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="trn-mono text-[0.65rem] text-gray-500 uppercase tracking-widest mb-4">Topicos abordados</p>
                    <div className="flex flex-col gap-3">
                      {module.items.map((item, itemIndex) => (
                        <div key={item} className="flex gap-3 border border-[#1A1D26] p-4 bg-black/20 hover:bg-[#1A1D26]/50 transition-colors">
                          <span className="trn-mono text-xs shrink-0 mt-0.5 font-bold" style={{ color: ['#00F0FF', '#BD00FF', '#00FF41'][index] }}>
                            {String(itemIndex + 1).padStart(2, '0')}
                          </span>
                          <p className="text-sm text-gray-200 leading-6">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-b border-[#1A1D26] py-10 relative bg-[#0E1016]/30">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent opacity-50" />
          <div className="flex items-center gap-2 mb-8 pl-4">
            <Route className="h-5 w-5 text-[#00F0FF]" />
            <p className="trn-mono text-xs font-bold text-gray-400 uppercase tracking-widest">{t('training.flowSection.eyebrow')}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-0 relative">
            {flowSteps.map((step, index) => {
              const Icon = flowIcons[index]
              const colors = ['#00F0FF', '#BD00FF', '#00FF41', '#00F0FF']
              return (
                <div key={step.tag} className="flex flex-col gap-3 px-6 relative border-r border-[#1A1D26] last:border-r-0">
                  {index < flowSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-6 translate-x-1/2 h-5 w-5 text-gray-600 z-10 bg-[#050508]" />
                  )}
                  <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: `${colors[index]}15`, color: colors[index] }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="trn-mono text-[0.6rem] font-bold" style={{ color: colors[index] }}>
                    [{step.tag}]
                  </span>
                  <h4 className="trn-display font-bold text-white text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-5">{step.description}</p>
                  <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                    <div className={`h-full ${index === 0 ? 'trn-shimmer' : index === 1 ? 'trn-shimmer-d1' : index === 2 ? 'trn-shimmer-d2' : 'trn-shimmer'}`} style={{ backgroundColor: colors[index], width: `${60 + index * 13}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="bg-[#0E1016] border border-[#1A1D26] p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 trn-grid" />
            <div className="relative z-10">
              <p className="trn-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-2">{t('training.modalitiesSection.eyebrow')}</p>
              <h2 className="trn-display text-2xl font-black text-white mb-4">{t('training.modalitiesSection.title')}</h2>
              <p className="text-sm text-gray-400 leading-6">{t('training.modalitiesSection.description')}</p>
            </div>
            <div className="flex flex-col gap-4 relative z-10">
              {modalities.map((modality, index) => {
                const Icon = modalityIcons[index]
                const colors = ['#00F0FF', '#BD00FF']
                return (
                  <div key={modality.title} className="border border-[#1A1D26] p-5 bg-black/20 trn-card-hover group hover:border-[#00F0FF]/30">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors[index]}15`, color: colors[index] }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="trn-display font-bold text-white">{modality.title}</h3>
                          <span className="trn-mono text-[0.6rem] px-2 py-0.5 border font-bold" style={{ color: colors[index], borderColor: `${colors[index]}40`, backgroundColor: `${colors[index]}10` }}>
                            {modality.tag}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-6">{modality.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-[#0E1016] border border-[#1A1D26] p-8">
            <p className="trn-mono text-xs text-gray-500 uppercase tracking-widest mb-5">{t('training.benefitsSection.title')}</p>
            <div className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 border border-[#1A1D26] p-4 bg-black/20 hover:bg-[#1A1D26]/40 transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 bg-[#00F0FF]/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00F0FF]" />
                  </div>
                  <p className="text-sm text-gray-200 leading-6">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="border border-[#1A1D26] bg-[#0E1016] p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute inset-0 trn-grid opacity-5" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#BD00FF] to-transparent" />
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center relative z-10">
              <div>
                <p className="trn-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-3">{cta.eyebrow}</p>
                <h2 className="trn-display text-3xl sm:text-4xl font-black text-white mb-4">
                  {cta.titlePrefix}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">
                    {cta.titleAccent}
                  </span>
                </h2>
                <p className="text-sm text-gray-400 leading-7 max-w-xl">{cta.description}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors trn-mono font-bold py-4 px-6 text-sm uppercase flex items-center justify-center gap-2">
                  {cta.primary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#modulos" className="bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors trn-mono font-bold py-4 px-6 text-sm uppercase flex items-center justify-center gap-2">
                  {cta.secondary}
                  <BookOpen className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-20 trn-crt" />

      <Footer />
    </div>
  )
}

export default TrainingPage
