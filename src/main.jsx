import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DetailedFeatures from './components/detailedfeatures.jsx'
import Metodologia from './components/metodologia.jsx'
import Ciencia from './components/ciencia.jsx'
import Sobre from './components/sobre.jsx'
import Login from './components/login.jsx'
import AuthCallback from './components/AuthCallback.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AreaLogadaLayout from './components/arealogada/AreaLogadaLayout.jsx'
import DashboardHome from './components/arealogada/DashboardHome.jsx'
import CadCategorias from './components/arealogada/CadCategorias.jsx'
import CadSubcategoria from './components/arealogada/CadSubcategoria.jsx'
import CadParticipantes from './components/arealogada/CadParticipantes.jsx'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/detailedfeatures" element={<DetailedFeatures />} />
        <Route path="/metodologia" element={<Metodologia />} />
        <Route path="/ciencia" element={<Ciencia />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes — all use AreaLogadaLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AreaLogadaLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/cad-categorias" element={<CadCategorias />} />
            <Route path="/cad-subcategorias" element={<CadSubcategoria />} />
            <Route path="/cad-participantes" element={<CadParticipantes />} />
            {/* Futuras páginas da área logada: */}
            {/* <Route path="/projetos" element={<Projetos />} /> */}
            {/* <Route path="/tarefas" element={<Tarefas />} /> */}
            {/* <Route path="/analytics" element={<Analytics />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

export { ScrollToTop }
