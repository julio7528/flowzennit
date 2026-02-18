import { motion } from 'framer-motion'

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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8YIQvD1hRb3oZGj4PCIlQ8YCNSnrRYAk4Ij8rPPP-p64GzK0msBC28Sw5RhAcI25mRgkHGOO9svkGOrnkd-gTtpPRMF_0Vi-fACsqkTvlro8brzeNdQisaoAEfnTnbJCIcJS_QGtJzc-PBitOMcwjOb-a-u_rAF4znGephXmgAHGQ3-tdSZ1eO_aQcd7EbnmuMa90FkL0WE7L9SnzSD21uZutPIvnXn1CvY9yCC4PwIZc15eyx1UPvjZSChcYbwtNuNqkemi2qQ"
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHa7QRlr8Q7bkRefldP3D3js7lO6L05Gwy5IGsHuhIrnZ56rdqQYpkzw2oYTqXW1xwwWtGCRXvX44BeT9p6yiCyI3cqgdwL-AzALrLNTVb0tUdTbYZ6cUjPNPzBe3ZwrDiu7gXa6ujNKjAs-gqD1qAOpgUQF2m7EHiyyVfT16WFHemlhVKSjB7m8mp4SeegaCOB9EPja_9vdv-6poL5P1A0fHBS0joKUvgihHU7DUDFeBuK3yD9G5ozwX6P3uzLIGNjkOety143g"
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
