import { motion } from 'framer-motion'

const MotionDiv = motion.div
const MotionLink = motion.a

const Cta = () => {
  return (
    <section id="cta" className="bg-white text-black py-32 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
            estamos apenas começando.
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            junte-se a nossa comunidade e vamos juntos formar um ecossistema de inovação e organização para nossos projetos e dia a dia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-8 py-4 rounded-lg bg-gradient-primary text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-xl"
            >
              Criar Conta Gratuita
            </MotionLink>
            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-8 py-4 rounded-lg border-2 border-gray-200 text-gray-800 font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Ler Documentação
            </MotionLink>
            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contato"
              className="px-8 py-4 rounded-lg border-2 border-gray-200 text-gray-800 font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 127.14 96.36" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.27 8.07C2.79 32.65-1.71 56.6.54 80.21A105.73 105.73 0 0 0 32.71 96.36a77.7 77.7 0 0 0 6.89-11.2 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2.04a75.57 75.57 0 0 0 64.32 0c.87.7 1.76 1.38 2.67 2.04a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.19A105.25 105.25 0 0 0 126.6 80.22c2.64-27.33-4.52-51.06-18.9-72.15ZM42.45 65.69c-6.28 0-11.44-5.79-11.44-12.9 0-7.11 5.05-12.9 11.44-12.9 6.39 0 11.55 5.85 11.44 12.9 0 7.11-5.05 12.9-11.44 12.9Zm42.24 0c-6.28 0-11.44-5.79-11.44-12.9 0-7.11 5.05-12.9 11.44-12.9 6.39 0 11.55 5.85 11.44 12.9 0 7.11-5.05 12.9-11.44 12.9Z" />
              </svg>
              Entrar na Comunidade
            </MotionLink>
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}

export default Cta
