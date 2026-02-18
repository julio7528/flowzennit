import { useState } from 'react'
import { Code2, Zap, Cpu, LayoutDashboard, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MotionDiv = motion.div

const features = [
  {
    id: 'opensource',
    icon: Code2,
    shortTitle: 'OPEN SOURCE',
    title: 'Código 100% Aberto',
    color: 'text-neonCyan',
    description:
      'Transparência total é nosso pilar. Você tem controle total sobre seus dados e a comunidade pode auditar a segurança a qualquer momento. Contribua, faça forks ou hospede você mesmo.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2076&auto=format&fit=crop',
  },
  {
    id: 'methodology',
    icon: Zap,
    shortTitle: 'METODOLOGIAS',
    title: 'Agile & Scrum Pragmático',
    color: 'text-purple-400',
    description:
      'Utilizamos os melhores princípios do Scrum e Agile, mas sem a burocracia excessiva. Removemos cerimonias desnecessárias para focar estritamente no que gera valor e na entrega contínua.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'ai',
    icon: Cpu,
    shortTitle: 'IA INTEGRADA',
    title: 'Inteligência Auxiliar',
    color: 'text-hotPink',
    description:
      'Nossos algoritmos analisam seu padrão de trabalho para sugerir prioridades e estimar prazos. A IA não substitui sua decisão, ela elimina a fadiga de decisão organizando o caos inicial.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'interface',
    icon: LayoutDashboard,
    shortTitle: 'INTERFACE INTUITIVA',
    title: 'Design Cognitivo',
    color: 'text-white',
    description:
      'Interface desenhada para reduzir a carga cognitiva. Cores, contrastes e disposição de elementos focados em manter você no estado de fluxo (Flow) por mais tempo, sem distrações visuais.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&auto=format&fit=crop',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const FeatureStrip = () => {
  const [selectedFeature, setSelectedFeature] = useState(null)

  return (
    <>
      <section id="metodologia" className="border-y border-white/5 bg-white/5 backdrop-blur-sm relative z-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MotionDiv
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {features.map((feature) => (
              <MotionDiv
                key={feature.id}
                variants={itemAnim}
                className="cursor-pointer group relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-colors hover:bg-white/5">
                  <feature.icon
                    className={`w-8 h-8 ${feature.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                  />
                  <span className="text-xs font-bold tracking-widest text-gray-300 group-hover:text-white transition-colors">
                    {feature.shortTitle}
                  </span>
                  <span className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2">
                    Clique para saber mais
                  </span>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      <AnimatePresence>
        {selectedFeature && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedFeature(null)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-2xl bg-bgCard border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10"
            >
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-48 md:h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bgCard to-transparent z-[1]" />
                  <img src={selectedFeature.image} alt={selectedFeature.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <selectedFeature.icon className={`w-6 h-6 ${selectedFeature.color}`} />
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{selectedFeature.title}</h3>
                  </div>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-6 rounded-full" />
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">{selectedFeature.description}</p>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  )
}

export default FeatureStrip
