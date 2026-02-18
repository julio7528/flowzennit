import { motion } from 'framer-motion'
import integrationCalendar from '../assets/integration-calendar.svg'
import integrationWhatsapp from '../assets/integration-whatsapp.svg'

const MotionDiv = motion.div
const MotionH2 = motion.h2

const NewFeatures = () => {
  return (
    <section id="integracoes" className="py-20 bg-black/20 scroll-mt-24">
      <div id="ciencia" className="scroll-mt-24" />
      <div id="novidades" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionH2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-12 text-center text-white"
        >
          Novas Funcionalidades
        </MotionH2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bgCard border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center"
          >
            <div className="mb-6 w-full relative group">
              <div className="absolute inset-0 bg-neonCyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={integrationCalendar}
                alt="Calendar UI"
                className="relative z-10 w-full rounded-xl border border-white/10 shadow-lg"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Integração Google Calendar</h3>
            <p className="text-textGray">
              Sincronize suas tarefas diretamente com seus slots de tempo. Nunca mais perca uma reunião ou prazo de
              entrega.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bgCard border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center"
          >
            <div className="mb-6 w-full relative group">
              <div className="absolute inset-0 bg-neonPurple/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={integrationWhatsapp}
                alt="WhatsApp UI"
                className="relative z-10 w-full rounded-xl border border-white/10 shadow-lg"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Integração WhatsApp</h3>
            <p className="text-textGray">
              Capture tarefas via áudio, receba resumos diários e consulte sua agenda diretamente no seu app de mensagens
              favorito.
            </p>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}

export default NewFeatures
