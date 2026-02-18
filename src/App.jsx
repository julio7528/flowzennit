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
  return (
    <div className="min-h-screen bg-bgDark font-sans selection:bg-hotPink selection:text-white">
      <TopBanner />
      <Header />
      <Hero />
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
