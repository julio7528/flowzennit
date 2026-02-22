import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import TopBanner from './components/banner.jsx'
import Header from './components/header.jsx'
import Hero from './components/hero.jsx'
import FeatureStrip from './components/featurestrip.jsx'
import MainFeatures from './components/mainfeatures.jsx'
import NewFeatures from './components/newfeatures.jsx'
import Contacts from './components/contacts.jsx'
import Cta from './components/cta.jsx'
import Footer from './components/footer.jsx'

function App() {
  const headerHeight = 80
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const [bannerHeight, setBannerHeight] = useState(0)
  const bannerRef = useRef(null)

  useLayoutEffect(() => {
    const updateHeight = () => {
      setBannerHeight(bannerRef.current?.offsetHeight ?? 0)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsBannerVisible(window.scrollY === 0)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-bgDark font-sans selection:bg-hotPink selection:text-white">
      <TopBanner ref={bannerRef} isVisible={isBannerVisible} />
      <Header offsetTop={isBannerVisible ? bannerHeight : 0} />
      <div className="relative z-10" style={{ paddingTop: headerHeight + (isBannerVisible ? bannerHeight : 0) }}>
        <Hero />
      </div>
      <FeatureStrip />
      <MainFeatures />
      <NewFeatures />
      <Contacts />
      <Cta />
      <Footer />
    </div>
  )
}

export default App
