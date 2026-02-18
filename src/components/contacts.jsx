import { motion } from 'framer-motion'

const MotionH2 = motion.h2
const MotionP = motion.p
const MotionForm = motion.form
const MotionButton = motion.button

const Contacts = () => {
  return (
    <section id="contato" className="relative overflow-hidden py-32 scroll-mt-24">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-hotPink/10 blur-[100px] -z-10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-neonCyan/10 blur-[100px] -z-10"></div>

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4 text-white"
          >
            Fale Conosco
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-textGray"
          >
            Dúvidas sobre o plano Enterprise? Mande uma mensagem.
          </MotionP>
        </div>

        <MotionForm
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              E-mail Corporativo
            </label>
            <input
              type="email"
              id="email"
              placeholder="voce@empresa.com"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
              Mensagem
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Como podemos ajudar?"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all"
            ></textarea>
          </div>
          <MotionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="w-full py-4 rounded-lg bg-gradient-primary text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Enviar Mensagem
          </MotionButton>
        </MotionForm>
      </div>
    </section>
  )
}

export default Contacts
