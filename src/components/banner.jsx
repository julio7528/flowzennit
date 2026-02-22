import { forwardRef } from 'react'

const TopBanner = forwardRef(({ isVisible }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 w-full bg-gradient-to-r from-purple-950 via-[#130720] to-purple-950 border-b border-white/5 text-white text-xs sm:text-sm py-2.5 text-center px-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <span className="opacity-90 tracking-wide">
        Cursos e treinamentos personalizados online fale com nossa equipe de suporte{' '}
        <a
          href="#"
          className="font-bold text-[#67e8f9] hover:underline hover:text-white transition-colors"
        >
          aqui
        </a>
        .
      </span>
    </div>
  )
})

export default TopBanner
