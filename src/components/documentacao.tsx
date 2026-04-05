import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './header.jsx'
import Footer from './footer.jsx'
import png001 from '../assets/png001.png'
import png002 from '../assets/png002.png'
import pngcadcat003 from '../assets/pngcadcat003.png'
import pngkanb006 from '../assets/pngkanb006.png'
import pngstuff007 from '../assets/pngstuff007.png'
import pngpainel008 from '../assets/pngpainel008.png'
import pngsub009 from '../assets/pngsub009.png'
import pngcadpart004 from '../assets/pngcadpart004.png'
import pngcadtar005 from '../assets/pngcadtar005.png'
import png010proj from '../assets/png010proj.png'

const pageImages = [
  png002,
  pngpainel008,
  pngcadcat003,
  pngsub009,
  pngcadpart004,
  pngcadtar005,
  pngkanb006,
  png010proj,
  pngstuff007,
]

const Documentacao = () => {
  const { t } = useTranslation()
  const methodologyItems = useMemo(() => t('documentation.methodologyItems', { returnObjects: true }), [t])
  const pageSections = useMemo(() => t('documentation.pageSections', { returnObjects: true }), [t])
  const architectureItems = useMemo(() => t('documentation.footerSections.architectureItems', { returnObjects: true }), [t])
  const evidenceItems = useMemo(() => t('documentation.footerSections.evidenceItems', { returnObjects: true }), [t])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_52%,#020617_100%)]">
        <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
            {t('documentation.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t('documentation.hero.title')}
          </h1>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-sky-500/40 via-white/10 to-transparent" />
          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            {t('documentation.hero.description')}
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <img src={png001} alt={t('documentation.coverAlt')} className="w-full h-auto object-cover" />
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-white/8 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
                {t('documentation.methodologySection.eyebrow')}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">
                {t('documentation.methodologySection.title')}
              </h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-400 lg:block">
              {t('documentation.methodologySection.aside')}
            </p>
          </div>

          <div className="grid divide-y divide-white/6 md:grid-cols-2 md:divide-x md:divide-y-0">
            {methodologyItems.map((item, index) => (
              <article key={item.title} className={`py-6 ${index % 2 === 1 ? 'md:pl-8' : 'md:pr-8'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black tracking-tighter text-sky-400">{item.title}</span>
                  <span className="h-px flex-1 bg-white/8" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t('documentation.projectLabel')}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.usage}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <div className="mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
              {t('documentation.pagesSection.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              {t('documentation.pagesSection.title')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {t('documentation.pagesSection.description')}
            </p>
          </div>

          <div className="mt-10 flex flex-col">
            {pageSections.map((section, index) => (
              <article key={section.title} className="grid gap-8 border-t border-white/8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="select-none text-4xl font-black tabular-nums text-sky-500/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">{section.title}</p>
                      <h3 className="mt-0.5 text-xl font-semibold text-white">{section.objective}</h3>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 pl-14">
                    {section.features.map((feature: string) => (
                      <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-400">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500/60" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {pageImages[index] ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-lg flex items-center justify-center">
                    <img src={pageImages[index]} alt={section.title} className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="border border-dashed border-sky-400/25 bg-sky-950/20 p-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
                      {t('documentation.placeholder.label')}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{t('documentation.placeholder.description')}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-16 pt-4">
          <div className="h-px w-full bg-gradient-to-r from-sky-500/30 via-white/8 to-transparent" />
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <article>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
                {t('documentation.footerSections.architectureEyebrow')}
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">{t('documentation.footerSections.architectureTitle')}</h2>
              <ul className="mt-5 space-y-3">
                {architectureItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">
                {t('documentation.footerSections.evidenceEyebrow')}
              </p>
              <h2 className="mt-2 text-xl font-bold text-white">{t('documentation.footerSections.evidenceTitle')}</h2>
              <ul className="mt-5 space-y-3">
                {evidenceItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-400">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-500/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Documentacao
