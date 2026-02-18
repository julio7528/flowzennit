import { motion } from 'framer-motion'
import { Instagram, Linkedin, Youtube } from 'lucide-react'
import logominimal from '../assets/logominimal.png'

const MotionFooter = motion.footer

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.53 2c.23 1.9 1.3 3.34 3.05 3.97v3.24a8.53 8.53 0 0 1-3.02-.57v6.2A6.84 6.84 0 1 1 10.7 8v3.4a3.44 3.44 0 1 0 3.46 3.44V2h3.37z" />
  </svg>
)

const Footer = () => {
  const socialLinks = [
    { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { label: 'TikTok', href: 'https://tiktok.com', icon: TikTokIcon },
    { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  ]

  return (
    <MotionFooter
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-footerBg pt-16 pb-8 border-t border-white/5 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logominimal} alt="FlowZenit Minimal Logo" className="h-6 w-auto" />
            </div>
            <p className="text-gray-500 text-sm">
              Plataforma open source para gestão de produtividade pessoal e pequenos negócios para alcançar a alta
              performance.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-200 hover:border-neonCyan/40 hover:bg-neonCyan/10 hover:text-neonCyan"
                  >
                    <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Produto</h4>
            <ul className="text-sm text-gray-400 space-y-3">
              <li>
                <a href="#funcionalidades" className="hover:text-neonCyan transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#integracoes" className="hover:text-neonCyan transition-colors">
                  Integrações
                </a>
              </li>
              <li>
                <a href="#novidades" className="hover:text-neonCyan transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Aprender</h4>
            <ul className="text-sm text-gray-400 space-y-3">
              <li>
                <a href="#cta" className="hover:text-neonCyan transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#cta" className="hover:text-neonCyan transition-colors">
                  Guia API
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-neonCyan transition-colors">
                  Comunidade
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-neonCyan transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Legal</h4>
            <ul className="text-sm text-gray-400 space-y-3">
              <li>
                <a href="#sobre" className="hover:text-neonCyan transition-colors">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-neonCyan transition-colors">
                  Termos
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-neonCyan transition-colors">
                  Segurança
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
          <p>© 2026 FlowZenit. MIT License Open Source.</p>
        </div>
      </div>
    </MotionFooter>
  )
}

export default Footer
