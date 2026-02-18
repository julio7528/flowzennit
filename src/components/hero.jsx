import { Play } from 'lucide-react'
import { motion } from 'framer-motion'

const MotionSection = motion.section

const Hero = () => {
  return (
    <MotionSection id="sobre" className="relative -mt-20 pt-32 pb-20 overflow-hidden scroll-mt-24">
      <div
        className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"
        style={{
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
        >
          <span className="text-xs font-semibold tracking-wider text-neonCyan uppercase">
            ★ 100% Open Source Software
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl"
        >
          Transforme o Caos em <br className="hidden md:block" />
          <span className="text-gradient">Produtividade Pura</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl text-textGray mb-10 max-w-3xl leading-relaxed"
        >
          A primeira plataforma que une metodologias GTD, MASP, GUT & PDCA para priorizar o que realmente importa.
          Gerencie, Organize e priorize tarefas com métodos otimizados para produtividade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
        >
          <a
            href="#"
            className="px-8 py-4 rounded-lg bg-gradient-primary text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-0.5 text-center"
          >
            Começar Gratuitamente
          </a>
          <a
            href="#"
            className="px-8 py-4 rounded-lg border border-white/20 bg-white/5 text-white font-semibold text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Ver Demo
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-full max-w-4xl mx-auto mt-8"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/10 blur-3xl rounded-full -z-10"></div>

          <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-2xl overflow-visible">
            <defs>
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <linearGradient id="grad-chaos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4b5563" stopOpacity="0" />
                <stop offset="50%" stopColor="#4b5563" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#4b5563" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="grad-out" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b92bca" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#b92bca" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient id="grad-pdca" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff007f" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ff007f" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient id="grad-ai" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <g transform="translate(400, 50)">
              <motion.g
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <text
                  x="0"
                  y="-20"
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="0.2em"
                >
                  INPUTS & CAOS
                </text>
                <circle cx="-120" cy="0" r="4" fill="#4b5563" opacity="0.6" />
                <rect x="-80" y="-10" width="8" height="8" fill="#4b5563" opacity="0.4" />
                <path d="M-40 -5 L-30 5 L-50 5 Z" fill="#4b5563" opacity="0.5" />
                <circle cx="20" cy="-15" r="3" fill="#4b5563" opacity="0.7" />
                <rect x="60" y="0" width="6" height="6" fill="#4b5563" opacity="0.5" />
                <circle cx="100" cy="-5" r="5" fill="#4b5563" opacity="0.4" />
                <line
                  x1="-100"
                  y1="20"
                  x2="-60"
                  y2="60"
                  stroke="#4b5563"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <line
                  x1="100"
                  y1="20"
                  x2="60"
                  y2="60"
                  stroke="#4b5563"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
              </motion.g>
            </g>

            <g transform="translate(0, 80)">
              <motion.g
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <path
                  d="M150,0 L650,0 L550,100 L250,100 Z"
                  fill="url(#grad-out)"
                  stroke="#b92bca"
                  strokeWidth="2"
                />
                <rect
                  x="300"
                  y="30"
                  width="200"
                  height="40"
                  rx="20"
                  fill="#0a0f1c"
                  stroke="#b92bca"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <text x="400" y="56" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
                  MATRIZ GUT
                </text>
                <line x1="200" y1="50" x2="280" y2="50" stroke="#b92bca" strokeWidth="1" opacity="0.5" />
                <line x1="520" y1="50" x2="600" y2="50" stroke="#b92bca" strokeWidth="1" opacity="0.5" />
              </motion.g>
            </g>

            <g transform="translate(0, 180)">
              <motion.g
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <path
                  d="M250,0 L550,0 L480,100 L320,100 Z"
                  fill="url(#grad-pdca)"
                  stroke="#ff007f"
                  strokeWidth="2"
                />
                <rect
                  x="330"
                  y="30"
                  width="140"
                  height="40"
                  rx="20"
                  fill="#0a0f1c"
                  stroke="#ff007f"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <text x="400" y="56" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
                  CICLO PDCA
                </text>
                <path
                  d="M370 80 Q 400 90 430 80"
                  fill="none"
                  stroke="#ff007f"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </motion.g>
            </g>

            <g transform="translate(0, 280)">
              <motion.g
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
              >
                <path
                  d="M320,0 L480,0 L440,80 L360,80 Z"
                  fill="url(#grad-ai)"
                  stroke="#00f0ff"
                  strokeWidth="2"
                />
                <circle cx="400" cy="40" r="25" fill="#0a0f1c" stroke="#00f0ff" strokeWidth="1.5" />
                <text x="400" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                  AI
                </text>
                <circle
                  cx="400"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="1"
                  opacity="0.3"
                  strokeDasharray="2 4"
                />
              </motion.g>
            </g>

            <g transform="translate(400, 360)">
              <motion.g
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.8, delay: 2.1 }}
                style={{ originY: 0 }}
              >
                <line x1="0" y1="0" x2="0" y2="80" stroke="#00f0ff" strokeWidth="4" filter="url(#neon-glow)" />
                <line x1="0" y1="0" x2="0" y2="80" stroke="#fff" strokeWidth="1" opacity="0.8" />
              </motion.g>

              <g transform="translate(0, 100)">
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 2.4, type: 'spring', stiffness: 200 }}
                >
                  <path
                    d="M0 -20 L15 0 L0 20 L-15 0 Z"
                    fill="#00f0ff"
                    fillOpacity="0.2"
                    stroke="#00f0ff"
                    strokeWidth="2"
                    filter="url(#neon-glow)"
                  />
                  <path d="M0 -12 L9 0 L0 12 L-9 0 Z" fill="#fff" />
                  <text
                    x="0"
                    y="45"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="14"
                    fontWeight="bold"
                    letterSpacing="0.1em"
                  >
                    RESULTADO
                  </text>
                </motion.g>
              </g>
            </g>
          </svg>
        </motion.div>
      </div>
    </MotionSection>
  )
}

export default Hero
