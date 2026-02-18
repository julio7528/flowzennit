import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import logofull from '../assets/logofull.png'

const MotionHeader = motion.header

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const navItems = [
    { label: 'Funcionalidades', href: '/detailedfeatures', isRoute: true },
    { label: 'Metodologia', href: '/metodologia', isRoute: true },
    { label: 'Ciência', href: '/ciencia', isRoute: true },
    { label: 'Blog', href: '#blog' },
    { label: 'Sobre', href: '#sobre' },
  ]

  return (
    <MotionHeader
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 bg-bgDark/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 flex items-center justify-center gap-2">
            <img src={logofull} alt="FlowZenit Logo" className="h-14 w-auto" />
          </Link>

          <nav className="hidden md:flex gap-8">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Acesse sua conta
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full bg-gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
            >
              Começar Gratuitamente
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-bgCard border-b border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {item.label}
                </a>
              ),
            )}
            <div className="pt-4 flex flex-col gap-3 px-3">
              <Link to="/login" className="text-center text-sm font-medium text-gray-300 hover:text-white">
                Acesse sua conta
              </Link>
              <Link
                to="/login"
                className="text-center px-5 py-2.5 rounded-full bg-gradient-primary text-white text-sm font-bold"
              >
                Começar Gratuitamente
              </Link>
            </div>
          </div>
        </div>
      )}
    </MotionHeader>
  )
}

export default Header
