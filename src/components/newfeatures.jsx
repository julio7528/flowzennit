import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import integrationCalendar from '../assets/png2gcarl.png'
import integrationWhatsapp from '../assets/png2wpp.png'

const MotionDiv = motion.div
const MotionH2 = motion.h2

const cardDefinitions = [
  {
    key: 'calendar',
    image: integrationCalendar,
    altKey: 'newFeatures.cards.calendar.imageAlt',
  },
  {
    key: 'whatsapp',
    image: integrationWhatsapp,
    altKey: 'newFeatures.cards.whatsapp.imageAlt',
  },
]

const NewFeatures = () => {
  const { t } = useTranslation()

  const cards = useMemo(
    () =>
      cardDefinitions.map((card) => ({
        ...card,
        title: t(`newFeatures.cards.${card.key}.title`),
        description: t(`newFeatures.cards.${card.key}.description`),
        imageAlt: t(card.altKey),
      })),
    [t],
  )

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
          {t('newFeatures.title')}
        </MotionH2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {cards.map((card, index) => (
            <MotionDiv
              key={card.key}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-bgCard border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center"
            >
              <div className="mb-6 w-full relative group">
                <div className={`absolute inset-0 ${index === 0 ? 'bg-neonCyan/10' : 'bg-neonPurple/10'} blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="relative z-10 w-full rounded-xl border border-white/10 shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{card.title}</h3>
              <p className="text-textGray">{card.description}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewFeatures
