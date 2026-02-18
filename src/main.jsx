import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DetailedFeatures from './components/detailedfeatures.jsx'
import Metodologia from './components/metodologia.jsx'
import Ciencia from './components/ciencia.jsx'
import Login from './components/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/detailedfeatures" element={<DetailedFeatures />} />
        <Route path="/metodologia" element={<Metodologia />} />
        <Route path="/ciencia" element={<Ciencia />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
