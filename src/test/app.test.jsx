import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App.jsx'

describe('App', () => {
  it('renderiza seções principais da landing page', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(screen.getByRole('heading', { name: /domine o caos\. escale a execução\./i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /novas funcionalidades/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /fale conosco/i })).toBeInTheDocument()
  })
})
