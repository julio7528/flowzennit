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
    colorClass: 'text-neonPurple shadow-neonPurple/50',
  },
  {
    id: 2,
    title: 'Ciclo PDCA Contínuo',
    description:
      'Transforme a melhoria contínua em hábito. Planeje, Execute, Verifique e Aja dentro de cada sprint com frameworks nativos.',
    icon: RefreshCw,
    colorClass: 'text-neonCyan shadow-neonCyan/50',
  },
  {
    id: 3,
    title: 'Copiloto Neural',
    description:
      'IA treinada para identificar gargalos. Ela aprende seu ritmo e ajusta estimativas de prazo automaticamente para evitar burnout.',
    icon: Cpu,
    colorClass: 'text-hotPink shadow-hotPink/50',
  },
  {
    id: 4,
    title: 'Deep Analytics',
    description:
      'Dashboards que revelam a verdade. Visualize métricas de fluxo, lead time e cycle time sem precisar configurar planilhas complexas.',
    icon: BarChart3,
    colorClass: 'text-neonCyan shadow-neonCyan/50',
  },
  {
    id: 5,
    title: 'Workflow GitOps',
    description:
      'O código é a fonte da verdade. Vincule commits a tarefas e mova cards automaticamente baseado em Pull Requests e Merges.',
    icon: GitBranch,
    colorClass: 'text-neonPurple shadow-neonPurple/50',
  },
  {
    id: 6,
    title: 'Segurança Militar',
    description:
      'Seus dados são criptografados de ponta a ponta. Controle de acesso granular e auditoria completa para compliance.',
    icon: ShieldCheck,
    colorClass: 'text-hotPink shadow-hotPink/50',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } },
}

const MainFeatures = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-900/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-gray-400 uppercase"
          >
            Stack Tecnológico
          </MotionDiv>
          <MotionH2
            id="funcionalidades"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight scroll-mt-24"
          >
            Funcionalidades de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Alta Performance
            </span>
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-textGray max-w-2xl mx-auto leading-relaxed"
          >
            Cada pixel foi desenhado para eliminar atrito cognitivo. Ferramentas poderosas escondidas sob uma
            interface minimalista.
          </MotionP>
        </div>

        <MotionDiv
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <MotionDiv key={feature.id} variants={item} className="group relative h-full">
              <div className="relative h-full bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/5 p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-black/50">
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${
                    feature.colorClass.includes('neonPurple')
                      ? 'from-neonPurple to-transparent'
                      : feature.colorClass.includes('neonCyan')
                        ? 'from-neonCyan to-transparent'
                        : 'from-hotPink to-transparent'
                  }`}
                />

                <div className="relative mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-bgDark border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${feature.colorClass.split(' ')[1]}`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.colorClass.split(' ')[0]}`} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  )
}

export default MainFeatures
