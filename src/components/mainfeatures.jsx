import { useMemo } from 'react'
import { BarChart3, Cpu, GitBranch, Layers, RefreshCw, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MotionDiv = motion.div
const MotionH2 = motion.h2
const MotionP = motion.p

const featureDefinitions = [
  { id: 1, key: 'prioritization', icon: Layers, color: 'purple' },
  { id: 2, key: 'pdca', icon: RefreshCw, color: 'cyan' },
  { id: 3, key: 'copilot', icon: Cpu, color: 'pink' },
  { id: 4, key: 'analytics', icon: BarChart3, color: 'cyan' },
  { id: 5, key: 'gitops', icon: GitBranch, color: 'purple' },
  { id: 6, key: 'security', icon: ShieldCheck, color: 'pink' },
]

const colorMap = {
  purple: {
    icon: 'text-violet-400',
    iconGlow: 'group-hover:shadow-[0_0_20px_rgba(167,139,250,0.45)]',
    shimmer: 'via-violet-500/70',
    glow: 'from-violet-500/10',
    tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  },
  cyan: {
    icon: 'text-cyan-400',
    iconGlow: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.45)]',
    shimmer: 'via-cyan-400/70',
    glow: 'from-cyan-400/10',
    tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/20',
  },
  pink: {
    icon: 'text-pink-400',
    iconGlow: 'group-hover:shadow-[0_0_20px_rgba(244,114,182,0.45)]',
    shimmer: 'via-pink-400/70',
    glow: 'from-pink-400/10',
    tag: 'bg-pink-500/10 text-pink-300 border-pink-400/20',
  },
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 18 } },
}

const MainFeatures = () => {
  const { t } = useTranslation()

  const features = useMemo(
    () =>
      featureDefinitions.map((feature) => ({
        ...feature,
        title: t(`mainFeatures.items.${feature.key}.title`),
        description: t(`mainFeatures.items.${feature.key}.description`),
        tag: t(`mainFeatures.items.${feature.key}.tag`),
      })),
    [t],
  )

  return (
    <section className="relative py-32 overflow-hidden isolate" id="funcionalidades">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-pink-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_30%,transparent_80%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_theme(colors.cyan.400)]" />
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gray-400">
              {t('mainFeatures.eyebrow')}
            </span>
          </MotionDiv>

          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-5 scroll-mt-24 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            {t('mainFeatures.titlePrefix')}{' '}
            <span className="bg-gradient-to-r from-white via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              {t('mainFeatures.titleAccent')}
            </span>
          </MotionH2>

          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400"
          >
            {t('mainFeatures.description')}
          </MotionP>
        </div>

        <MotionDiv
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const palette = colorMap[feature.color]
            const Icon = feature.icon

            return (
              <MotionDiv key={feature.id} variants={item} className="group relative h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1e] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.11] hover:shadow-2xl hover:shadow-black/60">
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${palette.shimmer} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className={`absolute -left-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br ${palette.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />

                  <div className={`relative mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] transition-all duration-300 group-hover:scale-105 ${palette.iconGlow}`}>
                    <Icon className={`h-5 w-5 ${palette.icon}`} strokeWidth={1.75} />
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col">
                    <h3 className="mb-2.5 text-base font-bold leading-snug tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-gray-400 transition-colors duration-200 group-hover:text-gray-300">
                      {feature.description}
                    </p>
                    <span className={`mt-5 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 ${palette.tag}`}>
                      {feature.tag}
                    </span>
                  </div>
                </div>
              </MotionDiv>
            )
          })}
        </MotionDiv>
      </div>
    </section>
  )
}

export default MainFeatures
