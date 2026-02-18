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
            Pronto para dominar seu fluxo?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de desenvolvedores que já estão transformando caos em código limpo e produtividade.
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
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}

export default Cta
