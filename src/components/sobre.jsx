import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Bot,
  Brain,
  Cpu,
  History,
  Keyboard,
  Monitor,
  Terminal,
  Wifi,
  Zap,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './header.jsx'
import Footer from './footer.jsx'

const areaIcons = [Bot, Brain, Blocks, Zap]

const Sobre = () => {
  const { t } = useTranslation()
  const statusItems = useMemo(() => t('about.statusBar.items', { returnObjects: true }), [t])
  const timelineItems = useMemo(() => t('about.timeline.items', { returnObjects: true }), [t])
  const focusAreas = useMemo(() => t('about.focusAreas', { returnObjects: true }), [t])
  const workflowSteps = useMemo(() => t('about.workflowSteps', { returnObjects: true }), [t])
  const certifications = useMemo(() => t('about.certifications.items', { returnObjects: true }), [t])
  const educationItems = useMemo(() => t('about.education.items', { returnObjects: true }), [t])
  const highlightProjects = useMemo(() => t('about.highlightProjects.items', { returnObjects: true }), [t])
  const terminal = t('about.terminal', { returnObjects: true })
  const hero = t('about.hero', { returnObjects: true })
  const featureCard = t('about.featureCard', { returnObjects: true })

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white antialiased selection:bg-[#00F0FF] selection:text-black overflow-x-hidden font-[Public_Sans,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');

        .sobre-display { font-family: 'Public Sans', sans-serif; }
        .sobre-mono { font-family: 'JetBrains Mono', monospace; }

        .sobre-crt {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }

        .sobre-grid-pattern {
          background-image: linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes sobreShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .sobre-shimmer { animation: sobreShimmer 2s infinite; }
        .sobre-shimmer-d1 { animation: sobreShimmer 2s infinite 0.5s; }
        .sobre-shimmer-d2 { animation: sobreShimmer 2s infinite 1s; }

        @media (prefers-reduced-motion: reduce) {
          .sobre-shimmer, .sobre-shimmer-d1, .sobre-shimmer-d2 {
            animation: none !important;
          }
        }
      `}</style>

      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-12">
        <div className="border-b border-[#1A1D26] bg-[#050508]/90 backdrop-blur-sm sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF41]" />
              </div>
              <h2 className="sobre-mono text-xs sm:text-sm tracking-widest text-[#00F0FF] font-bold">
                {t('about.statusBar.title')}
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4 sobre-mono text-xs text-gray-400">
              {[Terminal, Wifi, Cpu].map((Icon, index) => (
                <div key={statusItems[index]} className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#0E1016] border border-[#1A1D26]">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{statusItems[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#1A1D26] group">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="sobre-display text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 leading-none uppercase">
                    {hero.firstName}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BD00FF]">
                      {hero.lastName}
                    </span>
                  </h1>
                  <a href="https://github.com/julio7528" target="_blank" rel="noreferrer" className="sobre-mono text-[#00F0FF] text-sm tracking-widest uppercase">
                    github.com/julio7528
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/juliofgomes"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#00F0FF] text-[#050508] hover:bg-white transition-colors sobre-mono font-bold py-3 px-6 rounded text-sm uppercase flex items-center justify-center gap-2 group"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Linkedin_logo.svg" alt={hero.linkedinAlt} className="h-5 w-5 animate-bounce" />
                  {hero.linkedinAction}
                </a>
                <a
                  href="https://github.com/julio7528"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#0E1016] border border-[#00F0FF]/30 text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors sobre-mono font-bold py-3 px-6 rounded text-sm uppercase flex items-center justify-center gap-2"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/GitHub_Invertocat_Logo_invert.svg" alt={hero.githubAlt} className="h-5 w-5" />
                  {hero.githubAction}
                </a>
              </div>
            </div>

            <div className="h-full bg-[#0E1016] border border-[#1A1D26] rounded-xl p-6 sobre-mono text-xs md:text-sm overflow-hidden relative shadow-lg">
              <div className="flex items-center gap-2 mb-4 border-b border-[#1A1D26] pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-gray-500">{terminal.fileName}</span>
              </div>
              <div className="text-gray-300 leading-relaxed">
                <span className="text-[#BD00FF]">const</span>{' '}
                <span className="text-[#00F0FF]">devProfile</span> = {'{'}<br />
                {'  '}<span className="text-gray-400">{terminal.roleLabel}:</span>{' '}
                <span className="text-[#00FF41]">'{terminal.roleValue}'</span>,<br />
                {'  '}<span className="text-gray-400">{terminal.experienceLabel}:</span>{' '}
                <span className="text-blue-400">'{terminal.experienceValue}'</span>,<br />
                {'  '}<span className="text-gray-400">{terminal.locationLabel}:</span>{' '}
                <span className="text-blue-400">'{terminal.locationValue}'</span>,<br />
                {'  '}<span className="text-gray-400">{terminal.stackLabel}:</span> [<br />
                {terminal.stack.map((item) => (
                  <span key={item}>
                    {'    '}<span className="text-[#00FF41]">'{item}'</span>,<br />
                  </span>
                ))}
                {'  '}],<br />
                {'  '}<span className="text-gray-400">{terminal.currentRoleLabel}:</span>{' '}
                <span className="text-[#00FF41]">'{terminal.currentRoleValue}'</span>,<br />
                {'  '}<span className="text-gray-400">{terminal.missionLabel}:</span>{' '}
                <span className="text-[#00FF41]">'{terminal.missionValue}'</span><br />
                {'};'}<br />
                <br />
                <span className="text-gray-500">{terminal.bootMessage}</span><br />
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <History className="h-5 w-5 text-[#BD00FF]" />
              <h3 className="sobre-mono text-sm font-bold text-gray-400 uppercase">{t('about.timeline.title')}</h3>
            </div>
            <div className="space-y-4 relative pl-4 border-l border-[#1A1D26]">
              {timelineItems.map((item, index) => (
                <div key={item.period} className="relative group">
                  <div className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ${index === timelineItems.length - 1 ? 'bg-[#050508] border-2 border-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse' : 'bg-[#0E1016] border border-gray-600 group-hover:border-[#BD00FF]'} transition-colors`} />
                  <div className={`flex flex-col gap-1 p-3 rounded ${index === timelineItems.length - 1 ? 'bg-[#0E1016]/50 border border-[#1A1D26]' : 'hover:bg-[#1A1D26]/30'} transition-colors`}>
                    <span className={`sobre-mono text-xs ${index === timelineItems.length - 1 ? 'text-[#00F0FF]' : 'text-gray-500'}`}>{item.period}</span>
                    <h4 className={`font-bold text-sm ${index === timelineItems.length - 1 ? 'text-white' : 'text-gray-200'}`}>{item.company}</h4>
                    <span className="text-xs text-[#00FF41]">{item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-[#0E1016] rounded-xl p-8 h-full flex flex-col justify-between relative overflow-hidden border border-[#1A1D26] group hover:border-[#00F0FF]/50 transition-colors shadow-2xl">
              <div className="absolute inset-0 opacity-10 sobre-grid-pattern" />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <span className="sobre-mono text-xs text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-1 rounded border border-[#00F0FF]/20">
                    {featureCard.badge}
                  </span>
                </div>
                <h2 className="sobre-display text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  {featureCard.titleLine1}
                  <br />
                  <span className="text-gray-500">{featureCard.titleLine2}</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{featureCard.description}</p>
                <div className="mt-auto pt-4 flex items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="sobre-mono text-xs text-gray-400">{featureCard.projectsLabel}</span>
                    <span className="font-bold text-xl text-white">{featureCard.projectsValue}</span>
                  </div>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" fill="transparent" r="40" stroke="#1A1D26" strokeWidth="8" />
                      <circle className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" cx="48" cy="48" fill="transparent" r="40" stroke="#00F0FF" strokeDasharray="251.2" strokeDashoffset="25" strokeWidth="8" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-bold text-white">9+</span>
                      <span className="text-[0.5rem] sobre-mono text-[#00F0FF]">{featureCard.yearsLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3 h-full">
            {focusAreas.map((area, index) => {
              const Icon = areaIcons[index]
              const accent = index % 2 === 0 ? '#BD00FF' : '#00F0FF'
              const hoverText = index % 2 === 0 ? 'group-hover:text-white' : 'group-hover:text-[#050508]'
              return (
                <div key={area.title} className="bg-[#0E1016] border border-[#1A1D26] p-4 rounded-lg flex flex-col gap-2 hover:border-[#00F0FF]/50 transition-all hover:-translate-y-1 group">
                  <div className={`w-8 h-8 rounded flex items-center justify-center mb-2 transition-colors ${hoverText}`} style={{ backgroundColor: `${accent}1A`, color: accent }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">{area.title}</h4>
                  <p className="text-xs text-gray-400">{area.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-t border-b border-[#1A1D26] py-8 relative bg-[#0E1016]/30">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#00F0FF] to-transparent opacity-50" />
          <div className="grid md:grid-cols-3 gap-8 items-center relative">
            {[Keyboard, Monitor, Cpu].map((Icon, index) => (
              <div key={workflowSteps[index].title} className="flex flex-col gap-2 px-4 relative group">
                {index < workflowSteps.length - 1 && (
                  <div className={`hidden md:flex absolute ${index === 0 ? 'left-[100%]' : 'left-[100%]'} top-1/2 -translate-y-1/2 text-gray-700`}>
                    <ArrowRight className="h-8 w-8 animate-pulse" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${index === 0 ? 'text-[#00F0FF]' : index === 1 ? 'text-[#BD00FF]' : 'text-[#00FF41]'}`} />
                  <h4 className="sobre-mono font-bold text-white">{workflowSteps[index].title}</h4>
                </div>
                <p className="text-sm text-gray-400">{workflowSteps[index].description}</p>
                <div className="h-0.5 w-full bg-[#1A1D26] mt-2 overflow-hidden">
                  <div className={`h-full ${index === 0 ? 'w-1/2 bg-[#00F0FF] sobre-shimmer' : index === 1 ? 'w-2/3 bg-[#BD00FF] sobre-shimmer-d1' : 'w-full bg-[#00FF41] sobre-shimmer-d2'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-12 pt-4 border-t border-[#1A1D26]/50">
          <div className="flex items-center gap-2 mb-6">
            <BadgeCheck className="h-5 w-5 text-[#00F0FF]" />
            <h3 className="sobre-mono text-sm font-bold text-gray-400 uppercase tracking-widest">
              {t('about.certifications.title')}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {certifications.map((cert) => (
              <div key={cert.label} className="bg-[#0E1016] border border-[#1A1D26] rounded-lg p-4 flex flex-col gap-2 hover:border-[#00F0FF]/40 transition-all hover:-translate-y-1 group">
                <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: cert.color, boxShadow: `0 0 6px ${cert.color}` }} />
                <span className="sobre-mono text-xs font-bold text-white leading-tight">{cert.label}</span>
                <span className="sobre-mono text-[0.6rem] text-gray-500 uppercase">{cert.sub}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-[#0E1016] border border-[#1A1D26] rounded-lg p-5 flex flex-col gap-1">
              <span className="sobre-mono text-xs text-gray-500 uppercase">{t('about.education.title')}</span>
              <ul className="space-y-2 mt-2 sobre-mono text-xs text-gray-300">
                {educationItems.map((item) => (
                  <li key={item.label}>
                    <span style={{ color: item.color }}>{item.status}</span> {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0E1016] border border-[#1A1D26] rounded-lg p-5 flex flex-col gap-1">
              <span className="sobre-mono text-xs text-gray-500 uppercase">{t('about.highlightProjects.title')}</span>
              <ul className="space-y-2 mt-2 sobre-mono text-xs text-gray-300">
                {highlightProjects.map((item) => (
                  <li key={item}>
                    <span className="text-[#00F0FF]">&gt;&gt;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay opacity-20 sobre-crt" />

      <Footer />
    </div>
  )
}

export default Sobre
