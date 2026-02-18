import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Header from './header.jsx'
import Footer from './footer.jsx'

/* ───────────────────── animation variants ───────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}

const MotionSection = motion.section

/* ─── reusable section wrapper that triggers animation on scroll ─── */
const Section = ({ children, className = '', id }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <MotionSection
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </MotionSection>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SECTION 1 — HERO & INTRO  (reference: hero_&_intro)
   ══════════════════════════════════════════════════════════════════ */
const HeroSection = () => (
  <Section className="relative min-h-screen w-full pt-24 pb-20" id="hero-features">
    {/* Ambient */}
    <div className="absolute inset-0 -z-10 pointer-events-none ambient-glow" />
    <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
    <div className="absolute bottom-1/4 right-1/4 -z-10 w-96 h-96 rounded-full bg-secondary/5 blur-[120px]" />

    {/* Hero content */}
    <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
      {/* Badge */}
      <motion.div variants={fadeUp} custom={0} className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-xs font-medium tracking-wider text-primary">SYSTEM ONLINE</span>
      </motion.div>

      {/* Headline */}
      <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-[5.5rem] max-w-5xl">
        Gestão <span className="text-gradient-accent">Inteligente</span> <br /> de Tarefas
      </motion.h1>

      {/* Sub */}
      <motion.p variants={fadeUp} custom={2} className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-textMuted md:text-xl">
        Orquestração automática. Do caos à execução em milissegundos. <br className="hidden md:block" />
        Um sistema operacional vivo para seu fluxo de trabalho.
      </motion.p>

      {/* CTA */}
      <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-transparent px-8 py-3 text-white transition-all hover:scale-105 active:scale-95">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
          <span className="font-display text-lg font-bold tracking-wide relative z-10 flex items-center gap-2">
            Iniciar Sistema
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </span>
        </button>
        <button className="flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-medium text-textMuted transition-colors hover:text-white">
          <span className="material-symbols-outlined text-lg">play_circle</span>
          Ver Demo
        </button>
      </motion.div>

      {/* Dashboard 3-D */}
      <motion.div variants={fadeUp} custom={4} className="relative mt-20 w-full max-w-5xl group">
        <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/20 to-secondary/10 blur-2xl opacity-40 transition-opacity group-hover:opacity-60" />

        <div className="hero-dashboard animate-hero-float rounded-xl border border-white/10 bg-surfaceDark/80 backdrop-blur-xl overflow-hidden relative">
          {/* Glass shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-20" />
          {/* Image */}
          <div className="relative z-10 p-1 max-w-[80%] mx-auto">
            <img
              alt="Futuristic dashboard interface displaying glowing data analytics, burndown charts in neon cyan and purple on a dark background"
              className="w-full rounded-lg opacity-90 shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXEMxhOKM_lAM16uQjmb5w0nrvIPL64GaYlaDmUnUzSKnHPrSbXSKTE4yQAKPK8wTlSHpdBZ6yYSokSgmdKRdclNkAdetrAZVHzAa6E82xd5pEbLNP3qHw1kedbKoM6R5k9UmycYN52k7Uk5usKJRFsB84CbtWpnlJn-DNFBhVcAiSfHqkZfLuNfSnllPzWjDBl9IAEHJMTiEcCg5NuTH6LO6gguhUAnGA4t6mCIdVEhC_E8DS2e4MqDngJHECcLrDiOG9ZfK5zQ"
            />
            <div className="absolute top-[20%] left-[15%] w-[200px] h-[100px] bg-primary/10 blur-xl rounded-full mix-blend-screen animate-pulse-glow" />
            <div className="absolute bottom-[30%] right-[10%] w-[150px] h-[80px] bg-secondary/10 blur-xl rounded-full mix-blend-screen animate-pulse-glow" />
          </div>
          {/* Chrome dots */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>

        {/* Photon beam */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[150px] w-[2px] h-[150px] overflow-hidden z-0">
          <div className="w-full h-full bg-gradient-to-b from-primary to-transparent opacity-60 shadow-[0_0_15px_#0addf5] animate-beam-grow" />
        </div>
      </motion.div>
    </div>

    {/* Intro Grid */}
    <div className="relative z-10 mx-auto mt-32 max-w-7xl px-6 lg:px-8 pb-20">
      <motion.div variants={fadeIn} className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-primary mb-2">Capabilities</h2>
          <h3 className="font-display text-3xl font-bold text-white">MODULARIDADE ABSOLUTA</h3>
        </div>
        <div className="hidden md:block text-right">
          <p className="font-mono text-xs text-textMuted">SYSTEM_CHECK: <span className="text-green-400">OK</span></p>
          <p className="font-mono text-xs text-textMuted">LATENCY: <span className="text-primary">12ms</span></p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: 'inbox',
            title: 'Backlog Infinito',
            desc: 'Capture tudo sem fricção. Um repositório centralizado que processa inputs brutos em tarefas acionáveis.',
            module: 'Stuff',
            color: 'primary',
          },
          {
            icon: 'view_kanban',
            title: 'Fluxo Cinético',
            desc: 'Visualização Kanban que respira. Cards se movem como dados vivos, não post-its estáticos.',
            module: 'Kanban',
            color: 'secondary',
          },
          {
            icon: 'insights',
            title: 'Analytics Preditivo',
            desc: 'Matriz GUT automatizada. O sistema decide o que é urgente antes que se torne um incêndio.',
            module: 'Intel',
            color: 'accent',
          },
        ].map((card, idx) => (
          <motion.div key={card.module} variants={fadeUp} custom={idx} className="glass-card group rounded-2xl p-8 relative overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-${card.color}/5 blur-2xl transition-all group-hover:bg-${card.color}/10`} />
            <div className={`mb-6 inline-flex w-12 h-12 items-center justify-center rounded-lg bg-surfaceDark border border-white/10 text-${card.color} group-hover:border-${card.color}/50 group-hover:text-white transition-colors`}>
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <h4 className="mb-2 font-display text-xl font-bold text-white">{card.title}</h4>
            <p className="font-body text-sm leading-relaxed text-textMuted">{card.desc}</p>
            <div className="mt-6 flex items-center gap-2 border-t border-white/5 pt-4">
              <span className={`font-mono text-[10px] uppercase tracking-wider text-textMuted group-hover:text-${card.color} transition-colors`}>Module: {card.module}</span>
              <span className="material-symbols-outlined text-sm text-textMuted group-hover:translate-x-1 transition-transform group-hover:text-white">arrow_forward</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
)

/* ══════════════════════════════════════════════════════════════════
   SECTION 2 — CORE MODULES: STUFF & KANBAN
   ══════════════════════════════════════════════════════════════════ */
const CoreModulesSection = () => (
  <Section className="relative w-full px-6 lg:px-20 flex flex-col gap-24 py-8" id="core-modules">
    {/* Ambient bg */}
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-neonPurple/5 rounded-full blur-[150px]" />
    </div>

    {/* ── MODULE 01: STUFF ── */}
    <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      {/* Narrative */}
      <motion.div variants={fadeUp} custom={0} className="lg:col-span-4 flex flex-col relative">
        {/* Beam */}
        <div className="absolute left-[-24px] lg:left-[-40px] top-2 bottom-[-200px] w-[2px] bg-white/5 hidden md:block">
          <div className="absolute top-0 left-0 w-full h-[60%] connector-beam rounded-full" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-primary/30 text-primary font-mono text-xs font-bold bg-primary/10 shadow-[0_0_20px_-5px_rgba(10,221,245,0.4)]">01</span>
          <h2 className="font-mono text-sm tracking-[0.2em] text-primary uppercase">Módulo Stuff</h2>
        </div>

        <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">
          O Banco <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neonPurple">Central</span>
        </h3>

        <p className="text-textMuted text-lg font-body leading-relaxed max-w-md">
          Capture tudo. Processe depois. O "Stuff" é um poço gravitacional para pensamentos brutos, eliminando a carga cognitiva instantaneamente.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-textMuted">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            INPUT: 12 ITEMS
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-xs font-mono text-primary">
            <span className="material-symbols-outlined text-sm animate-pulse">bolt</span>
            STATUS: ACTIVE
          </div>
        </div>
      </motion.div>

      {/* Visual: Stuff Stack */}
      <motion.div variants={fadeUp} custom={2} className="lg:col-span-8 flex justify-center lg:justify-end py-10" style={{ perspective: '1000px' }}>
        <div className="relative w-[320px] h-[400px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[60px] rounded-full" />
          {/* Card 3 bottom */}
          <div className="absolute top-[40px] left-0 right-0 h-[180px] glass-panel rounded-2xl p-6 scale-90 translate-y-8 opacity-40 z-10 border-white/5" />
          {/* Card 2 middle */}
          <div className="absolute top-[20px] left-0 right-0 h-[180px] glass-panel rounded-2xl p-6 scale-95 translate-y-4 opacity-70 z-20 border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div className="h-2 w-20 bg-white/10 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <div className="h-4 w-3/4 bg-white/10 rounded-full mb-2" />
            <div className="h-4 w-1/2 bg-white/10 rounded-full" />
          </div>
          {/* Card 1 active */}
          <div className="absolute top-0 left-0 right-0 bg-[rgba(18,11,31,0.6)] backdrop-blur-xl border border-primary/50 rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 z-30 shadow-[0_0_20px_-5px_rgba(10,221,245,0.4)] group cursor-pointer float-slow">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-primary tracking-wider uppercase">Incoming Data</span>
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#0addf5]" />
            </div>
            <h4 className="text-white font-display font-bold text-xl mb-2">Fix Vercel Deployment</h4>
            <p className="text-textMuted text-sm font-body leading-relaxed mb-4">Build failed due to missing environmental variables in the production branch.</p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-textMuted uppercase">DevOps</span>
              <span className="px-2 py-1 rounded bg-neonPink/10 border border-neonPink/30 text-[10px] font-mono text-neonPink uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">warning</span> Critical
              </span>
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary rounded-tl-xl opacity-80" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary rounded-br-xl opacity-80" />
          </div>
          <div className="absolute -bottom-20 left-1/2 w-px h-20 bg-gradient-to-b from-primary/50 to-transparent hidden lg:block" />
        </div>
      </motion.div>
    </div>

    {/* ── MODULE 02: KANBAN ── */}
    <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
      {/* Narrative */}
      <motion.div variants={fadeUp} custom={0} className="lg:col-span-4 flex flex-col relative pt-10">
        <div className="absolute left-[-24px] lg:left-[-40px] top-[-100px] bottom-0 w-[2px] bg-white/5 hidden md:block">
          <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-primary/0 via-neonPurple/50 to-transparent" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-neonPurple/30 text-neonPurple font-mono text-xs font-bold bg-neonPurple/10 shadow-[0_0_25px_-5px_rgba(139,92,246,0.4)]">02</span>
          <h2 className="font-mono text-sm tracking-[0.2em] text-neonPurple uppercase">Módulo Kanban</h2>
        </div>

        <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">
          Fluxo <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonPink">Visual</span>
        </h3>

        <p className="text-textMuted text-lg font-body leading-relaxed max-w-md">
          Orquestração algorítmica. Visualize o movimento de energia do caos para a conclusão em colunas de vidro cristalino.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="glass-panel p-3 rounded-xl border border-white/5">
            <div className="text-[10px] font-mono text-textMuted uppercase mb-1">Velocity</div>
            <div className="text-xl font-bold text-white">24 pts</div>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-white/5">
            <div className="text-[10px] font-mono text-textMuted uppercase mb-1">Cycle Time</div>
            <div className="text-xl font-bold text-white">1.2 days</div>
          </div>
        </div>
      </motion.div>

      {/* Visual: Kanban Board */}
      <motion.div variants={fadeUp} custom={2} className="lg:col-span-8 w-full overflow-x-auto pb-4">
        <div className="min-w-[800px] grid grid-cols-3 gap-6">
          {/* TO DO */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs text-textMuted uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-textMuted" /> To Do
              </span>
              <span className="text-[10px] font-mono text-white/30">3</span>
            </div>
            <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 p-3 min-h-[400px]">
              {/* Ghost card */}
              <div className="glass-panel p-4 rounded-xl mb-3 relative group cursor-pointer border border-primary/40 shadow-[0_0_15px_-5px_rgba(10,221,245,0.2)] animate-pulse">
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
                <div className="pl-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">#SYS-102</span>
                  </div>
                  <p className="text-sm font-medium text-white mb-2">Refactor Auth Middleware</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px]">MK</div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3">
                  <span className="material-symbols-outlined text-primary text-xl drop-shadow-[0_0_5px_rgba(10,221,245,0.8)]">south</span>
                </div>
              </div>
              {/* Card 2 */}
              <div className="glass-panel p-4 rounded-xl mb-3 relative group hover:bg-white/5 transition-colors cursor-pointer">
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-textMuted rounded-r-full" />
                <div className="pl-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-textMuted bg-white/5 px-1.5 py-0.5 rounded">#UI-204</span>
                  </div>
                  <p className="text-sm font-medium text-textMuted line-through opacity-50">Review Design System</p>
                  <p className="text-sm font-medium text-white mb-2">Update Icon Set</p>
                </div>
              </div>
            </div>
          </div>

          {/* DOING */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs text-primary uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Doing
              </span>
              <span className="text-[10px] font-mono text-white/30">1</span>
            </div>
            <div className="flex-1 rounded-2xl bg-primary/[0.03] border border-primary/10 p-3 min-h-[400px]">
              <div className="glass-panel p-4 rounded-xl mb-3 relative group hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-l-primary shadow-[0_0_20px_-5px_rgba(10,221,245,0.4)]">
                <div className="pl-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">#API-88</span>
                    <span className="material-symbols-outlined text-sm text-primary animate-spin">progress_activity</span>
                  </div>
                  <p className="text-sm font-medium text-white mb-3">Optimize Database Queries</p>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-textMuted font-mono">
                    <span>65% Complete</span>
                    <span>2h left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DONE */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs text-neonPurple uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neonPurple" /> Done
              </span>
              <span className="text-[10px] font-mono text-white/30">12</span>
            </div>
            <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 p-3 min-h-[400px]">
              {[
                { id: '#MKT-12', title: 'Q4 Planning Deck' },
                { id: '#BUG-02', title: 'Fix Header z-index' },
              ].map((t) => (
                <div key={t.id} className="glass-panel p-4 rounded-xl mb-3 relative opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-neonPurple rounded-r-full" />
                  <div className="pl-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-neonPurple bg-neonPurple/10 px-1.5 py-0.5 rounded">{t.id}</span>
                      <span className="material-symbols-outlined text-sm text-neonPurple">check_circle</span>
                    </div>
                    <p className="text-sm font-medium text-white/80 mb-2">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </Section>
)

/* ══════════════════════════════════════════════════════════════════
   SECTION 3 — PLANNING MODULES: CALENDAR & GANTT
   ══════════════════════════════════════════════════════════════════ */
const calendarDays = [
  { day: '29', muted: true }, { day: '30', muted: true },
  { day: '01', dots: ['neonCyan'] }, { day: '02' },
  { day: '03', dots: ['neonPurple', 'neonPink'] }, { day: '04' }, { day: '05' },
  { day: '06' }, { day: '07', dots: ['neonCyan'] }, { day: '08' },
  { day: '09', active: true, dots: ['neonCyan', 'neonPurple'] },
  { day: '10' }, { day: '11', dots: ['neonPink'] }, { day: '12' },
]

const dotColor = (c) => {
  const map = { neonCyan: '#67e8f9', neonPurple: '#8b5cf6', neonPink: '#ff4fd8' }
  return map[c] || '#67e8f9'
}

const PlanningModulesSection = () => (
  <Section className="relative z-10 flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 gap-32" id="planning-modules">
    {/* Central beam */}
    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neonCyan/20 to-transparent hidden lg:block" />

    {/* ── CALENDAR ── */}
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-neonCyan rounded-full shadow-[0_0_15px_#67e8f9] hidden lg:block z-20" />

      {/* Text */}
      <motion.div variants={fadeUp} custom={0} className="lg:col-span-5 flex flex-col gap-6 lg:pr-12 text-left lg:text-right order-2 lg:order-1">
        <div className="flex items-center gap-3 lg:justify-end text-neonCyan font-mono text-xs tracking-widest uppercase">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          Temporal Sync
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
          Synchronize <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">Reality</span>
        </h2>
        <p className="text-textMuted font-body leading-relaxed text-lg max-w-md ml-auto">
          Onde o &apos;O quê&apos; encontra o &apos;Quando&apos;. Uma visualização granular de compromissos com atualizações em tempo real.
        </p>
        <div className="flex gap-4 lg:justify-end mt-4">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-mono font-bold text-white">124</span>
            <span className="text-xs text-textMuted font-mono uppercase">Active Events</span>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-2xl font-mono font-bold text-neonPink">98%</span>
            <span className="text-xs text-textMuted font-mono uppercase">On Schedule</span>
          </div>
        </div>
      </motion.div>

      {/* Visual: Calendar */}
      <motion.div variants={fadeUp} custom={2} className="lg:col-span-7 relative order-1 lg:order-2">
        <div className="glass-panel rounded-3xl p-6 md:p-8 transition-transform duration-700 hover:scale-[1.02]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h3 className="text-white font-display text-2xl font-bold">2026</h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/5">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
              <div key={d} className="bg-surfaceDark p-4 text-center text-xs font-mono text-textMuted">{d}</div>
            ))}
            {calendarDays.map((d, i) => (
              <div
                key={i}
                className={`h-24 p-3 relative group transition-colors ${
                  d.active
                    ? 'bg-white/10 cursor-pointer border border-neonCyan/30 shadow-[inset_0_0_20px_rgba(103,232,249,0.1)]'
                    : 'bg-surfaceDark/80 hover:bg-white/5'
                }`}
              >
                <span className={`font-mono text-sm ${d.muted ? 'text-textMuted/40' : d.active ? 'text-white font-bold' : 'text-textMuted'}`}>{d.day}</span>
                {d.dots && (
                  <div className="mt-2 flex gap-1">
                    {d.dots.map((c, j) => (
                      <div
                        key={j}
                        className={`rounded-full ${d.active ? 'w-2 h-2 animate-pulse' : 'w-1.5 h-1.5'}`}
                        style={{ backgroundColor: dotColor(c), boxShadow: `0 0 ${d.active ? 10 : 8}px ${dotColor(c)}` }}
                      />
                    ))}
                  </div>
                )}
                {/* Popover on active day */}
                {d.active && (
                  <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 -translate-y-full w-64 glass-popover rounded-xl p-4 z-50 hidden lg:block">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-neonCyan rounded-full" />
                        <span className="text-white font-display text-sm font-bold">Product Launch</span>
                      </div>
                      <span className="text-xs font-mono text-neonCyan bg-neonCyan/10 px-2 py-0.5 rounded border border-neonCyan/20">NOW</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-textMuted text-xs font-mono">
                        <span className="material-symbols-outlined text-[14px]">schedule</span> 14:00 - 15:30
                      </div>
                      <div className="flex items-center gap-2 text-textMuted text-xs font-mono">
                        <span className="material-symbols-outlined text-[14px]">group</span> Design Team
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border border-surfaceDark overflow-hidden"><div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600" /></div>
                        <div className="w-6 h-6 rounded-full border border-surfaceDark overflow-hidden"><div className="w-full h-full bg-gradient-to-br from-pink-500 to-rose-600" /></div>
                      </div>
                      <span className="text-[10px] text-neonCyan cursor-pointer hover:underline">View Details</span>
                    </div>
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e1e2d] border-b border-r border-neonCyan/30 rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-neonCyan/10 rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neonPurple/10 rounded-full blur-2xl -z-10" />
      </motion.div>
    </div>

    {/* ── GANTT ── */}
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-neonPurple rounded-full shadow-[0_0_15px_#8b5cf6] hidden lg:block z-20" />

      {/* Visual: Gantt */}
      <motion.div variants={fadeUp} custom={0} className="lg:col-span-7 relative order-2 lg:order-1">
        <div className="glass-panel rounded-3xl p-6 md:p-8 overflow-hidden relative min-h-[400px]">
          {/* Background grid */}
          <div className="absolute inset-0 flex justify-between px-8 pt-16 pb-4 pointer-events-none opacity-20">
            {[...Array(5)].map((_, i) => <div key={i} className="w-px h-full border-l border-dashed border-textMuted" />)}
          </div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-neonPurple">candlestick_chart</span>
              <h3 className="text-white font-display text-lg font-bold">Project Alpha Timeline</h3>
            </div>
            <div className="flex gap-4 text-xs font-mono text-textMuted">
              {['WK 41', 'WK 42', 'WK 43', 'WK 44'].map((w) => <span key={w}>{w}</span>)}
            </div>
          </div>
          {/* Tracks */}
          <div className="space-y-6 relative z-10 pt-4">
            {/* Strategy */}
            <div className="relative h-10 flex items-center">
              <div className="absolute left-0 w-24 text-xs font-mono text-textMuted font-medium">Strategy</div>
              <div className="ml-24 w-full h-full relative">
                <div className="absolute left-[0%] w-[25%] top-1/2 -translate-y-1/2 h-7 rounded-full bg-gradient-to-r from-neonPurple/80 to-indigo-600/80 border border-white/10 gantt-bar cursor-pointer flex items-center px-3">
                  <span className="text-[10px] font-bold text-white truncate">Initial Scope</span>
                </div>
                <svg className="absolute top-1/2 left-[23%] w-[15%] h-[60px] pointer-events-none overflow-visible z-0">
                  <path className="opacity-40 connection-line" d="M 0 0 C 30 0, 30 50, 60 50" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                </svg>
              </div>
            </div>
            {/* Design */}
            <div className="relative h-10 flex items-center">
              <div className="absolute left-0 w-24 text-xs font-mono text-textMuted font-medium">Design</div>
              <div className="ml-24 w-full h-full relative">
                <div className="absolute left-[25%] w-[35%] top-1/2 -translate-y-1/2 h-7 rounded-full bg-gradient-to-r from-neonCyan/80 to-blue-500/80 border border-white/10 gantt-bar cursor-pointer flex items-center px-3 shadow-[0_0_15px_rgba(103,232,249,0.15)]">
                  <span className="text-[10px] font-bold text-bgDark truncate">UI &amp; Prototyping</span>
                </div>
                <svg className="absolute top-1/2 left-[58%] w-[15%] h-[60px] pointer-events-none overflow-visible z-0">
                  <path className="opacity-40 connection-line" d="M 0 0 C 30 0, 30 50, 60 50" fill="none" stroke="#67e8f9" strokeWidth="2" />
                </svg>
              </div>
            </div>
            {/* Dev */}
            <div className="relative h-10 flex items-center">
              <div className="absolute left-0 w-24 text-xs font-mono text-textMuted font-medium">Dev</div>
              <div className="ml-24 w-full h-full relative">
                <div className="absolute left-[60%] w-[25%] top-1/2 -translate-y-1/2 h-7 rounded-full bg-gradient-to-r from-neonPink/80 to-purple-600/80 border border-white/10 gantt-bar cursor-pointer flex items-center px-3">
                  <span className="text-[10px] font-bold text-white truncate">Frontend Impl.</span>
                </div>
              </div>
            </div>
            {/* QA */}
            <div className="relative h-10 flex items-center opacity-60">
              <div className="absolute left-0 w-24 text-xs font-mono text-textMuted font-medium">QA</div>
              <div className="ml-24 w-full h-full relative">
                <div className="absolute left-[85%] w-[12%] top-1/2 -translate-y-1/2 h-7 rounded-full border border-dashed border-textMuted bg-white/5 flex items-center px-3">
                  <span className="text-[10px] font-bold text-textMuted truncate">Review</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-surfaceDark/90 to-transparent pointer-events-none z-20" />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div variants={fadeUp} custom={2} className="lg:col-span-5 flex flex-col gap-6 lg:pl-12 text-left order-1 lg:order-2">
        <div className="flex items-center gap-3 text-neonPurple font-mono text-xs tracking-widest uppercase">
          <span className="material-symbols-outlined text-sm">timeline</span>
          Orquestração Avançada
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
          Visualize o <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonPink">Efeito Dominó</span>
        </h2>
        <p className="text-textMuted font-body leading-relaxed text-lg max-w-md">
          Gerencie dependências críticas com precisão cirúrgica. Veja como um único atraso repercute em toda a sua linha do tempo em tempo real.
        </p>
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-4 group cursor-pointer">
            <div className="mt-1 w-8 h-8 rounded-lg bg-neonPurple/10 border border-neonPurple/30 flex items-center justify-center text-neonPurple group-hover:bg-neonPurple group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">link</span>
            </div>
            <div>
              <h4 className="text-white font-display font-bold text-lg group-hover:text-neonPurple transition-colors">Mapeamento de Dependências</h4>
              <p className="text-textMuted text-sm">Linhas do tempo que se ajustam automaticamente após resolução de bloqueios.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group cursor-pointer">
            <div className="mt-1 w-8 h-8 rounded-lg bg-neonPink/10 border border-neonPink/30 flex items-center justify-center text-neonPink group-hover:bg-neonPink group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">warning</span>
            </div>
            <div>
              <h4 className="text-white font-display font-bold text-lg group-hover:text-neonPink transition-colors">Análise de Caminho Crítico</h4>
              <p className="text-textMuted text-sm">Identifique gargalos antes que virem bloqueios.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </Section>
)

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════ */
const DetailedFeatures = () => {
  return (
    <div className="min-h-screen bg-bgDark font-sans selection:bg-hotPink selection:text-white overflow-x-hidden">
      <Header />

      <main className="relative w-full">
        <HeroSection />
        <CoreModulesSection />
        <PlanningModulesSection />
      </main>

      <Footer />
    </div>
  )
}

export default DetailedFeatures
