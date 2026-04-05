import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './header.jsx'
import Footer from './footer.jsx'

const Metodologia = () => {
  const { t } = useTranslation()
  const [activeMethod, setActiveMethod] = useState('gtd')
  const [activeGtd, setActiveGtd] = useState(0)
  const [activeGut, setActiveGut] = useState(0)
  const [activeMasp, setActiveMasp] = useState(0)
  const [activePdca, setActivePdca] = useState(0)

  const gtdSteps = useMemo(() => t('methodology.gtdSteps', { returnObjects: true }), [t])
  const gutFactors = useMemo(() => t('methodology.gutFactors', { returnObjects: true }), [t])
  const maspSteps = useMemo(() => t('methodology.maspSteps', { returnObjects: true }), [t])
  const pdcaPhases = useMemo(() => t('methodology.pdcaPhases', { returnObjects: true }), [t])
  const explainers = useMemo(() => t('methodology.explainers', { returnObjects: true }), [t])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    const nodes = document.querySelectorAll('[data-reveal]')
    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-bgDark text-white overflow-x-hidden selection:bg-hotPink selection:text-white">
      <style>{`
        .method-grid {
          background-image:
            linear-gradient(to right, rgba(148, 163, 184, 0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.10) 1px, transparent 1px);
          background-size: 34px 34px;
        }
        .timeline-thread {
          background: linear-gradient(to bottom, transparent 0%, #67e8f9 22%, #ff4fd8 55%, #8b5cf6 80%, transparent 100%);
          box-shadow: 0 0 22px rgba(103, 232, 249, 0.35);
        }
        .glass-panel {
          background: rgba(18, 11, 31, 0.65);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 680ms ease, transform 680ms ease;
        }
        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .spin-slow {
          animation: spin-slow 26s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Header />

      <main id="metodologia" className="relative method-grid">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-20 left-[20%] w-72 h-72 rounded-full bg-neonPurple/15 blur-[100px]" />
          <div className="absolute top-[40%] right-[6%] w-72 h-72 rounded-full bg-neonCyan/10 blur-[100px]" />
          <div className="absolute bottom-[8%] left-[8%] w-80 h-80 rounded-full bg-hotPink/10 blur-[110px]" />
        </div>

        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 timeline-thread z-0" />

        <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32 pb-20 text-center">
          <div className="max-w-4xl">
            <p data-reveal className="reveal inline-flex px-4 py-1 rounded-full border border-white/15 bg-white/5 text-xs tracking-[0.22em] text-neonCyan">
              {t('methodology.hero.badge')}
            </p>
            <h1 data-reveal style={{ transitionDelay: '120ms' }} className="reveal mt-6 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
              {t('methodology.hero.titleLine1')}
              <br />
              <span className="text-gradient">{t('methodology.hero.titleLine2')}</span>
            </h1>
            <p data-reveal style={{ transitionDelay: '220ms' }} className="reveal mt-6 text-textGray max-w-2xl mx-auto">
              {t('methodology.hero.description')}
            </p>

            <div data-reveal style={{ transitionDelay: '280ms' }} className="reveal mt-8 glass-panel rounded-2xl p-4 text-left">
              <div className="flex flex-wrap gap-2">
                {['gtd', 'gut', 'masp', 'pdca'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setActiveMethod(method)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                      activeMethod === method
                        ? 'bg-white text-black'
                        : 'bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-neonCyan text-xs tracking-[0.2em]">{explainers[activeMethod].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">{t('methodology.labels.what')}</span> {explainers[activeMethod].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">{t('methodology.labels.how')}</span> {explainers[activeMethod].how}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-start">
            <div className="lg:text-right">
              <p data-reveal className="reveal font-mono text-neonCyan tracking-[0.22em] text-xs">{t('methodology.gtdSection.eyebrow')}</p>
              <h2 data-reveal style={{ transitionDelay: '100ms' }} className="reveal mt-4 text-4xl md:text-5xl font-extrabold">{t('methodology.gtdSection.title')}</h2>
              <div data-reveal style={{ transitionDelay: '180ms' }} className="reveal glass-panel rounded-2xl p-6 mt-6">
                <p className="text-gray-300 leading-relaxed">{t('methodology.gtdSection.description')}</p>
              </div>
              <div data-reveal style={{ transitionDelay: '220ms' }} className="reveal glass-panel rounded-2xl p-6 mt-4 text-left lg:text-right">
                <p className="text-xs text-neonCyan tracking-[0.2em]">{gtdSteps[activeGtd].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">{t('methodology.labels.what')}</span> {gtdSteps[activeGtd].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">{t('methodology.labels.how')}</span> {gtdSteps[activeGtd].how}
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              {gtdSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  data-reveal
                  onClick={() => setActiveGtd(index)}
                  style={{ transitionDelay: `${120 + index * 90}ms` }}
                  className={`reveal mb-3 last:mb-0 w-full h-12 rounded-lg border-l-4 flex items-center px-4 text-left transition-colors ${
                    activeGtd === index
                      ? 'border-neonCyan bg-gradient-to-r from-neonCyan/25 to-transparent'
                      : 'border-neonCyan/60 bg-gradient-to-r from-neonCyan/10 to-transparent hover:from-neonCyan/20'
                  }`}
                >
                  <span className="font-mono text-neonCyan mr-3">0{index + 1}</span>
                  <span className="font-semibold text-white">{step.title}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-5xl mx-auto w-full glass-panel rounded-3xl p-8 md:p-12 border border-hotPink/30">
            <p data-reveal className="reveal font-mono text-hotPink tracking-[0.22em] text-xs text-center">{t('methodology.gutSection.eyebrow')}</p>
            <h2 data-reveal style={{ transitionDelay: '90ms' }} className="reveal mt-3 text-center text-4xl font-extrabold">{t('methodology.gutSection.title')}</h2>
            <p data-reveal style={{ transitionDelay: '160ms' }} className="reveal mt-3 text-center text-gray-300">{t('methodology.gutSection.description')}</p>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {gutFactors.map((factor, index) => (
                <button
                  key={factor.title}
                  type="button"
                  data-reveal
                  onClick={() => setActiveGut(index)}
                  style={{ transitionDelay: `${220 + index * 90}ms` }}
                  className={`reveal text-left rounded-xl p-3 border transition-colors ${
                    activeGut === index ? 'border-hotPink/60 bg-hotPink/10' : 'border-white/10 bg-black/20 hover:bg-hotPink/5'
                  }`}
                >
                  <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>{factor.title}</span>
                    <span className="text-hotPink">{factor.score}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden">
                    <div className={`h-full ${factor.width} bg-hotPink shadow-[0_0_10px_#ff4fd8]`} />
                  </div>
                </button>
              ))}
            </div>

            <div data-reveal className="reveal mt-6 rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs text-hotPink tracking-[0.2em]">{gutFactors[activeGut].title}</p>
              <p className="mt-1 text-sm text-gray-200">
                <span className="font-semibold text-white">{t('methodology.labels.what')}</span> {gutFactors[activeGut].what}
              </p>
              <p className="mt-1 text-sm text-gray-300">
                <span className="font-semibold text-white">{t('methodology.labels.how')}</span> {gutFactors[activeGut].how}
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10">
            <div>
              <p data-reveal className="reveal font-mono text-neonPurple tracking-[0.22em] text-xs">{t('methodology.maspSection.eyebrow')}</p>
              <h2 data-reveal style={{ transitionDelay: '90ms' }} className="reveal mt-4 text-4xl md:text-5xl font-extrabold">{t('methodology.maspSection.title')}</h2>
              <div data-reveal style={{ transitionDelay: '160ms' }} className="reveal glass-panel rounded-2xl p-6 mt-6 border-l-4 border-neonPurple">
                <p className="text-gray-300">{t('methodology.maspSection.description')}</p>
              </div>
              <div data-reveal style={{ transitionDelay: '220ms' }} className="reveal glass-panel rounded-2xl p-6 mt-4">
                <p className="text-xs text-neonPurple tracking-[0.2em]">{maspSteps[activeMasp].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">{t('methodology.labels.what')}</span> {maspSteps[activeMasp].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">{t('methodology.labels.how')}</span> {maspSteps[activeMasp].how}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {maspSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  data-reveal
                  onClick={() => setActiveMasp(index)}
                  style={{ transitionDelay: `${140 + index * 80}ms` }}
                  className={`reveal glass-panel rounded-xl p-4 border w-full text-left transition-colors ${
                    activeMasp === index ? 'border-neonPurple/60 bg-neonPurple/10' : 'border-neonPurple/25 hover:bg-neonPurple/5'
                  }`}
                >
                  <p className="font-mono text-xs text-neonPurple">0{index + 1}</p>
                  <h3 className="font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-gray-300">{step.what}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 min-h-screen flex items-center px-6 py-20">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p data-reveal className="reveal font-mono text-yellow-400 tracking-[0.22em] text-xs">{t('methodology.pdcaSection.eyebrow')}</p>
              <h2 data-reveal style={{ transitionDelay: '100ms' }} className="reveal mt-4 text-4xl md:text-6xl font-extrabold">{t('methodology.pdcaSection.title')}</h2>
              <div data-reveal style={{ transitionDelay: '180ms' }} className="reveal mt-6 grid grid-cols-2 gap-4">
                {pdcaPhases.map((phase, index) => (
                  <button
                    key={phase.title}
                    type="button"
                    onClick={() => setActivePdca(index)}
                    className={`glass-panel rounded-lg p-4 text-left transition-colors ${
                      activePdca === index ? 'border-yellow-400/50 bg-yellow-400/10' : 'hover:bg-white/10'
                    }`}
                  >
                    <p className={`font-bold ${activePdca === index ? 'text-yellow-400' : 'text-white/70'}`}>{phase.title}</p>
                    <p className="text-xs text-gray-400">{phase.what}</p>
                  </button>
                ))}
              </div>
              <div data-reveal className="reveal glass-panel rounded-2xl p-6 mt-4">
                <p className="text-xs text-yellow-400 tracking-[0.2em]">{pdcaPhases[activePdca].title}</p>
                <p className="mt-1 text-sm text-gray-200">
                  <span className="font-semibold text-white">{t('methodology.labels.what')}</span> {pdcaPhases[activePdca].what}
                </p>
                <p className="mt-1 text-sm text-gray-300">
                  <span className="font-semibold text-white">{t('methodology.labels.how')}</span> {pdcaPhases[activePdca].how}
                </p>
              </div>
            </div>

            <div data-reveal className="reveal flex items-center justify-center">
              <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-white/20 spin-slow">
                <div className="absolute inset-6 rounded-full border-2 border-dashed border-white/20" />
                <span className={`absolute top-8 left-1/2 -translate-x-1/2 font-bold ${activePdca === 0 ? 'text-yellow-400' : 'text-white/60'}`}>PLAN</span>
                <span className={`absolute right-8 top-1/2 -translate-y-1/2 font-bold ${activePdca === 1 ? 'text-yellow-400' : 'text-white/60'}`}>DO</span>
                <span className={`absolute bottom-8 left-1/2 -translate-x-1/2 font-bold ${activePdca === 2 ? 'text-yellow-400' : 'text-white/60'}`}>CHECK</span>
                <span className={`absolute left-8 top-1/2 -translate-y-1/2 font-bold ${activePdca === 3 ? 'text-yellow-400' : 'text-white/60'}`}>ACT</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-bgCard border border-yellow-400/40 shadow-[0_0_18px_rgba(251,191,36,0.35)]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 py-24 px-6 text-center">
          <h3 data-reveal className="reveal text-3xl md:text-4xl font-extrabold">{t('methodology.footer.title')}</h3>
          <p data-reveal style={{ transitionDelay: '100ms' }} className="reveal mt-4 text-gray-400 max-w-xl mx-auto">
            {t('methodology.footer.description')}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Metodologia
