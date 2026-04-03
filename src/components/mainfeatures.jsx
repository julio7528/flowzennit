import { Layers, RefreshCw, Cpu, BarChart3, GitBranch, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionDiv = motion.div
const MotionH2 = motion.h2
const MotionP = motion.p

const features = [
  {
    id: 1,
    title: 'Priorização Algorítmica',
    description:
      'Não apenas liste tarefas. Nossa Matriz GUT digital calcula automaticamente a gravidade e urgência para sugerir o que deve ser feito agora.',
    icon: Layers,
    color: 'purple',
    tag: 'Matriz GUT',
  },
  {
    id: 2,
    title: 'Ciclo PDCA Contínuo',
    description:
      'Transforme a melhoria contínua em hábito. Planeje, Execute, Verifique e Aja dentro de cada sprint com frameworks nativos.',
    icon: RefreshCw,
    color: 'cyan',
    tag: 'Melhoria Contínua',
  },
  {
    id: 3,
    title: 'Copiloto Neural',
    description:
      'IA treinada para identificar gargalos. Ela aprende seu ritmo e ajusta estimativas de prazo automaticamente para evitar burnout.',
    icon: Cpu,
    color: 'pink',
    tag: 'Powered by AI',
  },
  {
    id: 4,
    title: 'Deep Analytics',
    description:
      'Dashboards que revelam a verdade. Visualize métricas de fluxo, lead time e cycle time sem precisar configurar planilhas complexas.',
    icon: BarChart3,
    color: 'cyan',
    tag: 'Real-time',
  },
  {
    id: 5,
    title: 'Workflow GitOps',
    description:
      'O código é a fonte da verdade. Vincule commits a tarefas e mova cards automaticamente baseado em Pull Requests e Merges.',
    icon: GitBranch,
    color: 'purple',
    tag: 'GitHub · GitLab',
  },
  {
    id: 6,
    title: 'Segurança Militar',
    description:
      'Seus dados são criptografados de ponta a ponta. Controle de acesso granular e auditoria completa para compliance.',
    icon: ShieldCheck,
    color: 'pink',
    tag: 'E2E Encrypted',
  },
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
  return (
    <section className="relative py-32 overflow-hidden isolate" id="funcionalidades">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-pink-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_30%,transparent_80%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
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
              Stack Tecnológico
            </span>
          </MotionDiv>

          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-5 scroll-mt-24 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            Funcionalidades de{' '}
            <span className="bg-gradient-to-r from-white via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              Alta Performance
            </span>
          </MotionH2>

          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400"
          >
            Cada pixel foi desenhado para eliminar atrito cognitivo. Ferramentas
            poderosas escondidas sob uma interface minimalista.
          </MotionP>
        </div>

        {/* Grid */}
        <MotionDiv
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const c = colorMap[feature.color]
            const Icon = feature.icon
            return (
              <MotionDiv key={feature.id} variants={item} className="group relative h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0f1e] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.11] hover:shadow-2xl hover:shadow-black/60">

                  {/* Shimmer top border */}
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${c.shimmer} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  {/* Corner glow */}
                  <div className={`absolute -left-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br ${c.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />

                  {/* Icon */}
                  <div className={`relative mb-5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04] transition-all duration-300 group-hover:scale-105 ${c.iconGlow}`}>
                    <Icon className={`h-5 w-5 ${c.icon}`} strokeWidth={1.75} />
                  </div>

                  {/* Text */}
                  <div className="relative z-10 flex flex-1 flex-col">
                    <h3 className="mb-2.5 text-base font-bold leading-snug tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-gray-400 transition-colors duration-200 group-hover:text-gray-300">
                      {feature.description}
                    </p>

                    {/* Tag — reveals on hover */}
                    <span className={`mt-5 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-widest opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 ${c.tag}`}>
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