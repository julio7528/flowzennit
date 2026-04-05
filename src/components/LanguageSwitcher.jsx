import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getAppLanguage, setAppLanguage } from '../lib/i18n.js'

const MotionSpan = motion.span

function BrazilFlagIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="brazilFlagClip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>

      <g clipPath="url(#brazilFlagClip)">
        <rect width="64" height="64" fill="#009B3A" />
        <path d="M32 12L52 32L32 52L12 32Z" fill="#FFDF00" />
        <circle cx="32" cy="32" r="13" fill="#002776" />
        <path
          d="M20 30.5C24 27.5 29 26 34 26C39.5 26 44.5 27.8 48.5 31"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="32" r="1.4" fill="#FFFFFF" />
      </g>
    </svg>
  )
}

function USAFlagIcon({ className = '' }) {
  const stripeHeight = 64 / 13

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="usaFlagClip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>

      <g clipPath="url(#usaFlagClip)">
        <rect width="64" height="64" fill="#FFFFFF" />

        {Array.from({ length: 13 }).map((_, i) =>
          i % 2 === 0 ? (
            <rect
              key={i}
              x="0"
              y={i * stripeHeight}
              width="64"
              height={stripeHeight}
              fill="#B22234"
            />
          ) : null
        )}

        <rect x="0" y="0" width="28" height="30" fill="#3C3B6E" />

        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={3.5 + col * 4.2}
              cy={4 + row * 5.2}
              r="0.9"
              fill="#FFFFFF"
            />
          ))
        )}

        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle
              key={`alt-${row}-${col}`}
              cx={5.6 + col * 4.2}
              cy={6.6 + row * 5.2}
              r="0.9"
              fill="#FFFFFF"
            />
          ))
        )}
      </g>
    </svg>
  )
}

const LanguageSwitcher = ({ className = '' }) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = getAppLanguage() || i18n.resolvedLanguage || 'pt-BR'
  const isEnglish = currentLanguage === 'en'

  const toggle = () => setAppLanguage(isEnglish ? 'pt-BR' : 'en')

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`.trim()}
      aria-label={t('languageSwitcher.aria')}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isEnglish}
        onClick={toggle}
        className="
          relative h-8 w-[3.75rem] rounded-full
          border border-white/10
          bg-white/5
          overflow-hidden
          transition-colors
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#00F0FF]/50
        "
      >
        <MotionSpan
          animate={{ x: isEnglish ? 30 : 4 }}
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="
            absolute top-1 left-0
            h-6 w-6 rounded-full
            flex items-center justify-center
            bg-white shadow-lg shadow-black/40
            ring-1 ring-white/10
            overflow-hidden
          "
        >
          {isEnglish ? (
            <USAFlagIcon className="h-full w-full" />
          ) : (
            <BrazilFlagIcon className="h-full w-full" />
          )}
        </MotionSpan>
      </button>
    </div>
  )
}

export default LanguageSwitcher
