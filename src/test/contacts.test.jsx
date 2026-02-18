import { fireEvent, render, screen } from '@testing-library/react'
import Contacts from '../components/contacts.jsx'

describe('Contacts form', () => {
  it('envia o formulário e mostra mensagem de sucesso', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    render(<Contacts />)

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Maria Silva' } })
    fireEvent.change(screen.getByLabelText(/e-mail corporativo/i), { target: { value: 'maria@empresa.com' } })
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Quero saber sobre o plano Enterprise.' } })

    fireEvent.click(screen.getByRole('button', { name: /enviar mensagem/i }))

    expect(await screen.findByRole('status')).toHaveTextContent(/mensagem enviada com sucesso/i)
  })
})
