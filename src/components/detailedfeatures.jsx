import { motion, useInView } from 'framer-motion'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './header.jsx'
import Footer from './footer.jsx'
import dashboardPreview from '../assets/dashboard-preview.svg'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' } }),
}
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }
const MotionSection = motion.section
const calendarDays = [
  { day: '29', muted: true }, { day: '30', muted: true }, { day: '01', dots: ['neonCyan'] }, { day: '02' }, { day: '03', dots: ['neonPurple', 'neonPink'] }, { day: '04' }, { day: '05' },
  { day: '06' }, { day: '07', dots: ['neonCyan'] }, { day: '08' }, { day: '09', active: true, dots: ['neonCyan', 'neonPurple'] }, { day: '10' }, { day: '11', dots: ['neonPink'] }, { day: '12' },
]
const dotColor = (color) => ({ neonCyan: '#67e8f9', neonPurple: '#8b5cf6', neonPink: '#ff4fd8' }[color] || '#67e8f9')

const Section = ({ children, className = '', id }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return <MotionSection ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>{children}</MotionSection>
}

const DetailedFeatures = () => {
  const { t } = useTranslation()
  const hero = t('detailedFeatures.hero', { returnObjects: true })
  const stuff = t('detailedFeatures.stuff', { returnObjects: true })
  const kanban = t('detailedFeatures.kanban', { returnObjects: true })
  const calendar = t('detailedFeatures.calendar', { returnObjects: true })
  const gantt = t('detailedFeatures.gantt', { returnObjects: true })
  const introCards = useMemo(() => t('detailedFeatures.introCards', { returnObjects: true }), [t])

  return (
    <div className="min-h-screen bg-bgDark font-sans selection:bg-hotPink selection:text-white overflow-x-hidden">
      <Header />
      <main className="relative w-full">
        <Section className="relative min-h-screen w-full pt-24 pb-20" id="hero-features">
          <div className="absolute inset-0 -z-10 pointer-events-none ambient-glow" />
          <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 -z-10 w-96 h-96 rounded-full bg-secondary/5 blur-[120px]" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
            <motion.div variants={fadeUp} custom={0} className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
              <span className="font-mono text-xs font-medium tracking-wider text-primary">{hero.status}</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-[5.5rem] max-w-5xl">
              {hero.titleLine1} <span className="text-gradient-accent">{hero.titleAccent}</span> <br /> {hero.titleLine2}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-textMuted md:text-xl">
              {hero.descriptionLine1} <br className="hidden md:block" /> {hero.descriptionLine2}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-transparent px-8 py-3 text-white transition-all hover:scale-105 active:scale-95">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
                <span className="font-display text-lg font-bold tracking-wide relative z-10 flex items-center gap-2">{hero.primaryAction}<span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span></span>
              </button>
              <button className="flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm font-medium text-textMuted transition-colors hover:text-white"><span className="material-symbols-outlined text-lg">play_circle</span>{hero.secondaryAction}</button>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="relative mt-20 w-full max-w-5xl group">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/20 to-secondary/10 blur-2xl opacity-40 transition-opacity group-hover:opacity-60" />
              <div className="hero-dashboard animate-hero-float rounded-xl border border-white/10 bg-surfaceDark/80 backdrop-blur-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-20" />
                <div className="relative z-10 p-1 max-w-[80%] mx-auto">
                  <img alt={hero.imageAlt} className="w-full rounded-lg opacity-90 shadow-2xl" src={dashboardPreview} />
                  <div className="absolute top-[20%] left-[15%] w-[200px] h-[100px] bg-primary/10 blur-xl rounded-full mix-blend-screen animate-pulse-glow" />
                  <div className="absolute bottom-[30%] right-[10%] w-[150px] h-[80px] bg-secondary/10 blur-xl rounded-full mix-blend-screen animate-pulse-glow" />
                </div>
                <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 z-20"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/50" /></div>
              </div>
            </motion.div>
          </div>
          <div className="relative z-10 mx-auto mt-32 max-w-7xl px-6 lg:px-8 pb-20">
            <motion.div variants={fadeIn} className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
              <div><h2 className="font-mono text-sm font-bold uppercase tracking-widest text-primary mb-2">{hero.capabilities}</h2><h3 className="font-display text-3xl font-bold text-white">{hero.introTitle}</h3></div>
              <div className="hidden md:block text-right"><p className="font-mono text-xs text-textMuted">{hero.systemCheck} <span className="text-green-400">OK</span></p><p className="font-mono text-xs text-textMuted">{hero.latency} <span className="text-primary">12ms</span></p></div>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {introCards.map((card, index) => (
                <motion.div key={card.module} variants={fadeUp} custom={index} className="glass-card group rounded-2xl p-8 relative overflow-hidden">
                  <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-${card.color}/5 blur-2xl transition-all group-hover:bg-${card.color}/10`} />
                  <div className={`mb-6 inline-flex w-12 h-12 items-center justify-center rounded-lg bg-surfaceDark border border-white/10 text-${card.color} group-hover:border-${card.color}/50 group-hover:text-white transition-colors`}><span className="material-symbols-outlined">{card.icon}</span></div>
                  <h4 className="mb-2 font-display text-xl font-bold text-white">{card.title}</h4>
                  <p className="font-body text-sm leading-relaxed text-textMuted">{card.desc}</p>
                  <div className="mt-6 flex items-center gap-2 border-t border-white/5 pt-4"><span className={`font-mono text-[10px] uppercase tracking-wider text-textMuted group-hover:text-${card.color} transition-colors`}>Module: {card.module}</span><span className="material-symbols-outlined text-sm text-textMuted group-hover:translate-x-1 transition-transform group-hover:text-white">arrow_forward</span></div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="relative w-full px-6 lg:px-20 flex flex-col gap-24 py-8" id="core-modules">
          <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none"><div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" /><div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-neonPurple/5 rounded-full blur-[150px]" /></div>
          <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div variants={fadeUp} custom={0} className="lg:col-span-4 flex flex-col relative">
              <div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center w-8 h-8 rounded-full border border-primary/30 text-primary font-mono text-xs font-bold bg-primary/10">01</span><h2 className="font-mono text-sm tracking-[0.2em] text-primary uppercase">{stuff.label}</h2></div>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">{stuff.titleLine1}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neonPurple">{stuff.titleAccent}</span></h3>
              <p className="text-textMuted text-lg font-body leading-relaxed max-w-md">{stuff.description}</p>
              <div className="mt-8 flex items-center gap-4"><div className="flex items-center gap-2 text-xs font-mono text-textMuted"><span className="material-symbols-outlined text-sm">inventory_2</span>{stuff.input}</div><div className="h-4 w-px bg-white/10" /><div className="flex items-center gap-2 text-xs font-mono text-primary"><span className="material-symbols-outlined text-sm animate-pulse">bolt</span>{stuff.status}</div></div>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="lg:col-span-8 flex justify-center lg:justify-end py-10" style={{ perspective: '1000px' }}>
              <div className="relative w-[320px] h-[400px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[60px] rounded-full" />
                <div className="absolute top-[40px] left-0 right-0 h-[180px] glass-panel rounded-2xl p-6 scale-90 translate-y-8 opacity-40 z-10 border-white/5" />
                <div className="absolute top-[20px] left-0 right-0 h-[180px] glass-panel rounded-2xl p-6 scale-95 translate-y-4 opacity-70 z-20 border-white/10"><div className="flex justify-between items-start mb-3"><div className="h-2 w-20 bg-white/10 rounded-full" /><div className="w-2 h-2 rounded-full bg-white/20" /></div><div className="h-4 w-3/4 bg-white/10 rounded-full mb-2" /><div className="h-4 w-1/2 bg-white/10 rounded-full" /></div>
                <div className="absolute top-0 left-0 right-0 bg-[rgba(18,11,31,0.6)] backdrop-blur-xl border border-primary/50 rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 z-30 shadow-[0_0_20px_-5px_rgba(10,221,245,0.4)] group cursor-pointer float-slow">
                  <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3"><span className="text-[10px] font-mono text-primary tracking-wider uppercase">{stuff.incomingLabel}</span><span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#0addf5]" /></div>
                  <h4 className="text-white font-display font-bold text-xl mb-2">{stuff.cardTitle}</h4>
                  <p className="text-textMuted text-sm font-body leading-relaxed mb-4">{stuff.cardDescription}</p>
                  <div className="flex items-center gap-2 mt-auto"><span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-textMuted uppercase">{stuff.cardTag}</span><span className="px-2 py-1 rounded bg-neonPink/10 border border-neonPink/30 text-[10px] font-mono text-neonPink uppercase flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">warning</span>{stuff.cardSeverity}</span></div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <motion.div variants={fadeUp} custom={0} className="lg:col-span-4 flex flex-col relative pt-10">
              <div className="flex items-center gap-3 mb-4"><span className="flex items-center justify-center w-8 h-8 rounded-full border border-neonPurple/30 text-neonPurple font-mono text-xs font-bold bg-neonPurple/10">02</span><h2 className="font-mono text-sm tracking-[0.2em] text-neonPurple uppercase">{kanban.label}</h2></div>
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight font-display">{kanban.titleLine1}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonPink">{kanban.titleAccent}</span></h3>
              <p className="text-textMuted text-lg font-body leading-relaxed max-w-md">{kanban.description}</p>
              <div className="mt-8 grid grid-cols-2 gap-4"><div className="glass-panel p-3 rounded-xl border border-white/5"><div className="text-[10px] font-mono text-textMuted uppercase mb-1">{kanban.velocity}</div><div className="text-xl font-bold text-white">24 pts</div></div><div className="glass-panel p-3 rounded-xl border border-white/5"><div className="text-[10px] font-mono text-textMuted uppercase mb-1">{kanban.cycleTime}</div><div className="text-xl font-bold text-white">1.2 days</div></div></div>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="lg:col-span-8 w-full overflow-x-auto pb-4">
              <div className="min-w-[800px] grid grid-cols-3 gap-6">
                {[
                  { label: kanban.todo, tone: 'text-textMuted', count: '3' },
                  { label: kanban.doing, tone: 'text-primary', count: '1' },
                  { label: kanban.done, tone: 'text-neonPurple', count: '12' },
                ].map((column, index) => (
                  <div key={column.label} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2 px-1"><span className={`font-mono text-xs ${column.tone} uppercase tracking-widest flex items-center gap-2`}><span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-textMuted' : index === 1 ? 'bg-primary animate-pulse' : 'bg-neonPurple'}`} /> {column.label}</span><span className="text-[10px] font-mono text-white/30">{column.count}</span></div>
                    <div className={`flex-1 rounded-2xl p-3 min-h-[400px] ${index === 1 ? 'bg-primary/[0.03] border border-primary/10' : 'bg-white/[0.02] border border-white/5'}`}>
                      {index === 0 && (
                        <>
                          <div className="glass-panel p-4 rounded-xl mb-3 relative group cursor-pointer border border-primary/40 shadow-[0_0_15px_-5px_rgba(10,221,245,0.2)] animate-pulse"><div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" /><div className="pl-3"><span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{kanban.ghostCardId}</span><p className="text-sm font-medium text-white mt-2">{kanban.ghostCardTitle}</p></div></div>
                          <div className="glass-panel p-4 rounded-xl mb-3 relative"><div className="absolute left-0 top-3 bottom-3 w-1 bg-textMuted rounded-r-full" /><div className="pl-3"><span className="text-[10px] font-mono text-textMuted bg-white/5 px-1.5 py-0.5 rounded">{kanban.todoCardId}</span><p className="text-sm font-medium text-textMuted line-through opacity-50 mt-2">{kanban.todoCardTitlePast}</p><p className="text-sm font-medium text-white">{kanban.todoCardTitle}</p></div></div>
                        </>
                      )}
                      {index === 1 && (
                        <div className="glass-panel p-4 rounded-xl mb-3 relative border-l-2 border-l-primary shadow-[0_0_20px_-5px_rgba(10,221,245,0.4)]"><div className="pl-1"><div className="flex justify-between items-start mb-2"><span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{kanban.doingCardId}</span><span className="material-symbols-outlined text-sm text-primary animate-spin">progress_activity</span></div><p className="text-sm font-medium text-white mb-3">{kanban.doingCardTitle}</p><div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden"><div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }} /></div><div className="flex justify-between items-center text-[10px] text-textMuted font-mono"><span>{kanban.doingCardProgress}</span><span>{kanban.doingCardRemaining}</span></div></div></div>
                      )}
                      {index === 2 && kanban.doneCards.map((item) => (
                        <div key={item.id} className="glass-panel p-4 rounded-xl mb-3 relative opacity-60 hover:opacity-100 transition-opacity"><div className="absolute left-0 top-3 bottom-3 w-1 bg-neonPurple rounded-r-full" /><div className="pl-3"><div className="flex justify-between items-start mb-2"><span className="text-[10px] font-mono text-neonPurple bg-neonPurple/10 px-1.5 py-0.5 rounded">{item.id}</span><span className="material-symbols-outlined text-sm text-neonPurple">check_circle</span></div><p className="text-sm font-medium text-white/80 mb-2">{item.title}</p></div></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        <Section className="relative z-10 flex flex-col items-center w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 gap-32" id="planning-modules">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            <motion.div variants={fadeUp} custom={0} className="lg:col-span-5 flex flex-col gap-6 lg:pr-12 text-left lg:text-right order-2 lg:order-1">
              <div className="flex items-center gap-3 lg:justify-end text-neonCyan font-mono text-xs tracking-widest uppercase"><span className="material-symbols-outlined text-sm">calendar_month</span>{calendar.label}</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">{calendar.titleLine1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-neonPurple">{calendar.titleAccent}</span></h2>
              <p className="text-textMuted font-body leading-relaxed text-lg max-w-md ml-auto">{calendar.description}</p>
              <div className="flex gap-4 lg:justify-end mt-4"><div className="flex flex-col items-end"><span className="text-2xl font-mono font-bold text-white">124</span><span className="text-xs text-textMuted font-mono uppercase">{calendar.activeEvents}</span></div><div className="w-px h-12 bg-white/10" /><div className="flex flex-col items-end"><span className="text-2xl font-mono font-bold text-neonPink">98%</span><span className="text-xs text-textMuted font-mono uppercase">{calendar.onSchedule}</span></div></div>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="lg:col-span-7 relative order-1 lg:order-2">
              <div className="glass-panel rounded-3xl p-6 md:p-8 transition-transform duration-700 hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4"><h3 className="text-white font-display text-2xl font-bold">2026</h3><div className="flex gap-2"><button className="p-2 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"><span className="material-symbols-outlined">chevron_left</span></button><button className="p-2 rounded-full hover:bg-white/5 text-textMuted hover:text-white transition-colors"><span className="material-symbols-outlined">chevron_right</span></button></div></div>
                <div className="grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/5">
                  {calendar.weekdays.map((day) => <div key={day} className="bg-surfaceDark p-4 text-center text-xs font-mono text-textMuted">{day}</div>)}
                  {calendarDays.map((day, index) => (
                    <div key={`${day.day}-${index}`} className={`h-24 p-3 relative group transition-colors ${day.active ? 'bg-white/10 cursor-pointer border border-neonCyan/30 shadow-[inset_0_0_20px_rgba(103,232,249,0.1)]' : 'bg-surfaceDark/80 hover:bg-white/5'}`}>
                      <span className={`font-mono text-sm ${day.muted ? 'text-textMuted/40' : day.active ? 'text-white font-bold' : 'text-textMuted'}`}>{day.day}</span>
                      {day.dots && <div className="mt-2 flex gap-1">{day.dots.map((color, dotIndex) => <div key={`${color}-${dotIndex}`} className={`rounded-full ${day.active ? 'w-2 h-2 animate-pulse' : 'w-1.5 h-1.5'}`} style={{ backgroundColor: dotColor(color), boxShadow: `0 0 ${day.active ? 10 : 8}px ${dotColor(color)}` }} />)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            <motion.div variants={fadeUp} custom={0} className="lg:col-span-7 relative order-2 lg:order-1">
              <div className="glass-panel rounded-3xl p-6 md:p-8 overflow-hidden relative min-h-[400px]">
                <div className="flex justify-between items-center mb-6"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-neonPurple">candlestick_chart</span><h3 className="text-white font-display text-lg font-bold">{gantt.headerTitle}</h3></div><div className="flex gap-4 text-xs font-mono text-textMuted">{gantt.weeks.map((week) => <span key={week}>{week}</span>)}</div></div>
                <div className="space-y-6 relative z-10 pt-4">
                  {[
                    { label: gantt.tracks.strategy, title: gantt.tracks.strategyItem, style: 'left-[0%] w-[25%]', gradient: 'from-neonPurple/80 to-indigo-600/80', textClass: 'text-white' },
                    { label: gantt.tracks.design, title: gantt.tracks.designItem, style: 'left-[25%] w-[35%]', gradient: 'from-neonCyan/80 to-blue-500/80', textClass: 'text-bgDark' },
                    { label: gantt.tracks.dev, title: gantt.tracks.devItem, style: 'left-[60%] w-[25%]', gradient: 'from-neonPink/80 to-purple-600/80', textClass: 'text-white' },
                    { label: gantt.tracks.qa, title: gantt.tracks.qaItem, style: 'left-[85%] w-[12%]', muted: true },
                  ].map((track) => (
                    <div key={track.label} className={`relative h-10 flex items-center ${track.muted ? 'opacity-60' : ''}`}>
                      <div className="absolute left-0 w-24 text-xs font-mono text-textMuted font-medium">{track.label}</div>
                      <div className="ml-24 w-full h-full relative">
                        <div className={`absolute ${track.style} top-1/2 -translate-y-1/2 h-7 rounded-full ${track.muted ? 'border border-dashed border-textMuted bg-white/5' : `bg-gradient-to-r ${track.gradient} border border-white/10`} flex items-center px-3`}>
                          <span className={`text-[10px] font-bold truncate ${track.muted ? 'text-textMuted' : track.textClass}`}>{track.title}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={2} className="lg:col-span-5 flex flex-col gap-6 lg:pl-12 text-left order-1 lg:order-2">
              <div className="flex items-center gap-3 text-neonPurple font-mono text-xs tracking-widest uppercase"><span className="material-symbols-outlined text-sm">timeline</span>{gantt.label}</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">{gantt.titleLine1}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPurple to-neonPink">{gantt.titleAccent}</span></h2>
              <p className="text-textMuted font-body leading-relaxed text-lg max-w-md">{gantt.description}</p>
              <div className="mt-8 space-y-4">
                {[{ title: gantt.featureOneTitle, description: gantt.featureOneDescription, tone: 'neonPurple', icon: 'link' }, { title: gantt.featureTwoTitle, description: gantt.featureTwoDescription, tone: 'neonPink', icon: 'warning' }].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 group cursor-pointer">
                    <div className={`mt-1 w-8 h-8 rounded-lg bg-${item.tone}/10 border border-${item.tone}/30 flex items-center justify-center text-${item.tone} group-hover:bg-${item.tone} group-hover:text-white transition-all`}><span className="material-symbols-outlined text-sm">{item.icon}</span></div>
                    <div><h4 className={`text-white font-display font-bold text-lg group-hover:text-${item.tone} transition-colors`}>{item.title}</h4><p className="text-textMuted text-sm">{item.description}</p></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}

export default DetailedFeatures
