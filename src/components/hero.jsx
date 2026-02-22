import { Play, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } },
}

const dataFlowVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: 'easeInOut', delay: 1.5 },
  },
}

const Motion = motion

const Hero = () => {
  return (
    <Motion.section id="sobre" className="relative pt-28 pb-20 overflow-hidden scroll-mt-24 bg-[#050914] text-white flex flex-col items-center">
      {/* Luzes de Fundo Otimizadas */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[20%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_40%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* === CABEÇALHO E TEXTOS === */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center w-full">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase">
              O Motor Definitivo de Produtividade
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight max-w-4xl">
            Domine o Caos. <br className="hidden md:block" />
            Escale a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Execução.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl leading-relaxed font-medium">
            Um sistema que orquestra suas demandas com <strong>GTD</strong>, prioriza com <strong>GUT</strong>, e resolve problemas usando <strong>MASP</strong> dentro de um ciclo <strong>PDCA</strong> contínuo.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <a href="#" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2 group">
              Iniciar Sistema Integrado
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* === DIAGRAMA DO SISTEMA ENCAPSULADO (Glass Panel) === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, type: "spring" }}
          className="relative w-full max-w-5xl mx-auto p-4 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm"
        >
          {/* Linha brilhante decorativa no topo do painel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

          <svg viewBox="0 0 1000 450" className="w-full h-auto drop-shadow-2xl overflow-visible">
            <defs>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="gtd-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* 1. INPUTS & CAOS */}
            <g transform="translate(60, 225)">
              <text x="0" y="-35" fill="#94a3b8" fontSize="14" fontWeight="bold" letterSpacing="0.1em">DEMANDAS</text>
              <motion.circle animate={{ x: [-10, 10, -10], y: [-15, 5, -15] }} transition={{ repeat: Infinity, duration: 3 }} cx="-15" cy="-5" r="5" fill="#64748b" />
              <motion.rect animate={{ rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} x="15" y="-15" width="8" height="8" fill="#64748b" />
              <motion.polygon animate={{ x: [5, -5, 5], y: [15, -5, 15] }} transition={{ repeat: Infinity, duration: 3.5 }} points="0,10 12,22 -12,22" fill="#64748b" />
            </g>

            {/* FLUXO 1 */}
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 80 225 L 160 225" stroke="#475569" strokeWidth="2" strokeDasharray="6 6" fill="none" />

            {/* 2. GTD */}
            <g transform="translate(160, 175)">
              <rect x="0" y="0" width="150" height="100" rx="16" fill="url(#gtd-grad)" stroke="#3b82f6" strokeWidth="2" opacity="0.9" />
              <text x="75" y="45" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="900" letterSpacing="0.1em">GTD</text>
              <text x="75" y="65" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">ORGANIZAÇÃO</text>
              <circle cx="45" cy="85" r="4" fill="#60a5fa" />
              <circle cx="75" cy="85" r="4" fill="#60a5fa" />
              <circle cx="105" cy="85" r="4" fill="#60a5fa" />
            </g>

            {/* FLUXO 2 */}
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 310 225 L 400 225" stroke="#8b5cf6" strokeWidth="3" fill="none" filter="url(#glow-purple)" />

            {/* 3. GUT */}
            <g transform="translate(450, 225)">
              <motion.polygon 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 2.5 }}
                points="0,-55 45,0 0,55 -45,0" 
                fill="#8b5cf6" fillOpacity="0.2" stroke="#a855f7" strokeWidth="3" filter="url(#glow-purple)" 
              />
              <text x="0" y="6" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900">GUT</text>
              <text x="0" y="-70" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">PRIORIZA</text>
            </g>

            {/* FLUXO 3 */}
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 495 225 L 610 225" stroke="#00f0ff" strokeWidth="3" fill="none" filter="url(#glow-cyan)" />
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 485 190 Q 550 140 610 185" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 5" fill="none" />
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 485 260 Q 550 310 610 265" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 5" fill="none" />

            {/* 4. MOTOR PDCA + MASP + IA */}
            <g transform="translate(760, 225)">
              
              {/* PDCA Anel Externo */}
              <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }}>
                <circle cx="0" cy="0" r="150" fill="none" stroke="#0f172a" strokeWidth="35" />
                <path d="M 0 -150 A 150 150 0 0 1 150 0" fill="none" stroke="#00f0ff" strokeWidth="35" opacity="0.4" />
                <path d="M 150 0 A 150 150 0 0 1 0 150" fill="none" stroke="#3b82f6" strokeWidth="35" opacity="0.4" />
                <path d="M 0 150 A 150 150 0 0 1 -150 0" fill="none" stroke="#8b5cf6" strokeWidth="35" opacity="0.4" />
                <path d="M -150 0 A 150 150 0 0 1 0 -150" fill="none" stroke="#a855f7" strokeWidth="35" opacity="0.4" />
                <text x="110" y="-110" fill="#fff" fontSize="22" fontWeight="bold">P</text>
                <text x="110" y="125" fill="#fff" fontSize="22" fontWeight="bold">D</text>
                <text x="-125" y="125" fill="#fff" fontSize="22" fontWeight="bold">C</text>
                <text x="-125" y="-110" fill="#fff" fontSize="22" fontWeight="bold">A</text>
              </motion.g>
              <text x="0" y="-200" textAnchor="middle" fill="#67e8f9" fontSize="16" fontWeight="black" letterSpacing="0.2em">CICLO PDCA</text>

              {/* MASP Anel Interno */}
              <motion.g animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
                <circle cx="0" cy="0" r="95" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="8 8" />
                <circle cx="0" cy="-95" r="8" fill="#f472b6" />
                <circle cx="95" cy="0" r="8" fill="#f472b6" />
                <circle cx="0" cy="95" r="8" fill="#f472b6" />
                <circle cx="-95" cy="0" r="8" fill="#f472b6" />
              </motion.g>
              <text x="0" y="-115" textAnchor="middle" fill="#f472b6" fontSize="12" fontWeight="bold" letterSpacing="0.1em">MASP</text>

              {/* IA Núcleo */}
              <motion.circle animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} cx="0" cy="0" r="50" fill="#0ea5e9" filter="url(#glow-cyan)" opacity="0.8" />
              <circle cx="0" cy="0" r="38" fill="#0284c7" />
              <text x="0" y="7" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="black">IA</text>
            </g>

            {/* 5. SAÍDA */}
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 910 225 L 980 225" stroke="#00f0ff" strokeWidth="4" fill="none" filter="url(#glow-cyan)" />
            <motion.path variants={dataFlowVariant} initial="hidden" animate="visible" d="M 965 215 L 980 225 L 965 235" stroke="#00f0ff" strokeWidth="3" fill="none" filter="url(#glow-cyan)" />
          </svg>
        </motion.div>
      </div>
    </Motion.section>
  )
}

export default Hero
