import { screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import { renderWithProviders } from './render-with-providers.jsx'

describe('App', () => {
  it('renderiza seções principais da landing page', () => {
    renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(screen.getByRole('heading', { name: /domine o caos\./i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /novas funcionalidades/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /fale conosco/i })).toBeInTheDocument()
  })
})
